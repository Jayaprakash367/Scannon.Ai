import Hero from '../components/Hero';
import Features from '../components/Features';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    // Setup animated background canvas
    const setupCanvas = () => {
      const canvas = document.getElementById('homeBackgroundCanvas');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      let particles = [];
      
      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.vx = (Math.random() - 0.5) * 1;
          this.vy = (Math.random() - 0.5) * 1;
          this.radius = Math.random() * 2 + 0.5;
          this.opacity = Math.random() * 0.4 + 0.1;
        }
        
        update() {
          this.x += this.vx;
          this.y += this.vy;
          
          if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
          if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
          ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
      }
      
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
          particle.update();
          particle.draw();
        });
        
        requestAnimationFrame(animate);
      };
      
      animate();
      
      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    };
    
    setupCanvas();
  }, []);

  return (
    <div className="w-full bg-slate-950 relative">
      {/* Video Background - LIMITED to Hero Section Height Only */}
      <div className="absolute top-0 left-0 w-full z-0 overflow-hidden" style={{ height: '100vh' }}>
        {/* Video Background - Layer 1 */}
        <video
          key="video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ opacity: 0.8, zIndex: 1, objectPosition: 'center' }}
          onLoadedMetadata={(e) => {
            e.target.play().catch(err => console.log('Video play failed:', err));
          }}
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
        
        {/* Canvas Animated Background - Layer 2 (on top) */}
        <canvas 
          id="homeBackgroundCanvas" 
          className="absolute top-0 left-0 w-full h-full"
          style={{ display: 'block', zIndex: 2, pointerEvents: 'none' }}
        />
        
        {/* Dark Overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/50 to-slate-900" style={{ zIndex: 3 }}></div>
        
        {/* Strong Solid Fade Out at bottom */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" style={{ height: '250px', zIndex: 4, pointerEvents: 'none' }}></div>
      </div>

      {/* Content - High Z-index to appear above video */}
      <div className="relative w-full" style={{ zIndex: 10 }}>
        {/* Hero section spacing */}
        <div style={{ height: '0vh' }}></div>
        
        {/* New Feature Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 pt-28 relative z-20"
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

        {/* Clear separation - Full height solid background */}
        <div className="w-full bg-slate-950 relative pt-0">
          {/* Features Section */}
          <Features />

          {/* Clean CTA Section - SOLID OPAQUE Background with Modern Design */}
          <section className="w-full py-32 px-4 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 relative z-20 overflow-hidden">
            {/* Animated gradient blobs background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s', transform: 'translate(-50%, -50%)' }}></div>
            
            {/* Grid lines for tech aesthetic */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(96, 165, 250, 0.05) 25%, rgba(96, 165, 250, 0.05) 26%, transparent 27%, transparent 74%, rgba(96, 165, 250, 0.05) 75%, rgba(96, 165, 250, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(96, 165, 250, 0.05) 25%, rgba(96, 165, 250, 0.05) 26%, transparent 27%, transparent 74%, rgba(96, 165, 250, 0.05) 75%, rgba(96, 165, 250, 0.05) 76%, transparent 77%, transparent)',
              backgroundSize: '50px 50px'
            }}></div>
            
            <div className="container mx-auto text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto"
              >
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight drop-shadow-lg">
                  Ready to Protect Your Privacy?
                </h2>
                <p className="text-lg md:text-2xl text-gray-100 mb-12 font-medium drop-shadow-md">
                  Experience the power of AI-driven video privacy protection
                </p>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/upload'}
                  className="px-12 py-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full text-white font-bold text-xl shadow-2xl hover:shadow-cyan-500/70 transition-all"
                >
                  Get Started Now
                </motion.button>
              </motion.div>
            </div>
          </section>

          {/* Additional Info Section - Modern Animated Background */}
          <section className="w-full py-20 px-4 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-t border-slate-800/50 relative z-20 overflow-hidden">
            {/* Animated gradient orbs */}
            <div className="absolute inset-0">
              <div className="absolute top-10 left-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s' }}></div>
              <div className="absolute bottom-10 right-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
            </div>
            
            <div className="container mx-auto relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center p-6"
                >
                  <div className="text-4xl font-bold text-cyan-400 mb-3">🎯</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Accurate Detection</h3>
                  <p className="text-gray-200">Real-time AI detection with advanced algorithms</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-center p-6"
                >
                  <div className="text-4xl font-bold text-purple-400 mb-3">🔒</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Privacy First</h3>
                  <p className="text-gray-200">Your data is processed locally and never stored</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-center p-6"
                >
                  <div className="text-4xl font-bold text-blue-400 mb-3">⚡</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
                  <p className="text-gray-200">Instant processing with minimal latency</p>
                </motion.div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
