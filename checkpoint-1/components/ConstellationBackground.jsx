import { useEffect, useState } from 'react';

export default function ConstellationBackground() {
  const [dots, setDots] = useState([]);

  useEffect(() => {
    // Generate random constellation dots
    const generateDots = () => {
      const newDots = [];
      for (let i = 0; i < 60; i++) {
        newDots.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: Math.random() * 2 + 1,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 2,
        });
      }
      setDots(newDots);
    };
    generateDots();
  }, []);

  return (
    <div className="hero-constellation">
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="constellation-dot"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            '--constellation-duration': `${dot.duration}s`,
            '--constellation-delay': `${dot.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
