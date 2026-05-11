import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const PHOTOS = [
  '/photos/her fav pic.jpeg',
  '/photos/self.jpeg',
  '/photos/beautyqueen pic.jpeg',
  '/photos/myfav pic.jpeg',
];

export default function PoppingPolaroids() {
  const [visiblePhotos, setVisiblePhotos] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisiblePhotos(prev => {
        if (prev.length < 3) {
          const next = Math.floor(Math.random() * PHOTOS.length);
          if (!prev.includes(next)) return [...prev, next];
        }
        return prev.filter((_, i) => i !== 0);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {PHOTOS.map((src, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8, rotate: Math.random() * 20 - 10, y: 100 }}
          animate={visiblePhotos.includes(i) ? {
            opacity: 1,
            scale: 1,
            y: 0,
            x: [-20, 20, -20][i % 3], // Generic movement
          } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1, type: 'spring' }}
          className="absolute"
          style={{
            top: `${15 + (i * 20)}%`,
            left: i % 2 === 0 ? '10%' : '75%',
          }}
        >
          <div className="bg-white p-3 pb-12 shadow-2xl shadow-black/50 border border-white/20 -rotate-3 hover:rotate-0 transition-transform duration-500 pointer-events-auto">
            <div className="w-32 h-40 bg-zinc-900 overflow-hidden relative">
               <img 
                 src={src} 
                 alt="Memory" 
                 className="w-full h-full object-cover grayscale active:grayscale-0 transition-all duration-700" 
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="mt-2 text-center font-serif italic text-zinc-400 text-[10px]">
              Magic memory #{i + 1}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
