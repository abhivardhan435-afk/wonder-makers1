import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

import serviceBrand from '../assets/images/service_brand.png';
import serviceDigital from '../assets/images/service_digital.png';
import serviceMotion from '../assets/images/service_motion.png';
import serviceLabs from '../assets/images/hero_bg.png'; // Reusing hero background for a luxury dark canvas visual

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);
  
  const cards = [
    {
      num: '01',
      title: 'Brand & Strategy',
      tag: 'Identity Design',
      desc: 'Defining premium corporate identities and creative strategy through art direction.',
      img: serviceBrand
    },
    {
      num: '02',
      title: 'Digital Systems',
      tag: 'Development',
      desc: 'Building immersive digital products where high-end aesthetics meet robust architecture.',
      img: serviceDigital
    },
    {
      num: '03',
      title: 'Immersive Motion',
      tag: '3D & CGI Motion',
      desc: 'Creating custom 3D dynamics, fluid graphics, and cinema-grade interactive storytelling.',
      img: serviceMotion
    },
    {
      num: '04',
      title: 'Creative Labs',
      tag: 'Research & AI',
      desc: 'Exploring future-facing hooks, custom WebGL, and next-generation interactive design.',
      img: serviceLabs
    }
  ];

  // Card Refs
  const cardRefs = useRef([]);
  cardRefs.current = [];

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  useEffect(() => {
    const activeTriggers = [];

    // Reveal Heading elements on scroll
    const headingElements = headingRef.current.children;
    const headingTrigger = ScrollTrigger.create({
      trigger: headingRef.current,
      start: 'top bottom-=40',
      end: 'bottom top+=40',
      onEnter: () => {
        gsap.fromTo(headingElements, 
          { y: 40, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.1, overwrite: 'auto' }
        );
      },
      onLeave: () => {
        gsap.to(headingElements, 
          { y: -40, opacity: 0, duration: 0.5, ease: 'power2.in', stagger: 0.05, overwrite: 'auto' }
        );
      },
      onEnterBack: () => {
        gsap.fromTo(headingElements, 
          { y: 40, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.1, overwrite: 'auto' }
        );
      },
      onLeaveBack: () => {
        gsap.to(headingElements, 
          { y: 40, opacity: 0, duration: 0.5, ease: 'power2.in', stagger: 0.05, overwrite: 'auto' }
        );
      }
    });

    activeTriggers.push(headingTrigger);

    // Staggered reveal & exit for cards
    cardRefs.current.forEach((card) => {
      const trigger = ScrollTrigger.create({
        trigger: card,
        start: 'top bottom-=60',
        end: 'bottom top+=60',
        onEnter: () => {
          gsap.fromTo(card, 
            { y: 50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', overwrite: 'auto' }
          );
        },
        onLeave: () => {
          gsap.to(card, 
            { y: -50, opacity: 0, duration: 0.5, ease: 'power2.in', overwrite: 'auto' }
          );
        },
        onEnterBack: () => {
          gsap.fromTo(card, 
            { y: 50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', overwrite: 'auto' }
          );
        },
        onLeaveBack: () => {
          gsap.to(card, 
            { y: 50, opacity: 0, duration: 0.5, ease: 'power2.in', overwrite: 'auto' }
          );
        }
      });

      activeTriggers.push(trigger);
    });

    return () => {
      activeTriggers.forEach(t => t.kill());
    };
  }, []);

  // 3D Card Tilt Interaction
  const handleMouseMove = (e, idx) => {
    const card = cardRefs.current[idx];
    if (!card || window.matchMedia('(max-width: 1024px)').matches) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = x / rect.width - 0.5;
    const yc = y / rect.height - 0.5;

    // Apply rotation & shadow glow on tilt
    gsap.to(card.querySelector('.card-inner'), {
      rotationY: xc * 10,
      rotationX: -yc * 10,
      scale: 1.02,
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      borderColor: 'rgba(255, 45, 55, 0.4)',
      ease: 'power1.out',
      duration: 0.3
    });
  };

  const handleMouseLeave = (idx) => {
    const card = cardRefs.current[idx];
    if (!card) return;

    const isDark = document.documentElement.classList.contains('dark');
    // Reset rotation and scales
    gsap.to(card.querySelector('.card-inner'), {
      rotationY: 0,
      rotationX: 0,
      scale: 1,
      boxShadow: '0 0px 0px rgba(0,0,0,0)',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      ease: 'power2.out',
      duration: 0.5
    });
  };

  return (
    <section 
      id="services" 
      ref={containerRef}
      className="relative w-full py-24 md:py-32 px-6 md:px-12 border-b border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/40 transition-theme overflow-hidden"
    >
      {/* Mesh Background Accent Glow */}
      <div className="absolute top-1/2 left-0 w-[40vw] h-[40vw] rounded-full blur-[140px] pointer-events-none -z-10 opacity-15 bg-neon" />

      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Section Heading */}
        <div ref={headingRef} className="max-w-xl flex flex-col gap-4">
          <span className="text-xs font-semibold tracking-[0.25em] text-red-600 dark:text-neon uppercase select-none">
            What we do
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold leading-none text-black dark:text-white uppercase select-none">
            Premium Services & Showcase
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 font-sans text-sm md:text-base leading-relaxed">
            Delivering digital platforms that merge creative design with cinematic interactions and scalable codebases.
          </p>
        </div>

        {/* Services Grid Overlay with Fine Borders */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-black/8 dark:border-white/8 rounded-2xl overflow-hidden bg-neutral-100/50 dark:bg-neutral-900/10 backdrop-blur-sm"
        >
          {cards.map((card, idx) => (
            <div 
              key={idx}
              ref={addToRefs}
              onMouseMove={(e) => handleMouseMove(e, idx)}
              onMouseLeave={() => handleMouseLeave(idx)}
              className="perspective-[1000px] border-b border-r border-black/8 dark:border-white/8 last:border-b-0 md:last:border-r-0 lg:even:border-r lg:odd:border-r lg:last:border-r-0"
              style={{
                // remove bottom border on last rows for desktop
                borderBottom: idx >= 2 ? 'inherit' : undefined
              }}
            >
              <div 
                className="card-inner h-full flex flex-col justify-between p-8 border border-transparent transition-theme group/card relative overflow-hidden bg-white/60 dark:bg-neutral-950/40 backdrop-blur-md rounded-none"
                style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
              >
                {/* 3D Content Container */}
                <div style={{ transform: 'translateZ(20px)' }}>
                  
                  {/* Header Row: Num and Arrow */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-display font-light text-neutral-400 dark:text-neutral-500 tracking-wider">
                      {card.num}
                    </span>
                    <div className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-black dark:text-white group-hover/card:bg-neon group-hover/card:text-black group-hover/card:border-neon transition-all duration-300">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Title & Tag */}
                  <div className="mb-8">
                    <span className="text-[10px] tracking-wider uppercase font-semibold text-red-700 dark:text-neon/80 bg-red-100/70 dark:bg-neon/5 px-2 py-0.5 rounded-sm transition-theme">
                      {card.tag}
                    </span>
                    <h3 className="text-2xl font-display font-semibold text-black dark:text-white mt-3 leading-tight select-none">
                      {card.title}
                    </h3>
                  </div>
                </div>

                {/* Service Card Image (Middle) */}
                <div 
                  className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-6 relative group-hover/card:shadow-lg transition-shadow duration-300"
                  style={{ transform: 'translateZ(10px)' }}
                >
                  <img 
                    src={card.img} 
                    alt={card.title}
                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700 ease-out-cubic"
                  />
                  {/* Subtle Gradient Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Description Text */}
                <div style={{ transform: 'translateZ(15px)' }}>
                  <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 group-hover/card:text-neutral-700 dark:group-hover/card:text-neutral-200 transition-colors duration-300">
                    {card.desc}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
