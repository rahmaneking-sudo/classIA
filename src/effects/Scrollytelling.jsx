import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

import dakarSkyline from '../assets/dakar_skyline.png';
import brtFlying from '../assets/brt_flying.png';
import saintLouis from '../assets/saint_louis_bridge.png';
import airSenegal from '../assets/air_senegal_flight.png';
import spaceStation from '../assets/space_station.png';
import abdouAvatar from '../assets/abdou_avatar.png';
import JoinModal from '../components/JoinModal';

const scenes = [
  {
    image: dakarSkyline,
    title: "CLASSE IA",
    subtitle: "Découvre l'univers de l'Intelligence Artificielle. Maîtrise les outils de demain.",
    badge: "🚀 FORMATION IA - VIBE CODING - ACTU IA ⚡",
    transitionIcon: "✈️",
  },
  {
    image: brtFlying,
    title: "BRT DU FUTUR",
    subtitle: "Le transport intelligent survole la ville",
    badge: null,
    transitionIcon: "🚄",
  },
  {
    image: saintLouis,
    title: "SAINT-LOUIS",
    subtitle: "Le TER traverse le Pont Faidherbe à la vitesse de la lumière",
    badge: null,
    transitionIcon: "🛫",
  },
  {
    image: airSenegal,
    title: "AIR SÉNÉGAL",
    subtitle: "Destination : les étoiles",
    badge: null,
    transitionIcon: "🛰️",
  },
  {
    image: spaceStation,
    title: "STATION ORBITALE",
    subtitle: "L'IA ouvre les portes de l'impossible. Rejoins CLASSE IA.",
    badge: null,
    transitionIcon: "🚀",
  },
];

