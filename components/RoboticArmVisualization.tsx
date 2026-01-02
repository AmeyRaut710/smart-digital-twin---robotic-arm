
import React, { useRef, useEffect } from 'react';

interface RoboticArmVisualizationProps {
  joint1Angle: number;
  joint2Angle: number;
  isAnimating: boolean;
  temperature?: number;
}

const RoboticArmVisualization: React.FC<RoboticArmVisualizationProps> = ({ 
  joint1Angle, joint2Angle, isAnimating, temperature = 38
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const base = { x: w / 2, y: h - 80 };
      const link1Len = 130;
      const link2Len = 110;

      ctx.clearRect(0, 0, w, h);

      // Draw Atmospheric Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= w; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Physics to Rads
      const a1 = (joint1Angle * Math.PI) / 180;
      const a2 = (joint2Angle * Math.PI) / 180;

      // Joints
      const j1 = { 
        x: base.x + link1Len * Math.cos(a1), 
        y: base.y - link1Len * Math.sin(a1) 
      };
      const j2 = { 
        x: j1.x + link2Len * Math.cos(a1 + a2), 
        y: j1.y - link2Len * Math.sin(a1 + a2) 
      };

      // Base Platform - Chrome/Tech style
      const baseGrad = ctx.createLinearGradient(base.x - 60, base.y, base.x + 60, base.y + 40);
      baseGrad.addColorStop(0, '#334155');
      baseGrad.addColorStop(0.5, '#475569');
      baseGrad.addColorStop(1, '#1e293b');
      
      ctx.fillStyle = baseGrad;
      ctx.beginPath();
      ctx.roundRect(base.x - 60, base.y, 120, 35, 12);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Thermal stress calculation for vibrant colors
      const isCritical = temperature > 45;
      const isWarning = temperature > 40;
      const accentColor = isCritical ? '#ff003c' : isWarning ? '#fbbf24' : '#00f2ff';

      // Function to draw a glowing link
      const drawGlowingLink = (p1: {x:number, y:number}, p2: {x:number, y:number}, color1: string, color2: string, width: number) => {
        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        grad.addColorStop(0, color1);
        grad.addColorStop(1, color2);

        // Draw outer glow
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = color2;
        ctx.strokeStyle = grad;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.restore();

        // Draw inner high-light
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = width / 3;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      };

      // Link 1
      drawGlowingLink(base, j1, '#0062ff', accentColor, 14);
      
      // Link 2
      drawGlowingLink(j1, j2, accentColor, '#ff00ff', 10);

      // Draw Joints with high intensity
      const drawJoint = (x: number, y: number, color: string, radius: number) => {
        const pulsate = isAnimating ? Math.sin(Date.now() / 150) * 4 + 10 : 10;
        
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        
        // Large outer glow
        const radialGrad = ctx.createRadialGradient(x, y, 0, x, y, radius * 4);
        radialGrad.addColorStop(0, color);
        radialGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Inner core
        ctx.shadowBlur = pulsate;
        ctx.shadowColor = color;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      };

      drawJoint(base.x, base.y, '#0062ff', 8);
      drawJoint(j1.x, j1.y, accentColor, 7);
      drawJoint(j2.x, j2.y, '#ff00ff', 9);

      // Digital Overlays
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`L1: ${joint1Angle.toFixed(1)}°`, j1.x, j1.y - 20);
      ctx.fillText(`L2: ${joint2Angle.toFixed(1)}°`, j2.x, j2.y - 25);
    };

    let animationFrame: number;
    const animate = () => {
      render();
      animationFrame = requestAnimationFrame(animate);
    };
    
    if (isAnimating) {
      animate();
    } else {
      render();
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [joint1Angle, joint2Angle, temperature, isAnimating]);

  return (
    <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
      {/* Background Texture/FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(30,58,138,0.1)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="absolute top-6 left-6 flex flex-col gap-1 z-10">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isAnimating ? 'bg-cyan-400 animate-pulse shadow-[0_0_12px_#22d3ee]' : 'bg-slate-700'}`} />
          <span className="text-[11px] font-black text-white uppercase tracking-[0.25em]">Cyber-Twin Active</span>
        </div>
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Hydra-Drive v4.5 Core</span>
      </div>
      
      {temperature > 40 && (
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-red-600/20 border border-red-500/40 px-4 py-1.5 rounded-full animate-bounce z-10 backdrop-blur-md">
           <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]" />
           <span className="text-[10px] font-black text-red-400 uppercase tracking-wider">Thermal Overload</span>
        </div>
      )}

      <canvas 
        ref={canvasRef} 
        width={600} 
        height={450} 
        className="w-full h-full object-contain"
      />

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-8 z-10">
        <div className="flex flex-col items-center">
          <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Base Resolver</div>
          <div className="text-sm font-black text-cyan-400 font-mono">{joint1Angle.toFixed(2)}°</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Aux Resolver</div>
          <div className="text-sm font-black text-fuchsia-400 font-mono">{joint2Angle.toFixed(2)}°</div>
        </div>
      </div>
    </div>
  );
};

export default RoboticArmVisualization;
