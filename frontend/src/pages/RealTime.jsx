import { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Camera, AlertCircle } from 'lucide-react';

export default function RealTime() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ faces: 0, documents: 0, total: 0 });
  const [fps, setFps] = useState(0);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const isStreamingRef = useRef(false);
  const animationIdRef = useRef(null);

  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, []);

  const startStreaming = async () => {
    try {
      setError('');
      
      // Request webcam access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      });
      
      streamRef.current = stream;
      
      // Set video source and wait for it to be ready
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            resolve();
          };
        });
      }
      
      // Connect to WebSocket
      const ws = new WebSocket('ws://localhost:8000/ws/realtime');
      wsRef.current = ws;
      
      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        isStreamingRef.current = true;
        setIsStreaming(true);
        
        // Start sending frames immediately
        processFrames();
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'processed_frame') {
            // Display processed frame on canvas
            const canvas = canvasRef.current;
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
              // Set canvas size only if it changed
              if (canvas.width !== img.width || canvas.height !== img.height) {
                canvas.width = img.width;
                canvas.height = img.height;
              }
              
              // Clear canvas and draw new frame
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
              
              // Update stats
              if (message.stats) {
                setStats(message.stats);
              }
              
              // Calculate FPS
              frameCountRef.current++;
              const now = Date.now();
              if (now - lastTimeRef.current >= 1000) {
                setFps(frameCountRef.current);
                frameCountRef.current = 0;
                lastTimeRef.current = now;
              }
            };
            
            img.onerror = () => {
              console.error('Failed to load processed frame');
            };
            
            img.src = message.data;
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error. Make sure backend is running.');
      };
      
      ws.onclose = () => {
        console.log('WebSocket closed');
        setIsStreaming(false);
      };
      
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Could not access webcam. Please grant camera permissions.');
    }
  };

  const processFrames = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const sendFrame = () => {
      // Check WebSocket connection status
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.log('WebSocket not connected, stopping stream');
        return;
      }
      
      // Check if video is ready and has data
      if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
        console.log('Video not ready, retrying...');
        animationIdRef.current = setTimeout(sendFrame, 66);
        return;
      }
      
      try {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        // Convert to base64 and send
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        wsRef.current.send(JSON.stringify({
          type: 'frame',
          data: dataUrl
        }));
        
        console.log('Frame sent successfully');
      } catch (error) {
        console.error('Error sending frame:', error);
      }
      
      // Continue sending frames
      if (isStreamingRef.current && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        animationIdRef.current = setTimeout(sendFrame, 66);
      }
    };
    
    // Start sending frames
    sendFrame();
  };

  const stopStreaming = () => {
    // Update streaming status
    isStreamingRef.current = false;
    setIsStreaming(false);
    
    // Clear animation frames
    if (animationIdRef.current) {
      clearTimeout(animationIdRef.current);
    }
    
    // Stop webcam
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Close WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({ type: 'close' }));
      } catch (e) {
        console.log('Error sending close message');
      }
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setFps(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            🔴 Real-Time Privacy Protection
          </h1>
          <p className="text-gray-300 text-lg">
            Live face and document blurring from your webcam
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-500/20 border border-red-500 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-red-400" size={24} />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Video Display */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 shadow-2xl">
            {/* Stats Bar */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex gap-6">
                <div className="bg-slate-700/50 px-4 py-2 rounded-lg">
                  <span className="text-gray-400 text-sm">Faces:</span>
                  <span className="text-cyan-400 font-bold ml-2">{stats.faces}</span>
                </div>
                <div className="bg-slate-700/50 px-4 py-2 rounded-lg">
                  <span className="text-gray-400 text-sm">Documents:</span>
                  <span className="text-blue-400 font-bold ml-2">{stats.documents}</span>
                </div>
                <div className="bg-slate-700/50 px-4 py-2 rounded-lg">
                  <span className="text-gray-400 text-sm">FPS:</span>
                  <span className="text-green-400 font-bold ml-2">{fps}</span>
                </div>
              </div>
              
              {isStreaming && (
                <div className="flex items-center gap-2 text-red-400 animate-pulse">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-semibold">LIVE</span>
                </div>
              )}
            </div>

            {/* Video/Canvas Container */}
            <div className="relative bg-black rounded-xl overflow-hidden w-full" style={{ aspectRatio: '16/9', minHeight: '480px', maxWidth: '100%' }}>
              {/* Original video (hidden but needs to load) */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute opacity-0 pointer-events-none"
                style={{ width: 0, height: 0 }}
              />
              
              {/* Processed canvas (displayed) */}
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain block"
                style={{ display: isStreaming ? 'block' : 'none' }}
              />
              
              {/* Placeholder when not streaming */}
              {!isStreaming && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="text-center">
                    <Camera size={64} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">
                      Click &quot;Start Stream&quot; to begin
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="mt-6 flex gap-4 justify-center">
              {!isStreaming ? (
                <button
                  onClick={startStreaming}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 
                           hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl 
                           shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  <Video size={24} />
                  Start Stream
                </button>
              ) : (
                <button
                  onClick={stopStreaming}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 
                           hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl 
                           shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  <VideoOff size={24} />
                  Stop Stream
                </button>
              )}
            </div>

            {/* Info */}
            <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                <AlertCircle size={20} />
                How It Works
              </h3>
              <ul className="text-gray-300 text-sm space-y-1 ml-6 list-disc">
                <li>Real-time AI face detection using MediaPipe</li>
                <li>Automatic document detection and blurring</li>
                <li>All processing happens on the server - your privacy is protected</li>
                <li>Optimized for smooth performance (~15 FPS)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