const FloatingAvatar = () => {
  const handRef = useRef(null);

  useEffect(() => {
    // Reliable GSAP wave animation
    gsap.to(handRef.current, {
      rotation: 25,
      transformOrigin: "bottom right",
      duration: 0.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  return (
    <div className="absolute top-28 lg:top-36 right-8 lg:right-12 z-[40] pointer-events-none hidden md:flex flex-col items-center gap-4">
      <div className="relative w-20 h-20 lg:w-28 lg:h-28 rounded-full border-4 border-[var(--color-neon-blue)] shadow-[0_0_30px_rgba(0,212,255,0.6)] overflow-hidden animate-[float_4s_ease-in-out_infinite]">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${abdouAvatar})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020205]/40 to-transparent" />
      </div>
      
      {/* Chat Bubble below the avatar */}
      <div className="bg-[var(--color-neon-blue)]/10 backdrop-blur-md border border-[var(--color-neon-blue)]/50 px-4 py-2 rounded-2xl text-white text-sm lg:text-base font-bold shadow-[0_0_15px_rgba(0,212,255,0.3)] animate-[float_4s_ease-in-out_infinite_0.5s] flex items-center gap-2">
        <span>Hello, moi c'est Abdou !</span>
        <span ref={handRef} className="inline-block text-xl">👋</span>
      </div>
    </div>
  );
};

const CinematicSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const slideRef = useRef(null);
  const textRef = useRef(null);
  const iconRef = useRef(null);
  const progressRef = useRef(null);

  const SLIDE_DURATION = 7000;

  const animateTextIn = () => {
    if (!textRef.current) return;
    gsap.fromTo(textRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }
    );
  };

  const animateProgress = () => {
    if (!progressRef.current) return;
    gsap.fromTo(progressRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: SLIDE_DURATION / 1000, ease: 'none' }
    );
  };

  const transitionToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex((prev) => (prev + 1) % scenes.length);
        setIsTransitioning(false);
      },
    });

    // Flying icon across screen
    tl.fromTo(iconRef.current,
      { x: '-20vw', y: '10vh', opacity: 0, scale: 0.5, rotation: -10 },
      { x: '120vw', y: '-10vh', opacity: 1, scale: 1.5, rotation: 10, duration: 1.8, ease: 'power2.inOut' }
    );

    // Fade out text
    tl.to(textRef.current,
      { opacity: 0, y: -40, duration: 0.6, ease: 'power2.in' },
      0
    );

    // Zoom & fade out image
    tl.to(slideRef.current,
      { scale: 1.2, opacity: 0, duration: 1, ease: 'power2.in' },
      0.5
    );
  };

  useEffect(() => {
    if (!slideRef.current) return;

    // Animate new slide in
    const tlIn = gsap.timeline();
    // Quick fade in
    tlIn.fromTo(slideRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: 'power2.out' },
      0
    );
    // Continuous slow zoom across the entire slide duration
    tlIn.fromTo(slideRef.current,
      { scale: 1 },
      { scale: 1.15, duration: SLIDE_DURATION / 1000, ease: 'none' },
      0
    );

    animateTextIn();
    animateProgress();

    const timer = setTimeout(transitionToNext, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const scene = scenes[currentIndex];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#020205]">
      {/* Full-screen Background Image */}
      <div
        ref={slideRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${scene.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'transform, opacity',
        }}
      />

      {/* Light overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020205]/70 via-transparent to-[#020205]/20" />

      <div
        ref={iconRef}
        className="absolute top-1/2 left-0 text-8xl md:text-9xl pointer-events-none z-20 drop-shadow-[0_0_30px_rgba(0,212,255,0.8)]"
        style={{ opacity: 0 }}
      >
        {scene.transitionIcon}
      </div>

      <FloatingAvatar />

      <div ref={textRef} className="absolute inset-0 flex flex-col items-center justify-center w-full px-4 md:px-6 z-10" style={{ paddingTop: '72px' }}>
        {scene.badge && (
          <div className="mb-2 md:mb-4 px-3 py-1 md:px-5 md:py-2 rounded-full border border-[var(--color-neon-blue)]/50 bg-[var(--color-neon-blue)]/10 backdrop-blur-md shadow-[0_0_20px_rgba(0,212,255,0.2)] max-w-[92%] text-center">
            <span className="text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.08em] md:tracking-[0.15em] text-[var(--color-neon-blue)]">
              {scene.badge}
            </span>
          </div>
        )}

        {!scene.badge && (
          <p className="text-xs md:text-sm uppercase tracking-[0.5em] text-[var(--color-neon-blue)] mb-4 font-bold">
            {String(currentIndex + 1).padStart(2, '0')} / {String(scenes.length).padStart(2, '0')}
          </p>
        )}

        <h2
          className={`font-black text-white mb-2 md:mb-4 drop-shadow-[0_0_40px_rgba(0,212,255,0.6)] tracking-wider text-center ${
            currentIndex === 0
              ? 'text-4xl sm:text-6xl md:text-7xl lg:text-8xl'
              : 'text-3xl sm:text-5xl md:text-7xl'
          }`}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {currentIndex === 0
            ? <>CLASSE <span className="text-[var(--color-neon-blue)]">IA</span></>
            : scene.title
          }
        </h2>

        <p className="text-sm sm:text-base md:text-xl text-gray-200 font-light leading-relaxed text-center max-w-2xl mb-5 md:mb-7">
          {scene.subtitle}
        </p>

        <div className="flex flex-wrap justify-center gap-6 pointer-events-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-sci-fi px-8 py-4 sm:px-10 sm:py-5 rounded-lg bg-[var(--color-neon-blue)]/15 text-white font-bold tracking-widest text-sm uppercase border-2 border-[var(--color-neon-blue)] hover:bg-[var(--color-neon-blue)]/25 hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-all duration-300"
          >
            Commencer maintenant
          </button>
          <button className="px-8 py-4 sm:px-10 sm:py-5 rounded-lg text-gray-300 font-bold tracking-widest text-sm uppercase border border-white/20 hover:text-[var(--color-neon-purple)] hover:border-[var(--color-neon-purple)]/50 transition-all duration-300 backdrop-blur-sm">
            Voir le programme
          </button>
        </div>
      </div>

      <JoinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default CinematicSlideshow;
