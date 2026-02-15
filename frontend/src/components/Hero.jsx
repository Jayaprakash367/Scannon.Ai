import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* High-quality background video (fits right side) */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/poster.jpg"
          className="w-full h-full object-cover object-right-top"
          style={{ transform: 'scale(1.03)', filter: 'brightness(0.45) contrast(1.05)' }}
        >
          <source src="/Create_a_seamless_202510072128.mp4" type="video/mp4" />
          {/* fallback image */}
        </video>

        {/* Subtle overlay so text remains readable while letting high-quality video show through */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-blue-900/60 to-slate-900/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Center-aligned Scannon.AI Branding (logo removed) */}
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-center"
            >
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Scannon.AI
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl text-slate-900 mb-12 max-w-3xl mx-auto leading-relaxed text-center font-medium"
            >
              Where AI meets privacy. Watch as faces and data vanish in real-time
              with our advanced blurring technology.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/upload">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 rounded-full text-white font-bold text-lg shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300"
                >
                  Experience the Blur
                </motion.button>
              </Link>

              <Link to="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-slate-900/10 backdrop-blur-md rounded-full text-slate-900 font-bold text-lg border border-slate-900/20 hover:bg-slate-900/20 transition-all duration-300"
                >
                  Learn More
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <ChevronDown className="w-8 h-8 text-white/50" />
      </motion.div>
    </section>
  );
};

// Removed FeatureCard component as features were removed per request

export default Hero;
