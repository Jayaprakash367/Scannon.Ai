import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StartingPage = () => {
  const navigate = useNavigate();
  const text = "Scannon.AI";
  const letters = text.split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      x: 50,
      scale: 0.5
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  };

  const handleClick = () => {
    navigate('/home');
  };

  // Auto navigate after animation completes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000); // 3 seconds after page load

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
              backgroundSize: '100px 100px',
            }}
          />
        </div>
      </div>

      {/* Floating Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
      />

      {/* Invisible Click Area */}
      <div
        className="absolute inset-0 z-20 cursor-pointer"
        onClick={handleClick}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        {/* Animated Text */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl font-bold"
        >
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className="inline-block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
              style={{ 
                display: 'inline-block',
                textShadow: '0 0 20px rgba(6, 182, 212, 0.8), 0 0 40px rgba(6, 182, 212, 0.6), 0 0 60px rgba(6, 182, 212, 0.4), 0 0 80px rgba(59, 130, 246, 0.3), 0 0 100px rgba(147, 51, 234, 0.2)'
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StartingPage;
