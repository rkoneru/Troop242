import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import '../styles/ScoutPath.css';

const RANKS_DATA = [
  {
    name: 'Scout',
    num: 'Rank 1 of 7',
    desc: 'The gateway to Scouting. Scouts learn the Scout Oath, Scout Law, and discover what it means to be part of a patrol and troop.',
    req: 'Complete joining requirements · Learn the Scout Oath & Law · Go on a troop outing · Learn the Outdoor Code'
  },
  {
    name: 'Tenderfoot',
    num: 'Rank 2 of 7',
    desc: 'First outdoor skills take root — camping, first aid, and physical fitness — as Scouts begin building lasting patrol friendships.',
    req: '10 requirements covering camping, first aid, physical fitness, and citizenship'
  },
  {
    name: 'Second Class',
    num: 'Rank 3 of 7',
    desc: 'Scouts deepen wilderness skills including navigation, cooking, and swimming safety. Leadership in the patrol grows.',
    req: '12 requirements · First aid · Map & compass · Camp cooking · Community service'
  },
  {
    name: 'First Class',
    num: 'Rank 4 of 7',
    desc: 'A landmark achievement. First Class Scouts master core outdoor skills and begin leading fellow Scouts on adventures.',
    req: '13 requirements · Advanced first aid · 10-mile hike · Outdoor leadership · Community service'
  },
  {
    name: 'Star',
    num: 'Rank 5 of 7',
    desc: 'Leadership and merit badge excellence define the Star Scout. Scouts hold a formal leadership role and serve their community.',
    req: 'Hold a leadership position 4 months · 6 merit badges (4 Eagle-required) · 6 hrs of service'
  },
  {
    name: 'Life',
    num: 'Rank 6 of 7 — One Step Away',
    desc: 'The pinnacle before Eagle. Life Scouts demonstrate consistent dedication to service, leadership, and personal growth.',
    req: 'Hold leadership position 6 months · 11 merit badges · Active participation · 6 hrs of service'
  },
  {
    name: 'Eagle Scout',
    num: 'Rank 7 of 7 — The Summit',
    desc: 'The highest rank in all of Scouting. Earned by fewer than 4% of Scouts, this title represents exceptional character, citizenship, and leadership. It is carried for a lifetime.',
    req: '21+ merit badges · Eagle Scout Service Project · 6 months as Life Scout · Board of Review · A legacy of service'
  }
];

const BADGE_POSITIONS = [
  { x: 140, y: 420, emoji: '⚜️' },
  { x: 280, y: 365, emoji: '🎖️' },
  { x: 440, y: 320, emoji: '🗝️' },
  { x: 620, y: 275, emoji: '🛡️' },
  { x: 800, y: 230, emoji: '⭐' },
  { x: 960, y: 185, emoji: '✨' },
  { x: 1100, y: 160, emoji: '🦅' }
];

const THRESHOLDS = [0.03, 0.18, 0.32, 0.47, 0.61, 0.76, 0.93];
const TOTAL_DURATION = 16000;
const PAUSE_DURATION = 3500;

const SVG_STARS = [
  [90, 25], [195, 15], [310, 38], [425, 12], [540, 28],
  [655, 10], [775, 34], [890, 18], [1005, 40], [1065, 22]
];

// Curved path coordinates (simplified cubic bezier)
const PATH_POINTS = [
  { x: 50, y: 460 },
  { x: 220, y: 400 },
  { x: 440, y: 325 },
  { x: 680, y: 250 },
  { x: 920, y: 190 },
  { x: 1150, y: 160 }
];

