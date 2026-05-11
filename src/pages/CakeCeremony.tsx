import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Wind, MousePointer2, Music, SkipForward, Heart } from 'lucide-react';
import CustomCursor from '../components/ui/CustomCursor';
import Fireworks from '../components/effects/Fireworks';

interface CakeCeremonyProps {
  onComplete: () => void;
}

export default function CakeCeremony({ onComplete }: CakeCeremonyProps) {
  const [step, setStep] = useState<'lit' | 'blown' | 'cut'>('lit');
  const [showButton, setShowButton] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  const handleBlow = () => {
    if (step !== 'lit') return;
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);
    setStep('blown');
  };

  const handleCut = () => {
    if (step !== 'blown') return;
    setStep('cut');
    setTimeout(() => setShowButton(true), 1500);
  };

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden flex flex-col items-center justify-center font-sans">
      <CustomCursor />
      
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500/5 blur-[120px] rounded-full pointer-events-none" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            initial={{ x: Math.random() * 100 + 'vw', y: Math.random() * 100 + 'vh' }}
            animate={{ 
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Screen Flash Effect */}
      <AnimatePresence>
        {isFlashing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="relative z-20 text-center mb-16 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="text-zinc-500 tracking-[0.4em] uppercase text-[10px] mb-4 block">
            A Secret Celebration Just For You
          </span>
          <AnimatePresence mode="wait">
            {step === 'lit' ? (
              <motion.h1 
                key="wish-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-4xl md:text-6xl font-serif italic text-pink-200"
              >
                Make a wish, Priya...
              </motion.h1>
            ) : (
              <motion.h1 
                key="magic-title"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-5xl md:text-7xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-pink-200"
              >
                {step === 'blown' ? 'MAGIC IN THE AIR ✨' : 'THE UNIVERSE CELEBRATES 💖'}
              </motion.h1>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 3D CSS Cake */}
      <div className="relative z-10 scale-75 md:scale-100">
        <motion.div 
          className="relative preserve-3d"
          animate={{ rotateY: [0, 5, 0, -5, 0], y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Cake Layers */}
          <div className="relative">
            {/* Top Layer */}
            <div className="w-48 h-20 bg-zinc-800 rounded-[100%] shadow-2xl relative z-10 border-b-4 border-zinc-900 group">
               <div className="absolute inset-0 bg-gradient-to-b from-pink-500/20 to-transparent rounded-[100%]" />
               
               {/* Cake Top Surface */}
               <div className="absolute -top-4 left-0 w-48 h-20 bg-pink-500 rounded-[100%] border-2 border-pink-400 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4),transparent)]" />
                  {/* Strawberry decorations */}
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute w-3 h-4 bg-red-600 rounded-full blur-[1px]"
                      style={{ 
                        top: 20 + Math.sin(i) * 20 + 'px', 
                        left: 24 + Math.cos(i) * 80 + 'px',
                        transform: 'rotate(20deg)'
                      }}
                    />
                  ))}
               </div>
               
               {/* Candles */}
               <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="relative w-2 h-12 bg-pink-300 rounded-full transform translate-y-4">
                       <AnimatePresence>
                         {step === 'lit' && (
                           <motion.div 
                             initial={{ opacity: 0, scale: 0 }}
                             animate={{ opacity: 1, scale: 1 }}
                             exit={{ opacity: 0, scale: 0, filter: 'blur(10px)' }}
                             className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-8"
                           >
                              {/* Flame */}
                              <motion.div 
                                animate={{ 
                                  scaleY: [1, 1.2, 0.9, 1.1, 1],
                                  skewX: [-2, 2, -1, 3, 0]
                                }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                className="w-full h-full bg-gradient-to-t from-orange-500 via-yellow-400 to-white rounded-full blur-[1px] shadow-[0_0_15px_rgba(255,165,0,0.8)]"
                              />
                           </motion.div>
                         )}
                       </AnimatePresence>
                       {/* Smoke after blowing */}
                       {step === 'blown' && i === 1 && (
                         <motion.div 
                           initial={{ opacity: 0, y: 0 }}
                           animate={{ opacity: [0, 0.4, 0], y: -50, x: [0, 10, -10, 0] }}
                           transition={{ duration: 2 }}
                           className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-4 bg-white/20 blur-md rounded-full"
                         />
                       )}
                    </div>
                  ))}
               </div>
            </div>

            {/* Bottom Layer */}
            <div className="w-64 h-24 bg-zinc-900 rounded-[100%] absolute -bottom-10 -left-8 -z-10 shadow-2xl border-b-8 border-black">
               <div className="absolute -top-6 left-0 w-64 h-24 bg-zinc-800 rounded-[100%] border-2 border-zinc-700/50" />
            </div>
          </div>
          
          {/* Cake Slice Effect (Conditional) */}
          <AnimatePresence>
            {step === 'cut' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 50, rotate: 10 }}
                className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
              >
                <div className="w-full h-full bg-pink-500 rounded-lg transform -skew-x-12 shadow-xl border-l border-white/20">
                   <div className="absolute top-2 left-2 w-4 h-4 bg-white rounded-full blur-sm opacity-50" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Shadows and Glow */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-80 h-12 bg-black/60 blur-2xl rounded-[100%] -z-20" />
        <motion.div 
          animate={{ opacity: step === 'lit' ? [0.1, 0.2, 0.1] : 0 }}
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-orange-500/10 blur-3xl rounded-full -z-10"
        />
      </div>

      {/* Interactions */}
      <div className="relative z-30 mt-32 flex flex-col items-center gap-8">
        <AnimatePresence mode="wait">
          {step === 'lit' ? (
            <motion.button
              key="blow-btn"
              onClick={handleBlow}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.02)]"
            >
              <Wind className="text-pink-400" size={18} />
              <span className="text-white tracking-[0.3em] uppercase text-xs font-medium">Blow Candles 🎤</span>
            </motion.button>
          ) : step === 'blown' ? (
            <motion.button
              key="cut-btn"
              onClick={handleCut}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group flex items-center gap-3 px-10 py-5 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-all active:scale-95 shadow-lg shadow-pink-500/20"
            >
              <Sparkles size={18} />
              <span className="tracking-[0.3em] uppercase text-xs font-bold">Cut the Cake ✨</span>
            </motion.button>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {showButton && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onComplete}
              className="group relative px-14 py-6 rounded-full overflow-hidden transition-all duration-500 active:scale-95"
            >
              <div className="absolute inset-0 bg-white" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-100 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center gap-3 text-black font-display font-bold tracking-[0.3em] text-xs uppercase italic">
                Open Memory Universe
                <SkipForward size={16} />
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Ambiance Controls */}
      <div className="fixed bottom-10 left-10 flex flex-col gap-4 text-white/20">
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="flex items-center gap-3"
         >
           <Music size={14} />
           <span className="text-[10px] tracking-[0.2em] uppercase font-light">Cinematic Atmosphere Engaged</span>
         </motion.div>
         <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ height: [4, 12, 6, 14, 4] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-[1.5px] bg-white/20"
              />
            ))}
         </div>
      </div>

      {/* Final Celebration Effects */}
      {step !== 'lit' && <Fireworks />}
      
      {/* Floating Hearts after cut */}
      {step === 'cut' && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: '50vw', y: '60vh', opacity: 0, scale: 0 }}
              animate={{ 
                x: [null, (Math.random() - 0.5) * 100 + 50 + 'vw'],
                y: -100,
                opacity: [0, 1, 0],
                scale: [0, 1, 0.5]
              }}
              transition={{ duration: 4, delay: i * 0.3 }}
              className="absolute text-pink-500/40"
            >
              <Heart size={20} fill="currentColor" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

