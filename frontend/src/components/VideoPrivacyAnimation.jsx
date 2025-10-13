import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const VideoPrivacyAnimation = () => {
  const [faces, setFaces] = useState([]);

  useEffect(() => {
    // Generate random face positions
    const generateFaces = () => {
      const newFaces = [];
      for (let i = 0; i < 8; i++) {
        newFaces.push({
          id: i,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          size: Math.random() * 40 + 60,
          delay: Math.random() * 2,
        });
      }
      setFaces(newFaces);
    };

    generateFaces();
  }, []);

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-800 to-blue-900 rounded-2xl overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Animated Faces */}
      {faces.map((face) => (
        <motion.div
          key={face.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4,
            delay: face.delay,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          style={{
            position: 'absolute',
            left: `${face.x}%`,
            top: `${face.y}%`,
            width: `${face.size}px`,
            height: `${face.size}px`,
          }}
          className="rounded-full border-2 border-cyan-400"
        >
          {/* Face Detection Box */}
          <div className="w-full h-full relative">
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

            {/* Blur Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1, 1] }}
              transition={{
                duration: 4,
                delay: face.delay,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 backdrop-blur-xl"
            />
          </div>
        </motion.div>
      ))}

      {/* Central Label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-2">
            AI Privacy Protection
          </h3>
          <p className="text-cyan-400 text-lg">
            Real-time face detection & blurring
          </p>
        </div>
      </motion.div>

      {/* Scanning Line */}
      <motion.div
        animate={{ y: ['0%', '100%'] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"
      />
    </div>
  );
};

export default VideoPrivacyAnimation;