// SVG path calculation (hoisted to module scope to avoid re-allocation on 60fps frame renders)
const calculatePathPoint = (progress) => {
  const t = progress;

  if (t < 0.2) {
    const s = t / 0.2;
    return {
      x: PATH_POINTS[0].x + (PATH_POINTS[1].x - PATH_POINTS[0].x) * s,
      y: PATH_POINTS[0].y + (PATH_POINTS[1].y - PATH_POINTS[0].y) * s
    };
  } else if (t < 0.4) {
    const s = (t - 0.2) / 0.2;
    return {
      x: PATH_POINTS[1].x + (PATH_POINTS[2].x - PATH_POINTS[1].x) * s,
      y: PATH_POINTS[1].y + (PATH_POINTS[2].y - PATH_POINTS[1].y) * s
    };
  } else if (t < 0.6) {
    const s = (t - 0.4) / 0.2;
    return {
      x: PATH_POINTS[2].x + (PATH_POINTS[3].x - PATH_POINTS[2].x) * s,
      y: PATH_POINTS[2].y + (PATH_POINTS[3].y - PATH_POINTS[2].y) * s
    };
  } else if (t < 0.8) {
    const s = (t - 0.6) / 0.2;
    return {
      x: PATH_POINTS[3].x + (PATH_POINTS[4].x - PATH_POINTS[3].x) * s,
      y: PATH_POINTS[3].y + (PATH_POINTS[4].y - PATH_POINTS[3].y) * s
    };
  } else {
    const s = (t - 0.8) / 0.2;
    return {
      x: PATH_POINTS[4].x + (PATH_POINTS[5].x - PATH_POINTS[4].x) * s,
      y: PATH_POINTS[4].y + (PATH_POINTS[5].y - PATH_POINTS[4].y) * s
    };
  }
};

