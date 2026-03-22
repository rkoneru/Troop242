
import { useEffect, useRef, useState } from "react";

/* ══════════════════════════════════════════════════════════
   TROOP 242 · CAMPING TENT ANIMATION
   Style: 3D clay/low-poly cartoon — matching uploaded manual
══════════════════════════════════════════════════════════ */

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800&display=swap');

  @media (max-width: 768px) {
    svg { max-height: 100vh !important; }
  }

  @keyframes floatCloud1 {
    0%,100% { transform: translateX(0px); }
    50%      { transform: translateX(22px); }
  }
  @keyframes floatCloud2 {
    0%,100% { transform: translateX(0px); }
    50%      { transform: translateX(-18px); }
  }
  @keyframes floatCloud3 {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-8px); }
  }
  @keyframes spinSun {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes pulseSun {
    0%,100% { transform: scale(1); }
    50%      { transform: scale(1.08); }
  }
  @keyframes scoutBob {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    25%      { transform: translateY(-6px) rotate(1deg); }
    75%      { transform: translateY(-3px) rotate(-1deg); }
  }
  @keyframes legKick {
    0%,100% { transform: rotate(0deg); }
    50%      { transform: rotate(-8deg); }
  }
  @keyframes binocularsWave {
    0%,100% { transform: rotate(0deg); }
    30%      { transform: rotate(-12deg); }
    60%      { transform: rotate(5deg); }
  }
  @keyframes flameDance1 {
    0%,100% { d: path("M0,18 Q-7,8 -5,-2 Q-3,-12 0,-18 Q3,-12 5,-2 Q7,8 0,18"); transform: scaleX(1); }
    33%      { d: path("M0,18 Q-9,6 -6,-4 Q-3,-14 0,-20 Q3,-14 6,-4 Q9,6 0,18"); transform: scaleX(1.1); }
    66%      { d: path("M0,18 Q-5,9 -4,0 Q-2,-10 0,-16 Q2,-10 4,0 Q5,9 0,18"); transform: scaleX(0.9); }
  }
  @keyframes flameDance2 {
    0%,100% { transform: scaleY(1) scaleX(1); }
    40%      { transform: scaleY(1.15) scaleX(0.88); }
    70%      { transform: scaleY(0.9) scaleX(1.1); }
  }
  @keyframes emberFloat {
    0%   { transform: translate(0,0) scale(1); opacity: 1; }
    100% { transform: translate(var(--ex), var(--ey)) scale(0); opacity: 0; }
  }
  @keyframes grassSway {
    0%,100% { transform: rotate(0deg); transform-origin: bottom center; }
    50%      { transform: rotate(8deg); transform-origin: bottom center; }
  }
  @keyframes treeSway {
    0%,100% { transform: rotate(0deg); transform-origin: bottom center; }
    50%      { transform: rotate(2.5deg); transform-origin: bottom center; }
  }
  @keyframes titleBounce {
    0%   { transform: scale(1) rotate(-1deg); }
    50%  { transform: scale(1.04) rotate(1deg); }
    100% { transform: scale(1) rotate(-1deg); }
  }
  @keyframes groundPulse {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.88; }
  }
  @keyframes birdFly {
    0%   { transform: translateX(-80px); opacity: 0; }
    5%   { opacity: 1; }
    95%  { opacity: 1; }
    100% { transform: translateX(520px); opacity: 0; }
  }
  @keyframes shadowPulse {
    0%,100% { transform: scaleX(1); opacity: 0.18; }
    50%      { transform: scaleX(0.92); opacity: 0.12; }
  }
  @keyframes sparkle {
    0%,100% { opacity: 0; transform: scale(0.5); }
    50%      { opacity: 1; transform: scale(1); }
  }
  @keyframes waterShimmer {
    0%,100% { opacity: 0.4; transform: scaleX(1); }
    50%      { opacity: 0.7; transform: scaleX(1.04); }
  }
  @keyframes tentFlap {
    0%,100% { transform: skewX(0deg); }
    50%      { transform: skewX(1.5deg); }
  }
