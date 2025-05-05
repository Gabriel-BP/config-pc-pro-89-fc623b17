
import React, { useEffect, useRef } from 'react';

const InteractiveBackground: React.FC = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create circuit-like particles
    if (particlesRef.current) {
      const particleCount = 40;
      particlesRef.current.innerHTML = '';
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 6 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 30 + 10;
        const delay = Math.random() * 5;
        
        particle.className = 'absolute rounded-full opacity-60 z-0';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite alternate`;
        
        // Randomly assign a tech-themed color
        const colors = ['#64ffda', '#1eaedb', '#7E69AB', '#9b87f5'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = randomColor;
        
        particlesRef.current.appendChild(particle);
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!backgroundRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Calculate relative position (0 to 1)
      const relativeX = clientX / innerWidth;
      const relativeY = clientY / innerHeight;

      // Create a softer parallax effect with smaller movement range
      const moveX = relativeX * 12 - 6; // -6 to 6
      const moveY = relativeY * 12 - 6; // -6 to 6

      // Update gradient position with tech-themed colors
      backgroundRef.current.style.background = `
        radial-gradient(
          circle at ${clientX}px ${clientY}px,
          rgba(99, 102, 241, 0.2) 0%,
          rgba(99, 102, 241, 0.1) 20%,
          transparent 60%
        ),
        linear-gradient(135deg, #1A1F2C 0%, #0f1117 100%)
      `;

      // Apply transform with scale to prevent white borders
      backgroundRef.current.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div
        ref={backgroundRef}
        className="fixed inset-0 transition-transform duration-200 ease-out"
        style={{ 
          background: 'linear-gradient(135deg, #1A1F2C 0%, #0f1117 100%)',
          // Add initial scale to prevent white borders
          transform: 'scale(1.05)'
        }}
      />
      
      {/* Circuit board grid lines */}
      <div className="fixed inset-0 z-[1] opacity-10" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #9b87f5 1px, transparent 1px),
            linear-gradient(to bottom, #9b87f5 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Floating particles */}
      <div ref={particlesRef} className="fixed inset-0 z-[1] overflow-hidden" />
      
      {/* Tech circles */}
      <div className="fixed top-20 left-20 w-60 h-60 rounded-full bg-purple-500/5 blur-3xl animate-pulse z-0" />
      <div className="fixed bottom-20 right-20 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl animate-pulse z-0" />
    </>
  );
};

export default InteractiveBackground;
