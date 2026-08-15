import { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Camera, AlertCircle, Server } from 'lucide-react';

export default function RealTime() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ faces: 0, documents: 0, total: 0 });
  const [fps, setFps] = useState(0);
  const [backendAvailable, setBackendAvailable] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const isStreamingRef = useRef(false);
  const animationIdRef = useRef(null);

  // Check if backend is available
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/health`, {
          method: 'GET',
          mode: 'cors'
        });
        setBackendAvailable(response.ok);
      } catch (error) {
        console.log('Backend not available:', error);
        setBackendAvailable(false);
      }
    };
    checkBackend();
  }, []);

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

      // Connect to WebSocket with environment-aware URL
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'ws://localhost:8000/ws/realtime';
      const wsUrl = backendUrl.replace('http', 'ws');
      const ws = new WebSocket(wsUrl);
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
    <div className="min-h-screen bg-white text-zinc-900 pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-zinc-900 tracking-tight">
            🔴 Real-Time Privacy Protection
          </h1>
          <p className="text-zinc-600 text-lg font-medium">
            Live face and document blurring from your webcam
          </p>
        </div>

        {/* Backend Not Available Warning */}
        {backendAvailable === false && (
          <div className="max-w-2xl mx-auto mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <Server className="text-amber-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="text-amber-900 font-bold">Backend Server Required</p>
              <p className="text-amber-800 text-sm mt-1">
                Real-time blurring requires a backend server running. For local use, run:
              </p>
              <code className="text-zinc-900 text-xs mt-2 block bg-white border border-zinc-200 p-2 rounded font-mono font-bold">
                cd backend && python main.py
              </code>
              <p className="text-amber-800 text-sm mt-2">
                For production, deploy the backend to Railway, Render, or Heroku.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-red-600" size={24} />
            <p className="text-red-900 font-semibold">{error}</p>
          </div>
        )}

        {/* Video Display */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200 shadow-xl">
            {/* Stats Bar */}
            <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
              <div className="flex gap-4 sm:gap-6">
                <div className="bg-white border border-zinc-200 px-4 py-2 rounded-lg shadow-xs">
                  <span className="text-zinc-500 font-semibold text-sm">Faces:</span>
                  <span className="text-black font-black ml-2">{stats.faces}</span>
                </div>
                <div className="bg-white border border-zinc-200 px-4 py-2 rounded-lg shadow-xs">
                  <span className="text-zinc-500 font-semibold text-sm">Documents:</span>
                  <span className="text-black font-black ml-2">{stats.documents}</span>
                </div>
                <div className="bg-white border border-zinc-200 px-4 py-2 rounded-lg shadow-xs">
                  <span className="text-zinc-500 font-semibold text-sm">FPS:</span>
                  <span className="text-black font-black ml-2">{fps}</span>
                </div>
              </div>

              {isStreaming && (
                <div className="flex items-center gap-2 text-red-600 animate-pulse font-bold">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span>LIVE</span>
                </div>
              )}
            </div>

            {/* Video/Canvas Container */}
            <div className="relative bg-zinc-950 rounded-xl overflow-hidden w-full border border-zinc-800 shadow-md" style={{ aspectRatio: '16/9', minHeight: '480px', maxWidth: '100%' }}>
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
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                  <div className="text-center">
                    <Camera size={64} className="text-zinc-500 mx-auto mb-4" />
                    <p className="text-zinc-300 text-lg font-semibold">
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
                  className="flex items-center gap-3 px-8 py-4 bg-black hover:bg-zinc-800 text-white font-bold rounded-xl shadow-lg transition-all border border-black"
                >
                  <Video size={24} />
                  Start Stream
                </button>
              ) : (
                <button
                  onClick={stopStreaming}
                  className="flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  <VideoOff size={24} />
                  Stop Stream
                </button>
              )}
            </div>

            {/* Info */}
            <div className="mt-6 bg-zinc-100 border border-zinc-200 rounded-lg p-4 text-zinc-900">
              <h3 className="text-zinc-900 font-bold mb-2 flex items-center gap-2">
                <AlertCircle size={20} className="text-black" />
                How It Works
              </h3>
              <ul className="text-zinc-600 text-sm space-y-1 ml-6 list-disc font-medium">
                <li>Real-time AI face detection using MediaPipe</li>
                <li>Automatic document detection and blurring</li>
                <li>All processing happens on the server - your privacy is protected</li>
                <li>Optimized for smooth performance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
