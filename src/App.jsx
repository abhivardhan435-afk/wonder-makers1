import React, { useState, useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import Loader from './components/Loader';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import ThreeDBackground from './components/ThreeDBackground';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import AuthOverlay from './components/AuthOverlay';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [isServicesPage, setIsServicesPage] = useState(window.location.hash === '#/services');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
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

  // Handle hash change routing
  useEffect(() => {
    const handleHashChange = () => {
      const isServices = window.location.hash === '#/services';
      setIsServicesPage(isServices);

      const hash = window.location.hash;
      if (hash && hash !== '#/services' && hash.startsWith('#')) {
        // Wait briefly for the Home component to render before scrolling to anchor
        setTimeout(() => {
          const id = hash.substring(1);
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 120);
      } else {
        // Scroll to top for page changes
        window.scrollTo({ top: 0, behavior: 'instant' });
        // Force Lenis to scroll to top as well
        lenisRef.current?.lenis?.scrollTo(0, { immediate: true });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Check initial hash
    if (window.location.hash && window.location.hash !== '#/services') {
      // Trigger scroll scroll check on mount
      setTimeout(handleHashChange, 300);
    }
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

        {/* Fixed 3D Wireframe Shape Layer */}
        <ThreeDBackground />

        {/* Dynamic Navbar */}
        <Navbar 
          isLoaded={isLoaded} 
          onLoginClick={() => { setIsAuthOpen(true); setAuthTab('login'); }}
          onSignUpClick={() => { setIsAuthOpen(true); setAuthTab('signup'); }}
        />

        {/* Page Routing */}
        {isServicesPage ? (
          <ServicesPage isLoaded={isLoaded} />
        ) : (
          <Home isLoaded={isLoaded} />
        )}

        {/* Auth Slide-over Cover Panel */}
        <AuthOverlay 
          isOpen={isAuthOpen} 
          activeTab={authTab}
          onClose={() => setIsAuthOpen(false)}
          onTabChange={(tab) => setAuthTab(tab)}
        />
      </div>
    </ReactLenis>
  );
}

export default App;
