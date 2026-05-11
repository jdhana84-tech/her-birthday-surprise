import { useEffect } from 'react';
import { motion } from 'motion/react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Smooth transition timeout
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 5000);

    return () => {
      document.body.style.overflow = 'unset';
      clearTimeout(timer);
    };
  }, [onLoadingComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none w-full h-full">
      <div className="flex flex-col items-center gap-12 max-w-lg">
        {/* Step 1: Text reveal */}
        <motion.div
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <motion.h1 
            animate={{ 
              opacity: [0.3, 1, 0.3],
              letterSpacing: ["0.2em", "0.25em", "0.2em"]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-white/90 text-xl md:text-2xl font-serif italic tracking-[0.2em] leading-relaxed"
          >
            A Special Surprise is Waiting For You...
          </motion.h1>
          
          {/* Step 2: Cinematic Dot Loader (Delayed entrance) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="flex gap-4 mt-6"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  opacity: [0.2, 1, 0.2],
                  scale: [0.8, 1.2, 0.8],
                  backgroundColor: ["#ffffff", "#ec4899", "#ffffff"]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut"
                }}
                className="w-1 h-1 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.4)]"
              />
            ))}
          </motion.div>
        </motion.div>
        
        {/* Cinematic Vignette & Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.15),transparent_70%)]" />
          <motion.div 
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-pink-500/5"
          />
        </div>
      </div>
    </div>
  );
}

