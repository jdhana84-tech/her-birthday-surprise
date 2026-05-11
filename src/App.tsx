/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import LoadingScreen from './components/ui/LoadingScreen';
import LandingPage from './pages/LandingPage';
import MemoryVault from './pages/MemoryVault';
import CakeCeremony from './pages/CakeCeremony';
import MemoryGalaxy from './pages/MemoryGalaxy';
import TheLetter from './pages/TheLetter';
import FinalEnding from './pages/FinalEnding';
import ErrorBoundary from './components/ui/ErrorBoundary';
import DreamyAudio from './components/universe/DreamyAudio';

const SCENES = [
  { id: 1, title: 'Introduction', component: LandingPage },
  { id: 2, title: 'The Memory Vault', component: MemoryVault },
  { id: 3, title: 'Birthday Celebration', component: CakeCeremony },
  { id: 4, title: 'The Starlit Galaxy', component: MemoryGalaxy },
  { id: 5, title: 'The Final Secret', component: TheLetter },
  { id: 6, title: 'Eternal Memories', component: FinalEnding },
];

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [unlockedScenes, setUnlockedScenes] = useState<number[]>([1]);
  const [showIntro, setShowIntro] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    // Add a small delay before hiding intro completely to match transitions
    setTimeout(() => setShowIntro(false), 2000);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    // 🛡️ LOCALSTORAGE GUARD & CLEANUP
    if (!localStorage.getItem('auth_user')) localStorage.setItem('auth_user', 'priya');
    if (!localStorage.getItem('auth_password')) localStorage.setItem('auth_password', '22/06/2007');

    const badKeys = ['user', 'data', 'auth', 'storage', 'panguuu_memories'];
    const oldMemories = localStorage.getItem('panguuu_memories');
    if (oldMemories && !localStorage.getItem('memory_photos')) {
      localStorage.setItem('memory_photos', oldMemories);
    }
    badKeys.forEach(k => localStorage.removeItem(k));
  }, []);

  const unlockScene = (sceneId: number) => {
    setUnlockedScenes(prev => prev.includes(sceneId) ? prev : [...prev, sceneId]);
  };

  const handleNext = () => {
    if (currentPage < SCENES.length && unlockedScenes.includes(currentPage + 1)) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Specific milestone handlers that also unlock navigation
  const handleMilestone = (nextScene: number) => {
    unlockScene(nextScene);
    setCurrentPage(nextScene);
  };

  const currentSceneData = SCENES.find(s => s.id === currentPage);
  const isLocked = !unlockedScenes.includes(currentPage + 1) && currentPage < SCENES.length;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div 
            key="intro-overlay" 
            initial={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          >
            <LoadingScreen onLoadingComplete={handleLoadingComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`w-full h-full transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {currentPage === 1 && <LandingPage onEnter={() => handleMilestone(2)} />}
        {currentPage === 2 && <MemoryVault onUnlock={() => handleMilestone(3)} />}
        {currentPage === 3 && <CakeCeremony onComplete={() => handleMilestone(4)} />}
        {currentPage === 4 && <MemoryGalaxy onComplete={() => handleMilestone(5)} />}
        {currentPage === 5 && <TheLetter onComplete={() => handleMilestone(6)} />}
        {currentPage === 6 && <FinalEnding onReplay={() => setCurrentPage(1)} />}
      </div>

      {!isLoading && (
        <DreamyAudio />
      )}
    </div>
  );
}

export default function App() {
  return (
    <main className="w-full min-h-screen bg-black text-white selection:bg-pink-500/30">
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </main>
  );
}


