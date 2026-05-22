import React, { useState, useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import Loader from './components/Loader';
import Cursor from './components/Cursor';
import Home from './pages/Home';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const lenisRef = useRef(null);

  // Sync Lenis scroll raf with GSAP ticker for ultra-smooth ScrollTrigger updates
  useGSAP(() => {
    if (!isLoaded) return;
    
    const updateRaf = (time) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(updateRaf);
    return () => gsap.ticker.remove(updateRaf);
  }, [isLoaded]);

  const handleLoadingComplete = () => {
    setIsLoaded(true);
    // Unmount loader after exit animation completes
    setTimeout(() => {
      setShowLoader(false);
    }, 1200); // matches loader slide-out duration
  };

  return (
    <ReactLenis 
      root 
      ref={lenisRef}
      options={{ 
        duration: 1.2, 
        lerp: 0.08,
        smoothTouch: false,
        syncTouch: false
      }}
    >
      <div className="relative min-h-screen select-none">
        {/* Custom Film Grain Overlay */}
        <div className="noise-overlay" />

        {/* Custom Mouse Cursor */}
        <Cursor />

        {/* Fullscreen Preloader */}
        {showLoader && (
          <Loader onComplete={handleLoadingComplete} />
        )}

        {/* Home Page Content */}
        <Home isLoaded={isLoaded} />
      </div>
    </ReactLenis>
  );
}

export default App;
