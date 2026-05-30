import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import terImage from '../assets/ter_side.png';
import brtImage from '../assets/brt_side.png';

const TransportAnimation = () => {
  const terRef = useRef(null);
  const brtRef = useRef(null);

  useEffect(() => {
    // Animate the TER flying across the screen from left to right
    gsap.fromTo(terRef.current,
      { x: '-100vw', y: 0 },
      {
        x: '100vw',
        y: -50, // slight upward angle
        duration: 12,
        ease: 'none',
        repeat: -1,
        delay: 2
      }
    );

    // Animate the BRT flying across from right to left slightly lower
    gsap.fromTo(brtRef.current,
      { x: '100vw', y: 0 },
      {
        x: '-100vw',
        y: 20,
        duration: 18,
        ease: 'none',
        repeat: -1,
        delay: 5
      }
    );
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* TER Animation */}
      <div 
        ref={terRef}
        className="absolute bottom-[30%] left-0 w-[600px] h-[200px]"
        style={{
          backgroundImage: `url(${terImage})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          // mix-blend-screen removes the black background completely!
          mixBlendMode: 'screen',
          opacity: 0.8
        }}
      />
      
      {/* BRT Animation */}
      <div 
        ref={brtRef}
        className="absolute bottom-[15%] left-0 w-[500px] h-[180px]"
        style={{
          backgroundImage: `url(${brtImage})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          mixBlendMode: 'screen',
          opacity: 0.9,
          // Flip the image horizontally since it's going right to left
          transform: 'scaleX(-1)'
        }}
      />
    </div>
  );
};

export default TransportAnimation;
