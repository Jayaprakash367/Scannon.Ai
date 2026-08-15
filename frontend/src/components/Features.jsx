import { motion } from 'framer-motion';
import {
  Zap,
  Target,
  ShieldCheck,
  Sparkles,
  Video,
  Lock,
  Sliders,
  Shield,
  ArrowUpRight
} from 'lucide-react';
import { useState } from 'react';

const trustPills = [
  { text: "LIVE TRUST VERIFICATION", highlight: true },
  { text: "100% On-Device Processing" },
  { text: "Zero Cloud Data Transfer" },
  { text: "Ephemeral RAM Purging" },
  { text: "GDPR & HIPAA Compliant" }
];

const featuresData = [
  {
    icon: Video,
    title: "Real-Time AI Blurring",
    subtitle: "WEBCAM & LIVE STREAM PROTECTION",
    description: "Live webcam blurring powered by local AI. Seamlessly obfuscate faces, IDs, and background screens in real-time during video calls.",
    badge: "LIVE AI",
    status: "Active 60 FPS"
  },
  {
    icon: Zap,
    title: "Ultra-Fast On-Device Processing",
    subtitle: "HARDWARE ACCELERATED ENGINE",
    description: "Our optimized neural inference engine processes 4K video at extreme frame rates locally on your GPU, taking seconds instead of minutes.",
    badge: null,
    status: "< 0.02s Latency"
  },
  {
    icon: Shield,
    title: "Zero-Knowledge Cloud Protection",
    subtitle: "100% CLIENT-SIDE CONFIDENTIALITY",
    description: "Your video files never leave your device. All computations execute 100% locally in your browser memory with zero cloud uploads.",
    badge: "ZERO-CLOUD",
    status: "0 Bytes Uploaded"
  },
  {
    icon: Target,
    title: "Multi-Model AI Detection",
    subtitle: "YOLOV8 + MEDIAPIPE + EASYOCR",
    description: "Combines 3 deep-learning models for 99.9% accuracy detecting faces, credit cards, SSNs, passports, license plates, and sensitive screens.",
    badge: null,
    status: "99.9% Accuracy"
  },
  {
    icon: Lock,
    title: "Auto-Wipe RAM & Memory",
    subtitle: "EPHEMERAL STATE EXECUTION",
    description: "Temporary frames and metadata are instantly overwritten in memory upon completion, ensuring zero residual artifacts or data leaks.",
    badge: null,
    status: "RAM Auto-Purged"
  },
  {
    icon: Sliders,
    title: "Granular Multi-Layer Control",
    subtitle: "CUSTOMIZABLE BLUR MASKS",
    description: "Intelligent layer masking gives you fine-grained control over blur strength, pixelation styles, and target object classes.",
    badge: null,
    status: "Custom Filters"
  }
];

