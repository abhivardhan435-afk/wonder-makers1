import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Work from '../components/Work';

export default function Home({ isLoaded }) {
  return (
    <div className="relative min-h-screen w-full transition-theme bg-transparent">
      {/* Interactive Main Sections */}
      <main className="relative z-10">
        {/* Section 1: Hero */}
        <Hero isLoaded={isLoaded} />
        
        {/* Section 2: Credentials Showcase */}
        <About />

        {/* Section 3: Services Showcase */}
        <Services />

        {/* Section 4: Work Showcase */}
        <Work />
      </main>

      {/* Footer (Simple branding details matching luxury theme) */}
      <footer className="relative z-10 w-full py-16 px-6 md:px-12 border-t border-black/5 dark:border-white/5 bg-neutral-100 dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="font-display font-semibold text-lg text-black dark:text-white tracking-tight">WONDER MAKERS DIGITAL</span>
            <span className="text-xs">Crafting elite interfaces with premium interactions.</span>
          </div>
          <div className="flex gap-6 text-xs font-medium tracking-wide">
            <a href="#" className="hover:text-neon transition-colors interactive-hover">Privacy</a>
            <a href="#" className="hover:text-neon transition-colors interactive-hover">Terms</a>
            <a href="#" className="hover:text-neon transition-colors interactive-hover">Awwwards</a>
          </div>
          <div className="text-xs tracking-[0.2em]">
            © {new Date().getFullYear()} WONDER MAKERS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
