import { motion } from 'framer-motion';
import { Zap, Shield, Target, Lock, Cpu, Video } from 'lucide-react';
import { useState } from 'react';

const featuresData = [
  {
    icon: Video,
    title: "🔴 Real-Time Blurring",
    description: "Live webcam blurring with AI! Blur your face and documents in real-time during video calls or streams.",
    gradient: "from-red-400 to-pink-500",
    badge: "NEW"
  },
  {
    icon: Zap,
    title: "Lightning Fast Processing",
    description: "Our optimized AI engine processes videos at incredible speeds, delivering results in seconds, not minutes.",
    gradient: "from-yellow-400 to-orange-500"
  },
  {
    icon: Shield,
    title: "Military-Grade Privacy",
    description: "End-to-end encryption ensures your sensitive data remains completely secure throughout the entire process.",
    gradient: "from-cyan-400 to-blue-500"
  },
  {
    icon: Target,
    title: "AI-Powered Detection",
    description: "95%+ accuracy using MediaPipe + YOLOv8 + EasyOCR for comprehensive face, document, and text detection.",
    gradient: "from-pink-400 to-purple-500"
  },
  {
    icon: Lock,
    title: "Secure by Default",
    description: "Videos are processed securely, and all sensitive data is automatically identified and protected.",
    gradient: "from-green-400 to-emerald-500"
  },
  {
    icon: Cpu,
    title: "Multi-Layer Protection",
    description: "Detects faces, documents, license plates, screens, and sensitive text (emails, phone numbers, SSN).",
    gradient: "from-blue-400 to-indigo-500"
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-blue-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to protect privacy in your videos with cutting-edge AI technology
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, description, gradient, index, badge }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      {badge && (
        <div className="absolute -top-3 -right-3 z-10">
          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
            {badge}
          </span>
        </div>
      )}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 h-full">
        {/* Gradient Background on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.1 : 0 }}
          className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl`}
        />

        {/* Icon */}
        <div className="relative">
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.6 }}
            className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg`}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>

          {/* Spark Effect */}
          {isHovered && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className={`absolute top-0 left-0 w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} blur-xl`}
            />
          )}
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-white mb-3 relative">{title}</h3>
        <p className="text-gray-400 leading-relaxed relative">{description}</p>

        {/* Hover Indicator */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isHovered ? '100%' : '0%' }}
          className={`h-1 bg-gradient-to-r ${gradient} rounded-full mt-4`}
        />
      </div>
    </motion.div>
  );
};

export default Features;
