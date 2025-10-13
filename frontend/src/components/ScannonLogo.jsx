import { motion } from 'framer-motion';
import { Shield, Eye, Zap } from 'lucide-react';

const ScannonLogo = ({
  size = 'medium',
  showText = true,
  animated = true,
  className = ''
}) => {
  const sizeClasses = {
    small: { container: 'w-8 h-8', icon: 'w-5 h-5', text: 'text-lg' },
    medium: { container: 'w-12 h-12', icon: 'w-7 h-7', text: 'text-2xl' },
    large: { container: 'w-16 h-16', icon: 'w-10 h-10', text: 'text-4xl' },
    xl: { container: 'w-24 h-24', icon: 'w-14 h-14', text: 'text-5xl' },
    xxl: { container: 'w-32 h-32', icon: 'w-16 h-16', text: 'text-6xl' }
  };

  const classes = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <motion.div
        className={`${classes.container} bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden`}
        whileHover={animated ? { scale: 1.05 } : {}}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
        </div>

        {/* Shield Icon */}
        <Shield className={`${classes.icon} text-white relative z-10`} fill="white" />

        {/* AI Eye Overlay */}
        {animated && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Eye className="w-3 h-3 text-cyan-200 absolute top-1 right-1" />
          </motion.div>
        )}

        {/* Lightning Bolt */}
        {animated && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute bottom-0.5 left-0.5"
          >
            <Zap className="w-2 h-2 text-yellow-300" fill="currentColor" />
          </motion.div>
        )}
      </motion.div>

      {/* Logo Text */}
      {showText && (
        <div>
          <h1 className={`${classes.text} font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent`}>
            Scannon.AI
          </h1>
          <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 mt-1 rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default ScannonLogo;