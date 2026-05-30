import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    window.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      {/* Glow effect behind the cursor */}
      <div 
        className="pointer-events-none fixed top-0 left-0 z-[9998] w-24 h-24 rounded-full bg-[var(--color-neon-blue)] opacity-20 blur-xl mix-blend-screen transition-transform duration-300 ease-out"
        style={{ transform: `translate(${position.x - 48}px, ${position.y - 48}px)` }}
      />
      {/* The actual dot */}
      <div 
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-3 h-3 rounded-full bg-white shadow-[0_0_10px_var(--color-neon-blue)] transition-transform duration-75 ease-out"
        style={{ transform: `translate(${position.x - 6}px, ${position.y - 6}px)` }}
      />
    </>
  );
};

export default CustomCursor;
