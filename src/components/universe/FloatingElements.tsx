import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export default function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-pink-400/20"
          initial={{
            x: Math.random() * 100 + 'vw',
            y: '110vh',
            scale: Math.random() * 0.5 + 0.5,
            rotate: Math.random() * 360
          }}
          animate={{
            y: '-10vh',
            x: `${(Math.random() - 0.5) * 20 + 50}vw`,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
        >
          <Heart size={Math.random() * 20 + 10} fill="currentColor" />
        </motion.div>
      ))}
      
      {/* Sparkles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{
            x: Math.random() * 100 + 'vw',
            y: Math.random() * 100 + 'vh',
            opacity: 0,
            scale: 0
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}
