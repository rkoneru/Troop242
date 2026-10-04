import { useMemo } from 'react';

/**
 * ConstellationBackground renders floating constellation dots for hero/background sections.
 * Optimization:
 * Memoizes the 60 dot positions/properties using useMemo([]) instead of using state + useEffect.
 * This eliminates the double-render (mount + state dispatch) and prevents re-generating random
 * dot positions on parent component re-renders.
 */
export default function ConstellationBackground() {
  const dots = useMemo(() => {
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
    return newDots;
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
