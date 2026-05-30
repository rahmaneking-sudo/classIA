import React from 'react';

const VideoBackground = () => {
  // We use a high quality Cyberpunk City loop from YouTube
  // Using an iframe with autoplay, mute, loop, and no controls
  // The CSS ensures it covers the entire screen (object-cover equivalent for iframe)
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black pointer-events-none">
      <div className="relative w-full h-full pb-[56.25%] sm:pb-[56.25%] min-h-screen">
        <iframe
          // 'b3_lVSrPB6w' is a stunning 4K futuristic flying cars city loop
          // '4xDzrXjMMiI' or 'lXpEwKuT_pE' are also great alternatives
          src="https://www.youtube.com/embed/lXpEwKuT_pE?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=lXpEwKuT_pE&modestbranding=1&playsinline=1"
          title="Cyberpunk City Background"
          className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Overlays to blend the video with the site theme and text */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-[#050508]/60" />
      
      {/* A subtle blue/purple tint overlay to match CLASSE IA branding */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-neon-blue)]/10 to-[var(--color-neon-purple)]/10 mix-blend-overlay" />
      
      {/* Dark overlay specifically for text readability */}
      <div className="absolute inset-0 bg-[#050508]/40" />
    </div>
  );
};

export default VideoBackground;
