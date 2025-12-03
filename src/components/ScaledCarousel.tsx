'use client';

import NavBar from "@/components/navbar";
import Link from "next/link";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type FeatureCardProps = {
  title: string;
  subtitle?: string;
  content?: React.ReactNode;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ title, subtitle, content }) => {
  return (
    <div className="flex-shrink-0 w-[300px] h-[500px] rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-300 group cursor-pointer relative bg-black border border-white/10 p-8 flex flex-col justify-between">
      <div>
        <p className="text-xs font-semibold text-white/70 uppercase mb-2 tracking-wider">
          {subtitle}
        </p>

        <p className="text-4xl font-black text-white leading-tight">
          {title}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-white/80 font-mono">
          {content}
        </div>

        <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xl font-light transition-colors hover:bg-white/20">
          +
        </button>
      </div>
    </div>
  );
};

export default function Home() {

  // Scroll Logic
  const { scrollY } = useScroll();
  const dimmingOpacity = useTransform(scrollY, [0, 500], [0, 0.9]);

  // DYNAMIC DOT INDICATOR LOGIC
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const cardWidth = 300 + 24; // card width + gap
      const idx = Math.round(el.scrollLeft / cardWidth);
      setIndex(idx);
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const featureData = [
    {
      title: "Quantify how your body is feeling",
      subtitle: "Quantify how your body is feeling",
      content: "61% Recovery"
    },
    {
      title: "Extend your prime for years to come",
      subtitle: "Extend your prime for years to come",
      content: "45.8 WHOOP AGE"
    },
    {
      title: "Optimize your sleep",
      subtitle: "Optimize your sleep",
      content: "1:43 SWS (Deep)"
    },
    {
      title: "Measure the impact of every step and rep",
      subtitle: "Measure the impact of every step and rep",
      content: "14.2 Day Strain"
    },
    {
      title: "Stay connected to your heart health",
      subtitle: "Stay connected to your heart health",
      content: "HRV: 65ms"
    },
  ];

  // UPDATED: STARTS SHIFTED TO THE RIGHT
  const ScrollableContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <div
        ref={scrollRef}
        className="overflow-x-scroll snap-x snap-mandatory flex gap-6 py-4
                   pl-[40vw] pr-12 md:pl-[20vw] md:pr-12"
      >
        {children}
      </div>
    );
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-[#CCFF00] selection:text-black">
      <NavBar />

      {/* ================= HERO ================= */}
      <div className="fixed top-0 left-0 w-full h-[100vh] z-0 flex flex-col justify-center items-center">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video
            src="/home_ass/vd1.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-10"></div>
          <motion.div style={{ opacity: dimmingOpacity }} className="absolute inset-0 bg-black z-10" />
        </div>

        <div className="relative z-30 w-full max-w-[1400px] px-6 h-full flex flex-col justify-start">
          <div className="mt-[18vh] md:mt-[22vh] max-w-3xl">

            <p className="text-[#CCFF00] font-mono text-xs tracking-[0.3em] uppercase mb-4 animate-fadeIn opacity-90">
              The Backend of Human Performance
            </p>

            <div className="relative mb-6">
              <div className="absolute -inset-12 bg-[#CCFF00] blur-[120px] opacity-[0.12] rounded-full pointer-events-none"></div>

              <h1 className="relative text-[15vw] md:text-[8vw] font-black tracking-[-0.05em] leading-none text-white drop-shadow-[0_12px_25px_rgba(0,0,0,0.7)] whitespace-nowrap">
                VITALINK
              </h1>
            </div>

            <div className="space-y-5 animate-fadeIn opacity-90">
              <h3 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                Data without context is just noise.
              </h3>

              <p className="text-gray-200 text-lg md:text-xl font-light leading-relaxed">
                Vita Link focuses on the <strong>backend architecture</strong> of human performance —
                not just tracking steps, but decoding the autonomic nervous system.
              </p>

              <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl">
                Your body generates terabytes of signals every year. We process them into a
                single truth: <span className="text-white font-bold">Are you ready to perform?</span>
              </p>
            </div>

          </div>
        </div>

        <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center animate-bounce opacity-80">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#CCFF00] mb-2">Scroll</span>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10">
        <div className="h-[100vh] w-full pointer-events-none"></div>

        <div className="bg-[#0A0A0A] rounded-t-[4rem] border-t border-white/10 pb-0 shadow-[0_-50px_120px_rgba(0,0,0,1)] relative z-20 -mt-32">

          <div className="w-full flex justify-center pt-8 mb-16">
            <div className="w-20 h-1.5 bg-white/20 rounded-full"></div>
          </div>

          {/* === FEATURE CARDS === */}
          <section className="py-20 max-w-[1800px] mx-auto">
            <div className="mb-16 px-6 md:px-12">
              <h2 className="text-sm font-bold text-[#CCFF00] tracking-[0.2em] uppercase mb-4">Complete Health Picture</h2>
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">Get a complete picture of your health</h3>
              <p className="text-gray-400 text-lg max-w-2xl">
                No other wearable gives you a more comprehensive view of your health and fitness—and tells you how to improve it.
              </p>
            </div>

            <ScrollableContainer>
              {featureData.map((feature, idx) => (
                <FeatureCard
                  key={idx}
                  title={feature.title}
                  subtitle={feature.subtitle}
                  content={feature.content}
                />
              ))}
            </ScrollableContainer>

            {/* DOT INDICATOR */}
            <div className="flex justify-center space-x-2 mt-8">
              {featureData.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === index ? "bg-white" : "bg-white/50"
                  }`}
                ></div>
              ))}
            </div>

          </section>

          {/* REST OF YOUR CODE UNCHANGED (Bento sections, footer, etc.) */}
          
        </div>
      </div>
    </div>
  );
}
