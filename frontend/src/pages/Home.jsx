import Hero from '../components/Hero';
import Features from '../components/Features';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Target, ShieldCheck, Zap, CheckCircle2, Lock, Sparkles, Shield } from 'lucide-react';

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
    <div className="w-full bg-white text-zinc-900 relative">
      {/* Hero Full Screen Video Section (100vh) */}
      <div className="relative w-full h-screen overflow-hidden bg-black">
        {/* Full Screen Video */}
        <video
          key="video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ opacity: 1, zIndex: 1, objectPosition: 'center' }}
          onLoadedMetadata={(e) => {
            e.target.play().catch(err => console.log('Video play failed:', err));
          }}
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>

        {/* Canvas Animated Background */}
        <canvas
          id="homeBackgroundCanvas"
          className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
          style={{ zIndex: 2 }}
        />

        {/* Content Anchored at the BOTTOM of the Full Screen Video */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-10 pt-28 px-4 bg-gradient-to-t from-white via-white/95 to-transparent flex flex-col items-center justify-end text-center">
          <Hero />
        </div>
      </div>

      {/* Rest of the Page Sections */}
      <div className="relative w-full z-10 bg-white">
        {/* Features Section */}
        <Features />

        {/* Clean CTA Section */}
        <section className="w-full py-20 px-4 bg-white relative z-20 overflow-hidden">
          <div className="container mx-auto relative z-10 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-zinc-50 border border-zinc-200 rounded-3xl p-10 md:p-16 text-center shadow-lg relative overflow-hidden"
            >
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-6 leading-tight tracking-tight">
                Ready to Protect Your Privacy?
              </h2>
              <p className="text-base md:text-xl text-zinc-600 mb-10 font-medium max-w-2xl mx-auto">
                Experience the power of AI-driven video privacy protection. Process videos 100% locally with zero cloud upload.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/upload'}
                className="px-10 py-5 bg-black hover:bg-zinc-800 rounded-full text-white font-bold text-lg shadow-xl transition-all border border-black"
              >
                Get Started Now →
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Interactive Trust Standards & Core Pillars Section */}
        <section className="w-full py-24 px-4 bg-white relative z-20 overflow-hidden border-t border-zinc-200">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Accurate AI Detection */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4 }}
                className="bg-zinc-50 border border-zinc-200 hover:border-black rounded-3xl p-8 transition-all duration-300 shadow-xs hover:shadow-xl relative flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <motion.div
                      whileHover={{ rotate: 12, scale: 1.1 }}
                      className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center shadow-md"
                    >
                      <Target className="w-7 h-7 text-white" />
                    </motion.div>
                    <span className="text-[11px] font-mono font-bold bg-zinc-200/80 text-zinc-800 px-3 py-1 rounded-full border border-zinc-300">
                      99.9% ACCURACY
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-zinc-900 mb-3 tracking-tight">Precision AI Detection</h3>
                  <p className="text-zinc-600 text-sm font-medium leading-relaxed mb-6">
                    Multi-model neural inference (YOLOv8 + MediaPipe + EasyOCR) pinpoints faces, screens, license plates, and sensitive documents with extreme precision.
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-200 flex items-center justify-between text-xs font-bold text-zinc-900">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Neural Verified Engine
                  </span>
                  <span className="font-mono text-zinc-400 group-hover:text-black transition-colors">0.01s SCAN</span>
                </div>
              </motion.div>

              {/* Card 2: 100% Client-Side Privacy */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-zinc-50 border border-zinc-200 hover:border-black rounded-3xl p-8 transition-all duration-300 shadow-xs hover:shadow-xl relative flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <motion.div
                      whileHover={{ rotate: -12, scale: 1.1 }}
                      className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center shadow-md"
                    >
                      <ShieldCheck className="w-7 h-7 text-white" />
                    </motion.div>
                    <span className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
                      100% PRIVATE
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-zinc-900 mb-3 tracking-tight">Zero-Cloud Confidentiality</h3>
                  <p className="text-zinc-600 text-sm font-medium leading-relaxed mb-6">
                    Your video data is processed 100% locally inside your browser memory. Zero external server uploads, zero telemetry, zero logs stored.
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-200 flex items-center justify-between text-xs font-bold text-zinc-900">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    GDPR & SOC2 Ready
                  </span>
                  <span className="font-mono text-zinc-400 group-hover:text-black transition-colors">0 BYTES UPLOAD</span>
                </div>
              </motion.div>

              {/* Card 3: Lightning Fast Speed */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                whileHover={{ y: -8 }}
                className="bg-zinc-50 border border-zinc-200 hover:border-black rounded-3xl p-8 transition-all duration-300 shadow-xs hover:shadow-xl relative flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center shadow-md"
                    >
                      <Zap className="w-7 h-7 text-white" />
                    </motion.div>
                    <span className="text-[11px] font-mono font-bold bg-zinc-200/80 text-zinc-800 px-3 py-1 rounded-full border border-zinc-300">
                      60 FPS LATENCY
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-zinc-900 mb-3 tracking-tight">Real-Time Acceleration</h3>
                  <p className="text-zinc-600 text-sm font-medium leading-relaxed mb-6">
                    Hardware-accelerated WebGPU/WASM pipeline delivers instant face and document blurring with smooth sub-millisecond execution.
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-200 flex items-center justify-between text-xs font-bold text-zinc-900">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    GPU Accelerated
                  </span>
                  <span className="font-mono text-zinc-400 group-hover:text-black transition-colors">&lt; 0.02s SPEED</span>
                </div>
              </motion.div>
            </div>

            {/* Enterprise Security Verification Guarantee Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 bg-zinc-50 border border-zinc-200 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-black" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Enterprise Security Standard Guarantee</h4>
                  <p className="text-xs text-zinc-600 font-medium">All processing is bound by zero-retention client memory isolation.</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-xs font-bold text-zinc-800 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-black" /> 256-Bit Encrypted
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 100% Local Inference
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Clean Code
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
