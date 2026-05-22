import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDown } from 'lucide-react';
import heroBg from '../assets/images/hero_bg.png';

export default function Hero({ isLoaded }) {
  const containerRef = useRef(null);
  const titleLinesRef = useRef([]);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollRef = useRef(null);
  const bgRef = useRef(null);

  // Entrance animations when loaded
  useEffect(() => {
    if (isLoaded) {
      const tl = gsap.timeline();

      // Animate text reveal
      tl.to(titleLinesRef.current, {
        y: '0%',
        duration: 1.4,
        stagger: 0.15,
        ease: 'power4.out',
        delay: 0.4
      })
      // Stagger subtext and buttons
      .fromTo([descRef.current, ctaRef.current], 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out' },
        '-=0.8'
      )
      // Fade in scroll indicator
      .fromTo(scrollRef.current, 
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        '-=0.6'
      );
    }
  }, [isLoaded]);

  // Mouse Parallax background movement
  useEffect(() => {
    if (!isLoaded || window.matchMedia('(max-width: 768px)').matches) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPercent = (clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const yPercent = (clientY / window.innerHeight - 0.5) * 2; // -1 to 1

      gsap.to(bgRef.current, {
        x: xPercent * 25,
        y: yPercent * 25,
        duration: 1,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isLoaded]);

  const handleScrollClick = (e) => {
    e.preventDefault();
    const nextSection = document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden px-6 md:px-12 border-b border-black/5 dark:border-white/5 bg-transparent"
    >
      {/* 1. Fine-border Grid Overlay (Wonder Makers Aesthetic) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10 grid-overlay" />
      
      {/* 2. Abstract Parallax Background Image */}
      <div 
        ref={bgRef}
        className="absolute inset-0 -z-10 scale-105 pointer-events-none transition-transform opacity-30 dark:opacity-40"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'transform'
        }}
      />

      {/* 3. Subtle Glowing Mesh */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] rounded-full blur-[140px] pointer-events-none -z-10 opacity-30 dark:opacity-15 bg-neon" />

      {/* Main Hero Content */}
      <div className="max-w-4xl text-center flex flex-col items-center gap-8 relative z-10 pt-20">
        
        {/* Animated Heading (Text Masking Stagger) */}
        <h1 className="text-5xl md:text-8xl font-display font-bold leading-[0.95] tracking-tighter text-black dark:text-white uppercase select-none">
          <div className="text-mask block py-1 overflow-hidden">
            <span 
              ref={el => titleLinesRef.current[0] = el}
              className="text-mask-inner block translate-y-[105%]"
            >
              High-end design.
            </span>
          </div>
          <div className="text-mask block py-1 overflow-hidden text-lime-600 dark:text-neon">
            <span 
              ref={el => titleLinesRef.current[1] = el}
              className="text-mask-inner block translate-y-[105%]"
            >
              Crafted code.
            </span>
          </div>
        </h1>

        {/* Supporting Subtext */}
        <p 
          ref={descRef}
          className="text-neutral-600 dark:text-neutral-400 font-sans text-base md:text-lg max-w-[55ch] leading-relaxed opacity-0"
        >
          We are a digital product studio for teams who see design and engineering as their competitive advantage. From immersive websites to scalable apps, we create what's next.
        </p>

        {/* Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 opacity-0">
          <a 
            href="#about" 
            onClick={handleScrollClick}
            className="h-12 px-8 bg-neon hover:bg-neon-hover text-black font-sans font-medium rounded-full flex items-center justify-center transition-all duration-300 shadow-lg shadow-neon/10 interactive-hover"
          >
            Explore Showcase
          </a>
          <button className="h-12 px-8 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white font-sans font-medium rounded-full flex items-center justify-center transition-all duration-300 interactive-hover">
            Our Studio
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0 z-10"
      >
        <span className="text-[10px] tracking-[0.3em] font-sans font-medium text-neutral-400 dark:text-neutral-500 uppercase select-none">
          Scroll
        </span>
        <a 
          href="#about"
          onClick={handleScrollClick}
          className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 hover:border-neon/60 bg-transparent flex items-center justify-center text-black dark:text-white hover:text-neon transition-all duration-300 interactive-hover"
        >
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
