import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Music, Star, MailOpen, ChevronRight, ChevronLeft, MapPin } from 'lucide-react';
import CustomCursor from '../components/ui/CustomCursor';
import Fireworks from '../components/effects/Fireworks';

interface PageContent {
  title: string;
  body: string;
  image?: string;
}

const PAGES: PageContent[] = [
  {
    title: "Happy Birthday, Panguuu 💖",
    body: "I honestly don’t know where to start… because some people become so special that words never feel enough for them. From random conversations to unforgettable memories, you slowly became one of the most beautiful parts of my life.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7"
  },
  {
    title: "The Light You Bring",
    body: "You brought happiness in moments where I least expected it. Even your smallest presence somehow made everything feel lighter, calmer, and brighter. There are people we meet… and then there are people who quietly become home. For me, you are that person 🌸",
    image: "https://images.unsplash.com/photo-1516589174184-e6646f674c4a"
  },
  {
    title: "A Rare Soul",
    body: "Every laugh, every silly moment, every late-night talk, every memory with you became something I’ll always treasure. You are genuinely one of the rarest souls I’ve ever known. Your smile carries warmth. Your heart carries kindness ✨",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7"
  },
  {
    title: "My Hope For You",
    body: "No matter how life changes, I hope you always remember how special you are. I hope your dreams come true. I hope happiness follows you everywhere. I hope you always smile the way you make others smile.",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d"
  },
  {
    title: "Deep Gratitude",
    body: "And honestly… thank you. Thank you for existing. Thank you for the memories. Thank you for being you 💖 If life gives us thousands more moments together, I’ll cherish every single one of them.",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8"
  },
  {
    title: "Celebrating You",
    body: "So today, on your birthday… I just want you to feel loved, appreciated, and truly celebrated 🌙 Because someone like you deserves nothing less than the universe itself 🌌 Happy Birthday once again, Panguuu ✨",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176"
  },
  {
    title: "Always Grateful",
    body: "No matter what happens… I’ll always be grateful for you 🌸",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
  }
];

interface TheLetterProps {
  onComplete: () => void;
}

