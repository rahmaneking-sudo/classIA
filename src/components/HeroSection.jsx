import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import dakarSkyline from '../assets/dakar_skyline.png';

// Custom typewriter hook
const useTypewriter = (text, speed = 120, delay = 0) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let timeout;
    let i = 0;
    
    const typeWriter = () => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        timeout = setTimeout(typeWriter, speed);
      }
    };
    
    const startTimeout = setTimeout(typeWriter, delay);
    return () => {
      clearTimeout(timeout);
      clearTimeout(startTimeout);
    };
  }, [text, speed, delay]);
  
  return displayedText;
};

const HeroSection = () => {
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollRef = useRef(null);

  const titleText = "CLASSE IA";
  const typedTitle = useTypewriter(titleText, 150, 800);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.2 });
    
    tl.fromTo(subtitleRef.current, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    )
    .fromTo(ctaRef.current, 
      { opacity: 0, y: 30, scale: 0.95 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
      "-=0.4"
    )
    .fromTo(scrollRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 },
      "-=0.2"
    );

    // Bouncing scroll indicator
    gsap.to(scrollRef.current, {
      y: 15,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      delay: 4
    });
  }, []);

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Dakar Skyline Background */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${dakarSkyline})`,
          transform: 'scale(1.05)',
        }}
      />
      
      {/* Light cinematic overlays - just enough for text readability */}
      <div className="absolute inset-0 bg-[#020205]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020205]/80 via-transparent to-[#020205]/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020205]/30 via-transparent to-[#020205]/30" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-block mb-6 px-5 py-2 rounded-full border border-[var(--color-neon-blue)]/30 bg-[var(--color-neon-blue)]/5 backdrop-blur-md">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-neon-blue)]">
            🚀 Formation IA · Vibe Coding · Afrofuturisme
          </span>
        </div>
        
        {/* Typed Title */}
        <h1 
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-8 tracking-widest text-white leading-none drop-shadow-[0_0_40px_rgba(0,212,255,0.6)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {typedTitle.includes('IA') 
            ? <>{typedTitle.replace('IA', '')}<span className="text-[var(--color-neon-blue)]">IA</span></>
            : typedTitle
          }
          <span className="inline-block w-[5px] h-[0.8em] bg-[var(--color-neon-purple)] ml-3 animate-pulse align-middle" />
        </h1>
        
        {/* Subtitle */}
        <p 
          ref={subtitleRef}
          className="opacity-0 text-lg sm:text-xl md:text-2xl text-gray-200 font-light mb-14 max-w-3xl mx-auto leading-relaxed"
        >
          Découvre l'univers de l'Intelligence Artificielle. Maîtrise les outils de demain et transforme ta carrière avec les formations les plus avancées d'Afrique.
        </p>
        
        {/* CTA Buttons */}
        <div ref={ctaRef} className="opacity-0 flex flex-wrap justify-center gap-6">
          <button className="btn-sci-fi px-10 py-5 rounded-lg bg-[var(--color-neon-blue)]/15 text-white font-bold tracking-widest text-sm uppercase border-2 border-[var(--color-neon-blue)] hover:bg-[var(--color-neon-blue)]/25 hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-all duration-300">
            Commencer maintenant
          </button>
          <button className="px-10 py-5 rounded-lg text-gray-300 font-bold tracking-widest text-sm uppercase border border-white/20 hover:text-[var(--color-neon-purple)] hover:border-[var(--color-neon-purple)]/50 hover:shadow-[0_0_20px_rgba(123,47,247,0.3)] transition-all duration-300">
            Voir le programme
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div ref={scrollRef} className="opacity-0 absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-neon-blue)]">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-[var(--color-neon-blue)]/50 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-[var(--color-neon-blue)] animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
