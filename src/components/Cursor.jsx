import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Check if device is touch-based or screen is too small
    const checkDevice = () => {
      const mobile = window.matchMedia('(max-width: 768px)').matches || 
                     ('ontouchstart' in window) || 
                     (navigator.maxTouchPoints > 0);
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    if (isMobile) return;

    // Track mouse coordinates
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove);

    // GSAP Quick Setters for peak performance (runs in ticker rather than state)
    const setDotX = gsap.quickTo(dotRef.current, 'x', { duration: 0.1, ease: 'power3.out' });
    const setDotY = gsap.quickTo(dotRef.current, 'y', { duration: 0.1, ease: 'power3.out' });
    
    const setRingX = gsap.quickTo(ringRef.current, 'x', { duration: 0.35, ease: 'power3.out' });
    const setRingY = gsap.quickTo(ringRef.current, 'y', { duration: 0.35, ease: 'power3.out' });

    // Ticker loop
    const tick = () => {
      setDotX(mouse.x);
      setDotY(mouse.y);
      setRingX(mouse.x);
      setRingY(mouse.y);
    };
    gsap.ticker.add(tick);

    // Hover interactions
    const onMouseOver = (e) => {
      const target = e.target;
      const isInteractive = target.closest('a') || 
                            target.closest('button') || 
                            target.closest('.interactive-hover') ||
                            target.closest('[role="button"]');
      
      if (isInteractive) {
        gsap.to(ringRef.current, {
          width: 56,
          height: 56,
          backgroundColor: 'rgba(186, 255, 57, 0.15)',
          borderColor: 'rgba(186, 255, 57, 1)',
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to(dotRef.current, {
          scale: 1.5,
          backgroundColor: '#ffffff',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const onMouseOut = (e) => {
      const target = e.target;
      const isInteractive = target.closest('a') || 
                            target.closest('button') || 
                            target.closest('.interactive-hover') ||
                            target.closest('[role="button"]');
      
      if (isInteractive) {
        gsap.to(ringRef.current, {
          width: 32,
          height: 32,
          backgroundColor: 'transparent',
          borderColor: 'rgba(186, 255, 57, 0.5)',
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to(dotRef.current, {
          scale: 1,
          backgroundColor: 'var(--color-neon)',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(tick);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div 
        ref={dotRef} 
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] mix-blend-difference bg-neon -translate-x-1/2 -translate-y-1/2"
      />
      <div 
        ref={ringRef} 
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-neon/50 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform, width, height, background-color, border-color' }}
      />
    </>
  );
}
