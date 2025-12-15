from fastapi import FastAPI, File, UploadFile, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import uvicorn
import os
import cv2
import numpy as np
from pathlib import Path
import shutil
from datetime import datetime
import asyncio
import re
from typing import Optional, List, Tuple
import traceback
import base64
import json

import importlib

# AI/ML imports
mp = None
MEDIAPIPE_AVAILABLE = False
try:
    mp = importlib.import_module("mediapipe")
    MEDIAPIPE_AVAILABLE = True
except ImportError:
    MEDIAPIPE_AVAILABLE = False
    print("WARNING: MediaPipe not available. Face detection will be limited.")

YOLO = None
YOLO_AVAILABLE = False
try:
    ultralytics_module = importlib.import_module("ultralytics")
    YOLO = getattr(ultralytics_module, "YOLO", None)
    if YOLO is not None:
        YOLO_AVAILABLE = True
    else:
        print("WARNING: ultralytics module loaded but YOLO class is missing.")
except ImportError:
    YOLO_AVAILABLE = False
    print("WARNING: YOLOv8 not available. Object detection will be limited.")

easyocr = None
EASYOCR_AVAILABLE = False
try:
    easyocr = importlib.import_module("easyocr")
    EASYOCR_AVAILABLE = True
except ImportError:
    easyocr = None
    EASYOCR_AVAILABLE = False
    print("WARNING: EasyOCR not available. Text detection will be limited.")