export default function ScoutPath() {
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(Array(7).fill(false));
  const [paused, setPaused] = useState(false);
  const [currentRank, setCurrentRank] = useState(null);
  const [selectedRank, setSelectedRank] = useState(null);
  const [scoutPos, setScoutPos] = useState({ x: 140, y: 420 });
  const animStartRef = useRef(null);
  const pausedOffsetRef = useRef(0);
  const resetTimeRef = useRef(null);
  const svgRef = useRef(null);

  // Animation loop
  useEffect(() => {
    let frameId;

    const animate = (timestamp) => {
      frameId = requestAnimationFrame(animate);

      if (paused) return;

      if (!animStartRef.current) {
        animStartRef.current = timestamp;
      }

      const elapsed = timestamp - animStartRef.current - pausedOffsetRef.current;
      let prog = elapsed / TOTAL_DURATION;

      if (prog >= 1) {
        prog = 1;
        if (!resetTimeRef.current) resetTimeRef.current = timestamp;
        if (timestamp - resetTimeRef.current >= PAUSE_DURATION) {
          animStartRef.current = timestamp;
          pausedOffsetRef.current = 0;
          resetTimeRef.current = null;
          setProgress(0);
          setRevealed(Array(7).fill(false));
          setCurrentRank(null);
          return;
        }
      }

      setProgress(prog);

      // Scout position
      const pos = calculatePathPoint(prog);
      setScoutPos({ x: pos.x, y: pos.y - 8 });

      // Badge reveals - only update state when a new threshold is newly crossed to avoid redundant re-renders on every 60fps tick
      setRevealed((prevRevealed) => {
        let changed = false;
        let newRevealed = null;
        THRESHOLDS.forEach((threshold, i) => {
          if (!prevRevealed[i] && prog >= threshold) {
            if (!changed) {
              changed = true;
              newRevealed = [...prevRevealed];
            }
            newRevealed[i] = true;
            setCurrentRank(i);
          }
        });
        return changed ? newRevealed : prevRevealed;
      });
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [paused]);

  const handlePause = () => {
    if (paused) {
      pausedOffsetRef.current = 0;
    }
    setPaused(!paused);
  };

  const handleReset = () => {
    setPaused(false);
    pausedOffsetRef.current = 0;
    resetTimeRef.current = null;
    animStartRef.current = null;
    setProgress(0);
    setRevealed(Array(7).fill(false));
    setCurrentRank(null);
  };

  return (
    <div className="scout-path">
      <style>{`
        :root {
          --bg: #030c05;
          --path-gold: #c8900a;
          --path-glow: #e8b830;
          --badge-tan: #c9a870;
          --badge-inner: #b89858;
          --badge-border: #7a5010;
          --badge-dark: #5a3808;
          --text-gold: #f0d060;
          --text-green: #8ab060;
          --text-muted: #4a6a3a;
          --red-bsa: #8b1515;
          --blue-eagle: #1a2d6b;
        }
      `}</style>

      {/* Header */}
      <div className="scout-path__header">
        <h1 className="scout-path__title">The Scout Path</h1>
      </div>

      {/* Scene */}
      <div className="scout-path__scene-wrap">
        <svg
          className="scout-path__svg"
          viewBox="0 0 1200 550"
          xmlns="http://www.w3.org/2000/svg"
          ref={svgRef}
        >
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M2 1L8 5L2 9" fill="none" stroke="#c8900a" strokeWidth="1.5" strokeLinecap="round" />
            </marker>
          </defs>

          {/* Sky */}
          <rect x="0" y="0" width="1200" height="340" fill="#020a04" />
          {/* Ground */}
          <rect x="0" y="340" width="1200" height="210" fill="#040e05" />
          {/* Horizon ambient */}
          <ellipse cx="600" cy="345" rx="550" ry="35" fill="#0a1e0c" opacity=".9" /> 

          {/* Stars */}
          <g id="svgStars">
            {SVG_STARS.map((pos, i) => (
              <circle key={i} cx={pos[0]} cy={pos[1]} r={0.6} fill="#f0e8c8" opacity="0.5" />
            ))}
          </g>

          {/* Moon */}
          <circle cx="980" cy="48" r="22" fill="#1a3020" stroke="#c8a040" strokeWidth="1" opacity=".7" />
          <circle cx="990" cy="44" r="16" fill="#020a04" />

          {/* Background hills */}
          <path d="M 0 360 Q 240 310 480 340 Q 720 370 960 325 Q 1100 305 1200 330 L 1200 550 L 0 550 Z" fill="#050d06" />

          {/* Distant trees */}
          <g fill="#040c05">
            <polygon points="240,360 262,305 284,360" />
            <polygon points="470,355 497,300 524,355" />
            <polygon points="720,345 750,285 780,345" />
            <polygon points="950,340 980,280 1010,340" />
          </g>

          {/* Left foreground trees */}
          <g fill="#050e06">
            <polygon points="-5,430 30,300 65,430" />
            <polygon points="20,430 60,280 100,430" />
            <polygon points="70,420 105,315 140,420" />
            <polygon points="0,450 25,375 50,450" />
            <polygon points="80,435 110,350 140,435" />
          </g>

          {/* Right foreground trees */}
          <g fill="#050e06">
            <polygon points="1080,410 1115,300 1150,410" />
            <polygon points="1105,425 1142,290 1179,425" />
            <polygon points="1140,440 1172,360 1204,440" />
          </g>

          {/* Ground texture */}
          <path d="M 0 390 Q 300 378 600 388 Q 900 398 1200 382" fill="none" stroke="#081508" strokeWidth="9" />
          <path d="M 0 430 Q 300 416 600 426 Q 900 436 1200 420" fill="none" stroke="#081508" strokeWidth="13" />

          {/* Trail shadow */}
          <path d="M 50 460 C 110 460 170 430 220 400 S 360 335 480 295 S 680 235 800 195 S 950 150 1050 120 L 1150 100"
            fill="none" stroke="#4a2e02" strokeWidth="18" strokeLinecap="round" opacity=".5" />

          {/* Golden trail */}
          <path id="trail"
            d="M 50 460 C 110 460 170 430 220 400 S 360 335 480 295 S 680 235 800 195 S 950 150 1050 120 L 1150 100"
            fill="none" stroke="#c8900a" strokeWidth="10" strokeLinecap="round"
            style={{ strokeDasharray: 1200, strokeDashoffset: 1200 - progress * 1200 }}
          />

          {/* Trail highlight */}
          <path d="M 50 456 C 110 456 170 426 220 396 S 360 331 480 291 S 680 231 800 191 S 950 146 1050 116 L 1150 96"
            fill="none" stroke="#e8b830" strokeWidth="3" strokeLinecap="round" opacity=".35" />

          {/* Scout character */}
          <g id="scout" transform={`translate(${scoutPos.x},${scoutPos.y})`}>
            {/* Head */}
            <circle cx="0" cy="-8" r="3" fill="#d9c8a0" />
            {/* Body */}
            <line x1="0" y1="-5" x2="0" y2="4" stroke="#d9c8a0" strokeWidth="2" strokeLinecap="round" />
            {/* Arms */}
            <line x1="0" y1="-2" x2="-4" y2="-1" stroke="#d9c8a0" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="0" y1="-2" x2="4" y2="-1" stroke="#d9c8a0" strokeWidth="1.5" strokeLinecap="round" />
            {/* Legs (animated) */}
            <line id="legL" x1="0" y1="4" x2="-5" y2="5" stroke="#d9c8a0" strokeWidth="1.5" strokeLinecap="round" />
            <line id="legR" x1="0" y1="4" x2="6" y2="3" stroke="#d9c8a0" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Badges - Rendered last so they appear above the trail */}
          {BADGE_POSITIONS.map((pos, i) => (
            <g key={i} transform={`translate(${pos.x},${pos.y})`}>
              <motion.g
                className="scout-path__badge"
                animate={{ opacity: revealed[i] ? 1 : 0, scale: revealed[i] ? 1 : 0.2 }}
                transition={{ duration: 0.55, type: 'spring', stiffness: 100 }}
                onClick={() => setSelectedRank(i)}
                style={{ cursor: 'pointer' }}
              >
                {/* Badge circle */}
                <ellipse cx="0" cy="-7" rx="40" ry="48" fill="#c8900a" opacity=".1" />
                <ellipse cx="0" cy="-7" rx="36" ry="43" fill="#c9a870" stroke="#7a5010" strokeWidth="2.5" />
                <ellipse cx="0" cy="-7" rx="31" ry="38" fill="#c0a060" stroke="#6b4008" strokeWidth=".8" />

                {/* Emoji badge */}
                <text x="0" y="-2" textAnchor="middle" fontSize="42" fill="#4a2c06" fontFamily="Arial">
                  {pos.emoji}
                </text>

                {/* Badge label */}
                <text x="0" y="50" textAnchor="middle" fontSize="12" fill="#c0a060" fontFamily="Georgia" opacity={revealed[i] ? 1 : 0}>
                  {RANKS_DATA[i].name}
                </text>
              </motion.g>
            </g>
          ))}
        </svg>
      </div>

      {/* Progress section */}
      <div className="scout-path__progress">
        {/* Badges earned display */}
        <div className="scout-path__badges-earned">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
            {RANKS_DATA.map((rank, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: revealed[i] ? 1 : 0.4,
                  opacity: revealed[i] ? 1 : 0.3
                }}
                transition={{ type: 'spring', stiffness: 100 }}
                style={{
                  fontSize: '2rem',
                  cursor: 'pointer',
                  filter: revealed[i] ? 'none' : 'grayscale(100%)'
                }}
                onClick={() => setSelectedRank(i)}
                title={rank.name}
              >
                {BADGE_POSITIONS[i].emoji}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Rank label - Above progress bar */}
        <div className="scout-path__progress-rank">
          {currentRank !== null ? RANKS_DATA[currentRank].name.toUpperCase() : 'Click any badge to learn more'}
        </div>

        {/* Timeline progress bar */}
      {/*   <div className="scout-path__progress-bar">
          <div className="scout-path__progress-fill" style={{ width: `${progress * 100}%` }} />
        </div> */}

        {/* Badges earned counter */}
        <div className="scout-path__progress-counter">
          {revealed.filter(Boolean).length} of 7 ranks earned
        </div>
      </div>

      {/* Controls */}
      {/* <div className="scout-path__controls">
        <button className="scout-path__button" onClick={handlePause}>
          {paused ? 'Resume' : 'Pause'}
        </button>
        <button className="scout-path__button" onClick={handleReset}>
          Restart
        </button>
      </div> */}

      {/* Info overlay */}
      {selectedRank !== null && (
        <motion.div
          className="scout-path__overlay"
          onClick={() => setSelectedRank(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="scout-path__infocard"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <button
              className="scout-path__close"
              onClick={() => setSelectedRank(null)}
            >
              <X size={24} />
            </button>
            <p className="scout-path__infocard-num">{RANKS_DATA[selectedRank].num}</p>
            <h2 className="scout-path__infocard-name">{RANKS_DATA[selectedRank].name}</h2>
            <p className="scout-path__infocard-desc">{RANKS_DATA[selectedRank].desc}</p>
            <p className="scout-path__infocard-req">{RANKS_DATA[selectedRank].req}</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
