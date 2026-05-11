import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Fireworks() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const createFirework = () => {
      const firework = document.createElement('div');
      const startX = Math.random() * window.innerWidth;
      const startY = window.innerHeight;
      const endX = startX + (Math.random() - 0.5) * 200;
      const endY = window.innerHeight * 0.2 + Math.random() * (window.innerHeight * 0.3);

      firework.className = 'fixed w-1 h-2 bg-white rounded-full z-[60]';
      containerRef.current?.appendChild(firework);

      gsap.set(firework, { x: startX, y: startY });

      gsap.to(firework, {
        x: endX,
        y: endY,
        duration: 1 + Math.random(),
        ease: 'power2.out',
        onComplete: () => {
          explode(endX, endY);
          firework.remove();
        }
      });
    };

    const explode = (x: number, y: number) => {
      const colors = ['#ff7eb9', '#ffcc00', '#74ebd5', '#ffffff', '#e0c3fc', '#ec4899', '#3b82f6'];
      const particles = 50;

      for (let i = 0; i < particles; i++) {
        const p = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const isHeart = Math.random() > 0.8;
        
        p.className = `fixed rounded-full z-[60] ${isHeart ? 'w-3 h-3' : 'w-1.5 h-1.5'}`;
        p.style.backgroundColor = color;
        p.style.boxShadow = `0 0 15px ${color}`;
        if (isHeart) {
          p.innerHTML = '❤️';
          p.style.backgroundColor = 'transparent';
          p.style.boxShadow = 'none';
          p.style.fontSize = '12px';
        }
        
        containerRef.current?.appendChild(p);

        const angle = (i / particles) * Math.PI * 2;
        const velocity = 150 + Math.random() * 300;
        const targetX = x + Math.cos(angle) * velocity;
        const targetY = y + Math.sin(angle) * velocity;

        gsap.set(p, { x, y, scale: 1, opacity: 1 });
        gsap.to(p, {
          x: targetX,
          y: targetY + 150, // Gravity
          scale: 0,
          opacity: 0,
          duration: 2 + Math.random(),
          ease: 'power2.out',
          onComplete: () => p.remove()
        });
      }
      
      // Flash effect
      const flash = document.createElement('div');
      flash.className = 'fixed inset-0 z-50 bg-white/20 pointer-events-none opacity-0';
      containerRef.current?.appendChild(flash);
      gsap.to(flash, { opacity: 1, duration: 0.1, onComplete: () => gsap.to(flash, { opacity: 0, duration: 0.5, onComplete: () => flash.remove() }) });
    };

    const interval = setInterval(createFirework, 800);
    return () => clearInterval(interval);
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none" />;
}
