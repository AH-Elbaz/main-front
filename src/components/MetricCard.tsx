"use client";
import React, { useRef, useEffect, useState } from "react";

export interface MetricCardData {
  caption: string;
  title: string;
  metric: string; // Raw metric e.g. "REC 61%" or "TSI 14.2"
}
interface MetricCardProps extends MetricCardData {
  center: number; // viewport center x for scaling calculations
  active?: boolean; // whether card considered in focus for additional effects
  onFocus?: () => void; // callback when card becomes focused (first time)
  reducedMotion?: boolean;
}

// Extract numeric portion for count-up animation
function parseMetric(metric: string) {
  const match = metric.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (!match) return { number: null, prefix: metric, suffix: "" };
  const number = parseFloat(match[1]);
  const start = match.index || 0;
  const end = start + match[1].length;
  return {
    number,
    prefix: metric.slice(0, start),
    suffix: metric.slice(end),
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({ caption, title, metric, center, active, onFocus, reducedMotion }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [displayNumber, setDisplayNumber] = useState<string | null>(null);
  const parsed = parseMetric(metric);
  const targetNumber = parsed.number;
  const hasAnimated = useRef(false);

  // Scaling effect
  useEffect(() => {
    if (reducedMotion) return; // respect reduced motion
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;
    const dist = Math.abs(cardCenter - center);
    const maxDist = window.innerWidth * 0.6;
    const ratio = Math.min(dist / maxDist, 1);
    const newScale = 1.15 - ratio * 0.25; // 0.9 - 1.15 range
    setScale(Number(newScale.toFixed(3)));
  }, [center, reducedMotion]);

  // Count-up animation when active
  useEffect(() => {
    if (!active || hasAnimated.current || reducedMotion || targetNumber == null) return;
    hasAnimated.current = true;
    const duration = 900; // ms
    const start = performance.now();
    const from = 0;
    const to = targetNumber;

    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const current = from + (to - from) * eased;
      setDisplayNumber(current.toFixed(to % 1 === 0 ? 0 : 1));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    if (onFocus) onFocus();
  }, [active, reducedMotion, targetNumber, onFocus]);

  return (
    <div
      ref={cardRef}
      data-card
      className="flex-shrink-0 w-[300px] md:w-[320px] lg:w-[340px] h-[420px] rounded-[2.4rem] overflow-hidden transition-transform duration-300 group cursor-pointer relative bg-white snap-start will-change-transform"
      style={{
        transform: reducedMotion ? undefined : `scale(${scale})`,
        boxShadow: scale > 1.1 ? "0 12px 40px -10px rgba(0,0,0,0.25)" : "0 4px 20px rgba(0,0,0,0.08)",
        border: scale > 1.05 ? "1px solid rgba(0,0,0,0.25)" : "1px solid rgba(0,0,0,0.08)",
      }}
      aria-label={`${title} metric card`}
    >
      <div className="relative w-full h-full p-8 flex flex-col justify-between">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.18em] leading-tight">{caption}</p>
        <h3 className="text-[26px] md:text-[30px] font-semibold text-black leading-[1.15] max-w-[92%] tracking-tight">{title}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-bold text-black tracking-tight font-mono">
            {displayNumber != null && targetNumber != null ? (
              <>
                {parsed.prefix}{displayNumber}{parsed.suffix}
              </>
            ) : (
              metric
            )}
          </span>
          <button
            className="w-11 h-11 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center text-white text-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black/40"
            aria-label={`Explore ${caption}`}
          >
            +
          </button>
        </div>
      </div>
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(204,255,0,0.25), transparent 70%)" }}
        aria-hidden="true"
      />
      {active && !reducedMotion && (
        <div className="absolute -inset-px rounded-[2.4rem] ring-2 ring-[#CCFF00]/50 animate-pulse" aria-hidden="true" />
      )}
    </div>
  );
};

export default MetricCard;
