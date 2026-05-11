import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import CanvasParticles from '../components/galaxy/CanvasParticles';
import CustomCursor from '../components/ui/CustomCursor';
import FloatingElements from '../components/universe/FloatingElements';
import PolaroidStack from '../components/universe/PolaroidStack';
import FloatingQuotes from '../components/universe/FloatingQuotes';
import { Sparkles } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  const [isExploding, setIsExploding] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleEnter = () => {
    setIsExploding(true);
    setTimeout(onEnter, 1500);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center select-none font-sans">
      <CanvasParticles />
      <CustomCursor />
      <FloatingElements />
      <PolaroidStack />
      <FloatingQuotes />

      {/* Star Explosion Overlay */}
      <AnimatePresence>
        {isExploding && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeIn" }}
            className="fixed inset-0 z-[100] pointer-events-none"
          >
            <div className="w-full h-full bg-white rounded-full shadow-[0_0_100px_50px_rgba(255,255,255,1)]" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20 text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
        >
          <div className="inline-block relative">
             <motion.h1 
               className="text-6xl md:text-9xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-pink-200 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] mb-2 tracking-tighter"
               animate={{ 
                 textShadow: [
                   "0 0 20px rgba(255,255,255,0.3)",
                   "0 0 40px rgba(255,182,193,0.5)",
                   "0 0 20px rgba(255,255,255,0.3)"
                 ]
               }}
               transition={{ duration: 3, repeat: Infinity }}
             >
               Happy Birthday <br className="lg:hidden" /> Panguuu 💖
             </motion.h1>
             <motion.div 
               className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/40 to-transparent absolute -bottom-4"
               initial={{ scaleX: 0 }}
               animate={{ scaleX: 1 }}
               transition={{ duration: 1.5, delay: 1 }}
             />
          </div>
          
          <motion.p 
            className="mt-14 text-zinc-500 tracking-[0.5em] uppercase text-[10px] md:text-sm font-light font-display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            Your cosmic journey begins tonight
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
        >
          <button
            onClick={handleEnter}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            id="enter-button"
            className="group relative px-16 py-6 rounded-full overflow-hidden transition-all duration-700 active:scale-95"
          >
            {/* Glowing Border Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-gradient-x opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-[1.5px] bg-black rounded-full transition-all group-hover:bg-black/90" />
            
            {/* Soft Pulse Effect */}
            <motion.div 
              className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <span className="relative flex items-center gap-4 text-white tracking-[0.3em] font-medium text-xs md:text-base font-display">
              ENTER SECRET UNIVERSE
              <motion.span
                animate={hovered ? { 
                  rotate: [0, 90, 180, 270, 360],
                  scale: [1, 1.5, 1] 
                } : { rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={18} className="text-pink-300" />
              </motion.span>
            </span>

            {/* Sparkle Particles on Hover */}
            {hovered && [...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: 0, 
                  scale: 1, 
                  x: (Math.random() - 0.5) * 200, 
                  y: (Math.random() - 0.5) * 100 
                }}
                transition={{ duration: 0.8, repeat: Infinity, delay: Math.random() * 0.5 }}
                className="absolute w-1 h-1 bg-white rounded-full pointer-events-none"
                style={{ top: '50%', left: '50%' }}
              />
            ))}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

