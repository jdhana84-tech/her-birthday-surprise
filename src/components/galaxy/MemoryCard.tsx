import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import React, { useRef } from 'react';
import { Memory } from '../../types/memories';
import { Heart, Laugh, Smile, Trash2, Edit3 } from 'lucide-react';

interface MemoryCardProps {
  memory: Memory;
  onDelete: (id: string) => void;
  onEdit: (id: string, caption: string) => void;
}

export default function MemoryCard({ memory, onDelete, onEdit }: MemoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Parallax motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for the movement
  const springConfig = { damping: 20, stiffness: 150 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  // Transformations for 3D tilt
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  // Transformation for holographic shine
  const shineOpacity = useTransform(mouseXSpring, [-0.5, 0.5], [0.1, 0.4]);
  const shinePosition = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize coordinates between -0.5 and 0.5
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getMoodConfig = () => {
    switch (memory.mood) {
      case 'cute':
        return { 
          glow: 'from-pink-500/40 via-purple-500/40 to-pink-500/40', 
          border: 'border-pink-500/30', 
          icon: <Heart size={14} className="text-pink-400" />,
          particles: 'bg-pink-400/20'
        };
      case 'funny':
        return { 
          glow: 'from-amber-400/40 via-orange-500/40 to-amber-400/40', 
          border: 'border-amber-400/30', 
          icon: <Laugh size={14} className="text-amber-400" />,
          particles: 'bg-amber-400/20'
        };
      case 'emotional':
        return { 
          glow: 'from-blue-400/40 via-indigo-500/40 to-blue-400/40', 
          border: 'border-blue-400/30', 
          icon: <Smile size={14} className="text-blue-400" />,
          particles: 'bg-blue-400/20'
        };
    }
  };

  const config = getMoodConfig();

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.05 }}
      className="relative flex-shrink-0 w-72 md:w-80 group cursor-none"
    >
      {/* Dynamic Glow Backdrop */}
      <motion.div 
        className={`absolute -inset-4 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${config.glow}`}
        style={{
          translateZ: -50,
        }}
      />

      <div className={`relative bg-zinc-900/60 backdrop-blur-2xl rounded-3xl border ${config.border} p-5 overflow-hidden transition-all duration-500`}>
        {/* Holographic Shine Effect */}
        <motion.div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,1) 45%, rgba(255,255,255,1) 55%, transparent 60%)`,
            backgroundSize: '200% 100%',
            backgroundPosition: shinePosition,
            opacity: shineOpacity,
            mixBlendMode: 'overlay',
          }}
        />

        {/* Floating Background Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           {[...Array(6)].map((_, i) => (
             <motion.div 
               key={i}
               className={`absolute w-16 h-16 rounded-full blur-2xl ${config.particles}`}
               animate={{ 
                 x: [0, (Math.random() - 0.5) * 150], 
                 y: [0, (Math.random() - 0.5) * 150],
                 scale: [1, 1.8, 1],
                 opacity: [0.1, 0.3, 0.1]
               }}
               transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
             />
           ))}
        </div>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 relative z-20">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg bg-white/5 border ${config.border} flex items-center justify-center`}>
              {config.icon}
            </div>
            <span className="text-[10px] tracking-[0.2em] text-zinc-400 font-mono uppercase">{memory.date}</span>
          </div>
          <div className="flex gap-2">
             <button 
               onClick={() => onEdit(memory.id, prompt("Edit caption:", memory.caption) || memory.caption)}
               className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white transition-all backdrop-blur-sm shadow-lg"
               aria-label="Edit memory"
             >
               <Edit3 size={16} />
             </button>
             <button 
               onClick={() => onDelete(memory.id)}
               className="w-11 h-11 flex items-center justify-center rounded-xl bg-red-500/5 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-all backdrop-blur-sm shadow-lg"
               aria-label="Delete memory"
             >
               <Trash2 size={16} />
             </button>
          </div>
        </div>

        {/* Image Container with Parallax-like Depth */}
        <motion.div 
          className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black mb-5 group-hover:grayscale-0 grayscale transition-all duration-700 shadow-2xl"
          style={{ translateZ: 40 }}
        >
           <motion.img 
             src={memory.image} 
             alt={memory.caption} 
             className="w-full h-full object-cover scale-110" 
             referrerPolicy="no-referrer"
             style={{
               x: useTransform(mouseXSpring, [-0.5, 0.5], [10, -10]),
               y: useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]),
             }}
           />
           <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-sm border border-white/10">
             {memory.emoji}
           </div>
           
           {/* Image Overlay Gradient */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        </motion.div>

        {/* Caption */}
        <motion.div 
          className="px-2 relative z-20"
          style={{ translateZ: 30 }}
        >
          <p className="text-sm text-zinc-200 font-light leading-relaxed tracking-wide italic">
             "{memory.caption}"
          </p>
        </motion.div>
        
        {/* Subtle Decorative Elements */}
        <div className="absolute bottom-4 right-4 opacity-5 pointer-events-none">
           <Sparkles size={40} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}

const Sparkles = ({ size, className }: { size: number, className: string }) => (
  <svg 
    width={size} 
    height={size} 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);
