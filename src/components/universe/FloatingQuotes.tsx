import { motion } from 'motion/react';

const QUOTES = [
  "You are rare ✨",
  "My favorite human 🌸",
  "Some people become home 💖"
];

export default function FloatingQuotes() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex items-center justify-center">
      {QUOTES.map((quote, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 0.4, 0],
            y: [-20, -100],
            x: [(i - 1) * 100, (i - 1) * 100 + (Math.random() - 0.5) * 50]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 3,
            ease: "easeInOut"
          }}
          className="absolute text-white/40 text-sm md:text-lg font-light italic tracking-widest whitespace-nowrap"
        >
          {quote}
        </motion.div>
      ))}
    </div>
  );
}
