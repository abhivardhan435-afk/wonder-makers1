import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

import projectHooligan from '../assets/images/project_hooligan.png';
import projectEppi from '../assets/images/project_eppi.png';
import projectAvalanche from '../assets/images/project_avalanche.png';
import projectAvaCloud from '../assets/images/project_avacloud.png';

gsap.registerPlugin(ScrollTrigger);

const categories = ['All', 'Web3 & Gaming', 'E-commerce', 'Enterprise & SaaS'];

const projects = [
  {
    id: 1,
    title: 'My Pet Hooligan',
    category: 'Web3 & Gaming',
    tags: ['Web3', 'Action Shooter', 'Front-End'],
    desc: 'An immersive cinematic ecosystem merging gaming hubs with high-fidelity web interfaces.',
    img: projectHooligan,
    accent: 'var(--color-neon)',
    colSpan: 'col-span-12 md:col-span-7',
    offset: ''
  },
  {
    id: 2,
    title: 'EPPI Jewelry',
    category: 'E-commerce',
    tags: ['UX Design', 'Fine Diamonds', 'Shopify'],
    desc: 'A premium digital storefront featuring minimal typography and luxurious product showcases.',
    img: projectEppi,
    accent: '#f59e0b', // Amber/gold
    colSpan: 'col-span-12 md:col-span-5',
    offset: 'md:mt-20'
  },
  {
    id: 3,
    title: 'Avalanche Gaming',
    category: 'Web3 & Gaming',
    tags: ['Dashboard', 'AVAX Subnet', 'React'],
    desc: 'A high-performance portal featuring gaming tournaments, leaderboards, and telemetry logs.',
    img: projectAvalanche,
    accent: '#ef4444', // Red
    colSpan: 'col-span-12 md:col-span-5',
    offset: ''
  },
  {
    id: 4,
    title: 'Ava Cloud',
    category: 'Enterprise & SaaS',
    tags: ['Console', 'Blockchain Node', 'Tailwind'],
    desc: 'An enterprise blockchain infrastructure console with interactive subnet configurations.',
    img: projectAvaCloud,
    accent: '#8b5cf6', // Violet
    colSpan: 'col-span-12 md:col-span-7',
    offset: 'md:mt-20'
  }
];

