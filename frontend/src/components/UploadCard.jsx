import { motion } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle, Loader2, FileVideo, Image, Zap, Shield } from 'lucide-react';
import { useState, useRef } from 'react';
import React from 'react';
import axios from 'axios';

const UploadCard = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, uploading, processing, success, error
  const [processedFile, setProcessedFile] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type.startsWith('video/') || droppedFile.type.startsWith('image/'))) {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please drop a valid video or image file');
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type.startsWith('video/') || selectedFile.type.startsWith('image/'))) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid video or image file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatus('uploading');
      setUploadProgress(0);

      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      setStatus('processing');
      setProcessedFile(response.data.processed_file);

      // Poll for processing status
      pollProcessingStatus(response.data.processed_file);
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.detail || 'Upload failed. Please try again.');
    }
  };

  const pollProcessingStatus = async (filename) => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/status/${filename}`);

        if (response.data.ready) {
          clearInterval(interval);
          setStatus('success');
          setUploadProgress(100);
        }
      } catch (err) {
        clearInterval(interval);
        setStatus('error');
        setError('Processing failed. Please try again.');
      }
    }, 2000);
  };

  const handleDownload = () => {
    if (processedFile) {
      window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/download/${processedFile}`, '_blank');
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setStatus('idle');
    setProcessedFile(null);
    setError('');
  };

  const getFileIcon = () => {
    if (!file) return Upload;
    return file.type.startsWith('video/') ? FileVideo : Image;
  };

  const getFileTypeText = () => {
    if (!file) return 'video or image';
    return file.type.startsWith('video/') ? 'video' : 'image';
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-3 mb-4"
        >
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200">
            <Shield className="w-6 h-6 text-black" />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
            Secure Upload
          </h2>
        </motion.div>
        <p className="text-zinc-600 text-lg font-medium">
          Upload your {getFileTypeText()} for AI-powered privacy protection
        </p>
      </div>

      {/* Upload Area */}
      {status === 'idle' && (
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer transition-all duration-300 ${isDragging ? 'scale-102' : 'hover:scale-101'
            }`}
        >
          <div className={`relative p-12 rounded-2xl border-2 border-dashed transition-all duration-300 ${isDragging
            ? 'border-black bg-zinc-100 shadow-xl'
            : 'border-zinc-300 hover:border-black bg-zinc-50/50 hover:bg-zinc-50'
            }`}>
            <motion.div
              animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative z-10 text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white mb-6 border border-zinc-200 shadow-xs">
                {React.createElement(getFileIcon(), {
                  className: "w-10 h-10 text-black"
                })}
              </div>

              <motion.h3
                className="text-2xl font-bold text-zinc-900 mb-3"
              >
                {file ? (
                  <span className="flex items-center justify-center gap-2 text-green-700 font-bold">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    {file.name}
                  </span>
                ) : (
                  'Drop your file here'
                )}
              </motion.h3>

              <p className="text-zinc-600 mb-4 text-lg font-medium">
                or click to browse your files
              </p>

              <div className="flex justify-center gap-4 text-sm text-zinc-500 font-medium">
                <span className="flex items-center gap-1">
                  <FileVideo className="w-4 h-4" />
                  MP4, AVI, MOV, WebM
                </span>
                <span className="text-zinc-400">•</span>
                <span className="flex items-center gap-1">
                  <Image className="w-4 h-4" />
                  JPG, PNG, GIF, WebP
                </span>
              </div>
            </motion.div>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </motion.div>
      )}

      {/* Progress Section */}
      {(status === 'uploading' || status === 'processing') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 bg-zinc-50 p-8 rounded-2xl border border-zinc-200"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4 border border-zinc-200 shadow-xs">
              <Zap className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">
              {status === 'uploading' ? 'Uploading & Analyzing...' : 'AI Processing...'}
            </h3>
            <p className="text-zinc-600 font-medium">
              {status === 'uploading'
                ? 'Securing your file transfer...'
                : 'Detecting and protecting sensitive information...'
              }
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-zinc-900 font-bold">
              <span>{status === 'uploading' ? 'Upload Progress' : 'Processing Progress'}</span>
              <span className="text-black">{uploadProgress}%</span>
            </div>
            <div className="relative">
              <div className="w-full bg-zinc-200 rounded-full h-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-black rounded-full"
                />
              </div>
            </div>
          </div>

          {status === 'processing' && (
            <div className="flex items-center justify-center gap-3 text-zinc-900 bg-zinc-100 rounded-xl p-4 border border-zinc-200">
              <Loader2 className="w-5 h-5 animate-spin text-black" />
              <span className="font-bold">AI is analyzing every frame...</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Success State */}
      {status === 'success' && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center space-y-6 bg-zinc-50 p-8 rounded-2xl border border-zinc-200"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 border border-green-300">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">
              Privacy Protection Complete!
            </h3>
            <p className="text-zinc-600 font-medium">
              Your {getFileTypeText()} has been processed with advanced AI protection
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={handleDownload}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-black hover:bg-zinc-800 text-white font-bold text-lg rounded-xl shadow-lg transition-all"
            >
              Download Protected File
            </motion.button>
            <motion.button
              onClick={resetUpload}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-zinc-200 hover:bg-zinc-300 text-zinc-900 font-bold text-lg rounded-xl border border-zinc-300 transition-all"
            >
              Upload Another
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center space-y-6 bg-red-50 p-8 rounded-2xl border border-red-200"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 border border-red-300">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-red-900 mb-2">Processing Failed</h3>
            <p className="text-red-700 font-medium">{error}</p>
          </div>

          <motion.button
            onClick={resetUpload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-xl shadow-md transition-all"
          >
            Try Again
          </motion.button>
        </motion.div>
      )}

      {/* Upload Button */}
      {file && status === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <motion.button
            onClick={handleUpload}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-8 py-5 bg-black hover:bg-zinc-800 rounded-xl text-white font-bold text-xl shadow-xl transition-all flex items-center justify-center gap-3 border border-black"
          >
            <Zap className="w-6 h-6" />
            Start AI Protection
          </motion.button>
        </motion.div>
      )}

      {/* Error Message */}
      {error && status === 'idle' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-red-600 font-semibold text-center bg-red-50 rounded-lg p-3 border border-red-200"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default UploadCard;
