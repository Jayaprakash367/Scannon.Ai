import Hero from '../components/Hero';
import Features from '../components/Features';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative">
      {/* Video Background - Only Top Section */}
      <div className="fixed top-0 left-0 right-0 z-0" style={{ height: '100vh' }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ opacity: 0.75 }}
        >
          <source src="/background-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-blue-900/30 to-slate-900/40"></div>
        {/* Fade out at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* New Feature Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 pt-28"
        >
          <div className="bg-gradient-to-r from-red-500/20 via-pink-500/20 to-purple-500/20 border-2 border-red-500/50 rounded-2xl p-6 backdrop-blur-lg">
            <div className="flex items-center justify-between flex-wrap gap-4 lg:gap-8">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="flex items-center gap-2 text-red-400 animate-pulse font-bold whitespace-nowrap">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  NEW!
                </span>
                <span className="text-white font-semibold text-sm sm:text-base">🔴 Real-Time Blurring Now Available!</span>
                <span className="text-gray-300 text-sm hidden lg:inline">- Blur your webcam live with AI</span>
              </div>
              <button
                onClick={() => window.location.href = '/realtime'}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-full shadow-lg transition-all whitespace-nowrap"
              >
                Try It Now →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* Clean CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Protect Your Privacy?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Experience the power of AI-driven video privacy protection
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/upload'}
                className="px-10 py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full text-white font-bold text-lg shadow-2xl hover:shadow-cyan-500/50 transition-all"
              >
                Get Started Now
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
