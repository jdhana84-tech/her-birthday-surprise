import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, Sparkles, Moon, RefreshCcw, Download, UserPlus, Share2 } from 'lucide-react';
import CustomCursor from '../components/ui/CustomCursor';
import Fireworks from '../components/effects/Fireworks';

interface FinalEndingProps {
  onReplay?: () => void;
}

export default function FinalEnding({ onReplay }: FinalEndingProps) {
  const [phase, setPhase] = useState<'intro' | 'fireworks' | 'collage' | 'message' | 'credits'>('intro');
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    // Phases timing
    const timers = [
      setTimeout(() => setPhase('fireworks'), 1000),
      setTimeout(() => setPhase('collage'), 6000),
      setTimeout(() => setPhase('message'), 12000),
      setTimeout(() => setPhase('credits'), 20000)
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#020205] text-white overflow-hidden flex flex-col items-center justify-center font-sans">
      <CustomCursor />
      
      {/* Infinite Galaxy Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(20,10,40,0.4)_0%,_transparent_100%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
        
        {/* Shooting Stars */}
        <ShootingStars />
        
        {/* Floating Particles */}
        <FloatingMatter />
      </div>

      <AnimatePresence>
        {phase === 'fireworks' && (
          <>
            <Fireworks key="finale-fireworks" />
            <div className="fixed inset-0 z-20 pointer-events-none flex items-center justify-center">
               <AnimatePresence>
                 {[...Array(5)].map((_, i) => (
                   <motion.p
                     key={`end-quote-${i}`}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: [0, 1, 1, 0], y: [-20, -100] }}
                     transition={{ duration: 4, delay: i * 2, repeat: Infinity }}
                     className="absolute text-white/40 font-serif italic text-xl tracking-widest text-center"
                     style={{ top: `${20 + i * 15}%`, left: `${10 + (i * 20) % 80}%` }}
                   >
                     {[
                       "You deserve the universe 🌌",
                       "Thank you for every memory 💖",
                       "Some people become forever ✨",
                       "You made life beautiful 🌸",
                       "Grateful for your existence 🌙"
                     ][i % 5]}
                   </motion.p>
                 ))}
               </AnimatePresence>
            </div>
          </>
        )}
        
        {phase === 'collage' && (
          <motion.div 
            key="collage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 flex items-center justify-center"
          >
            <MemoryUniverse />
          </motion.div>
        )}

        {(phase === 'message' || phase === 'credits') && (
          <motion.div 
            key="final-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-20 flex flex-col items-center text-center max-w-4xl px-6"
          >
            <div className="relative mb-12">
               <motion.div 
                 animate={{ 
                   scale: [1, 1.05, 1],
                   opacity: [0.5, 0.8, 0.5] 
                 }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="absolute inset-0 bg-blue-400/20 blur-[100px] rounded-full"
               />
               <Moon size={120} className="text-white/10 fill-white/5 relative z-10" />
            </div>

            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="text-3xl md:text-6xl font-serif italic text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-100 to-pink-200/50 leading-tight"
            >
              You are one of the most beautiful parts of my life, Panguuu 💖
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-12 flex flex-wrap justify-center gap-6"
            >
               <ActionButton icon={<RefreshCcw size={18} />} label="Replay Memories" onClick={onReplay} />
               <ActionButton icon={<UserPlus size={18} />} label="Send Virtual Hug" variant="primary" onClick={() => setShowSecret(true)} />
               <ActionButton icon={<Share2 size={18} />} label="Stay In This Moment" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secret Message Overlay */}
      <AnimatePresence>
        {showSecret && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSecret(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-6 cursor-pointer"
          >
             <motion.div 
               initial={{ scale: 0.8, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="bg-white/5 border border-white/10 p-12 rounded-3xl text-center relative overflow-hidden"
             >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-blue-500" />
                <Heart size={48} className="text-pink-500 mx-auto mb-6 animate-pulse" fill="currentColor" />
                <h3 className="text-3xl font-serif italic text-white mb-4">A Tight Digital Hug!</h3>
                <p className="text-zinc-400 tracking-widest uppercase text-[10px]">You'll always be special to me 💖</p>
                <div className="mt-8 text-pink-300/50 animate-bounce">
                   <Sparkles size={20} className="mx-auto" />
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Credits Phase */}
      <AnimatePresence>
        {phase === 'credits' && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-12 flex flex-col items-center gap-2 pointer-events-none"
          >
             <p className="text-[10px] tracking-[0.8em] uppercase text-white/40 font-light">Made with love ✨</p>
             <p className="text-[9px] tracking-[0.4em] uppercase text-pink-300/30">Forever grateful for you 🌸</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secret Easter Egg Star */}
      <button 
        onClick={() => setShowSecret(true)}
        className="fixed top-8 right-8 z-50 text-white/5 hover:text-white/20 transition-colors"
      >
        <Star size={16} />
      </button>
    </div>
  );
}

function ActionButton({ icon, label, onClick, variant = 'secondary' }: { icon: any, label: string, onClick?: () => void, variant?: 'primary' | 'secondary' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`group relative px-6 py-3 rounded-full flex items-center gap-3 transition-all duration-500 ${
        variant === 'primary' 
          ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.3)]' 
          : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
      }`}
    >
      <div className="relative z-10">{icon}</div>
      <span className="relative z-10 text-[10px] tracking-[0.2em] font-bold uppercase">{label}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity rounded-full -z-10" />
      )}
    </motion.button>
  );
}

function ShootingStars() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: '110vw', y: '-10vh', opacity: 0 }}
          animate={{ x: '-10vw', y: '110vh', opacity: [0, 1, 0] }}
          transition={{ 
            duration: 1 + Math.random() * 2, 
            repeat: Infinity, 
            delay: Math.random() * 20,
            ease: "linear"
          }}
          className="absolute w-40 h-[1px] bg-gradient-to-r from-transparent to-white/70 -rotate-45"
        />
      ))}
    </div>
  );
}

function FloatingMatter() {
  const items = [
    { icon: Heart, color: 'text-pink-500/20' },
    { icon: Star, color: 'text-blue-300/10' },
    { icon: Sparkles, color: 'text-amber-200/15' }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(30)].map((_, i) => {
        const Item = items[i % items.length];
        return (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + 'vw', 
              y: Math.random() * 100 + 'vh',
              scale: 0.5 + Math.random(),
              opacity: 0 
            }}
            animate={{ 
              y: [null, '-=100'],
              opacity: [0, 0.4, 0],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 5 + Math.random() * 10, 
              repeat: Infinity, 
              delay: Math.random() * 10 
            }}
            className={`absolute ${Item.color}`}
          >
            <Item.icon size={12 + (i % 8)} fill="currentColor" />
          </motion.div>
        );
      })}
    </div>
  );
}

function MemoryUniverse() {
  const images = [
  "/photos/beautyqueen pic.jpeg",
  "/photos/black.jpeg",
  "/photos/her fav pic.jpeg",
  "/photos/myfav pic.jpeg",
  "/photos/self.jpeg",
  "/photos/cute pic.jpeg"
];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px]"
      >
        {images.map((img, i) => {
          const angle = (i / images.length) * Math.PI * 2;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.5 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-32 md:w-40 md:h-52 bg-white/5 backdrop-blur-md border border-white/20 p-2 shadow-2xl group hover:z-50"
              style={{
                x: `calc(cos(${angle}) * clamp(140px, 25vw, 300px))`,
                y: `calc(sin(${angle}) * clamp(140px, 25vw, 300px))`,
              }}
            >
              <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-white shadow-xl opacity-0 group-hover:opacity-10 transition-opacity" />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
