import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface WheelCarouselProps {
  items: Array<{
    title: string;
    imageSrc: string;
    subtitle?: string;
  }>;
}

const WheelCarousel: React.FC<WheelCarouselProps> = ({ items }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Update active index on scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scrollLeft = el.scrollLeft;
        const containerWidth = el.clientWidth;
        const scrollCenter = scrollLeft + containerWidth / 2;
        
        const cards = Array.from(el.querySelectorAll('[data-card]')) as HTMLElement[];
        let closestIdx = 0;
        let closestDistance = Infinity;
        
        cards.forEach((card, idx) => {
          const cardCenter = card.offsetLeft + card.offsetWidth / 2;
          const distance = Math.abs(scrollCenter - cardCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIdx = idx;
          }
        });
        
        setActiveIndex(closestIdx);
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      el.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items.length]);

  const scrollToIndex = useCallback((index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll('[data-card]')) as HTMLElement[];
    const card = cards[index];
    if (!card) return;
    
    const containerWidth = el.clientWidth;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const scrollTo = cardCenter - containerWidth / 2;
    
    el.scrollTo({ left: scrollTo, behavior: 'smooth' });
  }, []);

  // keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') scrollToIndex(Math.min(activeIndex + 1, items.length - 1));
      if (e.key === 'ArrowLeft') scrollToIndex(Math.max(activeIndex - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, items.length, scrollToIndex]);

  if (!items || items.length === 0) return null;

  return (
    <div className="w-full">
      <div className="relative">
        {/* Carousel Container */}
        <div
          ref={containerRef}
          className="overflow-x-scroll no-scrollbar snap-x snap-mandatory scroll-smooth"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          aria-label="Feature carousel"
        >
          <div 
            className="flex items-center gap-8 py-16" 
            style={{ 
              paddingLeft: 'max(2rem, calc((100vw - 350px) / 2))', 
              paddingRight: 'max(2rem, calc((100vw - 350px) / 2))' 
            }}
          >
            {items.map((item, idx) => {
              const isActive = activeIndex === idx;
              const distance = Math.abs(activeIndex - idx);
              const scale = isActive ? 1 : Math.max(0.85, 1 - distance * 0.08);
              const opacity = isActive ? 1 : Math.max(0.4, 1 - distance * 0.25);
              
              return (
                <div
                  key={idx}
                  data-card
                  onClick={() => scrollToIndex(idx)}
                  className="snap-center shrink-0 w-[350px] h-[500px] rounded-[2rem] overflow-hidden relative cursor-pointer"
                  style={{
                    transform: `scale(${scale})`,
                    opacity: opacity,
                    transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease',
                  }}
                  aria-hidden={!isActive}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image 
                      src={item.imageSrc} 
                      alt={item.title} 
                      fill 
                      className="object-cover"
                      priority={idx < 2}
                      sizes="350px"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 p-10 flex flex-col justify-between">
                    {/* Top Section */}
                    <div>
                      <p className="text-[10px] font-bold text-white/90 uppercase tracking-[0.2em] mb-4 leading-none">
                        {item.title.split(':')[0]}
                      </p>
                      <h3 className="text-[2rem] font-bold text-white leading-[1.1] tracking-tight">
                        {item.title.split(':')[1]?.trim() || item.title}
                      </h3>
                    </div>
                    
                    {/* Bottom Section */}
                    <div className="flex items-end justify-between">
                      <div className="text-white">
                        <p className="text-[2.5rem] font-black tracking-tight leading-none">
                          {item.subtitle}
                        </p>
                      </div>
                      
                      <button
                        aria-label={`View details`}
                        className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 hover:bg-white hover:border-white text-white hover:text-black flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex items-center justify-center gap-2 mt-12">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to metric ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === activeIndex 
                  ? 'w-2 h-2 bg-black' 
                  : 'w-1.5 h-1.5 bg-gray-400 hover:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WheelCarousel;