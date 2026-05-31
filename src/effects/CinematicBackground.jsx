import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const CinematicBackground = () => {
  const location = useLocation();

  const getBackgroundImage = (pathname) => {
    if (pathname.includes('/cours')) return '/flying_car_rapide.png';
    if (pathname.includes('/prompts')) return '/bg_prompts.png';
    if (pathname.includes('/boutique')) return '/bg_boutique.png';
    if (pathname.includes('/actu-ia')) return '/bg_actu.png';
    if (pathname.includes('/creation-site') || pathname.includes('/builder')) return '/bg_builder.png';
    // No image background for other pages (to avoid pixelation)
    return null;
  };

  const bgImage = useMemo(() => getBackgroundImage(location.pathname), [location.pathname]);

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] overflow-hidden bg-[#020205]">
      {bgImage ? (
        <>
          <div 
            key={bgImage} // Re-trigger animation on route change
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat animate-slow-zoom"
            style={{
              backgroundImage: `url('${bgImage}')`,
              filter: 'brightness(1.1) contrast(1.1)' 
            }}
          />
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#0a0a10]/60 via-transparent to-[#0a0a10]/95" />
        </>
      ) : (
        // Clean, smooth CSS gradient for other pages to avoid pixelation
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1a0b2e] via-[#050508] to-[#020205]" />
          <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-[var(--color-neon-blue)]/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-[var(--color-neon-purple)]/5 blur-[120px] rounded-full pointer-events-none" />
        </div>
      )}
    </div>
  );
};

export default CinematicBackground;