export default function TheLetter({ onComplete }: TheLetterProps) {
  const [status, setStatus] = useState<'envelope' | 'reading' | 'transition' | 'finale'>('envelope');
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const nextPage = () => {
    if (currentPage < PAGES.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage(prev => prev + 1);
      setTimeout(() => setIsAnimating(false), 800);
    } else if (currentPage === PAGES.length - 1) {
      handleFinalTransition();
    }
  };

  const handleFinalTransition = () => {
    setStatus('transition');
    setTimeout(() => {
      onComplete();
    }, 4000); // 4-second cinematic transition
  };

  const prevPage = () => {
    if (currentPage > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage(prev => prev - 1);
      setTimeout(() => setIsAnimating(false), 800);
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#050505] text-white overflow-hidden flex items-center justify-center font-sans">
      <CustomCursor />
      
      {/* Cinematic Background */}
      <BackgroundAtmosphere active={status !== 'envelope'} />

      <AnimatePresence mode="wait">
        {status === 'envelope' && (
          <EnvelopeContainer key="envelope" onOpen={() => setStatus('reading')} />
        )}

        {status === 'reading' && (
          <motion.div 
            key="reading"
            initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            className="relative z-10 w-full max-w-4xl px-4 md:px-0 mb-20 md:mb-0"
            style={{ perspective: '1000px' }}
          >
            <div className="relative flex flex-col items-center">
               <LetterPaper 
                 content={PAGES[currentPage]} 
                 isAnimating={isAnimating}
                 pageNumber={currentPage + 1}
                 total={PAGES.length}
               />

               {/* Navigation Controls */}
               <div className="mt-12 flex items-center gap-12">
                  <button 
                    onClick={prevPage}
                    disabled={currentPage === 0 || isAnimating}
                    className={`group relative p-4 rounded-full border border-white/5 bg-white/5 transition-all ${currentPage === 0 ? 'opacity-0' : 'hover:bg-white/10 opacity-100'}`}
                  >
                    <div className="absolute inset-0 bg-white/5 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <ChevronLeft size={20} className="relative z-10" />
                  </button>

                  <div className="flex gap-3">
                    {PAGES.map((_, i) => (
                      <div 
                        key={i} 
                        className={`transition-all duration-700 rounded-full ${i === currentPage ? 'w-8 h-1 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 'w-1.5 h-1.5 bg-white/10'}`} 
                      />
                    ))}
                  </div>

                  <button 
                    onClick={nextPage}
                    disabled={isAnimating}
                    className="group relative p-4 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <div className="absolute inset-0 bg-white/5 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <ChevronRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          </motion.div>
        )}

        {status === 'transition' && (
          <motion.div 
            key="transition-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
             <motion.div 
               initial={{ scale: 1, rotateY: 0 }}
               animate={{ 
                 scale: [1, 0.5, 0],
                 rotateY: [0, 180, 360],
                 y: [0, -200, -1000],
                 opacity: [1, 1, 0]
               }}
               transition={{ duration: 4, ease: "easeInOut" }}
               className="w-80 h-96 bg-[#fdfaf3] rounded-sm shadow-2xl relative"
             >
                <div className="absolute inset-0 bg-pink-500/40 mix-blend-overlay animate-pulse" />
                <div className="absolute inset-x-0 top-1/2 h-[2px] bg-pink-500 blur-sm shadow-[0_0_20px_rgba(236,72,153,1)]" />
                
                {/* Floating particles from letter */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      x: (Math.random() - 0.5) * 400,
                      y: (Math.random() - 0.5) * 400,
                      opacity: [1, 0],
                      scale: [1, 2]
                    }}
                    transition={{ duration: 2, delay: Math.random() * 2 }}
                    className="absolute top-1/2 left-1/2 w-2 h-2 bg-pink-400 rounded-full blur-sm"
                  />
                ))}
             </motion.div>
             
             {/* Dramatic Star Brightening */}
             <motion.div 
               animate={{ opacity: [0, 0.8, 0] }}
               transition={{ duration: 4 }}
               className="fixed inset-0 bg-white"
             />
          </motion.div>
        )}

        {status === 'finale' && (
          <motion.div 
            key="finale"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-20 flex flex-col items-center text-center"
          >
            <Fireworks />
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl md:text-7xl font-serif italic text-pink-200 mb-8"
            >
              Eternal Gratitude
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-zinc-500 tracking-[0.5em] uppercase text-xs"
            >
              The stars will always remember.
            </motion.p>
            
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              onClick={() => window.location.reload()}
              className="mt-16 px-8 py-3 rounded-full border border-pink-500/30 text-[10px] tracking-widest uppercase hover:bg-pink-500/10 transition-all"
            >
              Beginning of Forever
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Atmospheric Audio Overlay Indicator */}
      <div className="fixed bottom-8 right-8 flex items-center gap-4 text-white/20">
         <div className="flex gap-1 items-end h-4">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="w-[1.5px] bg-white/40"
                animate={{ height: [2, 10, 4, 12, 2] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
         </div>
         <span className="text-[9px] tracking-widest uppercase">Mood: Nostalgic</span>
      </div>
    </div>
  );
}

function BackgroundAtmosphere({ active }: { active: boolean }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Galaxy base */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(40,20,60,0.2)_0%,_transparent_70%)]" />
      
      {/* Floating Lights/Stars */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{ 
            x: Math.random() * 100 + 'vw', 
            y: Math.random() * 100 + 'vh',
            opacity: Math.random() * 0.3 
          }}
          animate={{ 
            opacity: [0.1, 0.5, 0.1],
            scale: [1, 1.5, 1],
            y: [null, '-=20']
          }}
          transition={{ 
            duration: 3 + Math.random() * 5, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Floating Petals */}
      <AnimatePresence>
        {active && [...Array(15)].map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            initial={{ y: -100, x: Math.random() * 100 + 'vw', rotate: 0, opacity: 0 }}
            animate={{ 
              y: '100vh', 
              x: `${(Math.random() - 0.5) * 50 + 50}vw`,
              rotate: 360,
              opacity: [0, 0.3, 0]
            }}
            transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, delay: i * 1 }}
            className="absolute text-pink-400/20"
          >
            <Heart size={16} fill="currentColor" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Moon Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full" />
    </div>
  );
}

