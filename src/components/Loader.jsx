import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function Loader({ onComplete }) {
  const [count, setCount] = useState(0);
  const [activeWord, setActiveWord] = useState('WONDER');
  const containerRef = useRef(null);
  const elementsRef = useRef(null);

  const words = ['WONDER', 'MAKERS', 'CRAFT', 'MOTION', 'READY'];

  useEffect(() => {
    // Count up animation
    let current = 0;
    const duration = 2000; // 2 seconds
    const intervalTime = 30;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      current += step + (Math.random() * 2); // Add variation to make it feel organic
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
      }
      const finalCount = Math.floor(current);
      setCount(finalCount);

      // Change active word based on progress
      if (finalCount < 25) {
        setActiveWord(words[0]);
      } else if (finalCount < 50) {
        setActiveWord(words[1]);
      } else if (finalCount < 75) {
        setActiveWord(words[2]);
      } else if (finalCount < 100) {
        setActiveWord(words[3]);
      } else {
        setActiveWord(words[4]);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (count === 100) {
      // Exit animation
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });

      tl.to(elementsRef.current, {
        opacity: 0,
        y: -50,
        duration: 0.6,
        ease: 'power3.in'
      })
      .to(containerRef.current, {
        clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)', // Clip path slide up reveal
        duration: 1.2,
        ease: 'power4.inOut'
      });
    }
  }, [count, onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-neutral-950 flex flex-col justify-between p-8 lg:p-12 overflow-hidden select-none"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
    >
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute left-1/4 top-0 bottom-0 border-l border-white/10" />
        <div className="absolute left-2/4 top-0 bottom-0 border-l border-white/10" />
        <div className="absolute left-3/4 top-0 bottom-0 border-l border-white/10" />
        <div className="absolute top-1/2 left-0 right-0 border-t border-white/10" />
      </div>

      {/* Top Brand Name */}
      <div className="relative z-10 flex justify-between items-center text-xs tracking-[0.2em] text-white/40 uppercase">
        <span>Digital Studio</span>
        <span>Est. 2026</span>
      </div>

      {/* Center Spinner Logo */}
      <div ref={elementsRef} className="relative z-10 flex flex-col items-center gap-6 my-auto">
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="w-16 h-16 text-neon animate-spin"
          style={{ animationDuration: '6s' }}
        >
          <path fillRule="evenodd" clipRule="evenodd" d="M24 11.5C22.4731 11.5001 20.961 11.3267 19.5503 10.7425C18.1395 10.1582 16.8577 9.30173 15.778 8.22201C14.6983 7.1423 13.8418 5.86046 13.2576 4.44972C12.6733 3.03897 12.4999 1.52695 12.5 0H11.5C11.5002 1.52683 11.3252 3.03875 10.7411 4.44942C10.1569 5.86009 9.30065 7.14188 8.2211 8.22159C7.14154 9.3013 5.85988 10.1578 4.44929 10.7421C3.03871 11.3265 1.52683 11.5 0 11.5V12.5C1.52672 12.4997 3.03855 12.6752 4.44912 13.2593C5.8597 13.8434 7.14138 14.6997 8.22096 15.7792C9.30054 16.8587 10.1569 18.1404 10.741 19.5509C11.3252 20.9615 11.5002 22.4733 11.5 24H12.5C12.4999 22.4732 12.6738 20.9613 13.2581 19.5508C13.8424 18.1402 14.6988 16.8585 15.7785 15.779C16.8582 14.6994 18.14 13.8432 19.5506 13.2591C20.9613 12.6751 22.4732 12.4996 24 12.5V11.5Z" fill="currentColor" />
        </svg>
        <span className="text-sm font-light text-white/50 tracking-[0.3em] h-6 flex items-center justify-center transition-all duration-300">
          {activeWord}
        </span>
      </div>

      {/* Bottom Counter */}
      <div className="relative z-10 flex justify-between items-end">
        <div className="text-xs text-white/30 max-w-[20ch] leading-relaxed hidden sm:block">
          CRAFTING FUTURE-FORWARD EXPERIENCES WITH PIXEL-PERFECT ENGINEERING.
        </div>
        <div className="text-8xl md:text-9xl font-display font-light text-white tabular-nums tracking-tighter flex items-start">
          <span>{count}</span>
          <span className="text-neon text-3xl md:text-4xl mt-2 ml-1">%</span>
        </div>
      </div>
    </div>
  );
}
