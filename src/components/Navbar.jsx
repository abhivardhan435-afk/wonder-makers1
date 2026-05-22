import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ isLoaded }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navRef = useRef(null);
  const contactBtnRef = useRef(null);
  const contactTextRef = useRef(null);

  // Sync scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync theme state from HTML class
  useEffect(() => {
    const isDarkClass = document.documentElement.classList.contains('dark');
    setIsDark(isDarkClass);
  }, []);

  // Animate Navbar Entrance
  useEffect(() => {
    if (isLoaded) {
      gsap.fromTo(navRef.current, 
        { y: -100, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.2 }
      );
    }
  }, [isLoaded]);

  // Magnetic Button Effect
  useEffect(() => {
    const btn = contactBtnRef.current;
    if (!btn || window.matchMedia('(max-width: 768px)').matches) return;

    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const btnX = rect.left + rect.width / 2;
      const btnY = rect.top + rect.height / 2;
      const distX = e.clientX - btnX;
      const distY = e.clientY - btnY;
      const distance = Math.hypot(distX, distY);

      if (distance < 75) {
        gsap.to(btn, {
          x: distX * 0.35,
          y: distY * 0.35,
          duration: 0.3,
          ease: 'power2.out'
        });
        if (contactTextRef.current) {
          gsap.to(contactTextRef.current, {
            x: distX * 0.15,
            y: distY * 0.15,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      } else {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1.1, 0.4)'
        });
        if (contactTextRef.current) {
          gsap.to(contactTextRef.current, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
          });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Theme Toggle Function
  const toggleTheme = (mode) => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Credentials', href: '#about' },
  ];

  return (
    <>
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 opacity-0 ${
          isScrolled 
            ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md py-4 border-b border-black/5 dark:border-white/5 shadow-sm' 
            : 'bg-transparent py-6 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group/logo interactive-hover">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-lime-600 dark:text-neon group-hover/logo:rotate-45 transition-transform duration-500">
              <path fillRule="evenodd" clipRule="evenodd" d="M24 11.5C22.4731 11.5001 20.961 11.3267 19.5503 10.7425C18.1395 10.1582 16.8577 9.30173 15.778 8.22201C14.6983 7.1423 13.8418 5.86046 13.2576 4.44972C12.6733 3.03897 12.4999 1.52695 12.5 0H11.5C11.5002 1.52683 11.3252 3.03875 10.7411 4.44942C10.1569 5.86009 9.30065 7.14188 8.2211 8.22159C7.14154 9.3013 5.85988 10.1578 4.44929 10.7421C3.03871 11.3265 1.52683 11.5 0 11.5V12.5C1.52672 12.4997 3.03855 12.6752 4.44912 13.2593C5.8597 13.8434 7.14138 14.6997 8.22096 15.7792C9.30054 16.8587 10.1569 18.1404 10.741 19.5509C11.3252 20.9615 11.5002 22.4733 11.5 24H12.5C12.4999 22.4732 12.6738 20.9613 13.2581 19.5508C13.8424 18.1402 14.6988 16.8585 15.7785 15.779C16.8582 14.6994 18.14 13.8432 19.5506 13.2591C20.9613 12.6751 22.4732 12.4996 24 12.5V11.5Z" fill="currentColor" />
            </svg>
            <span className="font-display font-medium text-lg tracking-tight text-black dark:text-white">
              WONDER MAKERS
            </span>
          </a>

          {/* Links (Desktop) */}
          <ul className="hidden md:flex items-center gap-10">
            {navLinks.map((link, idx) => (
              <li key={idx} className="overflow-hidden h-6 relative group">
                <a 
                  href={link.href}
                  className="block font-sans text-sm font-medium tracking-wide text-neutral-500 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-transform duration-300 group-hover:-translate-y-full interactive-hover"
                >
                  {link.label}
                </a>
                <a 
                  href={link.href}
                  className="block font-sans text-sm font-medium tracking-wide text-lime-600 dark:text-neon absolute top-full left-0 transition-transform duration-300 group-hover:-translate-y-full"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Controls & CTA */}
          <div className="hidden md:flex items-center gap-6">
            {/* Theme Toggle Switch */}
            <div className="relative w-36 h-9 bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-full flex p-1 select-none">
              <button 
                onClick={() => toggleTheme('light')} 
                className={`relative z-10 w-1/2 text-xs font-medium tracking-wide flex items-center justify-center rounded-full transition-colors duration-300 interactive-hover ${
                  !isDark ? 'text-black font-semibold' : 'text-neutral-500'
                }`}
              >
                Light
              </button>
              <button 
                onClick={() => toggleTheme('dark')} 
                className={`relative z-10 w-1/2 text-xs font-medium tracking-wide flex items-center justify-center rounded-full transition-colors duration-300 interactive-hover ${
                  isDark ? 'text-black dark:text-black font-semibold' : 'text-neutral-500'
                }`}
              >
                Dark
              </button>
              {/* Slider background pill */}
              <div 
                className={`absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] bg-white dark:bg-neon rounded-full transition-transform duration-300 ease-out-quart ${
                  isDark ? 'translate-x-[calc(100%+2px)]' : 'translate-x-0'
                }`}
              />
            </div>

            {/* Let's Talk CTA (Magnetic) */}
            <div ref={contactBtnRef} className="will-change-transform">
              <button className="h-10 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-full px-6 flex items-center gap-2 group/btn font-sans text-sm font-medium transition-all duration-300 border border-black/10 dark:border-white/10 interactive-hover shadow-md">
                <span ref={contactTextRef} className="block transition-transform duration-300">
                  Let's talk
                </span>
                <span className="w-5 h-5 bg-neon rounded-full flex items-center justify-center text-black">
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-4">
            <button 
              onClick={() => toggleTheme(isDark ? 'light' : 'dark')}
              className="text-xs border border-neutral-300 dark:border-white/10 rounded-full px-3 py-1 bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white active:scale-95 transition-transform"
            >
              {isDark ? 'Light' : 'Dark'}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-black dark:text-white border border-neutral-300 dark:border-white/10 rounded-full bg-neutral-100 dark:bg-neutral-900 active:scale-95 transition-transform"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[99] bg-neutral-950 flex flex-col justify-between p-8 transition-transform duration-700 ease-in-out-quart md:hidden ${
          mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex justify-between items-center">
          <span className="font-display font-medium text-lg text-white tracking-tight">WONDER MAKERS</span>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 border border-white/10 rounded-full text-white bg-white/5 active:scale-95 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ul className="flex flex-col gap-8 my-auto">
          {navLinks.map((link, idx) => (
            <li key={idx} className="overflow-hidden">
              <a 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-4xl font-display font-bold text-neutral-400 hover:text-white transition-all uppercase tracking-tighter"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-6">
          <button className="w-full h-12 bg-white text-black rounded-full font-sans text-sm font-semibold flex items-center justify-center gap-2">
            <span>Let's talk</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <div className="text-center text-xs text-white/30 tracking-[0.2em]">
            © {new Date().getFullYear()} WONDER MAKERS DIGITAL
          </div>
        </div>
      </div>
    </>
  );
}
