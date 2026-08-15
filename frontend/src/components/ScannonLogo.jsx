import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const ScannonLogo = ({
  size = 'medium',
  showText = true,
  animated = true,
  className = ''
}) => {
  const sizeClasses = {
    small: { container: 'w-8 h-8', icon: 'w-5 h-5', text: 'text-lg' },
    medium: { container: 'w-10 h-10', icon: 'w-6 h-6', text: 'text-xl' },
    large: { container: 'w-14 h-14', icon: 'w-8 h-8', text: 'text-3xl' },
    xl: { container: 'w-20 h-20', icon: 'w-12 h-12', text: 'text-4xl' },
    xxl: { container: 'w-28 h-28', icon: 'w-16 h-16', text: 'text-5xl' }
  };

  const classes = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <motion.div
        className={`${classes.container} rounded-xl flex items-center justify-center shadow-md relative overflow-hidden bg-black`}
        whileHover={animated ? { scale: 1.05 } : {}}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Shield className={`${classes.icon} text-white`} fill="white" />
      </motion.div>

      {/* Logo Text */}
      {showText && (
        <div className="flex items-center">
          <span className={`${classes.text} font-black tracking-tight text-zinc-900`}>
            Scannon.AI
          </span>
        </div>
      )}
    </div>
  );
};

export default ScannonLogo;
