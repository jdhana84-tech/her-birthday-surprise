import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DreamyAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Using a royalty-free cinematic piano track
  const AUDIO_URL = 'https://cdn.pixabay.com/audio/2022/02/22/audio_d1be661f00.mp3'; // Lofi/Cinematic ambient

  useEffect(() => {
    const audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed, user interaction required:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <button
        onClick={toggleAudio}
        className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center bg-black/40 backdrop-blur-md hover:bg-white/10 transition-colors group"
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Volume2 size={18} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="muted"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <VolumeX size={18} className="text-white/40" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Subtle indicator when playing */}
        {isPlaying && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(236,72,153,0.8)]" />
        )}
      </button>
      
      {!isPlaying && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10 text-[10px] tracking-[0.2em] text-white/60 pointer-events-none uppercase"
        >
          Enable Sound Atmosphere
        </motion.div>
      )}
    </div>
  );
}