`;

/* ── CLOUD SHAPES ── */
function Cloud({ cx=0, cy=0, s=1, style:cs="" }) {
  return (
    <g transform={`translate(${cx},${cy}) scale(${s})`} style={{ animation: cs }}>
      <ellipse cx="0"   cy="0"  rx="32" ry="22" fill="#EEF8FF"/>
      <ellipse cx="28"  cy="4"  rx="24" ry="18" fill="#E8F4FF"/>
      <ellipse cx="-24" cy="5"  rx="20" ry="16" fill="#E8F4FF"/>
      <ellipse cx="50"  cy="8"  rx="18" ry="14" fill="#F0F8FF"/>
      <ellipse cx="-42" cy="9"  rx="16" ry="13" fill="#F0F8FF"/>
      <ellipse cx="12"  cy="-8" rx="18" ry="15" fill="#F5FAFF"/>
      {/* Bottom flat */}
      <ellipse cx="0"   cy="18" rx="54" ry="10" fill="#EEF8FF"/>
    </g>
  );
}

/* ── LOW-POLY TREE ── */
function Tree({ x=0, y=0, s=1, dark=false }) {
  const g = dark ? ["#1A5C2A","#147820","#1E8C2A","#0E4818"] : ["#2A8C3A","#1E7830","#38A848","#166025"];
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} style={{ animation: "treeSway 4s ease-in-out infinite" }}>
      <rect x="-5" y="0" width="10" height="28" rx="3" fill="#5C3814"/>
      <polygon points="0,-55 -28,0 28,0"   fill={g[0]}/>
      <polygon points="0,-55 0,-20 28,0"   fill={g[3]}/>
      <polygon points="0,-38 -22,5 22,5"   fill={g[1]}/>
      <polygon points="0,-38 0,-10 22,5"   fill={g[3]}/>
      <polygon points="0,-22 -18,8 18,8"   fill={g[2]}/>
      <polygon points="0,-22 0,-2 18,8"    fill={g[3]}/>
    </g>
  );
}

/* ── LOW-POLY MOUNTAIN ── */
function Mountain({ pts, colors }) {
  return (
    <>
      {colors.map((col,i)=>(
        <polygon key={i} points={pts[i]} fill={col}/>
      ))}
    </>
  );
}

/* ── GRASS TUFT ── */
function Grass({ x=0, y=0, s=1, color="#3A9A3A" }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} style={{ animation:"grassSway 2.5s ease-in-out infinite" }}>
      <path d={`M0,0 Q-4,-10 -3,-18`} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <path d={`M0,0 Q0,-6 0,-14`}    fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <path d={`M0,0 Q4,-10 3,-18`}   fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </g>
  );
}

/* ── CAMPFIRE ── */
function Campfire({ x=0, y=0, s=1 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* Glow */}
      <ellipse cx="0" cy="8" rx="28" ry="12" fill="#FF8800" opacity="0.25"
        style={{ filter:"blur(6px)", animation:"flameDance2 0.6s ease-in-out infinite" }}/>
      {/* Logs */}
      <ellipse cx="0" cy="10" rx="20" ry="5" fill="#6A3010" transform="rotate(-20 0 10)"/>
      <ellipse cx="0" cy="10" rx="20" ry="5" fill="#5A2808" transform="rotate(20 0 10)"/>
      {/* Base ember */}
      <ellipse cx="0" cy="8" rx="12" ry="5" fill="#FF4400" opacity="0.9"
        style={{ animation:"flameDance2 0.5s ease-in-out infinite" }}/>
      {/* Flame 1 */}
      <path d="M0,8 Q-8,0 -5,-10 Q-2,-18 0,-22 Q2,-18 5,-10 Q8,0 0,8"
        fill="#FF5500"
        style={{ animation:"flameDance2 0.65s ease-in-out infinite", transformOrigin:"0px 8px" }}/>
      {/* Flame 2 */}
      <path d="M0,8 Q-5,1 -3,-7 Q-1,-14 0,-18 Q1,-14 3,-7 Q5,1 0,8"
        fill="#FF9900"
        style={{ animation:"flameDance2 0.5s ease-in-out infinite 0.1s", transformOrigin:"0px 8px" }}/>
      {/* Flame 3 yellow */}
      <path d="M0,8 Q-3,2 -2,-4 Q-1,-10 0,-13 Q1,-10 2,-4 Q3,2 0,8"
        fill="#FFD000"
        style={{ animation:"flameDance2 0.4s ease-in-out infinite 0.05s", transformOrigin:"0px 8px" }}/>
      {/* Sparks */}
      {[
        { x:-6, y:-20, ex:"-12px", ey:"-30px", delay:"0s" },
        { x:4,  y:-18, ex:"10px",  ey:"-28px", delay:"0.3s" },
        { x:-2, y:-24, ex:"-4px",  ey:"-36px", delay:"0.6s" },
        { x:7,  y:-15, ex:"14px",  ey:"-24px", delay:"0.9s" },
      ].map((e,i)=>(
        <circle key={i} cx={e.x} cy={e.y} r="1.5" fill="#FFE040"
          style={{
            "--ex": e.ex, "--ey": e.ey,
            animation: `emberFloat 1.2s ease-out infinite ${e.delay}`,
          }}/>
      ))}
    </g>
  );
}

/* ── LOW-POLY TENT ── */
function Tent({ x=0, y=0, s=1, c1="#D4660A", c2="#A84808", c3="#E8880A" }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}
      style={{ animation:"tentFlap 3s ease-in-out infinite" }}>
      <ellipse cx="0" cy="62" rx="60" ry="10" fill="rgba(0,0,0,0.18)"/>
      {/* Back face */}
      <polygon points="0,62 -52,62 -10,-22 42,-8" fill={c2}/>
      {/* Left face */}
      <polygon points="0,62 -52,62 -10,-22" fill={c1}/>
      {/* Right face */}
      <polygon points="0,62 42,-8 -10,-22" fill={c3}/>
      {/* Door */}
      <path d="M-18,62 Q-16,38 -8,26 Q-4,20 0,19 Q4,20 8,26 Q16,38 18,62Z"
        fill="rgba(0,0,0,0.4)"/>
    </g>
  );
}

/* ══ MAIN COMPONENT ══ */
export default function CampingAnimation() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "linear-gradient(160deg, #A8E4C8 0%, #7ACFB8 40%, #5BB8A8 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      margin: 0,
      overflow: "hidden",
    }}>
      <style>{style}</style>

      <div style={{
        width: "100%",
        height: "100%",
        position: "relative",
        borderRadius: 0,
        overflow: "hidden",
        boxShadow: "none",
      }}>
        <svg viewBox="0 -100 520 800" xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          style={{ display: "block", width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="bgSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#9EE8D8"/>
              <stop offset="55%"  stopColor="#B8F0E0"/>
              <stop offset="100%" stopColor="#D0F8EC"/>
            </linearGradient>
            <linearGradient id="bgGround" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#C8E8D8"/>
              <stop offset="100%" stopColor="#A8D8C0"/>
            </linearGradient>
            <linearGradient id="hillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#3AAA50"/>
              <stop offset="100%" stopColor="#228038"/>
            </linearGradient>
            <linearGradient id="hillGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#2A9440"/>
              <stop offset="100%" stopColor="#186830"/>
            </linearGradient>
            <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#5ABCE0"/>
              <stop offset="100%" stopColor="#4898B8"/>
            </linearGradient>
            <linearGradient id="scoutBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#4AC870"/>
              <stop offset="100%" stopColor="#2A9848"/>
            </linearGradient>
            <linearGradient id="scoutPants" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#3A3028"/>
              <stop offset="100%" stopColor="#1E1810"/>
            </linearGradient>
            <linearGradient id="rockGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"  stopColor="#5A4A3A"/>
              <stop offset="100%" stopColor="#2E2018"/>
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.2"/>
            </filter>
            <filter id="softShadow">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.25"/>
            </filter>
          </defs>

          {/* ══ BACKGROUND ══ */}
          <rect y="-100" width="520" height="800" fill="url(#bgSky)"/>

          {/* ── CARD outline / paper feel ── */}
          <rect x="2" y="-98" width="516" height="796" rx="26"
            fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="3"/>

          {/* ══ MOUNTAINS (back) ══ */}
          {/* Far-left blue mountain */}
          <polygon points="0,290 80,140 180,290" fill="#5A90C0"/>
          <polygon points="80,140 160,290 180,290 130,200" fill="#4A7AAA"/>
          <polygon points="80,140 90,170 70,175" fill="rgba(255,255,255,0.5)"/>

          {/* Centre-left teal mountain */}
          <polygon points="60,295 160,120 290,295" fill="#4AB0A8"/>
          <polygon points="160,120 240,295 290,295 200,185" fill="#3A9898"/>
          <polygon points="160,120 172,155 148,158" fill="rgba(255,255,255,0.55)"/>

          {/* Centre mountain */}
          <polygon points="220,300 330,105 430,300" fill="#5AA8C8"/>
          <polygon points="330,105 400,300 430,300 360,180" fill="#4888A8"/>
          <polygon points="330,105 344,148 316,150" fill="rgba(255,255,255,0.6)"/>

          {/* Right mountain */}
          <polygon points="370,300 460,130 520,250 520,300" fill="#4A9AB8"/>
          <polygon points="460,130 520,250 520,185 475,160" fill="#3A80A0"/>
          <polygon points="460,130 472,165 448,167" fill="rgba(255,255,255,0.55)"/>

          {/* ══ WATER / LAKE ══ */}
          <ellipse cx="260" cy="318" rx="210" ry="28" fill="url(#waterGrad)" opacity="0.85"/>
          {/* Shimmer strips */}
          {[245,280,215].map((x,i)=>(
            <rect key={i} x={x} y={308+i*4} width={40+i*12} height="3" rx="1.5"
              fill="rgba(255,255,255,0.55)"
              style={{ animation: `waterShimmer ${2.5+i*0.5}s ease-in-out infinite ${i*0.4}s` }}/>
          ))}

          {/* ══ GROUND HILLS ══ */}
          {/* Back hill */}
          <ellipse cx="260" cy="370" rx="300" ry="88" fill="url(#hillGrad)" opacity="0.9"/>
          {/* Front hill plateau */}
          <ellipse cx="280" cy="420" rx="310" ry="80" fill="url(#hillGrad2)"/>
          {/* Foreground dark ground */}
          <rect x="0" y="500" width="520" height="180" fill="#1E6030"/>
          <ellipse cx="260" cy="500" rx="310" ry="30" fill="#186028"/>

          {/* Dirt patches */}
          <ellipse cx="200" cy="510" rx="60" ry="15" fill="#8A5C30" opacity="0.4"/>
          <ellipse cx="380" cy="520" rx="50" ry="12" fill="#8A5C30" opacity="0.35"/>

          {/* ══ BACK TREES ══ */}
          <Tree x={80}  y={360} s={0.75} dark={true}/>
          <Tree x={116} y={352} s={0.88} dark={true}/>
          <Tree x={148} y={365} s={0.65} dark={true}/>
          <Tree x={385} y={358} s={0.8}  dark={true}/>
          <Tree x={420} y={350} s={0.72} dark={true}/>
          <Tree x={452} y={362} s={0.85} dark={true}/>

          {/* ══ TENTS ══ */}
          {/* Left/back tent */}
          <Tent x={168} y={420} s={0.82} c1="#C85A0A" c2="#8A3808" c3="#E07010"/>
          {/* Right tent */}
          <Tent x={400} y={418} s={0.78} c1="#C89030" c2="#9A6010" c3="#E0B040"/>

          {/* ══ FRONT TREES ══ */}
          <Tree x={52}  y={480} s={1.1}/>
          <Tree x={465} y={476} s={1.05}/>

          {/* ══ CAMPFIRE ══ */}
          <Campfire x={270} y={478} s={1.1}/>

          {/* ══ GRASS TUFTS ══ */}
          {[[130,475,"#2A9038"],[185,488,"#38A848"],[230,495,"#2E9840"],
            [320,492,"#2A9038"],[365,485,"#38A848"],[415,480,"#2E8C38"]].map(([x,y,c],i)=>(
            <Grass key={i} x={x} y={y} s={0.9} color={c}/>
          ))}

          {/* ══ CLOUDS ══ */}
          <g style={{ animation:"floatCloud1 8s ease-in-out infinite" }}>
            <Cloud cx={90}  cy={68} s={0.9}/>
          </g>
          <g style={{ animation:"floatCloud2 11s ease-in-out infinite 1s" }}>
            <Cloud cx={360} cy={55} s={0.7}/>
          </g>
          <g style={{ animation:"floatCloud3 9s ease-in-out infinite 3s" }}>
            <Cloud cx={230} cy={80} s={0.55}/>
          </g>
          {/* Foreground cloud (bottom) */}
          <g style={{ animation:"floatCloud1 13s ease-in-out infinite 2s" }}>
            <Cloud cx={80}  cy={590} s={1.15}/>
          </g>
          <g style={{ animation:"floatCloud2 10s ease-in-out infinite 4s" }}>
            <Cloud cx={420} cy={600} s={0.95}/>
          </g>

          {/* ══ SUN ══ */}
          <g transform="translate(450, 88)">
            <g style={{ animation:"pulseSun 3s ease-in-out infinite" }}>
              <circle cx="0" cy="0" r="38" fill="#FFE040" opacity="0.35"
                style={{ filter:"blur(8px)" }}/>
              <circle cx="0" cy="0" r="28" fill="#FFD830"/>
              <circle cx="0" cy="0" r="22" fill="#FFE840"/>
              <circle cx="0" cy="0" r="16" fill="#FFF060"/>
            </g>
            {/* Rays */}
            <g style={{ animation:"spinSun 12s linear infinite", transformOrigin:"0px 0px" }}>
              {Array.from({length:12},(_,i) => {
                const a = i*30 * Math.PI/180;
                return (
                  <line key={i}
                    x1={Math.cos(a)*30} y1={Math.sin(a)*30}
                    x2={Math.cos(a)*44} y2={Math.sin(a)*44}
                    stroke="#FFCC00" strokeWidth={i%3===0?3:2}
                    strokeLinecap="round" opacity={i%3===0?1:0.7}/>
                );
              })}
            </g>
            {/* Sparkles */}
            {[[-36,-12],[-20,-38],[14,-40],[38,-8],[40,18],[16,40]].map(([sx,sy],i)=>(
              <circle key={i} cx={sx} cy={sy} r="2.5" fill="#FFE040"
                style={{ animation:`sparkle ${1.5+i*0.3}s ease-in-out infinite ${i*0.25}s` }}/>
            ))}
          </g>

          {/* ══ ROCK (scout stands on) ══ */}
          <ellipse cx="310" cy="518" rx="52" ry="24" fill="url(#rockGrad)"/>
          <ellipse cx="305" cy="512" rx="48" ry="20" fill="#4A3A28"/>
          <ellipse cx="300" cy="508" rx="30" ry="12" fill="#5A4A36" opacity="0.6"/>

          {/* ══ SCOUT CHARACTER ══ */}
          <g transform="translate(302,360)"
            style={{ animation:"scoutBob 2.8s ease-in-out infinite" }}
            filter="url(#softShadow)">

            {/* Shadow */}
            <ellipse cx="8" cy="112" rx="42" ry="8"
              style={{ animation:"shadowPulse 2.8s ease-in-out infinite" }}
              fill="rgba(0,0,0,0.15)"/>

            {/* ── BOOTS ── */}
            {/* Left boot */}
            <rect x="-28" y="96" width="24" height="14" rx="7" fill="#C8A030"/>
            <rect x="-28" y="96" width="24" height="8"  rx="5" fill="#D8B040"/>
            <rect x="-30" y="104" width="12" height="7" rx="3" fill="#9A1818"/>
            {/* Right boot (raised leg) */}
            <g style={{ animation:"legKick 2.8s ease-in-out infinite", transformOrigin:"-8px 80px" }}>
              <rect x="12" y="86" width="22" height="13" rx="6" fill="#C8A030"/>
              <rect x="12" y="86" width="22" height="7"  rx="4" fill="#D8B040"/>
              <rect x="10" y="93" width="11" height="7"  rx="3" fill="#9A1818"/>
            </g>

            {/* ── PANTS ── */}
            <rect x="-32" y="54" width="26" height="46" rx="10" fill="#2A2018"/>
            <rect x="4"   y="46" width="24" height="42" rx="10" fill="#2A2018"
              style={{ animation:"legKick 2.8s ease-in-out infinite", transformOrigin:"4px 50px" }}/>
            {/* Pants highlight */}
            <rect x="-28" y="56" width="10" height="22" rx="5" fill="#3A3028" opacity="0.6"/>

            {/* Belt */}
            <rect x="-30" y="50" width="64" height="8" rx="4" fill="#5C3814"/>
            <rect x="6"   y="52" width="10" height="6" rx="2" fill="#C89030"/>

            {/* ── VEST / JACKET ── */}
            <rect x="-34" y="-18" width="72" height="72" rx="18" fill="url(#scoutBody)"/>
            {/* Jacket shadow */}
            <rect x="12"  y="-14" width="24" height="60" rx="12" fill="rgba(0,0,0,0.15)"/>
            {/* Front zip/button strip */}
            <rect x="-4" y="-14" width="10" height="60" rx="5" fill="#228040"/>
            {[0,12,24,36,48].map(y=>(
              <circle key={y} cx="1" cy={-8+y} r="2.5" fill="#C89030"/>
            ))}
            {/* Pocket */}
            <rect x="-26" y="10" width="18" height="14" rx="4" fill="#3AAA50"/>
            <rect x="-26" y="10" width="18" height="5"  rx="2" fill="#2A9040"/>
            {/* Scout patch on left chest */}
            <rect x="-26" y="-8" width="18" height="14" rx="3" fill="#CC2820"/>
            <text x="-17" y="-1" textAnchor="middle"
              style={{fontFamily:"'Fredoka One',cursive",fontSize:"5px",fill:"white",fontWeight:"700"}}>BSA</text>

            {/* ── ARMS ── */}
            {/* Left arm (resting) */}
            <rect x="-50" y="-14" width="20" height="50" rx="10" fill="url(#scoutBody)"/>
            <ellipse cx="-40" cy="38" rx="11" ry="9" fill="#D08040"/>
            {/* Right arm (binoculars) */}
            <g style={{ animation:"binocularsWave 2.8s ease-in-out infinite", transformOrigin:"30px 0px" }}>
              <rect x="28" y="-30" width="22" height="52" rx="10" fill="url(#scoutBody)"/>
              {/* Right arm shadow */}
              <rect x="36" y="-26" width="10" height="40" rx="5" fill="rgba(0,0,0,0.12)"/>
              {/* Hand */}
              <ellipse cx="40" cy="24" rx="12" ry="10" fill="#D08040"/>
              {/* BINOCULARS */}
              <rect x="26" y="-44" width="32" height="20" rx="6" fill="#2A2A2A"/>
              <circle cx="36" cy="-34" r="8" fill="#1A1A1A"/>
              <circle cx="36" cy="-34" r="5" fill="#0A4060"/>
              <circle cx="36" cy="-34" r="3" fill="#1A8ADE" opacity="0.8"/>
              <circle cx="34" cy="-36" r="1.5" fill="rgba(255,255,255,0.6)"/>
              <circle cx="48" cy="-34" r="8" fill="#1A1A1A"/>
              <circle cx="48" cy="-34" r="5" fill="#0A4060"/>
              <circle cx="48" cy="-34" r="3" fill="#1A8ADE" opacity="0.8"/>
              <circle cx="46" cy="-36" r="1.5" fill="rgba(255,255,255,0.6)"/>
              <rect x="36" y="-38" width="13" height="4" rx="2" fill="#3A3A3A"/>
              {/* Strap */}
              <path d="M28,-38 Q20,-50 8,-44" fill="none" stroke="#4A3020" strokeWidth="2.5" strokeLinecap="round"/>
            </g>

            {/* ── HEAD ── */}
            <ellipse cx="6" cy="-40" rx="32" ry="34" fill="#D08040"/>
            {/* Head highlight */}
            <ellipse cx="-4" cy="-52" rx="16" ry="12" fill="rgba(255,255,255,0.15)"/>
            {/* Ear */}
            <ellipse cx="-34" cy="-40" rx="8" ry="11" fill="#D08040"/>
            <ellipse cx="-34" cy="-40" rx="5" ry="7"  fill="#C07030"/>

            {/* FACE */}
            {/* Eyes (squinting / focused) */}
            <ellipse cx="-6"  cy="-44" rx="6" ry="4" fill="#1A0C06"/>
            <ellipse cx="16" cy="-44" rx="6" ry="4" fill="#1A0C06"/>
            <circle cx="-4" cy="-45" r="1.5" fill="white" opacity="0.7"/>
            <circle cx="18" cy="-45" r="1.5" fill="white" opacity="0.7"/>
            {/* Nose */}
            <ellipse cx="5" cy="-36" rx="5" ry="4" fill="#B86828"/>
            {/* Smile */}
            <path d="M-4,-28 Q6,-23 16,-28" fill="none" stroke="#8A4020" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Cheek blush */}
            <ellipse cx="-14" cy="-34" rx="8" ry="5" fill="#E88050" opacity="0.4"/>
            <ellipse cx="24"  cy="-34" rx="8" ry="5" fill="#E88050" opacity="0.4"/>

            {/* SCOUT HAT */}
            <ellipse cx="6" cy="-66" rx="36" ry="10" fill="#3A7830"/>
            <ellipse cx="6" cy="-72" rx="26" ry="18" fill="#4A9040"/>
            <ellipse cx="6" cy="-72" rx="20" ry="14" fill="#5AA850"/>
            {/* Hat brim shadow */}
            <ellipse cx="6" cy="-66" rx="30" ry="7"  fill="rgba(0,0,0,0.15)"/>
            {/* Hat band */}
            <rect x="-18" y="-80" width="48" height="6" rx="3" fill="#CC2820"/>
            {/* Goggle band */}
            <rect x="-28" y="-74" width="68" height="8" rx="4" fill="#4A3A28" opacity="0.7"/>
            {/* Goggles */}
            <ellipse cx="-4" cy="-72" rx="12" ry="9" fill="#3A8898" opacity="0.85"/>
            <ellipse cx="16" cy="-72" rx="12" ry="9" fill="#3A8898" opacity="0.85"/>
            <ellipse cx="-4" cy="-72" rx="9"  ry="7" fill="#60B8C0" opacity="0.7"/>
            <ellipse cx="16" cy="-72" rx="9"  ry="7" fill="#60B8C0" opacity="0.7"/>
            <ellipse cx="-6" cy="-74" rx="4"  ry="3" fill="rgba(255,255,255,0.45)"/>
            <ellipse cx="14" cy="-74" rx="4"  ry="3" fill="rgba(255,255,255,0.45)"/>
            {/* Bridge */}
            <rect x="4" y="-75" width="8" height="4" rx="2" fill="#4A3A28"/>
          </g>

          {/* ══ FLYING BIRD ══ */}
          <g style={{ animation:"birdFly 14s linear infinite 2s" }}>
            <path d="M0,0 Q-8,-6 -16,0" fill="none" stroke="#2A6888" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M0,0 Q8,-6 16,0"  fill="none" stroke="#2A6888" strokeWidth="2.5" strokeLinecap="round"/>
          </g>
          <g style={{ animation:"birdFly 18s linear infinite 7s" }}>
            <path d="M0,0 Q-6,-5 -12,0" fill="none" stroke="#2A6888" strokeWidth="2" strokeLinecap="round"/>
            <path d="M0,0 Q6,-5 12,0"  fill="none" stroke="#2A6888" strokeWidth="2" strokeLinecap="round"/>
          </g>

          {/* ══ TITLE BANNER ══ */}
          {/* Banner bg */}
          <rect x="20" y="540" width="480" height="84" rx="18"
            fill="rgba(200,240,220,0.65)" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
          {/* Title text */}
          <g style={{ animation:"titleBounce 4s ease-in-out infinite" }}>
            <text x="260" y="572" textAnchor="middle"
              style={{
                fontFamily:"'Fredoka One',cursive",
                fontSize:"46px",
                fill:"#1E5228",
                filter:"drop-shadow(2px 3px 0px rgba(0,0,0,0.2))",
                letterSpacing:"3px",
              }}>
              CAMPING
            </text>
          </g>
          <text x="260" y="616" textAnchor="middle"
            style={{
              fontFamily:"'Fredoka One',cursive",
              fontSize:"38px",
              fill:"#CC2820",
              filter:"drop-shadow(2px 3px 0px rgba(0,0,0,0.18))",
              letterSpacing:"4px",
            }}>
            TENT
          </text>

          {/* ══ SUBTITLE BUBBLE ══ */}
          <rect x="105" y="158" width="310" height="50" rx="25"
            fill="rgba(255,255,255,0.88)" stroke="rgba(255,255,255,0.95)" strokeWidth="2.5"
            style={{ filter:"drop-shadow(0 4px 10px rgba(0,0,0,0.12))" }}/>
          {/* Bubble tail */}
          <polygon points="260,208 245,222 275,208" fill="rgba(255,255,255,0.88)"/>
          <text x="260" y="181" textAnchor="middle"
            style={{fontFamily:"'Nunito',sans-serif",fontSize:"14px",fontWeight:"800",fill:"#1A5A30"}}>
            Troop 242 Camping
          </text>
          <text x="260" y="199" textAnchor="middle"
            style={{fontFamily:"'Nunito',sans-serif",fontSize:"11px",fill:"#3A7848",opacity:0.8}}>
            Sanford · Central Florida
          </text>

          {/* ══ BOTTOM INFO ══ */}
          <rect x="120" y="636" width="280" height="34" rx="17"
            fill="#2A6838" opacity="0.85"/>
          <text x="260" y="658" textAnchor="middle"
            style={{fontFamily:"'Nunito',sans-serif",fontSize:"12px",fontWeight:"700",fill:"white",letterSpacing:"0.5px"}}>
            TROOP 242 · CENTRAL FLORIDA
          </text>

          {/* Corner model number */}
          <text x="490" y="672" textAnchor="end"
            style={{fontFamily:"'Nunito',sans-serif",fontSize:"10px",fill:"rgba(30,82,40,0.5)",fontWeight:"700"}}>
            QBT00064
          </text>

          {/* ══ DECORATIVE GRASS at card edges ══ */}
          {[40,80,130,390,440,490].map((x,i)=>(
            <Grass key={i} x={x} y={540} s={0.7} color="#2A9840"/>
          ))}

          {/* ══ AMBIENT SPARKLES around sun ══ */}
          {[[418,50],[480,112],[458,38],[485,60]].map(([x,y],i)=>(
            <g key={i}>
              <line x1={x} y1={y-5} x2={x} y2={y+5} stroke="#FFD030"
                strokeWidth="1.5" strokeLinecap="round"
                style={{ animation:`sparkle ${1.2+i*0.4}s ease-in-out infinite ${i*0.3}s` }}/>
              <line x1={x-5} y1={y} x2={x+5} y2={y} stroke="#FFD030"
                strokeWidth="1.5" strokeLinecap="round"
                style={{ animation:`sparkle ${1.2+i*0.4}s ease-in-out infinite ${i*0.3}s` }}/>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
