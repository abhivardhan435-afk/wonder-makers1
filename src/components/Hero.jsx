import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import heroBg from '../assets/images/hero_bg.png';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ isLoaded }) {
  const containerRef = useRef(null);
  const titleLinesRef = useRef([]);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollRef = useRef(null);
  const scrollBgRef = useRef(null);
  const glassPanel1Ref = useRef(null);
  const glassPanel2Ref = useRef(null);


  // Entrance animations and Scroll Parallax when loaded
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
      // Float-in transition for floating glass panels (Light Mode)
      .fromTo(glassPanel1Ref.current,
        { y: 60, x: -30, opacity: 0, scale: 0.96 },
        { y: 0, x: 0, opacity: 1, scale: 1, duration: 1.8, ease: 'power3.out' },
        '-=1.2'
      )
      .fromTo(glassPanel2Ref.current,
        { y: -60, x: 30, opacity: 0, scale: 0.96 },
        { y: 0, x: 0, opacity: 1, scale: 1, duration: 1.8, ease: 'power3.out' },
        '-=1.5'
      )
      // Stagger subtext and buttons
      .fromTo([descRef.current, ctaRef.current], 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out' },
        '-=1.0'
      )
      // Fade in scroll indicator
      .fromTo(scrollRef.current, 
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        '-=0.6'
      );

      // Scroll Parallax for background fabric and glass card decors
      const triggers = [];

      const bgScroll = gsap.fromTo(scrollBgRef.current, 
        { y: 0 }, 
        {
          y: 90,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
      triggers.push(bgScroll);

      const glass1Scroll = gsap.fromTo(glassPanel1Ref.current, 
        { y: 0 }, 
        {
          y: 130,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
      triggers.push(glass1Scroll);

      const glass2Scroll = gsap.fromTo(glassPanel2Ref.current, 
        { y: 0 }, 
        {
          y: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
      triggers.push(glass2Scroll);

      return () => {
        triggers.forEach(t => {
          t.scrollTrigger?.kill();
          t.kill();
        });
      };
    }
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
      
      {/* 2. Abstract Parallax Background Image Wrapper (Scroll Parallax) */}
      <div 
        ref={scrollBgRef}
        className="absolute inset-0 -z-10 scale-105 pointer-events-none overflow-hidden opacity-30 dark:opacity-40"
      >
        {/* Inner Background Image */}
        <div 
          className="w-full h-full relative"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            willChange: 'transform'
          }}
        >
          {/* Silky fabric reflection highlights in Light Mode */}
          <div className="silky-reflection-overlay dark:hidden" />
        </div>
      </div>

      {/* 3. Subtle Glowing Mesh */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] rounded-full blur-[140px] pointer-events-none -z-10 opacity-30 dark:opacity-15 bg-neon" />

      {/* 4. Abstract Glass Panels (Light Mode Only - Parallax Decor) */}
      <div 
        ref={glassPanel1Ref}
        className="absolute top-[26%] left-[18vw] w-[30rem] h-48 glass-card-decor-1 pointer-events-none -z-10 dark:hidden" 
      />
      <div 
        ref={glassPanel2Ref}
        className="absolute bottom-[26%] right-[20vw] w-80 h-48 glass-card-decor-2 pointer-events-none -z-10 dark:hidden" 
      />

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
          <div className="text-mask block py-1 overflow-hidden text-neon">
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
            className="h-12 px-8 bg-neon hover:bg-neon-hover text-black font-sans font-medium rounded-full flex items-center justify-center transition-all duration-300 premium-btn-shadow interactive-hover"
          >
            Explore Showcase
          </a>
          <button className="h-12 px-8 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white font-sans font-medium rounded-full flex items-center justify-center transition-all duration-300 premium-btn-shadow interactive-hover">
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
