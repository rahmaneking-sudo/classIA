import React from 'react';

const CinematicBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-[-1] overflow-hidden bg-[#0a0a10]">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat animate-slow-zoom"
        style={{
          backgroundImage: `url('/cinematic_desert.png')`,
          filter: 'brightness(0.85) contrast(1.1)'
        }}
      />
      {/* Léger overlay pour s'assurer que le texte ne soit pas illisible aux endroits très clairs */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#0a0a10]/40 via-transparent to-[#0a0a10]/80" />
    </div>
  );
};

export default CinematicBackground;
