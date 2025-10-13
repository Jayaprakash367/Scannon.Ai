from fastapi import FastAPI, File, UploadFile, HTTPException
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

app = FastAPI(title="SCANNON.AI API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
UPLOAD_DIR = Path("uploads")
PROCESSED_DIR = Path("processed")
UPLOAD_DIR.mkdir(exist_ok=True)
PROCESSED_DIR.mkdir(exist_ok=True)

# Load face detection model
face_cascade = cv2.CascadeClassifier(os.path.join(os.path.dirname(cv2.__file__), 'data', 'haarcascades', 'haarcascade_frontalface_default.xml'))

@app.get("/")
async def root():
    return {
        "message": "Welcome to SCANNON.AI API",
        "status": "running",
        "version": "1.0.0"
    }

@app.post("/api/upload")
async def upload_video(file: UploadFile = File(...)):
    """
    Upload and process video with face blurring
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('video/'):
            raise HTTPException(status_code=400, detail="File must be a video")
        
        # Save uploaded file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        original_filename = f"{timestamp}_{file.filename}"
        upload_path = UPLOAD_DIR / original_filename
        
        with open(upload_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process video
        processed_filename = f"processed_{original_filename}"
        processed_path = PROCESSED_DIR / processed_filename
        
        # Start processing asynchronously
        asyncio.create_task(process_video(str(upload_path), str(processed_path)))
        
        return JSONResponse(content={
            "message": "Video uploaded successfully",
            "original_file": original_filename,
            "processed_file": processed_filename,
            "status": "processing"
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def process_video(input_path: str, output_path: str):
    """
    Process video with face detection and blurring
    """
    try:
        # Open video
        cap = cv2.VideoCapture(input_path)
        
        # Get video properties
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        # Video writer
        fourcc = cv2.VideoWriter.fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        frame_count = 0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Convert to grayscale for face detection
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # Detect faces
            faces = face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30)
            )
            
            # Blur detected faces
            for (x, y, w, h) in faces:
                # Extract face region
                face_region = frame[y:y+h, x:x+w]
                
                # Apply Gaussian blur
                blurred_face = cv2.GaussianBlur(face_region, (99, 99), 30)
                
                # Replace face region with blurred version
                frame[y:y+h, x:x+w] = blurred_face
            
            # Write frame
            out.write(frame)
            frame_count += 1
            
            # Progress logging (can be replaced with websocket for real-time updates)
            if frame_count % 30 == 0:
                progress = (frame_count / total_frames) * 100
                print(f"Processing: {progress:.2f}%")
        
        # Release resources
        cap.release()
        out.release()
        
        print(f"Video processing complete: {output_path}")
        
    except Exception as e:
        print(f"Error processing video: {str(e)}")

@app.get("/api/status/{filename}")
async def get_status(filename: str):
    """
    Check if processed video is ready
    """
    processed_file = PROCESSED_DIR / filename
    
    if processed_file.exists():
        return {
            "status": "completed",
            "file": filename,
            "ready": True
        }
    else:
        return {
            "status": "processing",
            "file": filename,
            "ready": False
        }

@app.get("/api/download/{filename}")
async def download_video(filename: str):
    """
    Download processed video
    """
    file_path = PROCESSED_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        path=str(file_path),
        filename=filename,
        media_type='video/mp4'
    )

@app.delete("/api/cleanup")
async def cleanup_files():
    """
    Clean up old files
    """
    try:
        for file in UPLOAD_DIR.glob("*"):
            file.unlink()
        for file in PROCESSED_DIR.glob("*"):
            file.unlink()
        return {"message": "Cleanup successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
