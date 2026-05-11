import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Lock, Unlock, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import OrbitalBackground from '../components/vault/OrbitalBackground';
import CustomCursor from '../components/ui/CustomCursor';

interface MemoryVaultProps {
  onUnlock: () => void;
}

export default function MemoryVault({ onUnlock }: MemoryVaultProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [typedText, setTypedText] = useState('');
  
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Parallax motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  const fullStatusText = "Only the birthday girl can unlock this universe…";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullStatusText.slice(0, i));
      i++;
      if (i > fullStatusText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Isolated Credentials check
    const storedUser = localStorage.getItem('auth_user') || 'priya';
    const storedPass = localStorage.getItem('auth_password') || '22/06/2007';

    if (username.toLowerCase() === storedUser.toLowerCase() && password === storedPass) {
      setIsUnlocking(true);
      setError(false);
      setTimeout(onUnlock, 2000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center p-4">
      <OrbitalBackground />
      <CustomCursor />

      {/* Decorative Floating Locks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
         {[...Array(6)].map((_, i) => (
           <motion.div
             key={i}
             className="absolute text-pink-400"
             initial={{ 
               x: Math.random() * 100 + 'vw', 
               y: Math.random() * 100 + 'vh',
               rotate: Math.random() * 360
             }}
             animate={{
               y: [null, Math.random() * -50 + 'px'],
               rotate: [null, 20, -20],
             }}
             transition={{ 
               duration: Math.random() * 10 + 10,
               repeat: Infinity,
               repeatType: 'reverse'
             }}
           >
             <Lock size={Math.random() * 40 + 20} strokeWidth={1} />
           </motion.div>
         ))}
      </div>

      <AnimatePresence>
        {!isUnlocking && (
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              x: error ? [0, -10, 10, -10, 10, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              x: { duration: 0.4, ease: "linear" } 
            }}
            className={`relative z-10 w-full max-w-md p-6 md:p-12 rounded-[2rem] border transition-all duration-500 backdrop-blur-2xl ${
              error ? 'bg-red-950/20 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.2)]' : 'bg-black/40 border-white/10 shadow-2xl shadow-black hover:border-pink-500/30'
            }`}
          >
            {/* Inner Glow */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            {/* Parallax Content Container */}
            <div style={{ transform: "translateZ(50px)" }}>
              <div className="text-center mb-8">
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6"
                  animate={error ? { rotate: [0, -10, 10, 0] } : {}}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {error ? <AlertCircle className="text-red-400" size={32} /> : <Lock className="text-zinc-400" size={32} />}
                </motion.div>
                
                <h2 className="text-xl md:text-2xl font-display font-medium tracking-widest text-white mb-2 uppercase">
                  Memory Vault
                </h2>
                <p className="text-zinc-500 text-[11px] font-mono tracking-wider h-4">
                  {typedText}
                  <motion.span 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-1 h-3 bg-pink-500 ml-1"
                  />
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 ml-1">Identity</label>
                  <div className={`relative group transition-all duration-300 ${error ? 'border-red-500/30' : ''}`}>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter Username"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all placeholder:text-white/10 tracking-widest"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 ml-1">Access Key</label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all placeholder:text-white/10 tracking-widest pl-4 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-6 left-1 text-[10px] text-red-400 tracking-widest uppercase"
                    >
                      Invalid authentication sequence
                    </motion.p>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full relative group py-4 rounded-xl overflow-hidden transition-all duration-500 active:scale-95"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 to-zinc-900 group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-500" />
                    <span className="relative flex items-center justify-center gap-2 text-white font-medium tracking-[0.3em] text-xs uppercase">
                      Verify Access
                      <Sparkles size={14} className="group-hover:animate-pulse" />
                    </span>
                  </button>
                </div>
              </form>

              <div className="mt-12 text-center">
                 <p className="text-[10px] text-zinc-600 tracking-[0.2em] font-light">
                   PROTECTED BY QUANTUM ENCRYPTION
                 </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Portal Overlay */}
      <AnimatePresence>
        {isUnlocking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: [0.5, 1, 40],
                opacity: [0, 1, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 2.5, 
                times: [0, 0.4, 1],
                ease: "easeInOut" 
              }}
              className="relative w-64 h-64 border-2 border-pink-500/50 rounded-full flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-pink-500/20 blur-[100px] rounded-full" />
              <Unlock size={48} className="text-white" />
              
              {/* Particle Blast */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  animate={{
                    x: [0, (Math.random() - 0.5) * 500],
                    y: [0, (Math.random() - 0.5) * 500],
                    opacity: [1, 0],
                    scale: [1, 0]
                  }}
                  transition={{ duration: 1, repeat: Infinity, delay: Math.random() * 0.5 }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
