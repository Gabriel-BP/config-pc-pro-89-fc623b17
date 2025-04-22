
import React, { useEffect, useRef } from 'react';

const InteractiveBackground: React.FC = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!backgroundRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Calculate relative position (0 to 1)
      const relativeX = clientX / innerWidth;
      const relativeY = clientY / innerHeight;

      // Create a softer parallax effect with smaller movement range
      const moveX = relativeX * 10 - 5; // -5 to 5 (reduced from -10 to 10)
      const moveY = relativeY * 10 - 5; // -5 to 5 (reduced from -10 to 10)

      // Update gradient position
      backgroundRef.current.style.background = `
        radial-gradient(
          circle at ${clientX}px ${clientY}px,
          rgba(99, 102, 241, 0.15) 0%,
          rgba(99, 102, 241, 0.05) 25%,
          transparent 50%
        ),
        linear-gradient(to bottom right, #1a1f2c, #0f1117)
      `;

      // Apply transform with scale to prevent white borders
      backgroundRef.current.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={backgroundRef}
      className="fixed inset-0 transition-transform duration-200 ease-out"
      style={{ 
        background: 'linear-gradient(to bottom right, #1a1f2c, #0f1117)',
        // Add initial scale to prevent white borders
        transform: 'scale(1.05)'
      }}
    />
  );
};

export default InteractiveBackground;
