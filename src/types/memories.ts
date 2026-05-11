import { LucideIcon, Heart, Laugh, Smile, Trash2, Edit3, Plus, RotateCcw, Image as ImageIcon, Send, Music } from 'lucide-react';

export type MemoryMood = 'cute' | 'funny' | 'emotional';

export interface Memory {
  id: string;
  image: string;
  date: string;
  caption: string;
  emoji: string;
  mood: MemoryMood;
  isDeleted?: boolean;
}

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: '1',
    image: 'https://picsum.photos/seed/mem1/600/400',
    date: 'Dec 2023',
    caption: 'The way you smile at the stars... ✨',
    emoji: '⭐',
    mood: 'emotional'
  },
  {
    id: '2',
    image: 'https://picsum.photos/seed/mem2/600/400',
    date: 'Jan 2024',
    caption: 'That time we tried to bake and failed miserably! 😂',
    emoji: '🎂',
    mood: 'funny'
  },
  {
    id: '3',
    image: 'https://picsum.photos/seed/mem3/600/400',
    date: 'Feb 2024',
    caption: 'You are my favorite view. Always.',
    emoji: '💖',
    mood: 'cute'
  },
  {
    id: '4',
    image: 'https://picsum.photos/seed/mem4/600/400',
    date: 'April 2024',
    caption: 'Thinking about our next big adventure. 🚀',
    emoji: '🌍',
    mood: 'emotional'
  }
];
