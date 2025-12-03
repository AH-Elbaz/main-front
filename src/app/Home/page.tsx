"use client";

import NavBar from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState, useCallback, memo } from "react";
import { useScrollPosition } from "@/app/features/auth/hooks/useScrollPosition";

export default function Home() {
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [showThankYou, setShowThankYou] = useState(false);
    const [userRegion, setUserRegion] = useState("United States");
    const scrollY = useScrollPosition();

    // Optimized region detection with cleanup
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        
        const detectRegion = async () => {
            try {
                const res = await fetch('https://ipapi.co/json/', {
                    signal: controller.signal,
                });
                const data = await res.json();
                if (isMounted && data.country_name) {
                    setUserRegion(data.country_name);
                }
            } catch {
                // Silently fail - default region is already set
                if (isMounted) {
                    console.warn('Region detection failed, using default');
                }
            }
        };

        detectRegion();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    // Memoized newsletter submit handler
    const handleNewsletterSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (newsletterEmail) {
            setShowThankYou(true);
            setTimeout(() => {
                setShowThankYou(false);
                setNewsletterEmail("");
            }, 1000);
        }
    }, [newsletterEmail]);

    // --- Helper Components for the New Section ---
    
    // Play Icon (White circle with black triangle) - Memoized
    const PlayIcon = memo(() => (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                <svg className="w-4 h-4 md:w-7 md:h-7 text-black translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>
        </div>
    ));
    PlayIcon.displayName = 'PlayIcon';

    // Plus Icon (Adapts to theme: light/dark) - Memoized
    const PlusIcon = memo(({ theme = "dark" }: { theme?: "light" | "dark" }) => (
        <button 
            className={`absolute bottom-3 right-3 md:bottom-5 md:right-5 w-6 h-6 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105 ${
                theme === "dark" ? "bg-black text-white" : "bg-white text-black"
            }`}
            aria-label="Learn more"
        >
            <svg className="w-3 h-3 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        </button>
    ));
    PlusIcon.displayName = 'PlusIcon';

    return (
        <div className="bg-black text-white selection:bg-[#CCFF00] selection:text-black overflow-x-hidden">
            {/* Accessibility Skip Link */}
            <a 
                href="#main-content" 
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] bg-[#CCFF00] text-black px-6 py-3 rounded-full text-sm font-bold shadow-2xl focus-ring"
            >
                Skip to main content
            </a>
            
            <NavBar />
            
            {/* Hero Section - completely static, unaffected by scroll */}
            <div className="relative w-full min-h-screen z-0">
                <div className="absolute inset-0 z-0">
                    {/* Mobile background image */}
                    <Image 
                        src="https://cdn.jsdelivr.net/gh/AH-Elbaz/Front-assets@main/heroM2.png" 
                        alt="Hero mobile background" 
                        fill 
                        priority 
                        quality={90}
                        sizes="100vw"
                        className="w-full h-full object-cover block md:hidden" 
                        draggable={false} 
                    />
                    {/* Desktop/Tablet background image */}
                    <Image 
                        src="https://cdn.jsdelivr.net/gh/AH-Elbaz/Front-assets@main/herooo2.png" 
                        alt="Hero background" 
                        fill 
                        priority 
                        quality={90}
                        sizes="100vw"
                        className="w-full h-full object-cover hidden md:block" 
                        draggable={false} 
                    />
                </div>
                
                {/* Hero Content - stays in place */}
                <div className="relative z-40 flex flex-col items-start justify-center h-full min-h-screen pt-24 md:pt-28 px-6 md:px-12 lg:px-20 text-left">
                    <div className="max-w-1xl">
                        {/* Added marketing headline per request */}
                        <div className="relative">
                            <div className="absolute -inset-10 bg-[#CCFF00] blur-[120px] opacity-0 rounded-full" />
                            <h1
                                className="text-white mb-6 w-full animate-fadeIn relative z-10"
                                style={{
                                    fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                                    lineHeight: '1.1',
                                    letterSpacing: '-0.03em',
                                    maxWidth: 'min(2000px, 92vw)',
                                    overflowWrap: 'break-word',
                                    wordBreak: 'normal',
                                    fontWeight: 400
                                }}
                            >
                                Understand your health from the inside
                            </h1>
                        </div>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-white/95 leading-tight max-w-3xl">
                            From raw signals to certainty.
                        </h2>
                        <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl">
                            Transform continuous biometric streams into <strong className="text-white">actionable readiness intelligence</strong> for coaches and elite athletes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-8">
                            <Link
                                href="/signup"
                                className="btn-primary inline-flex items-center justify-center gap-2 group shadow-[0_10px_30px_rgba(204,255,0,0.25)]"
                            >
                                Start Free Trial
                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                          
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Main Content - slides up over hero smoothly */}
            <div 
                className="relative z-20 bg-white transition-transform duration-700 ease-out" 
                style={{ 
                    transform: `translateY(-${Math.min(scrollY * 0.8, 400)}px)`,
                    willChange: 'transform'
                }}
            >
                
                {/* Content Container */}
                <div id="main-content" className="bg-white pb-0 relative z-20" role="main">
                  
                    <section className="pt-6 md:pt-10 pb-20 md:pb-32 bg-white relative overflow-hidden" aria-labelledby="metrics-heading">
                        <div className="max-w-[980px] mx-auto px-6 md:px-8">
                            
                            {/* First Content Block */}
                            <div className="mb-16 md:mb-24">
                                {/* Heading */}
                                <h2 id="metrics-heading" className="text-[44px] md:text-[56px] lg:text-[64px] font-medium text-black leading-[1.08] tracking-[-0.009em] mb-6">
                                    Track your vitals in real-time, optimize your performance
                                </h2>
                                
                                {/* Subheading */}
                                <p className="text-[19px] md:text-[21px] text-[#1d1d1f] leading-[1.381] tracking-[0.011em] font-normal max-w-[600px] mb-8">
                                    Daily VitaLink monitoring is linked to improved recovery scores, enhanced sleep quality, and over 15% better performance metrics. Members achieve their goals faster with data-driven insights.*
                                </p>
                                
                                {/* Additional descriptive content */}
                                <div className="grid md:grid-cols-2 gap-8 mb-12">
                                    <div>
                                        <h3 className="text-[24px] md:text-[28px] font-semibold text-black mb-4">What AI Means to Us</h3>
                                        <p className="text-[17px] text-[#1d1d1f] leading-[1.47] mb-4">
                                            At VitaLink, artificial intelligence isn&apos;t just a buzzword—it&apos;s the foundation of everything we do. Our advanced machine learning algorithms analyze millions of data points from your body&apos;s signals, transforming raw biometric data into actionable intelligence.
                                        </p>
                                        <p className="text-[17px] text-[#1d1d1f] leading-[1.47]">
                                            We believe AI should enhance human potential, not replace human intuition. That&apos;s why our technology works alongside coaches and athletes, providing insights that inform better decisions while respecting the expertise of the people who know their bodies best.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-[24px] md:text-[28px] font-semibold text-black mb-4">Precision Technology</h3>
                                        <p className="text-[17px] text-[#1d1d1f] leading-[1.47] mb-4">
                                            Our proprietary sensors capture heart rate variability, respiratory rate, skin temperature, and blood oxygen levels with medical-grade accuracy. Every metric is validated through rigorous testing and clinical research.
                                        </p>
                                        <p className="text-[17px] text-[#1d1d1f] leading-[1.47]">
                                            The result? A comprehensive health profile that adapts to your unique physiology, delivering personalized recommendations that evolve with your training, recovery, and lifestyle patterns.
                                        </p>
                                    </div>
                                </div>
                            </div> 
                            {/* Image with rounded corners - Full Width Design Fix */}
                            <div className="relative rounded-[15px] overflow-hidden mt-12">
                                <Image 
                                    src="https://cdn.jsdelivr.net/gh/AH-Elbaz/Front-assets@main/ph2.png" 
                                    alt="VitaLink Health Monitoring" 
                                    width={980} 
                                    height={451}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 980px, 980px"
                                    quality={85}
                                    className="w-full h-auto"
                                    priority
                                />
                            </div>
                        </div>

                        <div className="max-w-[980px] mx-auto px-6 md:px-8 mt-16">
                            {/* Second Content Block - REDESIGNED (Adidas/Nike Style) */}
                            <div className="mb-16">
                                {/* Heading */}
                                <h2 className="text-[44px] md:text-[56px] lg:text-[64px] font-medium text-black leading-[1.08] tracking-[-0.009em] mb-2">
                                    MASTER YOUR PHYSIOLOGY. TRANSCEND YOUR LIMITS.
                                </h2>
                                
                                {/* Subheading */}
                                <p className="text-[19px] md:text-[21px] text-[#1d1d1f] leading-[1.381] tracking-[0.011em] font-normal max-w-[600px] mb-8">
                                    VitaLink is the operating system for the elite athlete. We don&apos;t just track data; we transform raw biometric streams into the definitive intelligence that fuels world-class performance. Know your body&apos;s true capacity, every second of every day.
                                </p>
                                {/* Image 1: ph3.png (now the first image in the second section) - Smaller and Centered */}
                                <div className="relative mb-12 max-w-[600px]">
                                    <Image 
                                        src="https://cdn.jsdelivr.net/gh/AH-Elbaz/Front-assets@main/ph3.png" 
                                        alt="Complete Health View" 
                                        width={600} 
                                        height={300}
                                        sizes="(max-width: 768px) 100vw, 600px"
                                        quality={85}
                                        loading="lazy"
                                        className="w-full h-auto"
                                    />
                                </div>              
                                {/* Extended value proposition */}
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-[32px] md:text-[40px] font-semibold text-black mb-4">Intelligent Insights: The Future of Training</h3>
                                        <p className="text-[17px] text-[#1d1d1f] leading-[1.47] max-w-[700px]">
                                            Every champion is unique. Our proprietary AI doesn&apos;t just learn your baseline—it predicts your future. By interpreting your training load, recovery capacity, and performance goals in real-time, VitaLink delivers the precise, personalized intelligence you need to push past plateaus and avoid burnout. This is not data collection; this is predictive mastery.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image with Text Overlay */}
                        <div className="relative mt-12 -mx-6 md:-mx-8">
                            {/* Mobile Image */}
                                {/* Mobile image (no crop, full width) */}
                                <Image 
                                    src="https://cdn.jsdelivr.net/gh/AH-Elbaz/Front-assets@main/new2.png" 
                                    alt="Our Vision for the Future (Mobile)" 
                                    width={1200} 
                                    height={800}
                                    sizes="100vw"
                                    quality={85}
                                    loading="lazy"
                                        className="block md:hidden w-full h-auto object-contain"
                                />

                                {/* Desktop/Tablet image (no crop, full width) */}
                                <Image 
                                    src="https://cdn.jsdelivr.net/gh/AH-Elbaz/Front-assets@main/new.png" 
                                    alt="Our Vision for the Future (Desktop)" 
                                    width={1920} 
                                    height={1080}
                                    sizes="100vw"
                                    quality={85}
                                    loading="lazy"
                                        className="hidden md:block w-full h-auto object-contain"
                                />
                            
                            {/* Desktop/Tablet Image */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30 md:bg-none" />
                            
                            {/* Subtle overlay for readability on mobile without cropping */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 md:bg-none" />
                            
                            {/* Overlay Content */}
                            <div className="absolute inset-0 flex items-start pt-3 md:pt-8 pb-3 md:pb-6">
                                <div className="w-full mx-auto px-3 md:px-10">
                                    {/* Left and Right Content - Stack on mobile, side-by-side on desktop */}
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-3 md:gap-8">
                                        {/* Left Section */}
                                       

                                        {/* Right Section */}
                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Sports showcase */}
                    <section className="py-16 md:py-24 bg-white" aria-labelledby="recovery-heading">
                        {/* Heading container with centered layout */}
                        <div className="px-6 md:px-12 text-left mb-12 md:mb-16 max-w-[1200px] mx-auto">
                            <h3 className="text-[20px] md:text-[24px] font-semibold text-black mb-3">Sport-Specific Intelligence</h3>
                            <p className="text-[15px] md:text-[17px] text-[#1d1d1f] leading-[1.47]">
                                Our AI understands that a marathon runner&apos;s recovery needs differ from a basketball player&apos;s explosive power requirements. VitaLink&apos;s algorithms are trained on sport-specific data, delivering insights tailored to the unique demands of your discipline—whether you&apos;re tracking endurance capacity, power output, agility metrics, or tactical readiness.
                            </p>
                        </div>
                        {/* Edge-to-edge grid wrapper for images only */}
                        <div className="-mx-6 md:-mx-12">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                                {/* Running */}
                                <div>
                                    <div className="pl-12 pr-6 md:pl-20 md:pr-12 mb-2">
                                        <h3 className="text-black text-[12px] md:text-[14px] font-semibold leading-tight">Running</h3>
                                        <p className="text-[#1d1d1f] text-[12px] md:text-[13px] leading-snug">Real-time recovery to optimize every session.</p>
                                    </div>
                                    <div className="relative aspect-[3/4]">
                                        <Image
                                            src="https://cdn.jsdelivr.net/gh/AH-Elbaz/Front-assets@main/em-emc-RUNNING-hp-tc-d.jpg"
                                            alt="Running - Track your performance"
                                            fill
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            quality={80}
                                            loading="lazy"
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                {/* Basketball */}
                                <div>
                                    <div className="px-6 md:px-12 mb-2">
                                        <h3 className="text-black text-[12px] md:text-[14px] font-semibold leading-tight">Basketball</h3>
                                        <p className="text-[#1d1d1f] text-[12px] md:text-[13px] leading-snug">Explosive movement tracking and readiness for peak games.</p>
                                    </div>
                                    <div className="relative aspect-[3/4]">
                                        <Image
                                            src="https://cdn.jsdelivr.net/gh/AH-Elbaz/Front-assets@main/em-emc-BASKETBALL-hp-tc-d.jpg"
                                            alt="Basketball - Optimize your game"
                                            fill
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            quality={80}
                                            loading="lazy"
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                {/* Football */}
                                <div>
                                    <div className="pl-12 pr-6 md:pl-20 md:pr-12 mb-2">
                                        <h3 className="text-black text-[12px] md:text-[14px] font-semibold leading-tight">Football</h3>
                                        <p className="text-[#1d1d1f] text-[12px] md:text-[13px] leading-snug">Stamina, metrics, and match readiness in one place.</p>
                                    </div>
                                    <div className="relative aspect-[3/4]">
                                        <Image
                                            src="https://cdn.jsdelivr.net/gh/AH-Elbaz/Front-assets@main/em-emc-FOOTBALL-hp-tc-d.jpg"
                                            alt="Football - Enhance endurance"
                                            fill
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            quality={80}
                                            loading="lazy"
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                {/* Padel */}
                                <div>
                                    <div className="px-6 md:px-12 mb-2">
                                        <h3 className="text-black text-[12px] md:text-[14px] font-semibold leading-tight">Padel</h3>
                                        <p className="text-[#1d1d1f] text-[12px] md:text-[13px] leading-snug">Agility, reaction time, and intensity analytics for smarter play.</p>
                                    </div>
                                    <div className="relative aspect-[3/4]">
                                        <Image
                                            src="https://cdn.jsdelivr.net/gh/AH-Elbaz/Front-assets@main/em-emc-PADEL-hp-tc-d-n.jpg"
                                            alt="Padel - Improve agility"
                                            fill
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            quality={80}
                                            loading="lazy"
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                        
                    {/* Injury Prevention ROI Section */}
                    <section className="pb-0 px-6 md:px-12 bg-black" aria-labelledby="injury-heading">
                        
                    </section>
                        
                    {/* ===========================================================
                      NEW MASONRY GRID SECTION (Replaces Old Testimonials)
                      Mobile: 2 Columns | Desktop: 4 Columns
                      ===========================================================
                    */}
                    <section className="py-8 md:py-16 px-2 md:px-6 max-w-[1600px] mx-auto bg-white">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">

                            {/* --- COLUMN 1 (Stacked vertically in Mobile Left Col) --- */}
                            <div className="flex flex-col gap-2 md:gap-4">
                                
                                {/* 1. Video Card (Tall) - Ronaldo */}
                                <div className="relative w-full aspect-[9/14] rounded-[16px] md:rounded-[24px] overflow-hidden cursor-pointer group bg-black">
                                    <Image 
                                        src="/card_images/weights.jpg" 
                                        alt="Cristiano Ronaldo"
                                        fill
                                        sizes="(max-width: 1024px) 50vw, 25vw"
                                        quality={80}
                                        loading="lazy"
                                        className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <PlayIcon />
                                    <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6 text-left z-30">
                                        <h3 className="text-white font-bold text-sm md:text-2xl leading-none mb-0.5 md:mb-1">Cristiano Ronaldo</h3>
                                        <p className="text-white/80 text-[10px] md:text-sm font-medium leading-tight">Football Legend & Global Icon</p>
                                    </div>
                                </div>

                                {/* 2. Video Card (Square-ish) - Aryna */}
                                <div className="relative w-full aspect-[4/3] rounded-[16px] md:rounded-[24px] overflow-hidden cursor-pointer group bg-gray-900">
                                    <Image 
                                        src="/card_images/yoga.jpg" 
                                        alt="Aryna Sabalenka"
                                        fill
                                        sizes="(max-width: 1024px) 50vw, 25vw"
                                        quality={80}
                                        loading="lazy"
                                        className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20" />
                                    <div className="absolute bottom-3 left-3 right-8 md:bottom-6 md:left-6 md:right-16 text-left z-30">
                                        <h3 className="text-white font-bold text-sm md:text-xl leading-none mb-0.5 md:mb-1">Aryna Sabalenka</h3>
                                        <p className="text-white/80 text-[10px] md:text-xs font-medium leading-tight">World No. 1 Tennis Player</p>
                                    </div>
                                    <PlusIcon theme="light" />
                                </div>

                                {/* 3. Quote Card */}
                                <div className="relative w-full bg-[#F5F7F9] rounded-[16px] md:rounded-[24px] p-4 md:p-8 flex flex-col justify-between min-h-[160px] md:min-h-[240px]">
                                    <p className="text-black text-xs md:text-xl font-semibold leading-tight">
                                        &ldquo;VitaLink has been a huge motivator to a healthier lifestyle.&rdquo;
                                    </p>
                                    <div className="mt-4 md:mt-6">
                                        <p className="text-black font-bold text-xs md:text-sm">Ashlynn P.</p>
                                        <p className="text-gray-500 text-[10px] md:text-xs mt-0.5">VitaLink member</p>
                                    </div>
                                    <PlusIcon theme="dark" />
                                </div>
                            </div>


                            {/* --- COLUMN 2 (Stacked vertically in Mobile Right Col) --- */}
                            <div className="flex flex-col gap-2 md:gap-4">
                                
                                {/* 1. Video Card (Tall) - Stef Williams */}
                                <div className="relative w-full aspect-[9/13] rounded-[16px] md:rounded-[24px] overflow-hidden cursor-pointer group bg-black">
                                    <Image 
                                        src="/card_images/water.jpg" 
                                        alt="Stef Williams"
                                        fill
                                        sizes="(max-width: 1024px) 50vw, 25vw"
                                        quality={80}
                                        loading="lazy"
                                        className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20" />
                                    <PlayIcon />
                                    <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6 text-left z-30">
                                        <h3 className="text-white font-bold text-sm md:text-2xl leading-none mb-0.5 md:mb-1">Stef Williams</h3>
                                        <p className="text-white/80 text-[10px] md:text-sm font-medium leading-tight">Entrepreneur & Creator</p>
                                    </div>
                                </div>

                                {/* 2. Quote Card */}
                                <div className="relative w-full bg-[#F5F7F9] rounded-[16px] md:rounded-[24px] p-4 md:p-8 flex flex-col justify-between min-h-[140px] md:min-h-[220px]">
                                    <p className="text-black text-xs md:text-xl font-semibold leading-tight">
                                        &ldquo;VitaLink has helped me greatly improve my physical health.&rdquo;
                                    </p>
                                    <div className="mt-4 md:mt-6">
                                        <p className="text-black font-bold text-xs md:text-sm">Samantha R.</p>
                                        <p className="text-gray-500 text-[10px] md:text-xs mt-0.5">VitaLink member</p>
                                    </div>
                                    <PlusIcon theme="dark" />
                                </div>

                                {/* 3. Image Card (Short) - Nelly Korda */}
                                <div className="relative w-full aspect-[4/3] rounded-[16px] md:rounded-[24px] overflow-hidden cursor-pointer group bg-gray-800">
                                    <Image 
                                        src="/card_images/weights.jpg" 
                                        alt="Nelly Korda"
                                        fill
                                        sizes="(max-width: 1024px) 50vw, 25vw"
                                        quality={80}
                                        loading="lazy"
                                        className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute bottom-3 left-3 right-8 md:bottom-6 md:left-6 md:right-16 text-left z-30">
                                        <h3 className="text-white font-bold text-sm md:text-xl leading-none mb-0.5 md:mb-1">Nelly Korda</h3>
                                        <p className="text-white/80 text-[10px] md:text-xs font-medium leading-tight">Golf Icon & Champion</p>
                                    </div>
                                    <PlusIcon theme="light" />
                                </div>
                            </div>


                            {/* --- COLUMN 3 (Mobile: Stacks below Column 1) --- */}
                            <div className="flex flex-col gap-2 md:gap-4">
                                
                                {/* 1. Image Card (Landscape) - Sha Carri */}
                                <div className="relative w-full aspect-[16/11] rounded-[16px] md:rounded-[24px] overflow-hidden cursor-pointer group bg-black">
                                    <Image 
                                        src="/card_images/sleep.jpg" 
                                        alt="Sha Carri Richardson"
                                        fill
                                        sizes="(max-width: 1024px) 50vw, 25vw"
                                        quality={80}
                                        loading="lazy"
                                        className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute bottom-3 left-3 right-8 md:bottom-6 md:left-6 md:right-16 text-left z-30">
                                        <h3 className="text-white font-bold text-sm md:text-xl leading-none mb-0.5 md:mb-1">Sha&apos;Carri Richardson</h3>
                                        <p className="text-white/80 text-[10px] md:text-xs font-medium leading-tight">Track and Field Star</p>
                                    </div>
                                    <PlusIcon theme="light" />
                                </div>

                                {/* 2. Video Card (Tall) - Patrick Mahomes */}
                                <div className="relative w-full aspect-[9/14] rounded-[16px] md:rounded-[24px] overflow-hidden cursor-pointer group bg-gray-900">
                                    <Image 
                                        src="/card_images/heart.jpg" 
                                        alt="Patrick Mahomes"
                                        fill
                                        sizes="(max-width: 1024px) 50vw, 25vw"
                                        quality={80}
                                        loading="lazy"
                                        className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <PlayIcon />
                                    <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6 text-left z-30">
                                        <h3 className="text-white font-bold text-sm md:text-2xl leading-none mb-0.5 md:mb-1">Patrick Mahomes</h3>
                                        <p className="text-white/80 text-[10px] md:text-sm font-medium leading-tight">All-Star Quarterback</p>
                                    </div>
                                </div>

                                {/* 3. Image Card (Square) - Diplo */}
                                <div className="relative w-full aspect-square rounded-[16px] md:rounded-[24px] overflow-hidden cursor-pointer group bg-black">
                                    <Image 
                                        src="/card_images/yoga.jpg" 
                                        alt="Diplo"
                                        fill
                                        sizes="(max-width: 1024px) 50vw, 25vw"
                                        quality={80}
                                        loading="lazy"
                                        className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute bottom-3 left-3 right-8 md:bottom-6 md:left-6 md:right-16 text-left z-30">
                                        <h3 className="text-white font-bold text-sm md:text-xl leading-none mb-0.5 md:mb-1">Diplo</h3>
                                        <p className="text-white/80 text-[10px] md:text-xs font-medium leading-tight">World-Renown DJ</p>
                                    </div>
                                    <PlusIcon theme="light" />
                                </div>
                            </div>


                            {/* --- COLUMN 4 (Mobile: Stacks below Column 2) --- */}
                            <div className="flex flex-col gap-2 md:gap-4">
                                
                                {/* 1. Quote Card */}
                                <div className="relative w-full bg-[#F5F7F9] rounded-[16px] md:rounded-[24px] p-4 md:p-8 flex flex-col justify-between min-h-[140px] md:min-h-[200px]">
                                    <p className="text-black text-xs md:text-xl font-semibold leading-tight">
                                        &ldquo;VitaLink continues to transform my approach to health.&rdquo;
                                    </p>
                                    <div className="mt-4 md:mt-6">
                                        <p className="text-black font-bold text-xs md:text-sm">Weilynn T.</p>
                                        <p className="text-gray-500 text-[10px] md:text-xs mt-0.5">VitaLink member</p>
                                    </div>
                                    <PlusIcon theme="dark" />
                                </div>

                                {/* 2. Video Card (Tall) - Virgil Van Dijk */}
                                <div className="relative w-full aspect-[9/15] rounded-[16px] md:rounded-[24px] overflow-hidden cursor-pointer group bg-black">
                                    <Image 
                                        src="/card_images/weights.jpg" 
                                        alt="Virgil Van Dijk"
                                        fill
                                        sizes="(max-width: 1024px) 50vw, 25vw"
                                        quality={80}
                                        loading="lazy"
                                        className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <PlayIcon />
                                    <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6 text-left z-30">
                                        <h3 className="text-white font-bold text-sm md:text-2xl leading-none mb-0.5 md:mb-1">Virgil Van Dijk</h3>
                                        <p className="text-white/80 text-[10px] md:text-sm font-medium leading-tight">Global Football Star</p>
                                    </div>
                                </div>

                                {/* 3. Quote Card */}
                                <div className="relative w-full bg-[#F5F7F9] rounded-[16px] md:rounded-[24px] p-4 md:p-8 flex flex-col justify-between min-h-[140px] md:min-h-[200px]">
                                    <p className="text-black text-xs md:text-xl font-semibold leading-tight">
                                        &ldquo;Healthspan has helped me adjust my behaviors.&rdquo;
                                    </p>
                                    <div className="mt-4 md:mt-6">
                                        <p className="text-black font-bold text-xs md:text-sm">Ellie G.</p>
                                        <p className="text-gray-500 text-[10px] md:text-xs mt-0.5">VitaLink member</p>
                                    </div>
                                    <PlusIcon theme="dark" />
                                </div>
                            </div>

                        </div>
                    </section>
                    
                    {/* End of New Section */}

                    <footer className="bg-black pt-6 md:pt-8 pb-0 border-t border-white/10 relative z-20 overflow-hidden">
                        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                            {/* Product Description Section */}
                            <div className="mb-8">
                                <h3 className="text-white text-xl md:text-2xl font-bold mb-4">VITALINK</h3>
                                <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-3xl">
                                    Our mission at VitaLink is to unlock human performance and intelligence through advanced biometric monitoring. We transform continuous health data streams into actionable insights for coaches, athletes, and health-conscious individuals. With 24/7 monitoring across sleep, recovery, strain, stress, and heart health, VitaLink delivers a complete view of your wellness — empowering you to make smarter, data-driven decisions every day. Join thousands who trust VitaLink to optimize their performance and elevate their health journey.
                                </p>
                            </div>
                            {/* Footer Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12 mb-6">
                                {/* Support */}
                                <div>
                                    <h5 className="text-white font-bold text-sm mb-4">Support</h5>
                                    <ul className="space-y-3">
                                        <li><Link href="/support" className="text-gray-400 text-sm hover:text-[#CCFF00] transition-colors">Member Support</Link></li>
                                        <li><Link href="/order-status" className="text-gray-400 text-sm hover:text-[#CCFF00] transition-colors">Order Status</Link></li>
                                        <li><Link href="/login" className="text-gray-400 text-sm hover:text-[#CCFF00] transition-colors">Member Login</Link></li>
                                    </ul>
                                </div>

                                {/* Company */}
                                <div>
                                    <h5 className="text-white font-bold text-sm mb-4">Company</h5>
                                    <ul className="space-y-3">
                                        <li><Link href="/about" className="text-gray-400 text-sm hover:text-[#CCFF00] transition-colors">About</Link></li>
                                        <li><Link href="/careers" className="text-gray-400 text-sm hover:text-[#CCFF00] transition-colors">Careers</Link></li>
                                        <li><Link href="/mission" className="text-gray-400 text-sm hover:text-[#CCFF00] transition-colors">Our Mission</Link></li>
                                    </ul>
                                </div>

                                {/* Legal */}
                                <div>
                                    <h5 className="text-white font-bold text-sm mb-4">Legal</h5>
                                    <ul className="space-y-3">
                                        <li><Link href="/terms" className="text-gray-400 text-sm hover:text-[#CCFF00] transition-colors">Terms of Use</Link></li>
                                        <li><Link href="/privacy" className="text-gray-400 text-sm hover:text-[#CCFF00] transition-colors">Privacy</Link></li>
                                        <li><Link href="/security" className="text-gray-400 text-sm hover:text-[#CCFF00] transition-colors">Security</Link></li>
                                    </ul>
                                </div>

                                {/* Partner */}
                                <div>
                                    <h5 className="text-white font-bold text-sm mb-4">Partner</h5>
                                    <ul className="space-y-3">
                                        <li><Link href="/affiliate" className="text-gray-400 text-sm hover:text-[#CCFF00] transition-colors">Become an Affiliate</Link></li>
                                        <li><Link href="/developers" className="text-gray-400 text-sm hover:text-[#CCFF00] transition-colors">Developers</Link></li>
                                    </ul>
                                </div>

                                {/* Resources */}
                                <div>
                                    <h5 className="text-white font-bold text-sm mb-4">Resources</h5>
                                    <ul className="space-y-3">
                                        <li><Link href="/blog" className="text-gray-400 text-sm hover:text-[#CCFF00] transition-colors">Blog</Link></li>
                                        <li><Link href="/press" className="text-gray-400 text-sm hover:text-[#CCFF00] transition-colors">Press Center</Link></li>
                                        <li><Link href="/help" className="text-gray-400 text-sm hover:text-[#CCFF00] transition-colors">Help Center</Link></li>
                                    </ul>
                                </div>

                                {/* Connect */}
                                <div>
                                    <h5 className="text-white font-bold text-sm mb-4">Connect</h5>
                                    <ul className="space-y-3">
                                        <li><Link href="https://twitter.com" className="text-gray-400 text-sm hover:text-[#CCFF00] transition-colors">Twitter</Link></li>
                                        <li><Link href="https://instagram.com" className="text-gray-400 text-sm hover:text-[#CCFF00] transition-colors">Instagram</Link></li>
                                        <li><Link href="https://linkedin.com" className="text-gray-400 text-sm hover:text-[#CCFF00] transition-colors">LinkedIn</Link></li>
                                    </ul>
                                </div>
                            </div>

                            {/* Newsletter */}
                            <div className="border-t border-white/10 pt-6 pb-0">
                                <div className="max-w-md">
                                    <p className="text-sm text-gray-400 mb-4">Our obsession is to unlock human performance and intelligence.</p>
                                    {showThankYou ? (
                                        <div className="flex items-center gap-2 py-3">
                                            <svg className="w-5 h-5 text-[#CCFF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <p className="text-sm text-[#CCFF00] font-semibold">Thanks for subscribing!</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                                            <input 
                                                type="email" 
                                                value={newsletterEmail}
                                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                                placeholder="Enter your email" 
                                                required
                                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#CCFF00] transition-colors"
                                                suppressHydrationWarning
                                            />
                                            <button 
                                                type="submit"
                                                className="bg-[#CCFF00] text-black px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#B8E600] transition-colors"
                                                suppressHydrationWarning
                                            >
                                                Submit
                                            </button>
                                        </form>
                                    )}
                                    <p className="text-xs text-gray-500 mt-3">By signing up, I agree with the data protection policy.</p>
                                </div>
                            </div>

                            {/* Bottom */}
                            <div className="border-t border-white/10 pt-4 pb-4 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                  
                                    {/* Country/Region Selector */}
                                    <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm" suppressHydrationWarning>
                                        <span className="text-lg">🌐</span>
                                        <span>{userRegion}</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">© {new Date().getFullYear()} VITALINK. All rights reserved.</p>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}