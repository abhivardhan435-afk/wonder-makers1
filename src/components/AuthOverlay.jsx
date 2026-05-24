import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { X, Mail, Lock, User, Eye, EyeOff, Check, ArrowRight } from 'lucide-react';

export default function AuthOverlay({ isOpen, activeTab, onClose, onTabChange }) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const backdropRef = useRef(null);
  const panelRef = useRef(null);

  // Form values
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // Handle slide-in / slide-out animation via GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isOpen) {
        gsap.timeline()
          .to(backdropRef.current, { opacity: 1, duration: 0.35, ease: 'power2.out' })
          .to(panelRef.current, { x: '0%', duration: 0.45, ease: 'power3.out' }, '<');
      } else {
        gsap.timeline()
          .to(panelRef.current, { x: '100%', duration: 0.4, ease: 'power3.in' })
          .to(backdropRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '<');
      }
    });
    return () => ctx.revert();
  }, [isOpen]);

  // Reset eye toggle on tab changes
  useEffect(() => {
    setShowPassword(false);
  }, [activeTab]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${activeTab === 'login' ? 'Logging in' : 'Signing up'} with: ${activeTab === 'login' ? loginEmail : signUpEmail}`);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex justify-end select-none ${
      isOpen ? 'pointer-events-auto' : 'pointer-events-none'
    }`}>
      {/* Backdrop overlay */}
      <div 
        ref={backdropRef}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/45 dark:bg-neutral-950/70 backdrop-blur-sm opacity-0 cursor-pointer"
      />

      {/* Sliding cover panel */}
      <div 
        ref={panelRef}
        style={{ transform: 'translateX(100%)' }}
        className="relative w-full md:w-1/2 h-full bg-white dark:bg-neutral-950 border-l border-black/5 dark:border-white/10 shadow-2xl p-8 md:p-12 flex flex-col justify-between overflow-y-auto z-10"
      >
        <div>
          {/* Header row with logo and close button */}
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-red-600 dark:text-neon">
                <path fillRule="evenodd" clipRule="evenodd" d="M24 11.5C22.4731 11.5001 20.961 11.3267 19.5503 10.7425C18.1395 10.1582 16.8577 9.30173 15.778 8.22201C14.6983 7.1423 13.8418 5.86046 13.2576 4.44972C12.6733 3.03897 12.4999 1.52695 12.5 0H11.5C11.5002 1.52683 11.3252 3.03875 10.741 4.44942C10.1569 5.86009 9.30065 7.14188 8.2211 8.22159C7.14154 9.3013 5.85988 10.1578 4.44929 10.7421C3.03871 11.3265 1.52683 11.5 0 11.5V12.5C1.52672 12.4997 3.03855 12.6752 4.44912 13.2593C5.8597 13.8434 7.14138 14.6997 8.22096 15.7792C9.30054 16.8587 10.1569 18.1404 10.741 19.5509C11.3252 20.9615 11.5002 22.4733 11.5 24H12.5C12.4999 22.4732 12.6738 20.9613 13.2581 19.5508C13.8424 18.1402 14.6988 16.8585 15.7785 15.779C16.8582 14.6994 18.14 13.8432 19.5506 13.2591C20.9613 12.6751 22.4732 12.4996 24 12.5V11.5Z" fill="currentColor" />
              </svg>
              <span className="font-display font-bold text-sm tracking-tight text-black dark:text-white uppercase">
                WONDER MAKERS
              </span>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 active:scale-90 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Intro text */}
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-black dark:text-white mb-2">
              {activeTab === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 font-sans">
              {activeTab === 'login' 
                ? 'Access your product console and project specifications.' 
                : 'Join our digital lab and collaborate on premium project scope.'
              }
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="relative w-full h-11 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full flex p-1 mb-8">
            <button 
              onClick={() => onTabChange('login')} 
              className={`relative z-10 w-1/2 text-xs font-semibold tracking-wide flex items-center justify-center rounded-full transition-colors duration-300 cursor-pointer ${
                activeTab === 'login' ? 'text-black dark:text-black' : 'text-neutral-400 dark:text-neutral-500'
              }`}
            >
              Login
            </button>
            <button 
              onClick={() => onTabChange('signup')} 
              className={`relative z-10 w-1/2 text-xs font-semibold tracking-wide flex items-center justify-center rounded-full transition-colors duration-300 cursor-pointer ${
                activeTab === 'signup' ? 'text-black dark:text-black' : 'text-neutral-400 dark:text-neutral-500'
              }`}
            >
              Sign Up
            </button>
            {/* Sliding Highlight Pill */}
            <div 
              className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white dark:bg-neon rounded-full border border-neutral-200/40 dark:border-transparent transition-transform duration-300 ease-out-quart shadow-sm ${
                activeTab === 'signup' ? 'translate-x-[calc(100%+8px)]' : 'translate-x-0'
              }`}
            />
          </div>

          {/* Authentication Forms */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {activeTab === 'signup' && (
              <div className="relative w-full">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
                  <User className="w-4 h-4" />
                </span>
                <input 
                  type="text" 
                  required
                  placeholder="Full Name" 
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-red-500 dark:focus:border-neon focus:ring-1 focus:ring-red-500 dark:focus:ring-neon text-sm text-black dark:text-white transition-all duration-300 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                />
              </div>
            )}

            <div className="relative w-full">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
                <Mail className="w-4 h-4" />
              </span>
              <input 
                type="email" 
                required
                placeholder="Email Address" 
                value={activeTab === 'login' ? loginEmail : signUpEmail}
                onChange={(e) => activeTab === 'login' ? setLoginEmail(e.target.value) : setSignUpEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-red-500 dark:focus:border-neon focus:ring-1 focus:ring-red-500 dark:focus:ring-neon text-sm text-black dark:text-white transition-all duration-300 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
              />
            </div>

            <div className="relative w-full">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
                <Lock className="w-4 h-4" />
              </span>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                placeholder="Password" 
                value={activeTab === 'login' ? loginPassword : signUpPassword}
                onChange={(e) => activeTab === 'login' ? setLoginPassword(e.target.value) : setSignUpPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-red-500 dark:focus:border-neon focus:ring-1 focus:ring-red-500 dark:focus:ring-neon text-sm text-black dark:text-white transition-all duration-300 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Checkboxes / Extras */}
            {activeTab === 'login' ? (
              <div className="flex justify-between items-center text-xs mt-1">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    rememberMe 
                      ? 'bg-red-600 border-red-600 dark:bg-neon dark:border-neon text-white dark:text-black' 
                      : 'border-neutral-300 dark:border-neutral-800'
                  }`}>
                    {rememberMe && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                  </div>
                  <span>Remember me</span>
                </label>
                <a href="#/forgot-password" className="text-red-600 dark:text-neon hover:underline font-medium">
                  Forgot Password?
                </a>
              </div>
            ) : (
              <div className="flex items-start text-xs mt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                  <input 
                    type="checkbox" 
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 flex-shrink-0 transition-all ${
                    agreeTerms 
                      ? 'bg-red-600 border-red-600 dark:bg-neon dark:border-neon text-white dark:text-black' 
                      : 'border-neutral-300 dark:border-neutral-800'
                  }`}>
                    {agreeTerms && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                  </div>
                  <span className="leading-tight">
                    I agree to the <a href="#/terms" className="text-red-600 dark:text-neon hover:underline font-medium">Terms</a> and <a href="#/privacy" className="text-red-600 dark:text-neon hover:underline font-medium">Privacy Policy</a>
                  </span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-xl font-sans text-sm font-semibold flex items-center justify-center gap-2 border border-black/10 dark:border-white/10 transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-md mt-4"
            >
              <span>{activeTab === 'login' ? 'Sign In' : 'Register Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer/Branding inside overlay */}
        <div className="mt-12 text-center text-[10px] text-neutral-400 dark:text-neutral-500 font-sans tracking-wide">
          Protected by reCAPTCHA. Privacy Policy & Terms apply.
        </div>
      </div>
    </div>
  );
}
