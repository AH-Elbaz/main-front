'use client';

import React from 'react';
import Image from 'next/image';

interface FeatureCardProps {
  imageSrc: string;
  title: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ imageSrc, title }) => {
  return (
    <div className="relative w-80 h-96 rounded-3xl overflow-hidden group cursor-pointer flex-shrink-0 transition-all duration-500 ease-out transform hover:scale-[1.02] shadow-xl hover:shadow-2xl">
      {/* Image */}
      <Image 
        src={imageSrc} 
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 320px"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
          <h3 className="text-white text-2xl font-bold leading-tight mb-4 max-w-[280px]">
            {title}
          </h3>
          
          {/* Action Button */}
          <button 
            className="inline-flex items-center gap-2 text-[#CCFF00] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0"
            aria-label={`Learn more about ${title}`}
          >
            Learn More
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
        
        {/* Corner Icon */}
        <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-60 group-hover:opacity-100 group-hover:bg-[#CCFF00]/20 transition-all duration-500">
          <svg className="w-5 h-5 text-white group-hover:text-[#CCFF00] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 border-2 border-[#CCFF00]/30 rounded-3xl" />
      </div>
    </div>
  );
};

export default FeatureCard;