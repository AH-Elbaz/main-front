'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "Technology" },
  { href: "/dashboard", label: "Performance" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 1. Refined Scroll Effect and Body Overflow Management
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Increased scroll threshold for smoother transition
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // A cleaner way to handle body overflow for mobile menu
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset'; // Cleanup on unmount
    };
  }, [isOpen]);

  return (
    <>
      <header className="fixed top-0 w-full z-50">
        {/* 2. Simplified Ambient Glow Effect (Fixed, not mouse-following) */}
        <div 
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full transition-opacity duration-500 pointer-events-none ${
            isScrolled ? 'opacity-0' : 'opacity-30'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(204,255,0,0.15) 0%, transparent 70%)',
            filter: 'blur(50px)',
            transform: 'translateZ(0)' // Hardware acceleration
          }}
        />
        
        <nav className={`relative w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/80 backdrop-blur-xl shadow-2xl border-b border-white/5' 
            : 'bg-transparent backdrop-blur-sm' // Lighter initial blur
        }`}>
          <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16">
            <div className="flex items-center justify-between h-20 md:h-24"> {/* Slightly reduced height */}
              
              {/* 3. Simplified Logo with Cleaner Hover Effect */}
              <Link href="/" className="relative group z-50">
                <div className="relative flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-extrabold tracking-[-0.04em] text-white transition-colors duration-300 group-hover:text-gray-200">
                    VITA
                  </span>
                  <span className="text-3xl md:text-4xl font-extrabold tracking-[-0.04em] bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#FFFFFF] bg-clip-text text-transparent animate-gradient">
                    LINK
                  </span>
                  {/* Cleaner, more subtle underline effect */}
                  <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#CCFF00] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              </Link>

              {/* 4. Refined Desktop Navigation - Cleaner Glass Morphism */}
              <div className="hidden lg:flex items-center gap-1.5 bg-white/5 backdrop-blur-2xl rounded-full px-1.5 py-1.5 border border-white/10 shadow-xl">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative px-5 py-2 text-sm font-medium tracking-wide transition-all duration-300 rounded-full overflow-hidden group ${
                        isActive 
                          ? "text-black shadow-md" // Added shadow for depth
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {/* Cleaner Active State Indicator (Full background) */}
                      {isActive && (
                        <span className="absolute inset-0 bg-gradient-to-br from-[#CCFF00] to-[#b8e600] rounded-full" />
                      )}
                      <span className="relative z-10">
                        {link.label}
                      </span>
                      {/* Subtle hover effect for inactive links */}
                      {!isActive && (
                        <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* 5. Refined Desktop Actions */}
              <div className="hidden lg:flex items-center gap-3">
                <Link 
                  href="/login" 
                  className="relative group px-5 py-2.5 text-sm font-medium text-white rounded-full border border-white/20 hover:border-[#CCFF00]/50 transition-all duration-300 hover:bg-white/5"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="relative group px-6 py-2.5 text-sm font-bold text-black overflow-hidden rounded-full transition-all duration-300 bg-gradient-to-br from-[#CCFF00] via-[#d4ff33] to-[#CCFF00] shadow-[0_0_20px_rgba(204,255,0,0.4)] hover:shadow-[0_0_30px_rgba(204,255,0,0.6)]" // Toned down shadow
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /> {/* Slightly thinner stroke for elegance */}
                    </svg>
                  </span>
                </Link>
              </div>

              {/* 6. Simplified Mobile Menu Button */}
              <button 
                className="lg:hidden relative p-2.5 z-50 group rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#CCFF00]/50 transition-all duration-300"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                <div className="relative w-5 h-4 flex flex-col justify-between">
                  <span className={`w-full h-[2px] bg-white rounded-full transform transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                  <span className={`w-full h-[2px] bg-white rounded-full transition-all duration-300 ${isOpen ? 'opacity-0 scale-x-0' : ''}`} />
                  <span className={`w-full h-[2px] bg-white rounded-full transform transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* 7. Refined Mobile Menu - Cleaner Transitions and Typography */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Background with a subtle, non-pulsing radial gradient */}
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(204,255,0,0.1),transparent_60%)] backdrop-blur-3xl" />
        
        {/* Menu content */}
        <div className="relative h-full flex flex-col items-center justify-center px-8 py-24">
          <div className="space-y-6 mb-10">
            {NAV_LINKS.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block text-center transition-all duration-500 ease-out ${
                    isActive 
                      ? 'text-[#CCFF00] scale-105' 
                      : 'text-white/70 hover:text-white'
                  }`}
                  style={{ 
                    // Simplified transition logic for better readability and performance
                    transitionDelay: isOpen ? `${idx * 80}ms` : '0ms',
                    transform: isOpen ? 'translateY(0)' : 'translateY(10px)',
                    opacity: isOpen ? 1 : 0,
                    fontSize: 'clamp(2.5rem, 10vw, 4rem)', // Larger, more impactful mobile typography
                    fontWeight: 900,
                    letterSpacing: '-0.03em'
                  }}
                >
                  {link.label}
                  {isActive && (
                    <div className="w-10 h-1 mx-auto mt-2 rounded-full bg-[#CCFF00]" />
                  )}
                </Link>
              );
            })}
          </div>
          
          <div className="flex flex-col items-center gap-4 w-full max-w-sm pt-8 border-t border-white/10"
               style={{ 
                 transitionDelay: isOpen ? '300ms' : '0ms',
                 opacity: isOpen ? 1 : 0,
                 transform: isOpen ? 'translateY(0)' : 'translateY(10px)',
                 transition: 'all 400ms ease-out'
               }}
          >
            <Link 
              href="/login"
              onClick={() => setIsOpen(false)} 
              className="w-full text-center px-8 py-3 text-lg font-semibold text-white border-2 border-white/30 rounded-full hover:border-[#CCFF00] hover:bg-white/10 transition-all backdrop-blur-xl"
            >
              Sign In
            </Link>
            <Link 
              href="/signup"
              onClick={() => setIsOpen(false)} 
              className="w-full text-center px-8 py-3 text-lg font-bold text-black bg-gradient-to-r from-[#CCFF00] to-[#b8e600] rounded-full shadow-[0_0_30px_rgba(204,255,0,0.5)] hover:shadow-[0_0_40px_rgba(204,255,0,0.7)] transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </>
  );
}