export default function Work() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const tabsRef = useRef(null);
  const gridRef = useRef(null);
  const cardRefs = useRef([]);
  cardRefs.current = [];

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  // Initial Entrance Animation
  useEffect(() => {
    const activeTriggers = [];

    // Header reveal (staggered children)
    const headerElements = [
      ...headingRef.current.querySelector('.max-w-xl').children,
      headingRef.current.querySelector('.items-baseline')
    ];

    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: headingRef.current,
        start: 'top bottom-=40',
        end: 'bottom top+=40',
        scrub: 0.8,
      }
    });

    headerTl.fromTo(headerElements,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, ease: 'power2.out', stagger: 0.1, duration: 0.4 }
    )
    .to(headerElements,
      { y: -40, opacity: 0, ease: 'power2.in', stagger: 0.1, duration: 0.4 },
      '+=0.2'
    );

    if (headerTl.scrollTrigger) activeTriggers.push(headerTl.scrollTrigger);

    // Tabs float in & exit
    const tabsTl = gsap.timeline({
      scrollTrigger: {
        trigger: tabsRef.current,
        start: 'top bottom-=40',
        end: 'bottom top+=40',
        scrub: 0.8,
      }
    });

    tabsTl.fromTo(tabsRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, ease: 'power2.out', duration: 0.4 }
    )
    .to(tabsRef.current,
      { y: -30, opacity: 0, ease: 'power2.in', duration: 0.4 },
      '+=0.2'
    );

    if (tabsTl.scrollTrigger) activeTriggers.push(tabsTl.scrollTrigger);

    return () => {
      activeTriggers.forEach(t => t.kill());
    };
  }, []);

  // Animate grid rebuild on tab change
  const handleCategoryChange = (category) => {
    if (category === activeCategory) return;

    const cards = gridRef.current.querySelectorAll('.project-card');

    // Staggered fade out
    gsap.to(cards, {
      y: 30,
      opacity: 0,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.in',
      onComplete: () => {
        setActiveCategory(category);
        const filtered = category === 'All' 
          ? projects 
          : projects.filter(p => p.category === category);
        setFilteredProjects(filtered);
      }
    });
  };

  // Staggered fade back in & scroll-triggered entrance/exit
  useEffect(() => {
    // We target only cards currently rendered
    const cards = gridRef.current?.querySelectorAll('.project-card');
    if (!cards || cards.length === 0) return;

    // Reset cardRefs mapping
    cardRefs.current = Array.from(cards);

    const activeCardTriggers = [];

    cardRefs.current.forEach((card) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=80',
          end: 'bottom top+=80',
          scrub: 0.8,
        }
      });

      tl.fromTo(card,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out', duration: 0.4 }
      )
      .to(card,
        { y: -80, opacity: 0, ease: 'power2.in', duration: 0.4 },
        '+=0.2'
      );

      if (tl.scrollTrigger) activeCardTriggers.push(tl.scrollTrigger);
    });

    ScrollTrigger.refresh();

    return () => {
      activeCardTriggers.forEach(t => t.kill());
    };
  }, [filteredProjects]);

  // Card interactions (tilt and internal parallax translation)
  const handleMouseMove = (e, cardEl) => {
    if (!cardEl || window.matchMedia('(max-width: 1024px)').matches) return;

    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = x / rect.width - 0.5;
    const yc = y / rect.height - 0.5;

    // Slightly tilt card container
    gsap.to(cardEl.querySelector('.card-frame'), {
      rotationY: xc * 8,
      rotationX: -yc * 8,
      scale: 1.015,
      ease: 'power1.out',
      duration: 0.3
    });

    // Translate the image inside the card frame slightly in opposite direction
    gsap.to(cardEl.querySelector('.project-img'), {
      x: -xc * 18,
      y: -yc * 18,
      scale: 1.06,
      ease: 'power1.out',
      duration: 0.3
    });
  };

  const handleMouseLeave = (cardEl) => {
    if (!cardEl) return;

    // Reset card container tilt
    gsap.to(cardEl.querySelector('.card-frame'), {
      rotationY: 0,
      rotationX: 0,
      scale: 1,
      ease: 'power2.out',
      duration: 0.5
    });

    // Reset image translation
    gsap.to(cardEl.querySelector('.project-img'), {
      x: 0,
      y: 0,
      scale: 1,
      ease: 'power2.out',
      duration: 0.5
    });
  };

  return (
    <section 
      id="work" 
      ref={containerRef}
      className="relative w-full py-24 md:py-32 px-6 md:px-12 border-b border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/40 transition-theme overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Section Heading & Subtext */}
        <div ref={headingRef} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-xl flex flex-col gap-4">
            <span className="text-xs font-semibold tracking-[0.25em] text-neutral-800 dark:text-neon uppercase select-none">
              Selected Works
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-bold leading-none text-black dark:text-white uppercase select-none">
              CREATIVE PORTFOLIO
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-sans text-sm md:text-base leading-relaxed">
              Discover a handpicked collection of our premier digital developments, immersive portals, and web tools.
            </p>
          </div>
          <div className="flex items-baseline gap-2 font-display text-neutral-400 dark:text-neutral-600">
            <span className="text-5xl md:text-7xl font-bold font-display select-none">
              {projects.length}
            </span>
            <span className="text-xs tracking-wider uppercase font-semibold">Cases</span>
          </div>
        </div>

        {/* Categories Tabs Filter */}
        <div 
          ref={tabsRef}
          className="flex flex-wrap gap-2 border-b border-black/10 dark:border-white/10 pb-6 items-center"
        >
          {categories.map((cat, idx) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={idx}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-theme uppercase border interactive-hover active:scale-95 ${
                  isActive 
                    ? 'bg-black text-white border-black dark:bg-neon dark:text-black dark:border-neon font-bold shadow-md shadow-neon/5'
                    : 'bg-white/40 dark:bg-neutral-900/20 text-neutral-500 dark:text-neutral-400 border-black/10 dark:border-white/5 hover:text-black dark:hover:text-white hover:border-black/25 dark:hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Alternating Asymmetrical Portfolio Grid */}
        <div 
          ref={gridRef}
          className="grid grid-cols-12 gap-8 md:gap-12 min-h-[500px]"
        >
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              ref={addToRefs}
              onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
              className={`project-card perspective-[1000px] flex flex-col gap-6 ${project.colSpan} ${project.offset}`}
            >
              {/* Card Outer Tilt Shell */}
              <div 
                className="card-frame w-full aspect-[4/3] rounded-2xl overflow-hidden border border-black/10 dark:border-white/8 bg-white/40 dark:bg-neutral-900/30 backdrop-blur-md transition-theme relative group cursor-pointer"
                style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
              >
                {/* Image Wrapper */}
                <div className="w-full h-full overflow-hidden relative rounded-2xl">
                  <img 
                    src={project.img} 
                    alt={project.title}
                    className="project-img w-full h-full object-cover origin-center transition-transform duration-300 ease-out"
                    style={{ willChange: 'transform' }}
                  />
                  {/* Color Tint Overlay matching project accent */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                    style={{ backgroundColor: project.accent }}
                  />
                  {/* Subtle Gradient Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Tags on Image Top Left */}
                <div 
                  className="absolute top-6 left-6 flex flex-wrap gap-2"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  {project.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx}
                      className="px-2.5 py-1 bg-black/50 backdrop-blur-md border border-white/10 text-[9px] font-semibold tracking-wider text-white uppercase rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bottom Left Hover Info */}
                <div 
                  className="absolute bottom-6 left-6 right-6 flex justify-between items-end"
                  style={{ transform: 'translateZ(25px)' }}
                >
                  <div className="flex flex-col gap-1 text-white">
                    <span className="text-[10px] tracking-widest text-neutral-300 uppercase font-medium">
                      {project.category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-display font-bold leading-tight uppercase">
                      {project.title}
                    </h3>
                  </div>
                  {/* Hover expanding circular action arrow */}
                  <div 
                    className="w-10 h-10 rounded-full bg-white dark:bg-neon text-black flex items-center justify-center border border-white/20 shadow-lg group-hover:rotate-45 transition-transform duration-500"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Description metadata beneath card (highly responsive & readable) */}
              <div className="px-2 flex flex-col gap-2">
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-sans leading-relaxed max-w-lg">
                  {project.desc}
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold tracking-wide text-neutral-800 dark:text-neutral-300">
                  <span>Client Case STUDY</span>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.accent }} />
                  <span className="text-neutral-400 dark:text-neutral-500 font-normal">Wonder Makers Creative</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
