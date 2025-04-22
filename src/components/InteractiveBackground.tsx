
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

      // Create parallax effect
      const moveX = relativeX * 20 - 10; // -10 to 10
      const moveY = relativeY * 20 - 10; // -10 to 10

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

      // Apply transform for subtle parallax
      backgroundRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={backgroundRef}
      className="fixed inset-0 transition-transform duration-200 ease-out"
      style={{ background: 'linear-gradient(to bottom right, #1a1f2c, #0f1117)' }}
    />
  );
};

export default InteractiveBackground;
