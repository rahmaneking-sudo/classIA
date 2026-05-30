import React, { useState, useEffect } from 'react';
import dakarImage from '../assets/dakar_cyberpunk.png';
import transportImage from '../assets/ter_brt_future.png';
import planeImage from '../assets/air_senegal_space.png';

const images = [dakarImage, transportImage, planeImage];

const CyberCity = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Rotate images every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // max 20px shift
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#050508]">
      {images.map((img, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={img}
            className={`absolute inset-0 w-full h-full transition-opacity duration-[3000ms] ease-in-out ${
              isActive ? 'opacity-60' : 'opacity-0'
            }`}
            style={{
              transform: `scale(1.05) translate(${isActive ? mousePos.x : 0}px, ${isActive ? mousePos.y : 0}px)`,
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        );
      })}
      
      {/* Gradients to blend the edges and text */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-[#050508]/50" />
      <div className="absolute inset-0 bg-[#00d4ff]/5 mix-blend-overlay" />
    </div>
  );
};

export default CyberCity;
