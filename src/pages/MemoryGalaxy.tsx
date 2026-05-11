import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Memory, INITIAL_MEMORIES, MemoryMood } from '../types/memories';
import MemoryCard from '../components/galaxy/MemoryCard';
import CustomCursor from '../components/ui/CustomCursor';
import { Plus, RotateCcw, Send, Trash2, X, Sparkles, SkipForward, Music } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Explicitly define the row type from Supabase for better TS support
interface MemoryRow {
  id: string;
  image_url: string;
  caption: string;
  mood: string;
  created_at: string;
}

interface MemoryGalaxyProps {
  onComplete: () => void;
}

export default function MemoryGalaxy({ onComplete }: MemoryGalaxyProps) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [trashedMemories, setTrashedMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // New Memory Form State
  const [newCaption, setNewCaption] = useState('');
  const [newMood, setNewMood] = useState<MemoryMood>('cute');
  const [newImage, setNewImage] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMemories = async () => {
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        const allMemories: Memory[] = (data as MemoryRow[]).map(m => ({
          id: m.id,
          image: m.image_url,
          caption: m.caption,
          mood: m.mood as MemoryMood,
          date: new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          emoji: m.mood === 'cute' ? '💖' : m.mood === 'funny' ? '😂' : '✨',
          isDeleted: false
        }));
        
        setMemories(allMemories);
      }
    } catch (err) {
      console.error('Error fetching memories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        setNewImage(base64);
        setIsCompressing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id: string) => {
    const memoryToDelete = memories.find(m => m.id === id);
    if (memoryToDelete) {
      setMemories(prev => prev.filter(m => m.id !== id));
      setTrashedMemories(prev => [...prev, { ...memoryToDelete, isDeleted: true }]);
    }
  };

  const handleRestore = async (id: string) => {
    const memoryToRestore = trashedMemories.find(m => m.id === id);
    if (memoryToRestore) {
      setTrashedMemories(prev => prev.filter(m => m.id !== id));
      setMemories(prev => [...prev, { ...memoryToRestore, isDeleted: false }]);
    }
  };

  const permanentDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTrashedMemories(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Error permanently deleting memory:', err);
    }
  };

  const handleEdit = async (id: string, caption: string) => {
    try {
      const { error } = await supabase
        .from('memories')
        .update({ caption })
        .eq('id', id);

      if (error) throw error;

      setMemories(prev => prev.map(m => m.id === id ? { ...m, caption } : m));
    } catch (err) {
      console.error('Error editing memory:', err);
    }
  };

  const addNewMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageData = newImage;
    if (!imageData) return;

    setIsCompressing(true);
    try {
      // 1. Convert base64 to Blob safely
      const parts = imageData.split(',');
      const byteString = atob(parts[1]);
      const mimeString = parts[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      // 2. Upload to storage bucket 'memories'
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('memories')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Supabase Storage Error:', uploadError);
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('memories')
        .getPublicUrl(fileName);

      // 4. Insert into 'memories' table
      const { data: insertResult, error: insertError } = await supabase
        .from('memories')
        .insert({
          image_url: publicUrl,
          caption: newCaption,
          mood: newMood
        })
        .select()
        .single();

      if (insertError) {
        console.error('Supabase Database Error:', insertError);
        throw new Error(`Database insert failed: ${insertError.message}`);
      }

      if (!insertResult) throw new Error('Failed to retrieve newly created memory');

      const typedResult = insertResult as MemoryRow;

      const newMemory: Memory = {
        id: typedResult.id,
        image: typedResult.image_url,
        date: new Date(typedResult.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        caption: typedResult.caption,
        emoji: typedResult.mood === 'cute' ? '💖' : typedResult.mood === 'funny' ? '😂' : '✨',
        mood: typedResult.mood as MemoryMood
      };

      setMemories(prev => [...prev, newMemory]);
      setNewCaption('');
      setNewImage(null);
      setIsAddOpen(false);
      
      // Scroll to end smoothly
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'smooth' });
        }
      }, 300);
    } catch (err) {
      console.error('Archive Error:', err);
      alert(err instanceof Error ? err.message : 'An unexpected error occurred while archiving.');
    } finally {
      setIsCompressing(false);
    }
  };

  const activeMemories = memories;

  return (
    <div className="relative w-full h-screen bg-[#020202] overflow-hidden flex flex-col font-sans text-white">
      <CustomCursor />

      {/* Galaxy Background layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(40,20,60,0.15)_0%,transparent_70%)]" />
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-20"
            initial={{ x: Math.random() * 100 + 'vw', y: Math.random() * 100 + 'vh' }}
            animate={{ opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Header UI */}
      <header className="relative z-20 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex flex-col">
          <h2 className="text-xs tracking-[0.5em] uppercase text-zinc-500 font-light mb-1">Celestial Archive</h2>
          <h1 className="text-lg md:text-xl font-display font-medium tracking-widest text-pink-200">Memory Galaxy</h1>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setIsTrashOpen(true)}
            className="group relative p-3 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 transition-all"
          >
            <Trash2 size={18} className="text-zinc-400 group-hover:text-red-400 transition-colors" />
            {trashedMemories.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[8px] flex items-center justify-center rounded-full font-bold">
                {trashedMemories.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-pink-500 hover:bg-pink-600 transition-all active:scale-95 shadow-lg shadow-pink-500/20"
          >
            <Plus size={18} />
            <span className="text-[10px] tracking-widest uppercase font-bold">Add Memory</span>
          </button>
        </div>
      </header>

      {/* Horizontal Scroll Area */}
      <main 
        ref={scrollRef}
        className="relative z-10 flex-1 flex items-center overflow-x-auto overflow-y-hidden px-[10vw] gap-12 no-scrollbar scroll-smooth"
      >
        <div className="flex items-center gap-16 py-20 pr-[20vw]">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="flex items-center justify-center w-screen">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-2 border-pink-500/20 border-t-pink-500 rounded-full"
                />
              </div>
            ) : activeMemories.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full px-20">
                <p className="text-zinc-500 italic font-light tracking-[0.2em] uppercase text-xs mb-4">No memories found in this sector</p>
                <button 
                  onClick={() => setIsAddOpen(true)}
                  className="text-pink-400 text-[10px] tracking-widest uppercase hover:text-pink-300 transition-colors"
                >
                  Create first memory
                </button>
              </div>
            ) : (
              activeMemories.map((memory, index) => (
                <motion.div 
                  key={memory.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="flex items-center gap-16 flex-shrink-0"
                >
                  {/* Connecting Line */}
                  {index > 0 && (
                    <div className="w-16 h-[1px] bg-gradient-to-r from-pink-500/20 via-white/5 to-pink-500/20 flex-shrink-0" />
                  )}
                  <MemoryCard 
                    memory={memory} 
                    onDelete={handleDelete} 
                    onEdit={handleEdit} 
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {/* End Portal */}
          <div className="flex flex-col items-center ml-20">
             <div className="relative w-64 h-64 flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0 bg-pink-500/20 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <div className="absolute inset-4 border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-10 border border-pink-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                
                <button
                  onClick={onComplete}
                  className="group relative flex flex-col items-center gap-4 transition-transform hover:scale-110"
                >
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black shadow-2xl">
                     <SkipForward size={24} />
                  </div>
                  <span className="text-[10px] tracking-[0.4em] uppercase text-pink-300 font-bold whitespace-nowrap">
                    Read My Letter 💌
                  </span>
                </button>
             </div>
          </div>
        </div>
      </main>

      {/* Recycle Bin Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden"
            >
              <button 
                onClick={() => setIsAddOpen(false)}
                className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition-all z-50"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              <h2 className="text-xl font-display font-medium tracking-widest text-white mb-8">CAPTURE A MEMORY</h2>

              <form onSubmit={addNewMemory} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500">Memory Photo</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full h-40 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
                      newImage ? 'border-pink-500/50' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {newImage ? (
                      <img src={newImage} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Plus className="text-zinc-600 mb-2" size={24} />
                        <span className="text-[10px] uppercase tracking-widest text-zinc-600">
                          {isCompressing ? 'Processing...' : 'Upload from Library'}
                        </span>
                      </>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500">Caption</label>
                  <textarea
                    required
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="Tell the story..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-pink-500/50 min-h-[80px] resize-none transition-all placeholder:text-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500">Mood Archive</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['cute', 'funny', 'emotional'] as MemoryMood[]).map(mood => (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => setNewMood(mood)}
                        className={`py-3 rounded-xl border text-[10px] uppercase tracking-widest transition-all ${
                          newMood === mood ? 'bg-pink-500 border-pink-500 text-white' : 'bg-black/40 border-white/5 text-zinc-500'
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!newImage || isCompressing}
                  className="w-full py-4 rounded-xl bg-white text-black font-bold tracking-[0.2em] text-xs uppercase hover:bg-pink-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCompressing ? 'PROCESSING...' : 'ARCHIVE MEMORY'} <Send size={14} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Recycle Bin Modal */}
      <AnimatePresence>
        {isTrashOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl p-8 relative"
            >
              <button 
                onClick={() => setIsTrashOpen(false)}
                className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition-all z-50"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <Trash2 className="text-red-400" size={24} />
                <h2 className="text-xl font-display font-medium tracking-widest text-white">RECYCLE BIN</h2>
              </div>

              {trashedMemories.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-zinc-500 italic font-light tracking-wide font-mono">No discarded galaxies found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {trashedMemories.map(m => (
                    <div key={m.id} className="group relative flex gap-4 p-4 bg-black/40 rounded-2xl border border-white/5 items-center hover:border-white/10 transition-colors">
                       <img src={m.image} className="w-20 h-20 rounded-xl object-cover grayscale brightness-50" />
                       
                       <div className="flex-1 overflow-hidden">
                          <p className="text-xs text-zinc-300 truncate font-light mb-2">{m.caption || "Untilted Memory"}</p>
                          <div className="flex items-center gap-4">
                             <button 
                               onClick={() => handleRestore(m.id)}
                               className="flex items-center gap-2 h-11 px-4 rounded-xl bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 active:scale-95 transition-all text-[10px] uppercase tracking-widest font-bold"
                               title="Restore Memory"
                             >
                               <RotateCcw size={14} />
                               <span>Restore</span>
                             </button>
                             <button 
                               onClick={() => permanentDelete(m.id)}
                               className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500/20 active:scale-95 transition-all"
                               title="Permanently Delete"
                             >
                               <Trash2 size={16} />
                             </button>
                          </div>
                       </div>

                       {/* Mobile-friendly specific "X" or restore overlay if needed, 
                           but the above horizontal layout with 44px (11rem) height buttons is better */}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-10 right-10 text-white/20 flex flex-col items-end gap-2 pointer-events-none">
          <div className="flex items-center gap-2">
             <Music size={14} />
             <span className="text-[9px] tracking-[0.2em] uppercase">Universal Whispers</span>
          </div>
          <div className="w-12 h-[1px] bg-white/20" />
      </div>
    </div>
  );
}
