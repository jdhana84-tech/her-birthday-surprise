import { useEffect, useRef } from 'react';

export default function OrbitalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    class Particle {
      x: number;
      y: number;
      radius: number;
      angle: number;
      distance: number;
      speed: number;
      color: string;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.angle = Math.random() * Math.PI * 2;
        this.distance = Math.random() * Math.min(canvasWidth, canvasHeight) * 0.4 + 50;
        this.x = canvasWidth / 2 + Math.cos(this.angle) * this.distance;
        this.y = canvasHeight / 2 + Math.sin(this.angle) * this.distance;
        this.radius = Math.random() * 1.5;
        this.speed = (Math.random() * 0.002 + 0.001) * (Math.random() > 0.5 ? 1 : -1);
        const colors = ['#f472b6', '#c084fc', '#ffffff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.angle += this.speed;
        this.x = canvasWidth / 2 + Math.cos(this.angle) * this.distance;
        this.y = canvasHeight / 2 + Math.sin(this.angle) * this.distance;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add subtle trails/glow
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const count = 150;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', init);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 bg-black"
      style={{ filter: 'blur(1px)' }}
    />
  );
}