app = FastAPI(title="SCANNON.AI API", version="3.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
UPLOAD_DIR = Path("uploads")
PROCESSED_DIR = Path("processed")
UPLOAD_DIR.mkdir(exist_ok=True)
PROCESSED_DIR.mkdir(exist_ok=True)

# Processing status tracking
processing_status = {}

# Initialize AI models
print("Loading AI models...")

# MediaPipe Face Detection
mp_face_detection = None
mp_face_mesh = None
if MEDIAPIPE_AVAILABLE and mp is not None:
    try:
        mp_face_detection = mp.solutions.face_detection.FaceDetection(
            model_selection=1,  # 1 for full-range detection (0-5m), 0 for short-range (2m)
            min_detection_confidence=0.5
        )
        mp_face_mesh = mp.solutions.face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=10,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        print("✓ MediaPipe Face Detection loaded")
    except Exception as e:
        print(f"✗ MediaPipe initialization failed: {e}")
        MEDIAPIPE_AVAILABLE = False

# YOLOv8 for object detection (ID cards, screens, license plates, documents, phones)
yolo_model = None
if YOLO_AVAILABLE and YOLO is not None:
    try:
        # Using YOLOv8n (nano) for speed, can upgrade to yolov8s/m/l for better accuracy
        yolo_model = YOLO('yolov8n.pt')
        print("✓ YOLOv8 Object Detection loaded")
    except Exception as e:
        print(f"✗ YOLOv8 initialization failed: {e}")
        YOLO_AVAILABLE = False

# EasyOCR for text detection
ocr_reader = None
if EASYOCR_AVAILABLE:
    try:
        # English only for speed, add more languages as needed
        reader_class = getattr(easyocr, "Reader", None)
        if reader_class is None:
            raise ImportError("EasyOCR Reader class is unavailable")
        ocr_reader = reader_class(['en'], gpu=False)
        print("✓ EasyOCR Text Detection loaded")
    except Exception as e:
        print(f"✗ EasyOCR initialization failed: {e}")
        EASYOCR_AVAILABLE = False

# Patterns for sensitive text detection
PHONE_PATTERN = re.compile(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b')
EMAIL_PATTERN = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
SSN_PATTERN = re.compile(r'\b\d{3}-\d{2}-\d{4}\b')
CREDIT_CARD_PATTERN = re.compile(r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b')

# YOLOv8 COCO class IDs for privacy-relevant objects
PRIVACY_CLASSES = {
    'cell phone': 67,
    'laptop': 63,
    'tv': 62,
    'keyboard': 66,
    'mouse': 64,
    'remote': 65,
    'book': 73,
}

def detect_faces_mediapipe(frame):
    """
    Detect faces using MediaPipe (much more accurate than Haar Cascades)
    Returns list of (x, y, w, h) tuples
    """
    faces = []
    
    if not MEDIAPIPE_AVAILABLE or mp_face_detection is None:
        print("WARNING: MediaPipe not available for face detection")
        return faces
    
    try:
        # Convert BGR to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = mp_face_detection.process(rgb_frame)
        
        if results.detections:
            h, w, _ = frame.shape
            for detection in results.detections:
                bbox = detection.location_data.relative_bounding_box
                x = int(bbox.xmin * w)
                y = int(bbox.ymin * h)
                width = int(bbox.width * w)
                height = int(bbox.height * h)
                
                # Add padding for better coverage
                padding = int(min(width, height) * 0.2)
                x = max(0, x - padding)
                y = max(0, y - padding)
                width = min(w - x, width + 2 * padding)
                height = min(h - y, height + 2 * padding)
                
                faces.append((x, y, width, height))
                print(f"✓ Face detected at ({x}, {y}, {width}, {height})")
        else:
            print("No faces detected by MediaPipe")
    except Exception as e:
        print(f"MediaPipe face detection error: {e}")
        traceback.print_exc()
    
    return faces


def merge_overlapping_rectangles(rectangles, overlap_threshold=0.3):
    """
    Merge overlapping rectangles to avoid duplicate detections
    """
    if len(rectangles) == 0:
        return []
    
    # Convert to list of lists for easier manipulation
    rects = [list(r) for r in rectangles]
    
    merged = []
    used = [False] * len(rects)
    
    for i in range(len(rects)):
        if used[i]:
            continue
        
        x1, y1, w1, h1 = rects[i]
        
        # Find all overlapping rectangles
        for j in range(i + 1, len(rects)):
            if used[j]:
                continue
            
            x2, y2, w2, h2 = rects[j]
            
            # Calculate overlap
            overlap_x = max(0, min(x1 + w1, x2 + w2) - max(x1, x2))
            overlap_y = max(0, min(y1 + h1, y2 + h2) - max(y1, y2))
            overlap_area = overlap_x * overlap_y
            
            area1 = w1 * h1
            area2 = w2 * h2
            min_area = min(area1, area2)
            
            if min_area > 0 and overlap_area / min_area > overlap_threshold:
                # Merge rectangles
                x1 = min(x1, x2)
                y1 = min(y1, y2)
                w1 = max(x1 + w1, x2 + w2) - x1
                h1 = max(y1 + h1, y2 + h2) - y1
                used[j] = True
        
        merged.append((x1, y1, w1, h1))
        used[i] = True
    
    return merged


def apply_blur(frame, x, y, w, h, blur_type="gaussian", intensity=99):
    """
    Apply blur to a region of the frame with different blur types
    """
    # Add padding to blur area for better coverage
    padding = int(min(w, h) * 0.1)
    x = max(0, x - padding)
    y = max(0, y - padding)
    w = min(frame.shape[1] - x, w + 2 * padding)
    h = min(frame.shape[0] - y, h + 2 * padding)
    
    region = frame[y:y+h, x:x+w]
    
    if region.size == 0:
        return frame
    
    if blur_type == "gaussian":
        # Strong Gaussian blur
        kernel_size = intensity if intensity % 2 == 1 else intensity + 1
        blurred = cv2.GaussianBlur(region, (kernel_size, kernel_size), 30)
    elif blur_type == "pixelate":
        # Pixelation effect
        temp = cv2.resize(region, (10, 10), interpolation=cv2.INTER_LINEAR)
        blurred = cv2.resize(temp, (w, h), interpolation=cv2.INTER_NEAREST)
    elif blur_type == "median":
        # Median blur
        kernel_size = intensity if intensity % 2 == 1 else intensity + 1
        blurred = cv2.medianBlur(region, min(kernel_size, 99))
    elif blur_type == "solid":
        # Solid color block
        blurred = np.full_like(region, [50, 50, 50])
    else:
        blurred = cv2.GaussianBlur(region, (99, 99), 30)
    
    frame[y:y+h, x:x+w] = blurred
    return frame


def detect_text_with_ocr(frame):
    """
    Detect text regions using EasyOCR and identify sensitive information
    NOW AGGRESSIVE: Blurs ALL text on official documents, certificates, IDs, etc.
    Returns list of (x, y, w, h) tuples for regions containing sensitive text
    """
    text_regions = []
    
    if not EASYOCR_AVAILABLE or ocr_reader is None:
        return text_regions
    
    try:
        # Run OCR on frame
        results = ocr_reader.readtext(frame)
        
        # Check if this looks like an official document
        all_text = " ".join([text for (_, text, _) in results]).lower()
        
        # Keywords that indicate official/sensitive documents
        official_keywords = [
            'certificate', 'government', 'official', 'ministry', 'department',
            'passport', 'license', 'registration', 'birth', 'death', 'marriage',
            'identity', 'card', 'aadhar', 'pan', 'voter', 'driving',
            'confidential', 'private', 'restricted', 'medical', 'bank',
            'account', 'statement', 'invoice', 'receipt', 'tax'
        ]
        
        is_official_document = any(keyword in all_text for keyword in official_keywords)
        
        if is_official_document:
            print(f"⚠️ OFFICIAL DOCUMENT DETECTED - Blurring ALL text")
        
        for (bbox, text, confidence) in results:
            if confidence < 0.3:  # Skip low confidence detections
                continue
            
            # Check if text contains sensitive information
            is_sensitive = False
            
            # If this is an official document, blur EVERYTHING
            if is_official_document:
                is_sensitive = True
                print(f"Blurring text: '{text}' (official document)")
            else:
                # Check for phone numbers
                if PHONE_PATTERN.search(text):
                    is_sensitive = True
                    print(f"Blurring phone number: '{text}'")
                
                # Check for emails
                if EMAIL_PATTERN.search(text):
                    is_sensitive = True
                    print(f"Blurring email: '{text}'")
                
                # Check for SSN
                if SSN_PATTERN.search(text):
                    is_sensitive = True
                    print(f"Blurring SSN: '{text}'")
                
                # Check for credit cards
                if CREDIT_CARD_PATTERN.search(text):
                    is_sensitive = True
                    print(f"Blurring credit card: '{text}'")
                
                # Check for keywords that might indicate sensitive info
                sensitive_keywords = ['password', 'ssn', 'social security', 'credit card', 
                                    'account', 'pin', 'confidential', 'private', 'name',
                                    'address', 'date of birth', 'dob', 'age', 'father', 'mother']
                if any(keyword in text.lower() for keyword in sensitive_keywords):
                    is_sensitive = True
                    print(f"Blurring sensitive keyword: '{text}'")
            
            if is_sensitive:
                # Get bounding box coordinates
                top_left = tuple(map(int, bbox[0]))
                bottom_right = tuple(map(int, bbox[2]))
                x, y = top_left
                w = bottom_right[0] - x
                h = bottom_right[1] - y
                
                # Add padding
                padding = int(max(w, h) * 0.3)
                x = max(0, x - padding)
                y = max(0, y - padding)
                w = w + 2 * padding
                h = h + 2 * padding
                
                text_regions.append((x, y, w, h))
    
    except Exception as e:
        print(f"OCR text detection error: {e}")
        traceback.print_exc()
    
    return text_regions


def detect_license_plates(frame):
    """
    Detect license plates using edge detection and contour analysis
    """
    plates = []
    
    try:
        # Convert to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Apply bilateral filter to reduce noise while keeping edges sharp
        blurred = cv2.bilateralFilter(gray, 11, 17, 17)
        
        # Edge detection
        edges = cv2.Canny(blurred, 30, 200)
        
        # Find contours
        contours, _ = cv2.findContours(edges.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        # Sort contours by area (largest first)
        contours = sorted(contours, key=cv2.contourArea, reverse=True)[:30]
        
        for contour in contours:
            # Approximate the contour
            peri = cv2.arcLength(contour, True)
            approx = cv2.approxPolyDP(contour, 0.018 * peri, True)
            
            # License plates typically have 4 corners (rectangular)
            if len(approx) == 4:
                x, y, w, h = cv2.boundingRect(approx)
                aspect_ratio = w / float(h) if h > 0 else 0
                
                # License plates typically have aspect ratio between 2 and 6
                # Also check minimum size to avoid small rectangles
                if 1.5 < aspect_ratio < 6 and w > 60 and h > 20:
                    plates.append((x, y, w, h))
                    print(f"✓ License plate candidate detected at ({x}, {y}, {w}, {h}) - aspect ratio: {aspect_ratio:.2f}")
    
    except Exception as e:
        print(f"License plate detection error: {e}")
        traceback.print_exc()
    
    return plates


def detect_document_shapes(frame):
    """
    SMART: Detect LIGHT-COLORED rectangular shapes (paper documents, certificates, IDs)
    Ignores dark objects like cars, furniture, etc.
    """
    documents = []
    
    try:
        h, w = frame.shape[:2]
        frame_area = h * w
        
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Focus on LIGHT regions (paper is usually white/cream/light gray)
        # Threshold to find bright regions
        _, light_mask = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
        
        # Find contours in light regions only
        contours, _ = cv2.findContours(light_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contours = sorted(contours, key=cv2.contourArea, reverse=True)[:30]
        
        for contour in contours:
            area = cv2.contourArea(contour)
            
            # Skip very small regions (less than 3% of frame)
            if area < frame_area * 0.03:
                continue
            
            peri = cv2.arcLength(contour, True)
            approx = cv2.approxPolyDP(contour, 0.03 * peri, True)
            
            # Accept 4-sided polygons (documents)
            if len(approx) == 4:
                x, y, w, h = cv2.boundingRect(contour)
                aspect_ratio = w / float(h) if h > 0 else 0
                
                # Check if the region is actually light-colored (paper-like)
                roi = gray[y:y+h, x:x+w]
                mean_brightness = cv2.mean(roi)[0]
                
                # Paper documents: light colored (brightness > 120) and reasonable aspect ratio
                if mean_brightness > 120 and 0.5 < aspect_ratio < 2.5 and area > 10000:
                    documents.append((x, y, w, h))
                    print(f"✓ PAPER DOCUMENT DETECTED: ({x}, {y}, {w}, {h}) - ratio: {aspect_ratio:.2f}, brightness: {mean_brightness:.0f}")
                else:
                    print(f"✗ Rejected (too dark or wrong shape): brightness={mean_brightness:.0f}, ratio={aspect_ratio:.2f}")
    
    except Exception as e:
        print(f"Document shape detection error: {e}")
        traceback.print_exc()
    
    return documents


def detect_privacy_objects_yolo(frame):
    """
    Detect privacy-sensitive objects using YOLOv8:
    - Cell phones, laptops, monitors (screens that may show notifications/private content)
    - Books, documents (may contain personal information)
    - TVs, keyboards (may show private content)
    - Cars (to help find license plates)
    Returns dict with categorized detections: {'screens': [], 'documents': [], 'devices': [], 'cars': []}
    """
    detections = {
        'screens': [],      # Phones, laptops, TVs, monitors
        'documents': [],    # Books, documents, papers
        'devices': [],      # Keyboards, mice (potential sensitive areas)
        'cars': []          # Cars (for license plate context)
    }
    
    if not YOLO_AVAILABLE or yolo_model is None:
        print("WARNING: YOLOv8 not available for object detection")
        return detections
    
    try:
        # Run YOLOv8 detection
        results = yolo_model(frame, conf=0.3, verbose=False)
        
        for result in results:
            boxes = result.boxes
            print(f"YOLOv8 detected {len(boxes)} objects in frame")
            for box in boxes:
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                
                # Convert to (x, y, w, h) format
                x, y, w, h = x1, y1, x2 - x1, y2 - y1
                
                print(f"Object class {cls} detected with confidence {conf:.2f}")
                
                # Categorize detections
                if cls in [67]:  # Cell phone
                    detections['screens'].append(('cell_phone', x, y, w, h, conf))
                    print(f"✓ Cell phone detected at ({x}, {y}, {w}, {h})")
                elif cls in [63]:  # Laptop
                    detections['screens'].append(('laptop', x, y, w, h, conf))
                    print(f"✓ Laptop detected at ({x}, {y}, {w}, {h})")
                elif cls in [62]:  # TV/Monitor
                    detections['screens'].append(('tv', x, y, w, h, conf))
                    print(f"✓ TV/Monitor detected at ({x}, {y}, {w}, {h})")
                elif cls in [73]:  # Book
                    detections['documents'].append(('book', x, y, w, h, conf))
                    print(f"✓ Book detected at ({x}, {y}, {w}, {h})")
                elif cls in [66, 64, 65]:  # Keyboard, mouse, remote
                    detections['devices'].append(('device', x, y, w, h, conf))
                    print(f"✓ Device detected at ({x}, {y}, {w}, {h})")
                elif cls in [2, 5, 7]:  # Car, bus, truck
                    detections['cars'].append(('vehicle', x, y, w, h, conf))
                    print(f"✓ Vehicle detected at ({x}, {y}, {w}, {h})")
    
    except Exception as e:
        print(f"YOLOv8 detection error: {e}")
        traceback.print_exc()
    
    return detections


def process_frame(frame, blur_faces=True, blur_text=False, blur_plates=True, blur_type="gaussian"):
    """
    Process a single frame to detect and blur sensitive information using AI models
    """
    regions_to_blur = []
    detection_stats = {
        'faces': 0,
        'text': 0,
        'screens': 0,
        'documents': 0,
        'plates': 0,
        'total': 0
    }
    
    # 1. Detect faces using MediaPipe (most accurate)
    if blur_faces:
        print(f"🔍 Face detection enabled - running MediaPipe...")
        faces = detect_faces_mediapipe(frame)
        regions_to_blur.extend(faces)
        detection_stats['faces'] = len(faces)
        print(f"Found {len(faces)} faces")
    
    # 2. Detect DOCUMENT SHAPES (certificates, IDs, papers) - ALWAYS ENABLED
    print(f"🔍 Document shape detection ALWAYS enabled (aggressive mode)...")
    document_shapes = detect_document_shapes(frame)
    regions_to_blur.extend(document_shapes)
    detection_stats['documents'] += len(document_shapes)
    print(f"Found {len(document_shapes)} document shapes")
    
    # 3. Detect LICENSE PLATES (always enabled when blur_plates is True)
    if blur_plates:
        print(f"🔍 License plate detection enabled - running edge detection...")
        license_plates = detect_license_plates(frame)
        regions_to_blur.extend(license_plates)
        detection_stats['plates'] = len(license_plates)
        print(f"Found {len(license_plates)} license plates")
    
    # 4. Detect privacy-sensitive objects using YOLOv8
    if blur_plates:  # Reusing blur_plates flag for all object detection
        print(f"🔍 Object detection enabled - running YOLOv8...")
        yolo_detections = detect_privacy_objects_yolo(frame)
        
        # Blur all screens (phones, laptops, TVs)
        for detection in yolo_detections['screens']:
            _, x, y, w, h, _ = detection
            regions_to_blur.append((x, y, w, h))
            detection_stats['screens'] += 1
        print(f"Found {detection_stats['screens']} screens")
        
        # Blur documents and books detected by YOLO
        for detection in yolo_detections['documents']:
            _, x, y, w, h, _ = detection
            regions_to_blur.append((x, y, w, h))
            detection_stats['documents'] += 1
        print(f"Found {detection_stats['documents']} total documents (YOLO + shapes)")
    
    # 5. Detect sensitive text using OCR (AGGRESSIVE for official documents)
    if blur_text:
        print(f"🔍 Text detection enabled - running EasyOCR (AGGRESSIVE MODE)...")
        text_regions = detect_text_with_ocr(frame)
        regions_to_blur.extend(text_regions)
        detection_stats['text'] = len(text_regions)
        print(f"Found {len(text_regions)} sensitive text regions")
    
    # Merge overlapping regions to avoid double-blurring
    regions_to_blur = merge_overlapping_rectangles(regions_to_blur)
    detection_stats['total'] = len(regions_to_blur)
    
    print(f"📊 Total regions to blur: {detection_stats['total']}")
    print(f"📊 Detection stats: {detection_stats}")
    
    # Apply blur to all detected regions
    for (x, y, w, h) in regions_to_blur:
        print(f"Blurring region at ({x}, {y}, {w}, {h})")
        frame = apply_blur(frame, x, y, w, h, blur_type=blur_type)
    
    return frame, detection_stats


async def process_video_async(input_path: str, output_path: str, file_id: str, 
                               blur_faces=True, blur_text=False, blur_plates=True, blur_type="gaussian"):
    """
    Process video with AI-based detection and blurring asynchronously
    """
    try:
        processing_status[file_id] = {
            "status": "processing",
            "progress": 0,
            "message": "Starting AI-powered video processing...",
            "detections": {
                "faces": 0,
                "text": 0,
                "screens": 0,
                "documents": 0,
                "total": 0
            }
        }
        
        # Open video
        cap = cv2.VideoCapture(input_path)
        
        if not cap.isOpened():
            processing_status[file_id] = {
                "status": "error",
                "progress": 0,
                "message": "Could not open video file"
            }
            return
        
        # Get video properties
        fps = int(cap.get(cv2.CAP_PROP_FPS)) or 30
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        if total_frames == 0:
            total_frames = 1  # Prevent division by zero
        
        processing_status[file_id]["message"] = f"Processing {total_frames} frames at {fps} FPS"
        
        # Video writer - use mp4v codec for better compatibility
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        if not out.isOpened():
            # Try alternative codec
            fourcc = cv2.VideoWriter_fourcc(*'XVID')
            out = cv2.VideoWriter(output_path.replace('.mp4', '.avi'), fourcc, fps, (width, height))
        
        frame_count = 0
        cumulative_stats = {
            'faces': 0,
            'text': 0,
            'screens': 0,
            'documents': 0,
            'plates': 0,
            'total': 0
        }
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Process frame with AI detection
            processed_frame, frame_stats = process_frame(
                frame, 
                blur_faces=blur_faces, 
                blur_text=blur_text, 
                blur_plates=blur_plates,
                blur_type=blur_type
            )
            
            # Update cumulative statistics
            for key in cumulative_stats:
                cumulative_stats[key] += frame_stats.get(key, 0)
            
            # Write frame
            out.write(processed_frame)
            frame_count += 1
            
            # Update progress
            progress = int((frame_count / total_frames) * 100)
            processing_status[file_id] = {
                "status": "processing",
                "progress": progress,
                "message": f"Processing frame {frame_count}/{total_frames}",
                "detections": cumulative_stats.copy()
            }
            
            # Allow other tasks to run
            if frame_count % 10 == 0:
                await asyncio.sleep(0.001)
        
        # Release resources
        cap.release()
        out.release()
        
        # Verify output file exists
        if Path(output_path).exists():
            processing_status[file_id] = {
                "status": "completed",
                "progress": 100,
                "message": "AI processing complete!",
                "detections": cumulative_stats,
                "frames_processed": frame_count
            }
        else:
            processing_status[file_id] = {
                "status": "error",
                "progress": 0,
                "message": "Output file was not created"
            }
        
        print(f"Video processing complete: {output_path}")
        print(f"Detection summary: {cumulative_stats}")
        
    except Exception as e:
        print(f"Error processing video: {str(e)}")
        traceback.print_exc()
        processing_status[file_id] = {
            "status": "error",
            "progress": 0,
            "message": f"Error: {str(e)}"
        }


def process_image(input_path: str, output_path: str, blur_faces=True, blur_text=False, blur_plates=True, blur_type="gaussian"):
    """
    Process an image with AI-based detection and blurring
    """
    try:
        frame = cv2.imread(input_path)
        
        if frame is None:
            return False, "Could not read image file", {}
        
        processed_frame, stats = process_frame(
            frame, 
            blur_faces=blur_faces, 
            blur_text=blur_text, 
            blur_plates=blur_plates,
            blur_type=blur_type
        )
        
        # Save processed image
        cv2.imwrite(output_path, processed_frame)
        
        message = f"Detected and blurred: {stats['faces']} faces, {stats['screens']} screens, {stats['text']} text regions"
        return True, message, stats
        
    except Exception as e:
        return False, str(e), {}


@app.get("/")
async def root():
    return {
        "message": "Welcome to SCANNON.AI API - AI-Powered Privacy Protection",
        "status": "running",
        "version": "3.0.0",
        "ai_models": {
            "mediapipe": MEDIAPIPE_AVAILABLE,
            "yolov8": YOLO_AVAILABLE,
            "easyocr": EASYOCR_AVAILABLE
        },
        "features": [
            "🎭 Face detection using MediaPipe (95%+ accuracy)",
            "📱 Screen detection (phones, laptops, TVs, monitors)",
            "📄 Document detection (ID cards, books, papers)",
            "🔤 Text detection (emails, phone numbers, SSN, credit cards)",
            "🎨 Multiple blur types (gaussian, pixelate, median, solid)",
            "🎥 Real-time video and image processing",
            "🤖 Powered by YOLOv8, MediaPipe, and EasyOCR"
        ]
    }


@app.post("/api/upload")
async def upload_video(
    file: UploadFile = File(...),
    blur_type: str = "gaussian",
    blur_faces: bool = True,
    blur_plates: bool = True,
    blur_text: bool = True  # NOW ENABLED BY DEFAULT for document detection
):
    """
    Upload and process video/image with face and sensitive information blurring
    """
    try:
        # Validate file type
        content_type = file.content_type or ""
        is_video = content_type.startswith('video/')
        is_image = content_type.startswith('image/')
        
        if not is_video and not is_image:
            raise HTTPException(status_code=400, detail="File must be a video or image")
        
        # Save uploaded file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = re.sub(r'[^\w\-_\.]', '_', file.filename or "upload")
        original_filename = f"{timestamp}_{safe_filename}"
        upload_path = UPLOAD_DIR / original_filename
        
        with open(upload_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Determine output filename and extension
        if is_video:
            processed_filename = f"processed_{original_filename}"
            if not processed_filename.lower().endswith('.mp4'):
                processed_filename = processed_filename.rsplit('.', 1)[0] + '.mp4'
        else:
            processed_filename = f"processed_{original_filename}"
        
        processed_path = PROCESSED_DIR / processed_filename
        file_id = f"{timestamp}_{hash(original_filename)}"
        
        if is_video:
            # Start video processing asynchronously
            asyncio.create_task(process_video_async(
                str(upload_path), 
                str(processed_path), 
                file_id,
                blur_faces=blur_faces,
                blur_text=blur_text,
                blur_plates=blur_plates,
                blur_type=blur_type
            ))
            
            return JSONResponse(content={
                "message": "Video uploaded successfully, processing started",
                "original_file": original_filename,
                "processed_file": processed_filename,
                "file_id": file_id,
                "status": "processing",
                "type": "video"
            })
        else:
            # Process image synchronously
            success, message, stats = process_image(
                str(upload_path), 
                str(processed_path),
                blur_faces=blur_faces,
                blur_text=blur_text,
                blur_plates=blur_plates,
                blur_type=blur_type
            )
            
            if success:
                return JSONResponse(content={
                    "message": message,
                    "original_file": original_filename,
                    "processed_file": processed_filename,
                    "file_id": file_id,
                    "status": "completed",
                    "type": "image",
                    "ready": True,
                    "detections": stats
                })
            else:
                raise HTTPException(status_code=500, detail=message)
    
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/status/{filename}")
async def get_status(filename: str):
    """
    Check processing status of a file
    """
    # Check by filename in processing_status
    for file_id, status in processing_status.items():
        if filename in file_id or file_id in filename:
            return {
                "file": filename,
                "ready": status.get("status") == "completed",
                **status
            }
    
    # Check if processed file exists
    processed_file = PROCESSED_DIR / filename
    
    if processed_file.exists():
        return {
            "status": "completed",
            "file": filename,
            "ready": True,
            "progress": 100,
            "message": "File is ready for download"
        }
    else:
        return {
            "status": "processing",
            "file": filename,
            "ready": False,
            "progress": 0,
            "message": "File is still being processed"
        }


@app.get("/api/progress/{file_id}")
async def get_progress(file_id: str):
    """
    Get detailed processing progress
    """
    if file_id in processing_status:
        return processing_status[file_id]
    
    return {
        "status": "unknown",
        "message": "File ID not found"
    }


@app.get("/api/download/{filename}")
async def download_file(filename: str):
    """
    Download processed file
    """
    file_path = PROCESSED_DIR / filename
    
    if not file_path.exists():
        # Try without .mp4 extension or with different extension
        for ext in ['.mp4', '.avi', '.jpg', '.png', '.jpeg']:
            alt_path = PROCESSED_DIR / (filename.rsplit('.', 1)[0] + ext)
            if alt_path.exists():
                file_path = alt_path
                break
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    # Determine media type
    suffix = file_path.suffix.lower()
    media_types = {
        '.mp4': 'video/mp4',
        '.avi': 'video/x-msvideo',
        '.mov': 'video/quicktime',
        '.webm': 'video/webm',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
    }
    media_type = media_types.get(suffix, 'application/octet-stream')
    
    return FileResponse(
        path=str(file_path),
        filename=file_path.name,
        media_type=media_type
    )


@app.get("/api/preview/{filename}")
async def preview_file(filename: str):
    """
    Preview original uploaded file
    """
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    suffix = file_path.suffix.lower()
    media_types = {
        '.mp4': 'video/mp4',
        '.avi': 'video/x-msvideo',
        '.mov': 'video/quicktime',
        '.webm': 'video/webm',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
    }
    media_type = media_types.get(suffix, 'application/octet-stream')
    
    return FileResponse(
        path=str(file_path),
        filename=filename,
        media_type=media_type
    )


@app.delete("/api/cleanup")
async def cleanup_files():
    """
    Clean up all files
    """
    try:
        deleted_count = 0
        for file in UPLOAD_DIR.glob("*"):
            file.unlink()
            deleted_count += 1
        for file in PROCESSED_DIR.glob("*"):
            file.unlink()
            deleted_count += 1
        
        processing_status.clear()
        
        return {"message": f"Cleanup successful, deleted {deleted_count} files"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/file/{filename}")
async def delete_file(filename: str):
    """
    Delete specific file
    """
    try:
        upload_path = UPLOAD_DIR / filename
        processed_path = PROCESSED_DIR / filename
        processed_path2 = PROCESSED_DIR / f"processed_{filename}"
        
        deleted = []
        for path in [upload_path, processed_path, processed_path2]:
            if path.exists():
                path.unlink()
                deleted.append(str(path.name))
        
        if deleted:
            return {"message": f"Deleted: {', '.join(deleted)}"}
        else:
            raise HTTPException(status_code=404, detail="File not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
async def health_check():
    """
    Health check endpoint with AI model status
    """
    ai_model_status = {
        "mediapipe": {
            "available": MEDIAPIPE_AVAILABLE,
            "loaded": mp_face_detection is not None,
            "purpose": "Face detection"
        },
        "yolov8": {
            "available": YOLO_AVAILABLE,
            "loaded": yolo_model is not None,
            "purpose": "Object detection (screens, documents, devices)"
        },
        "easyocr": {
            "available": EASYOCR_AVAILABLE,
            "loaded": ocr_reader is not None,
            "purpose": "Text detection (emails, phone numbers, sensitive data)"
        }
    }
    
    return {
        "status": "healthy",
        "version": "3.0.0",
        "opencv_version": cv2.__version__,
        "ai_models": ai_model_status,
        "upload_dir": str(UPLOAD_DIR.absolute()),
        "processed_dir": str(PROCESSED_DIR.absolute()),
        "capabilities": {
            "face_detection": MEDIAPIPE_AVAILABLE,
            "screen_detection": YOLO_AVAILABLE,
            "text_detection": EASYOCR_AVAILABLE,
            "realtime_processing": True,
            "comprehensive_privacy": MEDIAPIPE_AVAILABLE and YOLO_AVAILABLE and EASYOCR_AVAILABLE
        }
    }


@app.websocket("/ws/realtime")
async def websocket_realtime(websocket: WebSocket):
    """
    WebSocket endpoint for real-time video processing
    Receives frames from client, processes them, and sends back blurred frames
    """
    await websocket.accept()
    print("🔴 Real-time session started")
    
    try:
        while True:
            # Receive frame data from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "frame":
                # Decode base64 image
                img_data = base64.b64decode(message["data"].split(",")[1])
                nparr = np.frombuffer(img_data, np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                
                if frame is not None:
                    # Process frame with AI detection (fast mode - only faces and documents)
                    processed_frame, stats = process_frame(
                        frame,
                        blur_faces=True,
                        blur_text=False,  # Disable OCR for speed in real-time
                        blur_plates=False,  # Disable for speed
                        blur_type="gaussian"
                    )
                    
                    # Encode processed frame to JPEG
                    _, buffer = cv2.imencode('.jpg', processed_frame, (cv2.IMWRITE_JPEG_QUALITY, 85))
                    processed_base64 = base64.b64encode(buffer).decode('utf-8')
                    
                    # Send processed frame back
                    await websocket.send_json({
                        "type": "processed_frame",
                        "data": f"data:image/jpeg;base64,{processed_base64}",
                        "stats": stats
                    })
            
            elif message.get("type") == "close":
                print("🛑 Client requested close")
                break
                
    except WebSocketDisconnect:
        print("🔌 Real-time session disconnected")
    except Exception as e:
        print(f"❌ Real-time processing error: {e}")
        traceback.print_exc()
    finally:
        print("✅ Real-time session ended")


if __name__ == "__main__":
    print("="*60)
    print("🚀 Starting SCANNON.AI Backend Server v3.0.0")
    print("="*60)
    print(f"📦 OpenCV version: {cv2.__version__}")
    print(f"\n🤖 AI Models Status:")
    print(f"  ✓ MediaPipe Face Detection: {'Loaded' if MEDIAPIPE_AVAILABLE else 'Not Available'}")
    print(f"  ✓ YOLOv8 Object Detection: {'Loaded' if YOLO_AVAILABLE else 'Not Available'}")
    print(f"  ✓ EasyOCR Text Detection: {'Loaded' if EASYOCR_AVAILABLE else 'Not Available'}")
    print(f"\n✨ NEW FEATURES:")
    print(f"  🔴 Real-Time Webcam Blurring (WebSocket)")
    print(f"  📄 Smart Document Detection (light-colored papers only)")
    print(f"  🚗 License Plate Detection")
    print(f"\n📂 Directories:")
    print(f"  - Upload: {UPLOAD_DIR.absolute()}")
    print(f"  - Processed: {PROCESSED_DIR.absolute()}")
    print("="*60)
    print("🌐 Server starting on http://0.0.0.0:8000")
    print("📚 API docs: http://localhost:8000/docs")
    print("🔴 Real-Time: ws://localhost:8000/ws/realtime")
    print("="*60)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
