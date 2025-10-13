import { motion, AnimatePresence } from 'framer-motion';
import UploadCard from '../components/UploadCard';
import { Shield, Lock, Zap } from 'lucide-react';

const Upload = () => {
  return (
    <div className="relative min-h-screen py-20 px-4 overflow-hidden">
      {/* Animated dark background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -80, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 80, 0], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
        />
        <div className="absolute inset-0 bg-slate-900/80" />
      </div>
      <div className="relative z-10 container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Upload Your Media
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Our AI will automatically detect and blur all faces and sensitive information in your videos and images
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <TrustBadge
              icon={Shield}
              text="Secure Upload"
            />
            <TrustBadge
              icon={Lock}
              text="Encrypted Transfer"
            />
            <TrustBadge
              icon={Zap}
              text="Fast Processing"
            />
          </div>
        </motion.div>

        {/* Combined Upload and Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative max-w-7xl mx-auto"
        >
          {/* Main Container with Connected Design */}
          <div className="relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl" />
            <div className="absolute inset-0 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl" />

            {/* Animated border */}
            <motion.div
              animate={{
                background: [
                  "conic-gradient(from 0deg, transparent, cyan-400/20, transparent)",
                  "conic-gradient(from 360deg, transparent, cyan-400/20, transparent)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-3xl p-[1px]"
            >
              <div className="w-full h-full bg-slate-900/90 backdrop-blur-md rounded-3xl" />
            </motion.div>

            <div className="relative p-8">
              {/* Single Upload Container */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative max-w-4xl mx-auto"
              >
                {/* Upload Container Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl" />
                <div className="absolute inset-0 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl" />

                <div className="relative p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-400/30">
                      <Shield className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      Upload & Process
                    </h2>
                  </div>

                  <UploadCard />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
            <div className="space-y-4 text-gray-300">
              <Step
                number="1"
                title="Upload Your Media"
                description="Choose a video or image file from your device. We support MP4, AVI, MOV, WebM, JPG, PNG, GIF, and WebP formats."
              />
              <Step
                number="2"
                title="AI Processing"
                description="Our advanced AI scans every frame to detect faces and sensitive information with 99.9% accuracy."
              />
              <Step
                number="3"
                title="Download Protected Video"
                description="Get your privacy-protected video with all faces and sensitive data automatically blurred."
              />
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mt-8 p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Privacy Guarantee
            </h3>
            <p className="text-gray-300 text-sm">
              Your videos are processed securely and automatically deleted from our servers after 24 hours. 
              We never store, share, or use your content for any purpose other than processing.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Info Section */}
    </div>
  );
};

const TrustBadge = ({ icon: Icon, text }) => {
  return (
    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
      <Icon className="w-5 h-5 text-cyan-400" />
      <span className="text-white font-medium">{text}</span>
    </div>
  );
};

const Step = ({ number, title, description }) => {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <div>
        <h3 className="text-white font-semibold mb-1">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Upload;
