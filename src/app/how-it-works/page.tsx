"use client";
import NavBar from "@/components/navbar";
import Link from "next/link";
import React from "react";
import { ArrowRight, Brain, HeartPulse, Target, Zap } from 'lucide-react';
import Footer from "@/components/ui/footer";
// --- Data for the 4 Steps ---
const steps = [
  {
    icon: HeartPulse,
    headline: "COLLECT & SYNCHRONIZE",
    description: "Real-time biometric and environmental data is seamlessly streamed from your wearables and sensors into the secure VitaLink network.",
    color: 'var(--color-lime)',
  },
  {
    icon: Brain,
    headline: "ANALYZE & MODEL",
    description: "The proprietary V.L. AI core processes billions of data points to build a predictive digital twin of your current physical state.",
    color: 'var(--color-lime)',
  },
  {
    icon: Target,
    headline: "INSIGHT & ADVICE",
    description: "You receive immediate, hyper-personalized insights—including precise recovery windows and optimal training intensity.",
    color: 'var(--color-lime)',
  },
  {
    icon: Zap,
    headline: "PERFORM & ADAPT",
    description: "Implement the V.L. directives, and the system instantly incorporates the new results, initiating a more refined optimization loop.",
    color: 'var(--color-lime)',
  },
];

// --- Step Card Component ---
const StepCard = ({
  icon: Icon,
  headline,
  description,
  color,
  index,
  isLast,
}: {
  icon: React.ComponentType<{ size?: number }>;
  headline: string;
  description: string;
  color: string;
  index: number;
  isLast: boolean;
}) => (
  <div
    className={`relative flex flex-col items-center text-center p-6 sm:p-8 rounded-xl transition-all duration-500 w-full md:w-1/5 group transform-gpu hover:shadow-[0_0_50px_rgba(204,255,0,0.3)]`}
    style={{
      backgroundColor: 'var(--color-dark-card)',
      border: `1px solid var(--color-border-medium)`,
    }}
  >
    {/* Icon & Glow */}
    <div
      className={`p-5 rounded-full mb-6 relative`}
      style={{
        color: color,
        border: `2px solid ${color}`,
        boxShadow: `0 0 15px ${color}`,
      }}
    >
      <Icon size={32} />
      {/* Subtle inner glow effect */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: `${color}1A` }}
      ></div>
    </div>

    {/* Content */}
    <h3
      className="text-xl font-bold mb-3 tracking-widest"
      style={{ color: 'var(--color-text-primary)' }}
    >
      {index + 1}. {headline}
    </h3>
    <p
      className="text-base leading-relaxed"
      style={{ color: 'var(--color-text-secondary)' }}
    >
      {description}
    </p>

    {/* Connecting Arrow/Line (Hidden on last card for the flow) */}
    {!isLast && (
      <div
        className="
          absolute top-1/2 right-[-10%]
          hidden md:flex
          items-center justify-center
          transform -translate-y-1/2
          w-[20%] h-[2px]
        "
      >
        <div
          className="w-full h-[2px] bg-gradient-to-r from-transparent to-[var(--color-lime)] opacity-50 group-hover:opacity-100 transition-all duration-300 animate-line-pulse"
        ></div>
        <ArrowRight
          size={32}
          className="ml-2 text-[var(--color-lime)] opacity-70 group-hover:opacity-100 transition-all duration-300 animate-arrow-move"
        />
      </div>
    )}
  </div>
);

export default function HowItWorks() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--color-dark-bg)',
        color: 'var(--color-text-primary)',
      }}
    >
      {/* Navigation Bar */}
      <NavBar />

      {/* --- Main How It Works Header --- */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-7 relative overflow-hidden text-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{
              background: `radial-gradient(circle, var(--color-lime)20, transparent 70%)`,
              filter: 'blur(150px)',
              animation: 'float 10s ease-in-out infinite',
            }}
          ></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
          <h1
            className="mb-8 font-extralight"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.03em',
            }}
          >
            THE ENGINE OF{' '}
            <span
              style={{ color: 'var(--color-lime)', fontWeight: 400 }}
            >
              ELITE
            </span>{' '}
            PERFORMANCE
          </h1>
          <p
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{
              fontWeight: 400,
              color: 'var(--color-text-secondary)',
              lineHeight: '1.8',
            }}
          >
            VitaLink synthesizes bio-data and athletic telemetry into{' '}
            <span className="font-semibold text-white">
              actionable foresight
            </span>
            —a simple, four-phase cycle for continuous human optimization.
          </p>
        </div>
      </section>

      {/* --- 4-Step Flow Section --- */}
      <section className="py-10 md:py-10 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* The Data Flow Pipeline (Horizontal) */}
          {/* <div className="relative mb-20 md:mb-32 flex justify-center items-center">
            <div
              className="absolute h-1 w-full md:w-11/12 transform-gpu"
              style={{
                background: `linear-gradient(90deg, transparent, var(--color-lime) 5%, var(--color-lime) 95%, transparent)`,
                boxShadow: `0 0 10px var(--color-lime)`,
                zIndex: 0,
              }}
            >
              <div
                className="h-full bg-black relative"
                style={{
                  width: '0%',
                  animation: 'flow 4s ease-out forwards',
                  boxShadow: `0 0 20px var(--color-lime)`,
                }}
              ></div>
            </div>
          </div> */}

          {/* The Step Cards Container */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-8 justify-between">
            {steps.map((step, index) => (
              <StepCard
                key={index}
                index={index}
                icon={step.icon}
                headline={step.headline}
                description={step.description}
                color={step.color}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- Final CTA Section --- */}
      <section
        className="bg-black text-white py-20 md:py-32 border-t relative overflow-hidden"
        style={{ borderColor: 'var(--color-border-medium)' }}
      >
        <div className="max-w-4xl mx-auto text-center px-6 md:px-12 relative z-10">
          <h2
            className="text-4xl md:text-6xl font-bold mb-8 leading-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Ready to{' '}
            <span
              className="font-extrabold"
              style={{ color: 'var(--color-lime)' }}
            >
              TRANSCEND
            </span>{' '}
            Your Limits?
          </h2>
          <p
            className="text-xl md:text-2xl leading-relaxed mb-12"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Stop guessing and start optimizing. Get the precision of the V.L. AI
            and unlock your peak performance.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-gradient-to-r from-[#CCFF00] to-[#A0FF00] text-black font-bold rounded-xl px-12 py-6 text-2xl shadow-lg hover:shadow-[0_0_40px_rgba(204,255,0,0.9)] hover:scale-110 transition-all duration-300 transform-gpu tracking-widest"
          >
            START V.L. PROTOCOL
          </Link>
        </div>
      </section>

      {/* Footer */}
     <Footer></Footer>

      {/* Custom CSS for Animations */}
      <style global jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-40px) translateX(15px);
          }
          66% {
            transform: translateY(30px) translateX(-15px);
          }
        }
        @keyframes flow {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        @keyframes line-pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scaleY(1);
          }
          50% {
            opacity: 1;
            transform: scaleY(1.2);
          }
        }
        @keyframes arrow-move {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(5px);
          }
        }
        .animate-line-pulse {
          animation: line-pulse 2s ease-in-out infinite;
        }
        .animate-arrow-move {
          animation: arrow-move 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}