function EnvelopeContainer({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="relative z-10 flex flex-col items-center gap-12">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="text-zinc-500 tracking-[0.6em] uppercase text-[10px] mb-4 block">The Final Secret</span>
        <h2 className="text-4xl font-display italic text-pink-100">For Your Eyes Only</h2>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05, rotateY: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpen}
        className="cursor-pointer relative transition-all duration-700"
      >
        <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full scale-110 pointer-events-none" />
        
        {/* Realistic Envelope UI */}
        <div className="w-80 h-52 bg-[#fcf8f0] rounded-sm shadow-2xl relative overflow-hidden group">
           {/* Interior Texture */}
           <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
           
           {/* Flap lines */}
           <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 left-0 w-full h-0 border-t-[104px] border-t-white/40 border-l-[160px] border-l-transparent border-r-[160px] border-r-transparent transition-transform duration-700 origin-top" />
           </div>

           {/* Handwritten Address */}
           <div className="absolute inset-0 flex items-center justify-center flex-col gap-1">
              <span className="font-handwriting text-zinc-900/80 text-3xl">Panguuu 💖</span>
              <div className="w-12 h-[1px] bg-zinc-300" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-bold">Confidential</span>
           </div>

           {/* Wax Seal */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-10 h-10 bg-red-800 rounded-full shadow-lg border border-red-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Heart size={14} className="text-white/80" fill="currentColor" />
              </div>
           </div>
           
           <div className="absolute bottom-4 right-6 opacity-20 transform rotate-12">
              <MapPin size={24} className="text-zinc-600" />
           </div>
        </div>
      </motion.div>
    </div>
  );
}

function LetterPaper({ content, isAnimating, pageNumber, total }: { content: PageContent, isAnimating: boolean, pageNumber: number, total: number }) {
  return (
    <motion.div 
      key={content.title}
      initial={{ rotateY: 10, y: 20, opacity: 0 }}
      animate={{ rotateY: 0, y: 0, opacity: 1 }}
      className="relative w-full min-h-[60vh] md:aspect-[4/3] max-w-3xl bg-[#fdfaf3] rounded-sm shadow-[0_10px_50px_rgba(0,0,0,0.5)] p-8 md:p-16 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 bg-[#fdfaf3] opacity-50" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 pointer-events-none" />
      
      {/* Fold Lines */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/5" />
      <div className="absolute top-0 left-1/2 w-[1px] h-full bg-black/5 shadow-inner" />

      {/* Burnt edges simulation */}
      <div className="absolute inset-0 border-[20px] border-transparent shadow-[inset_0_0_100px_rgba(139,69,19,0.05)] pointer-events-none" />

      {/* Memory Polaroid (Subtle) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-10 right-10 w-32 h-40 bg-white p-2 shadow-xl rotate-6 group"
      >
        <img src={content.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
        <div className="mt-2 text-[8px] font-handwriting text-zinc-400">Memory #0{pageNumber}</div>
      </motion.div>

      {/* Handwritten Content */}
      <div className="relative z-10 w-full max-w-lg">
        <motion.h2 
          className="font-handwriting text-zinc-900 text-4xl md:text-5xl mb-8 border-b border-zinc-200 pb-2"
        >
          {content.title}
        </motion.h2>

        <div className="flex flex-col gap-6">
          <HandwrittenText key={content.body} text={content.body} />
        </div>
        
        {pageNumber === total && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 4 }}
             className="mt-12 text-right"
           >
             <p className="font-handwriting text-zinc-800 text-3xl">With love,</p>
             <div className="relative inline-block mt-2">
                <svg width="150" height="40" className="text-pink-600">
                   <motion.path
                     d="M10 25 C30 10, 80 10, 140 25 S100 40, 10 30"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     initial={{ pathLength: 0 }}
                     animate={{ pathLength: 1 }}
                     transition={{ duration: 2, delay: 5 }}
                   />
                </svg>
                <span className="absolute left-4 top-0 font-handwriting text-3xl text-zinc-900">[Your Name] 💖</span>
             </div>
           </motion.div>
        )}
      </div>

      <div className="absolute bottom-8 right-12 font-mono text-[8px] text-zinc-300">
        Page {pageNumber} of {total}
      </div>
    </motion.div>
  );
}

function HandwrittenText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 40); // Base typing speed
    
    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="font-handwriting text-zinc-800/90 text-xl md:text-3xl leading-relaxed first-letter:text-4xl select-none">
      {displayedText}
      <motion.span 
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-1 h-6 bg-pink-500/20 ml-1"
      />
    </p>
  );
}
