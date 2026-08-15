import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative py-2 w-full flex items-center justify-center overflow-hidden bg-transparent">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Center-aligned Scannon.AI Branding */}
          <div className="flex flex-col items-center justify-center">
            {/* Top Subtitle */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl md:text-4xl font-extrabold text-zinc-900 mb-4 tracking-tight"
            >
              Every second, personal data is at risk.
            </motion.h2>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-black mb-4 text-center tracking-tight text-zinc-900"
            >
              Scannon.AI
            </motion.h1>

            {/* Subtitle Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed text-center font-bold text-zinc-700"
            >
              Where AI meets privacy. Watch as faces and data vanish in real-time with our advanced blurring technology.
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
                  className="px-9 py-4 rounded-full font-extrabold text-base shadow-xl transition-all duration-300 bg-black hover:bg-zinc-800 text-white border border-black"
                >
                  Experience the Blur
                </motion.button>
              </Link>

              <Link to="/realtime">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-9 py-4 rounded-full font-bold text-base transition-all duration-300 shadow-md flex items-center gap-2 border bg-white hover:bg-zinc-100 text-zinc-900 border-zinc-300"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Live Stream Blur
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
