import { motion } from 'framer-motion';
import UploadCard from '../components/UploadCard';
import {
  Lock,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ServerOff,
  Sparkles,
  FileVideo,
  ArrowRight
} from 'lucide-react';

const Upload = () => {
  return (
    <div className="relative min-h-screen py-24 px-4 overflow-hidden bg-white text-zinc-900">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, #000 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-zinc-50 border border-zinc-300 rounded-full px-4 py-2 text-xs font-bold text-zinc-700 mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <ServerOff className="w-3.5 h-3.5 text-black" />
            100% ON-DEVICE PROCESSING ENABLED
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6 text-zinc-900 tracking-tight leading-tight">
            Upload & Safeguard Your Media
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Our AI engine automatically detects and blurs faces, sensitive documents, and personal details in seconds.
          </p>

          {/* Trust Indicators Pill Bar */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <TrustBadge icon={ShieldCheck} text="Local RAM Isolation" status="Verified" />
            <TrustBadge icon={Lock} text="Zero Cloud Upload" status="0 Bytes Out" />
            <TrustBadge icon={Zap} text="WebGPU Acceleration" status="60 FPS" />
            <TrustBadge icon={CheckCircle2} text="GDPR & SOC2 Ready" status="Compliant" />
          </div>
        </motion.div>

        {/* Combined Upload Studio Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative bg-white border border-zinc-200 rounded-3xl shadow-xl p-6 sm:p-12 overflow-hidden">
            {/* Card Top Security Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-6 mb-8 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center shadow-md border border-black">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                    Secure AI Processing Studio
                  </h2>
                  <p className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-500">
                    Client-Side Memory Sandbox
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                ACTIVE PIPELINE: READY
              </div>
            </div>

            <UploadCard />
          </div>
        </motion.div>

        {/* Step-by-Step Guide & Privacy Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 max-w-5xl mx-auto"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black tracking-tight mb-2 text-zinc-900">How It Works</h2>
            <p className="text-sm font-medium text-zinc-600">Simple 3-step client-side privacy workflow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard
              step="01"
              icon={FileVideo}
              title="Select Your File"
              description="Upload your video or image (MP4, MOV, WebM, PNG, JPG). All computations stay 100% on your device."
            />
            <StepCard
              step="02"
              icon={Sparkles}
              title="Neural Frame Scan"
              description="Our local AI models (YOLOv8 + MediaPipe + EasyOCR) scan frames in real-time to detect faces and text."
            />
            <StepCard
              step="03"
              icon={CheckCircle2}
              title="Export Protected File"
              description="Download your anonymized file instantly. Temporary memory buffers are purged immediately."
            />
          </div>


        </motion.div>
      </div>
    </div>
  );
};

const TrustBadge = ({ icon: Icon, text, status }) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold shadow-xs transition-colors bg-zinc-50 border-zinc-300 text-zinc-900">
      <Icon className="w-4 h-4 text-black" />
      <span>{text}</span>
      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold text-zinc-700 bg-zinc-200 border border-zinc-300">{status}</span>
    </div>
  );
};

const StepCard = ({ step, icon: Icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl p-8 transition-all duration-300 shadow-lg relative flex flex-col justify-between group border bg-zinc-50 border-zinc-200 hover:border-black text-zinc-900"
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-xl border flex items-center justify-center shadow-md p-2.5 bg-black border-black">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black font-mono transition-colors text-zinc-400 group-hover:text-black">
            {step}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2 tracking-tight text-zinc-900">{title}</h3>
        <p className="text-sm leading-relaxed font-medium text-zinc-600">{description}</p>
      </div>

      <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs font-mono border-zinc-200 text-zinc-700">
        <span>STEP {step} PIPELINE</span>
        <ArrowRight className="w-4 h-4 transition-colors text-zinc-400 group-hover:text-black" />
      </div>
    </motion.div>
  );
};

export default Upload;
