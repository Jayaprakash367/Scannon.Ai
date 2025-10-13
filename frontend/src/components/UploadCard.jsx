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

      const response = await axios.post('http://localhost:8000/api/upload', formData, {
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
        const response = await axios.get(`http://localhost:8000/api/status/${filename}`);

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
      window.open(`http://localhost:8000/api/download/${processedFile}`, '_blank');
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
              <div className="relative">
                <Shield className="w-8 h-8 text-cyan-400" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-cyan-400/30 rounded-full"
                />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Secure Upload
              </h2>
            </motion.div>
            <p className="text-gray-300 text-lg">
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
              className={`relative group cursor-pointer transition-all duration-500 ${
                isDragging ? 'scale-105' : 'hover:scale-102'
              }`}
            >
              <div className={`relative p-12 rounded-2xl border-2 border-dashed transition-all duration-300 ${
                isDragging
                  ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 shadow-2xl shadow-cyan-500/20'
                  : 'border-white/20 hover:border-cyan-400/50 hover:bg-gradient-to-br hover:from-white/5 hover:to-cyan-500/5'
              }`}>
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        x: [0, Math.random() * 100 - 50, 0],
                        y: [0, Math.random() * 100 - 50, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                      className="absolute w-2 h-2 bg-cyan-400/20 rounded-full"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`
                      }}
                    />
                  ))}
                </div>

                <motion.div
                  animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative z-10 text-center"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-6 border border-cyan-400/30"
                  >
                    {React.createElement(getFileIcon(), {
                      className: "w-10 h-10 text-cyan-400"
                    })}
                  </motion.div>

                  <motion.h3
                    className="text-2xl font-bold text-white mb-3"
                    animate={file ? {} : { opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {file ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        {file.name}
                      </span>
                    ) : (
                      'Drop your file here'
                    )}
                  </motion.h3>

                  <motion.p
                    className="text-gray-400 mb-4 text-lg"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    or click to browse your files
                  </motion.p>

                  <div className="flex justify-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileVideo className="w-4 h-4" />
                      MP4, AVI, MOV, WebM
                    </span>
                    <span className="text-gray-600">•</span>
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
              className="space-y-6"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-4 border border-cyan-400/30"
                >
                  <Zap className="w-8 h-8 text-cyan-400" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {status === 'uploading' ? 'Uploading & Analyzing...' : 'AI Processing...'}
                </h3>
                <p className="text-gray-400">
                  {status === 'uploading'
                    ? 'Securing your file transfer...'
                    : 'Detecting and protecting sensitive information...'
                  }
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-white font-medium">
                  <span>{status === 'uploading' ? 'Upload Progress' : 'Processing Progress'}</span>
                  <span className="text-cyan-400">{uploadProgress}%</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full relative overflow-hidden"
                    >
                      <motion.div
                        animate={{ x: [-100, 400] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>

              {status === 'processing' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-3 text-cyan-400 bg-cyan-500/10 rounded-xl p-4 border border-cyan-500/20"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-medium">AI is analyzing every frame...</span>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-center space-y-6"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30"
              >
                <CheckCircle className="w-10 h-10 text-green-400" />
              </motion.div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Privacy Protection Complete!
                </h3>
                <p className="text-gray-400">
                  Your {getFileTypeText()} has been processed with advanced AI protection
                </p>
              </div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  onClick={handleDownload}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Download Protected File
                </motion.button>
                <motion.button
                  onClick={resetUpload}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl text-white font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Upload Another
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-center space-y-6"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-400/30"
              >
                <AlertCircle className="w-10 h-10 text-red-400" />
              </motion.div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Processing Failed</h3>
                <p className="text-gray-400">{error}</p>
              </div>

              <motion.button
                onClick={resetUpload}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl text-white font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
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
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <motion.button
                onClick={handleUpload}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(6, 182, 212, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-8 py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-xl text-white font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Zap className="w-6 h-6" />
                  Start AI Protection
                  <Zap className="w-6 h-6" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-200, 400] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.button>
            </motion.div>
          )}

          {/* Error Message */}
          {error && status === 'idle' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-red-400 text-center bg-red-500/10 rounded-lg p-3 border border-red-500/20"
            >
              {error}
            </motion.p>
          )}
        </div>
      );
    };

    export default UploadCard;
