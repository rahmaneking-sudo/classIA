import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const CinematicBackground = () => {
  const location = useLocation();

  const getBackgroundImage = (pathname) => {
    if (pathname.includes('/prompts')) return '/cinematic_desert.png';
    if (pathname.includes('/actu-ia')) return '/cinematic_city.png';
    if (pathname.includes('/boutique')) return '/cinematic_street.png';
    if (pathname.includes('/cours')) return '/courses_assets/bright_classroom.png';
    // Fallback global background
    return '/cinematic_desert.png';
  };

  const bgImage = useMemo(() => getBackgroundImage(location.pathname), [location.pathname]);

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] overflow-hidden bg-[#0a0a10]">
      <div 
        key={bgImage} // Re-trigger animation on route change
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat animate-slow-zoom"
        style={{
          backgroundImage: `url('${bgImage}')`,
          filter: 'brightness(0.9) contrast(1.1)' // Garder l'aspect lumineux
        }}
      />
      {/* Léger overlay pour s'assurer que le texte ne soit pas illisible aux endroits très clairs */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#0a0a10]/40 via-transparent to-[#0a0a10]/80" />
    </div>
  );
};

export default CinematicBackground;