const Features = () => {
  const [isDemoBlurActive, setIsDemoBlurActive] = useState(true);

  return (
    <section className="py-20 px-4 relative overflow-hidden bg-white text-zinc-900">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, #000 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Top Trust Verification Pills Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
          {trustPills.map((pill, idx) => (
            <div
              key={idx}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border transition-all ${
                pill.highlight
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 shadow-xs'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-700'
              }`}
            >
              {pill.highlight && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
              {pill.text}
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-zinc-900"
          >
            Engineered for <span className="underline decoration-black decoration-4 underline-offset-8">Absolute Trust</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl max-w-2xl mx-auto font-medium text-zinc-600 leading-relaxed"
          >
            Enterprise-grade privacy algorithms designed to give you 100% peace of mind and bulletproof security.
          </motion.p>
        </div>

        {/* 6 Capability Cards Grid (2 rows x 3 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {featuresData.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} index={idx} />
          ))}
        </div>

        {/* Interactive Feature Spotlight Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-8 md:p-12 border shadow-2xl relative overflow-hidden bg-[#070B14] text-white border-zinc-800"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                Live Privacy Engine Demonstration
              </div>
              <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                See How AI Instantly Protects Your Sensitive Data
              </h3>
              <p className="leading-relaxed text-sm font-medium text-zinc-400">
                Test our active AI privacy filter below. Toggle protection ON/OFF to witness real-time face, document, and SSN blurring in action.
              </p>

              {/* Interactive Demo Toggle */}
              <div className="pt-2 flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => setIsDemoBlurActive(!isDemoBlurActive)}
                  className={`px-5 py-3 rounded-full font-mono text-xs font-bold transition-all flex items-center gap-2 border shadow-lg ${
                    isDemoBlurActive
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-red-500/15 text-red-400 border-red-500/30'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  AI Blur Protection {isDemoBlurActive ? 'ACTIVE' : 'DISABLED'}
                </button>
                <span className="text-xs font-mono text-zinc-500">
                  Status: <span className={isDemoBlurActive ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{isDemoBlurActive ? 'ON' : 'OFF'}</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl p-6 border relative overflow-hidden shadow-2xl bg-[#0B1220] border-zinc-800 text-white">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4 font-mono text-xs text-zinc-400">
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isDemoBlurActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`}></span>
                    LIVE_FEED // STREAM_01
                  </span>
                  <span className="text-cyan-400">60 FPS • 4K</span>
                </div>

                {/* Simulated Video Canvas Frame */}
                <div className="relative rounded-xl overflow-hidden bg-[#070B14] border border-zinc-800 flex items-center justify-center p-8 min-h-[220px]">
                  <div className="text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-zinc-900 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-md">
                      <Shield className={`w-7 h-7 ${isDemoBlurActive ? 'text-cyan-400' : 'text-zinc-600'}`} />
                    </div>
                    <div className="text-xs font-mono text-zinc-400">
                      {isDemoBlurActive ? 'FACES & SENSITIVE DATA MASKED' : 'ORIGINAL UNMASKED FEED'}
                    </div>
                  </div>

                  {/* Simulated Scanning Line when active */}
                  {isDemoBlurActive && (
                    <motion.div
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_12px_#22d3ee] z-30 opacity-70"
                    />
                  )}
                </div>

                {/* Footer Trust Bar */}
                <div className="mt-4 flex items-center justify-between text-xs font-mono text-zinc-500">
                  <span>Model: YOLOv8-Privacy</span>
                  <span className="text-cyan-400 font-bold">100% CONFIDENTIAL</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, subtitle, description, index, badge, status }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group h-full"
    >
      {badge && (
        <div className="absolute -top-3 -right-2 z-20">
          <span className="text-[10px] font-black tracking-wider px-3 py-1 rounded-full shadow-md border uppercase bg-black text-white border-zinc-700">
            {badge}
          </span>
        </div>
      )}

      <div className="rounded-2xl p-8 transition-all duration-300 h-full flex flex-col justify-between shadow-xs hover:shadow-xl relative overflow-hidden border bg-zinc-50 border-zinc-200 hover:border-black text-zinc-900">
        <div>
          {/* Top Bar with Icon & Live Status */}
          <div className="flex items-center justify-between mb-6">
            <motion.div
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md relative border bg-black border-black"
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>

            <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-md border text-zinc-800 bg-zinc-200/80 border-zinc-300">
              {status}
            </span>
          </div>

          {/* Titles */}
          <h3 className="text-xl font-black mb-1 tracking-tight text-zinc-900">{title}</h3>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-4 font-mono text-zinc-500">{subtitle}</p>

          {/* Description */}
          <p className="text-sm leading-relaxed font-medium text-zinc-600">{description}</p>
        </div>

        {/* Hover Verified Link */}
        <div className="mt-6 pt-4 border-t flex items-center justify-between border-zinc-200">
          <span className="text-xs font-bold text-zinc-900 group-hover:underline flex items-center gap-1">
            Verified Feature
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-black" />
          </span>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isHovered ? '100%' : '0%' }}
            className="h-0.5 rounded-full transition-all duration-300 bg-black"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Features;
