
export default function CampfireIllustration({ isHeroBackground = false }) {
  return (
    <div style={{
      background: isHeroBackground ? "transparent" : "#efecf1",
      maxWidth: isHeroBackground ? "300%" : "auto",
      width: "100%",
      height: isHeroBackground ? "200%" : "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: isHeroBackground ? "0" : "32px 16px",
      fontFamily: "'Georgia',serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&display=swap" rel="stylesheet"/>

      {/*  <div style={{ textAlign:"center", marginBottom:20 }}>
        <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:7,
          color:"#3A8C48", textTransform:"uppercase", margin:"0 0 5px" }}>
          Scouting America · Central Florida Council
        </p>
        <h1 style={{ fontFamily:"'Oswald',sans-serif", fontSize:"clamp(18px,3vw,28px)",
          fontWeight:700, letterSpacing:5, color:"#F5E8C8", margin:0 }}>
          TROOP <span style={{color:"#3A8C48"}}>242</span> · SPRING CAMPOUT
        </h1>
      </div>  */}

      <div style={{
        width:"100%", maxWidth:1100,
        borderRadius:18, overflow:"hidden",
        boxShadow:"0 40px 100px rgba(0,0,0,0.95), 0 0 0 1px rgba(58,140,72,0.12)",
      }}>
        <svg viewBox="0 0 1100 500" xmlns="http://www.w3.org/2000/svg"
          style={{ display:"block", width:"100%", height:"auto" }}>
          <defs>
            <radialGradient id="gnd" cx="50%" cy="0%" r="90%">
              <stop offset="0%"   stopColor="#1C0B35"/>
              <stop offset="50%"  stopColor="#100620"/>
              <stop offset="100%" stopColor="#05020C"/>
            </radialGradient>
            <linearGradient id="sky" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%"   stopColor="#0A0418"/>
              <stop offset="100%" stopColor="#030110"/>
            </linearGradient>
            <radialGradient id="fglow" cx="50%" cy="20%" r="75%">
              <stop offset="0%"   stopColor="#FF7010" stopOpacity="0.9"/>
              <stop offset="35%"  stopColor="#CC3800" stopOpacity="0.55"/>
              <stop offset="65%"  stopColor="#880000" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="flit1" cx="100%" cy="55%" r="80%">
              <stop offset="0%"   stopColor="#FF8020" stopOpacity="0.75"/>
              <stop offset="55%"  stopColor="#CC4400" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="flit2" cx="0%" cy="55%" r="80%">
              <stop offset="0%"   stopColor="#FF8020" stopOpacity="0.7"/>
              <stop offset="55%"  stopColor="#CC4400" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="ls_body" x1="0" y1="0.3" x2="1" y2="0.7">
              <stop offset="0%"   stopColor="#2A1878"/>
              <stop offset="50%"  stopColor="#4838B8"/>
              <stop offset="100%" stopColor="#FF8030"/>
            </linearGradient>
            <linearGradient id="ls_legs" x1="0" y1="0" x2="1" y2="0.8">
              <stop offset="0%"   stopColor="#604020"/>
              <stop offset="60%"  stopColor="#FF7020"/>
              <stop offset="100%" stopColor="#FF9040"/>
            </linearGradient>
            <linearGradient id="rs_shirt" x1="1" y1="0.3" x2="0" y2="0.7">
              <stop offset="0%"   stopColor="#183858"/>
              <stop offset="45%"  stopColor="#2868A8"/>
              <stop offset="100%" stopColor="#FF8030"/>
            </linearGradient>
            <linearGradient id="skin_lit" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#5A2808"/>
              <stop offset="55%"  stopColor="#B04818"/>
              <stop offset="100%" stopColor="#F07030"/>
            </linearGradient>
            <linearGradient id="skin_dk" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#3A1A08"/>
              <stop offset="100%" stopColor="#7A3818"/>
            </linearGradient>
            <linearGradient id="box_g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#D03030"/>
              <stop offset="100%" stopColor="#5A0808"/>
            </linearGradient>
            <linearGradient id="rock_g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#FF7018"/>
              <stop offset="50%"  stopColor="#CC3800"/>
              <stop offset="100%" stopColor="#580C00"/>
            </linearGradient>
            <linearGradient id="tent_f" x1="0.1" y1="0" x2="0.5" y2="1">
              <stop offset="0%"   stopColor="#2A6038"/>
              <stop offset="100%" stopColor="#0A1C10"/>
            </linearGradient>
            <linearGradient id="tent_s" x1="0.9" y1="0" x2="0.4" y2="1">
              <stop offset="0%"   stopColor="#0E2018"/>
              <stop offset="100%" stopColor="#040A06"/>
            </linearGradient>
            <linearGradient id="water_g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#0E2840"/>
              <stop offset="100%" stopColor="#060C18"/>
            </linearGradient>
            <linearGradient id="mng_g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#0A1E10"/>
              <stop offset="100%" stopColor="#040808"/>
            </linearGradient>
            <filter id="f2"><feGaussianBlur stdDeviation="2"/></filter>
            <filter id="f5"><feGaussianBlur stdDeviation="5"/></filter>
            <filter id="f10"><feGaussianBlur stdDeviation="10"/></filter>
            <filter id="f18"><feGaussianBlur stdDeviation="18"/></filter>
          </defs>

          {/* SKY */}
          <rect width="1100" height="500" fill="url(#sky)"/>

          {/* Stars */}
          {[[65,28],[140,18],[215,38],[305,22],[395,14],[475,30],[560,16],[640,34],
            [725,20],[808,28],[895,16],[975,32],[1048,22],[90,55],[185,68],[310,52],
            [440,62],[580,48],[700,58],[820,46],[960,55],[50,82],[160,76],[285,88],
            [415,72],[545,82],[675,70],[795,80],[920,76],[1060,84]].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r={0.5+i%3*0.45} fill="white"
              opacity={0.2+i%5*0.12}>
              <animate attributeName="opacity"
                values={`${0.1+i%3*0.08};${0.55+i%2*0.25};${0.1+i%3*0.08}`}
                dur={`${2.2+i*0.31}s`} begin={`${i*0.13}s`} repeatCount="indefinite"/>
            </circle>
          ))}

          {/* HORIZON WATER */}
          <rect x="0" y="188" width="1100" height="48" fill="url(#water_g)" opacity="0.7"/>
          <rect x="160" y="195" width="280" height="2.5" rx="1.2" fill="#4090B0" opacity="0.2">
            <animate attributeName="opacity" values="0.08;0.3;0.08" dur="5s" repeatCount="indefinite"/>
          </rect>
          <rect x="660" y="198" width="200" height="2" rx="1" fill="#4090B0" opacity="0.16">
            <animate attributeName="opacity" values="0.06;0.24;0.06" dur="6s" begin="2s" repeatCount="indefinite"/>
          </rect>

          {/* MANGROVE KEYS */}
          <ellipse cx="160"  cy="205" rx="220" ry="25" fill="url(#mng_g)"/>
          <ellipse cx="680"  cy="202" rx="195" ry="20" fill="url(#mng_g)"/>
          <ellipse cx="1000" cy="206" rx="155" ry="18" fill="url(#mng_g)" opacity="0.9"/>
          {[38,72,108,148,188,225,260].map((x,i)=>(
            <g key={i}>
              <rect x={x-2} y={176+i%3*4} width={3+i%2} height={24+i%3*7} fill="#060E08"/>
              <ellipse cx={x} cy={176+i%3*4} rx={11+i%3*5} ry={9+i%2*4} fill="#081408"/>
            </g>
          ))}
          {[555,588,622,658,695,728,762].map((x,i)=>(
            <g key={i}>
              <rect x={x-2} y={178+i%2*5} width={3+i%2} height={20+i%3*6} fill="#060E08"/>
              <ellipse cx={x} cy={178+i%2*5} rx={10+i%2*4} ry={8+i%3*3} fill="#081408"/>
            </g>
          ))}

          {/* LIGHTHOUSE */}
          <g transform="translate(880,160)" opacity="0.55">
            <rect x="-5.5" y="0" width="11" height="48" fill="#C8C0B0"/>
            <polygon points="-8,0 8,0 5,-12 -5,-12" fill="#B82818"/>
            {[6,14,22,30,38].map(y=>(
              <rect key={y} x="-7" y={y} width="14" height="2.5" fill="#888" opacity="0.4"/>
            ))}
            <rect x="-8" y="46" width="16" height="7" rx="2" fill="#A89880"/>
            <circle cx="0" cy="-14" r="5" fill="#FFFBE0" opacity="0.85">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2.4s" repeatCount="indefinite"/>
            </circle>
            <ellipse cx="0" cy="-14" rx="22" ry="10" fill="#FFFBE0" opacity="0.12" filter="url(#f5)">
              <animate attributeName="opacity" values="0;0.28;0" dur="2.4s" repeatCount="indefinite"/>
            </ellipse>
          </g>

          {/* BUOY */}
          <g transform="translate(338,212)" opacity="0.6">
            <ellipse cx="0" cy="2" rx="6" ry="9" fill="#B81818"/>
            <ellipse cx="0" cy="-5" rx="4.5" ry="3.5" fill="#EEC000"/>
            <line x1="0" y1="-8.5" x2="0" y2="-18" stroke="#888" strokeWidth="1.2"/>
            <circle cx="0" cy="-20" r="2" fill="#FF8800">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="3.2s" begin="0.8s" repeatCount="indefinite"/>
            </circle>
          </g>

          {/* GROUND */}
          <rect x="0" y="260" width="1100" height="240" fill="url(#gnd)"/>
          <ellipse cx="550" cy="262" rx="550" ry="20" fill="#160830" opacity="0.8"/>

          {/* Fire ambient glow */}
          <ellipse cx="544" cy="368" rx="320" ry="90" fill="url(#fglow)">
            <animate attributeName="rx" values="290;340;305;330;290" dur="2.8s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.75;1;0.82;0.96;0.75" dur="2.8s" repeatCount="indefinite"/>
          </ellipse>
          <ellipse cx="544" cy="390" rx="460" ry="70" fill="#FF4400" opacity="0.08" filter="url(#f18)"/>

          {/* PALM TREES */}
          <g fill="#040110" opacity="0.93">
            <path d="M72,430 Q69,385 66,345 Q63,308 62,280 Q65,312 68,348 Q71,386 74,430Z"/>
            <path d="M62,280 Q22,250 -8,264 Q26,260 50,278Z"/>
            <path d="M62,280 Q18,272 8,298 Q34,280 56,282Z"/>
            <path d="M62,280 Q28,300 22,326 Q46,302 60,287Z"/>
            <path d="M62,280 Q100,252 128,266 Q96,260 70,280Z"/>
            <path d="M62,280 Q104,272 112,298 Q86,278 64,284Z"/>
            <path d="M62,280 Q62,242 62,217 Q65,244 66,280Z"/>
          </g>
          <g fill="#040110" opacity="0.9" transform="translate(24,12)">
            <path d="M42,418 Q40,380 38,348 Q35,318 33,295 Q37,324 40,356 Q43,388 46,418Z"/>
            <path d="M33,295 Q-5,270 -28,283 Q4,278 26,293Z"/>
            <path d="M33,295 Q2,274 -6,298 Q22,280 30,297Z"/>
            <path d="M33,295 Q66,268 90,281 Q62,276 40,295Z"/>
          </g>
          <g fill="#040110" opacity="0.93">
            <path d="M1028,425 Q1031,380 1034,342 Q1037,305 1038,278 Q1035,310 1032,346 Q1029,382 1026,425Z"/>
            <path d="M1038,278 Q1078,248 1108,262 Q1074,258 1050,276Z"/>
            <path d="M1038,278 Q1082,270 1092,296 Q1066,278 1044,280Z"/>
            <path d="M1038,278 Q1072,298 1078,324 Q1054,300 1040,285Z"/>
            <path d="M1038,278 Q1000,250 972,264 Q1004,260 1030,278Z"/>
            <path d="M1038,278 Q996,270 986,296 Q1012,276 1036,282Z"/>
            <path d="M1038,278 Q1038,240 1038,215 Q1035,242 1034,278Z"/>
          </g>

          {/* TENT */}
          <g transform="translate(548,235)">
            <ellipse cx="8" cy="130" rx="105" ry="14" fill="#0A0418" opacity="0.55" filter="url(#f5)"/>
            <polygon points="0,130 88,18 150,130" fill="url(#tent_s)"/>
            <polygon points="0,130 -88,18 -150,130" fill="url(#tent_f)"/>
            <polygon points="0,130 -88,18 -150,130" fill="#FF6010" opacity="0.1">
              <animate attributeName="opacity" values="0.05;0.16;0.07;0.13;0.05" dur="2.5s" repeatCount="indefinite"/>
            </polygon>
            <line x1="0" y1="130" x2="0" y2="16" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
            <polygon points="-24,36 24,36 0,14" fill="rgba(255,255,255,0.12)"/>
            <path d="M-32,130 Q-30,88 -17,70 Q-8,58 0,56 Q8,58 17,70 Q30,88 32,130Z" fill="#060210"/>
            <rect x="-46" y="85" width="92" height="22" rx="6" fill="#1E4228"/>
            <rect x="-44" y="87" width="88" height="18" rx="5" fill="#2A5A38"/>
            <text x="0" y="101" textAnchor="middle"
              style={{fontFamily:"'Oswald',sans-serif",fontSize:"11px",fontWeight:"700",
                fill:"#F5E8C8",letterSpacing:"2px"}}>TROOP 242</text>
            <line x1="0" y1="14" x2="0" y2="2" stroke="#D4AC6A" strokeWidth="2"/>
            <circle cx="0" cy="1" r="3.5" fill="#F0C050"/>
            {[[-150,130],[-100,132],[100,132],[150,130]].map(([x,y],i)=>(
              <line key={i} x1="0" y1="16" x2={x} y2={y}
                stroke="rgba(180,150,90,0.12)" strokeWidth="0.8" strokeDasharray="3 5"/>
            ))}
          </g>

          {/* CAMPFIRE */}
          <g transform="translate(534,398)">
            <ellipse cx="0" cy="10" rx="55" ry="10" fill="#1A0808" transform="rotate(-18 0 10)"/>
            <ellipse cx="0" cy="10" rx="55" ry="10" fill="#1A0808" transform="rotate(18 0 10)"/>
            <ellipse cx="-22" cy="8" rx="10" ry="6" fill="#260C0C" transform="rotate(-18)"/>
            <ellipse cx="22"  cy="8" rx="10" ry="6" fill="#260C0C" transform="rotate(18)"/>
            <ellipse cx="0" cy="6" rx="34" ry="10" fill="#FF3800" opacity="0.8">
              <animate attributeName="opacity" values="0.55;0.92;0.65;0.88;0.55" dur="1.4s" repeatCount="indefinite"/>
            </ellipse>
            <path d="M-26,10 Q-24,-14 -14,-36 Q-7,-56 0,-68 Q7,-56 14,-36 Q24,-14 26,10Z" fill="#E84000">
              <animate attributeName="d"
                values="M-26,10 Q-24,-14 -14,-36 Q-7,-56 0,-68 Q7,-56 14,-36 Q24,-14 26,10Z;
                        M-26,10 Q-27,-17 -16,-40 Q-8,-60 0,-73 Q8,-60 16,-40 Q27,-17 26,10Z;
                        M-26,10 Q-22,-12 -12,-34 Q-6,-52 0,-64 Q6,-52 12,-34 Q22,-12 26,10Z;
                        M-26,10 Q-24,-14 -14,-36 Q-7,-56 0,-68 Q7,-56 14,-36 Q24,-14 26,10Z"
                dur="0.72s" repeatCount="indefinite"/>
            </path>
            <path d="M-18,10 Q-16,-10 -9,-28 Q-4,-44 0,-55 Q4,-44 9,-28 Q16,-10 18,10Z" fill="#FF9000">
              <animate attributeName="d"
                values="M-18,10 Q-16,-10 -9,-28 Q-4,-44 0,-55 Q4,-44 9,-28 Q16,-10 18,10Z;
                        M-18,10 Q-18,-12 -10,-32 Q-5,-49 0,-60 Q5,-49 10,-32 Q18,-12 18,10Z;
                        M-18,10 Q-14,-8 -8,-26 Q-3,-40 0,-51 Q3,-40 8,-26 Q14,-8 18,10Z;
                        M-18,10 Q-16,-10 -9,-28 Q-4,-44 0,-55 Q4,-44 9,-28 Q16,-10 18,10Z"
                dur="0.58s" repeatCount="indefinite"/>
            </path>
            <path d="M-11,10 Q-9,-6 -5,-18 Q-2,-30 0,-38 Q2,-30 5,-18 Q9,-6 11,10Z" fill="#FFD820">
              <animate attributeName="d"
                values="M-11,10 Q-9,-6 -5,-18 Q-2,-30 0,-38 Q2,-30 5,-18 Q9,-6 11,10Z;
                        M-11,10 Q-10,-7 -6,-20 Q-3,-34 0,-43 Q3,-34 6,-20 Q10,-7 11,10Z;
                        M-11,10 Q-8,-5 -4,-16 Q-2,-28 0,-35 Q2,-28 4,-16 Q8,-5 11,10Z;
                        M-11,10 Q-9,-6 -5,-18 Q-2,-30 0,-38 Q2,-30 5,-18 Q9,-6 11,10Z"
                dur="0.46s" repeatCount="indefinite"/>
            </path>
            <ellipse cx="0" cy="-10" rx="4.5" ry="12" fill="#FFF8D0" opacity="0.9">
              <animate attributeName="ry" values="9;16;10;14;9" dur="0.42s" repeatCount="indefinite"/>
            </ellipse>
            {[[-10,-62,0.7],[5,-55,0.56],[14,-70,0.68],[-16,-48,0.5],[8,-58,0.62],
              [-5,-72,0.75],[18,-50,0.52],[-12,-65,0.65],[3,-45,0.48]].map(([sx,sy,dur],i)=>(
              <g key={i}>
                <circle cx={sx} cy={sy} r={1+i%2*0.7} fill="#FFD020">
                  <animate attributeName="cy" values={`${sy};${sy-22};${sy-42}`}
                    dur={`${dur}s`} begin={`${i*0.17}s`} repeatCount="indefinite"/>
                  <animate attributeName="cx" values={`${sx};${sx+(i%2?9:-9)};${sx+(i%2?16:-16)}`}
                    dur={`${dur}s`} begin={`${i*0.17}s`} repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0;0.95;0.6;0"
                    dur={`${dur}s`} begin={`${i*0.17}s`} repeatCount="indefinite"/>
                  <animate attributeName="r" values={`${1+i%2*0.7};0.7;0.2;0`}
                    dur={`${dur}s`} begin={`${i*0.17}s`} repeatCount="indefinite"/>
                </circle>
              </g>
            ))}
          </g>

          {/* ROCKS */}
          {[[435,412,42,17],[470,422,26,11],[499,416,32,14],[522,424,20,9],
            [554,426,27,12],[580,418,34,15],[612,413,25,11],[638,420,30,13],[666,410,22,9]
          ].map(([cx,cy,rx,ry],i)=>(
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#rock_g)" opacity={0.7+i%3*0.1}/>
          ))}
          {[[70,462,50,20],[210,468,40,16],[390,474,46,18],
            [760,466,44,17],[900,468,42,16],[1050,460,48,19]
          ].map(([cx,cy,rx,ry],i)=>(
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#rock_g)" opacity={0.65+i%2*0.1}/>
          ))}

          {/* TEAPOT */}
          <g transform="translate(618,386)">
            <ellipse cx="0" cy="4" rx="20" ry="24" fill="#C04068"/>
            <ellipse cx="0" cy="-16" rx="14" ry="7" fill="#D05080"/>
            <rect x="-5" y="-24" width="10" height="10" rx="3" fill="#AA2858"/>
            <path d="M20,4 Q34,-2 32,8 Q30,16 18,12" fill="none" stroke="#AA2858" strokeWidth="3.5" strokeLinecap="round"/>
            <ellipse cx="0" cy="-4" rx="9" ry="7" fill="rgba(255,200,220,0.1)"/>
          </g>

          {/* MUGS */}
          <g transform="translate(464,418)">
            <rect x="-13" y="-14" width="26" height="20" rx="3.5" fill="#3848A8"/>
            <rect x="-13" y="-14" width="26" height="8"  rx="2"   fill="#4858B8"/>
            <path d="M13,-10 Q22,-10 20,0 Q18,8 12,6" fill="none" stroke="#2838A0" strokeWidth="3" strokeLinecap="round"/>
          </g>
          <g transform="translate(705,408)">
            <rect x="-12" y="-13" width="24" height="18" rx="3" fill="#3848A8"/>
            <rect x="-12" y="-13" width="24" height="7"  rx="2" fill="#4858B8"/>
            <path d="M12,-9 Q20,-9 18,0 Q16,7 11,5" fill="none" stroke="#2838A0" strokeWidth="2.8" strokeLinecap="round"/>
          </g>

          {/* ═══════════════════════════════
              LEFT SCOUT  (sitting, knees up)
          ═══════════════════════════════ */}
          <g transform="translate(248,295)">
            <ellipse cx="10" cy="162" rx="80" ry="12" fill="#0A0418" opacity="0.5" filter="url(#f2)"/>

            {/* BACKPACK */}
            <rect x="-92" y="18" width="62" height="85" rx="14" fill="#4838B8"/>
            <rect x="-89" y="22" width="56" height="73" rx="12" fill="#5848C8"/>
            <rect x="-88" y="15" width="54" height="16" rx="9"  fill="#5040C0"/>
            <rect x="-90" y="62" width="58" height="9"  rx="4"  fill="#D02820"/>
            <rect x="-90" y="62" width="58" height="4"  rx="2"  fill="#E03830" opacity="0.7"/>
            <polygon points="-62,34 -54,42 -62,50 -70,42" fill="rgba(255,255,255,0.32)"/>
            <polygon points="-60,34 -54,40 -60,46 -66,40" fill="rgba(255,255,255,0.14)"/>
            <polygon points="-60,64 -52,72 -60,80 -68,72" fill="rgba(255,255,255,0.28)"/>
            <rect x="-95" y="38" width="10" height="34" rx="5" fill="#4030B0"/>
            <path d="M-70,100 Q-78,115 -72,140" fill="none" stroke="#3828A8" strokeWidth="8" strokeLinecap="round"/>
            <path d="M-40,102 Q-32,118 -38,142" fill="none" stroke="#3828A8" strokeWidth="8" strokeLinecap="round"/>
            {/* Fire glow on pack */}
            <rect x="-92" y="18" width="62" height="85" rx="14" fill="url(#flit1)" opacity="0.4"/>

            {/* BODY */}
            <ellipse cx="0" cy="48" rx="58" ry="65" fill="#4838B8"/>
            <ellipse cx="28" cy="38" rx="38" ry="48" fill="url(#flit1)"/>
            <ellipse cx="-30" cy="42" rx="28" ry="40" fill="rgba(0,0,0,0.35)"/>

            {/* Neckerchief */}
            <polygon points="-10,8 16,8 3,42" fill="#CC2820"/>
            <polygon points="-10,8 16,8 3,42" fill="rgba(255,180,60,0.2)"/>
            <circle cx="3" cy="24" r="5" fill="#C89030"/>

            {/* LEGS */}
            <path d="M-28,88 Q-45,95 -52,120 Q-56,140 -40,145 Q-24,148 -14,128 Q-5,108 -14,92Z"
              fill="url(#ls_legs)"/>
            <path d="M24,86 Q42,93 50,118 Q54,138 38,143 Q22,146 12,126 Q4,106 14,90Z"
              fill="url(#ls_legs)"/>
            <ellipse cx="-32" cy="128" rx="22" ry="15" fill="#8A6030"/>
            <ellipse cx="32"  cy="126" rx="20" ry="14" fill="#AA7838"/>
            <ellipse cx="36"  cy="124" rx="16" ry="12" fill="#FF8020" opacity="0.35"/>

            {/* ARMS */}
            <path d="M-42,55 Q-65,80 -52,122" fill="none" stroke="#3828A8" strokeWidth="24" strokeLinecap="round"/>
            <path d="M42,52 Q66,78 52,120"   fill="none" stroke="#3828A8" strokeWidth="24" strokeLinecap="round"/>
            <path d="M42,52 Q66,78 52,120" fill="none" stroke="#FF8020" strokeWidth="8" strokeLinecap="round" opacity="0.28"/>
            <ellipse cx="-52" cy="122" rx="13" ry="10" fill="url(#skin_dk)"/>
            <ellipse cx="52"  cy="119" rx="12" ry="9"  fill="url(#skin_lit)"/>

            {/* BOOTS */}
            <ellipse cx="-30" cy="148" rx="26" ry="12" fill="#8090C0"/>
            <ellipse cx="32"  cy="146" rx="24" ry="11" fill="#8090C0"/>
            <rect x="-52" y="140" width="44" height="12" rx="6" fill="#7080B0"/>
            <rect x="10"  y="138" width="42" height="12" rx="6" fill="#7080B0"/>
            <line x1="-40" y1="144" x2="-18" y2="144" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2"/>
            <line x1="16"  y1="142" x2="38"  y2="142" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2"/>

            {/* HEAD */}
            <ellipse cx="10" cy="-12" rx="34" ry="36" fill="url(#skin_dk)"/>
            <ellipse cx="28" cy="-6"  rx="20" ry="24" fill="#FF8020" opacity="0.32"/>

            {/* HAIR + BUN */}
            <ellipse cx="8"   cy="-34" rx="34" ry="16" fill="#160A06"/>
            <ellipse cx="-16" cy="-22" rx="14" ry="22" fill="#160A06"/>
            <circle cx="8" cy="-42" r="10" fill="#1E0E08"/>
            <circle cx="8" cy="-44" r="6"  fill="#100808"/>
            {/* Headphones */}
            <path d="M-20,-20 Q-5,-50 14,-46" fill="none" stroke="#1A1040" strokeWidth="5"/>
            <circle cx="-22" cy="-18" r="6" fill="#2A1A50"/>
            <circle cx="16"  cy="-44" r="6" fill="#2A1A50"/>

            {/* SCOUT HAT */}
            <ellipse cx="12" cy="-38" rx="38" ry="10" fill="#5C3C14"/>
            <ellipse cx="12" cy="-45" rx="27" ry="17" fill="#6A4820"/>
            <rect x="-22" y="-51" width="68" height="6" rx="3" fill="#1E5228"/>
            <rect x="-20" y="-50" width="64" height="3" rx="1.5" fill="#2A6A34" opacity="0.6"/>
            <circle cx="24" cy="-48" r="5"   fill="#F0C050"/>
            <circle cx="24" cy="-48" r="3.2" fill="#1E5228"/>
            <circle cx="24" cy="-48" r="1.5" fill="#F0C050" opacity="0.8"/>

            {/* Merit sash */}
            <rect x="-6" y="10" width="18" height="42" rx="4" fill="rgba(240,192,80,0.45)"/>
            {[16,24,32,40].map(y=>(
              <rect key={y} x="-3" y={y} width="6" height="5" rx="1.5" fill="rgba(30,82,40,0.65)"/>
            ))}
          </g>

          {/* ═══════════════════════════════
              RIGHT SCOUT (sitting on box, reading)
          ═══════════════════════════════ */}
          <g transform="translate(822,298)">
            <ellipse cx="5" cy="162" rx="75" ry="11" fill="#0A0418" opacity="0.45" filter="url(#f2)"/>

            {/* SITTING BOX */}
            <rect x="-58" y="120" width="115" height="52" rx="8" fill="url(#box_g)"/>
            <rect x="-56" y="120" width="111" height="12" rx="6" fill="#D83535"/>
            <rect x="-54" y="122" width="60"  height="4"  rx="2" fill="#E84040" opacity="0.5"/>
            <rect x="-50" y="136" width="40"  height="30" rx="3" fill="rgba(0,0,0,0.2)"/>
            <rect x="16"  y="136" width="35"  height="30" rx="3" fill="rgba(0,0,0,0.15)"/>
            <rect x="-58" y="120" width="115" height="52" rx="8" fill="url(#flit2)" opacity="0.45"/>

            {/* SIDE BACKPACK */}
            <rect x="58" y="100" width="48" height="68" rx="10" fill="#3848A8"/>
            <rect x="60" y="103" width="44" height="58" rx="9"  fill="#4858B8"/>
            <rect x="60" y="100" width="44" height="12" rx="7"  fill="#4050B0"/>
            <rect x="58" y="138" width="48" height="7"  rx="3"  fill="#1E5228"/>

            {/* BODY */}
            <ellipse cx="0" cy="46" rx="52" ry="62" fill="#2868A8"/>
            <ellipse cx="-26" cy="38" rx="34" ry="46" fill="url(#flit2)"/>
            <ellipse cx="26"  cy="42" rx="26" ry="38" fill="rgba(0,0,0,0.3)"/>

            {/* Neckerchief */}
            <polygon points="-8,8 14,8 2,40" fill="#CC2820"/>
            <polygon points="-8,8 14,8 2,40" fill="rgba(255,180,60,0.18)"/>
            <circle cx="2" cy="22" r="4.5" fill="#C89030"/>

            {/* LEGS */}
            <rect x="-40" y="90" width="28" height="52" rx="12" fill="#5A3A18"/>
            <rect x="14"  y="94" width="28" height="46" rx="12" fill="#5A3A18"/>
            <ellipse cx="14" cy="96" rx="40" ry="16" fill="#6A4A22"/>
            <ellipse cx="-24" cy="110" rx="18" ry="28" fill="#FF8020" opacity="0.2"/>

            {/* YELLOW SHOES */}
            <ellipse cx="-26" cy="142" rx="22" ry="10" fill="#D08820"/>
            <rect x="-46" y="134" width="40" height="11" rx="6" fill="#C07818"/>
            <rect x="-44" y="136" width="26" height="5"  rx="2.5" fill="#E09828" opacity="0.7"/>
            <ellipse cx="22"  cy="140" rx="20" ry="9"  fill="#D08820"/>
            <rect x="4"   y="132" width="36" height="11" rx="6" fill="#C07818"/>
            <line x1="-38" y1="138" x2="-18" y2="138" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2"/>

            {/* ARMS */}
            <path d="M-38,30 Q-58,56 -44,88" fill="none" stroke="#2060A0" strokeWidth="22" strokeLinecap="round"/>
            <path d="M38,28 Q58,54 44,86"   fill="none" stroke="#2060A0" strokeWidth="22" strokeLinecap="round"/>
            <path d="M-38,30 Q-58,56 -44,88" fill="none" stroke="#FF8020" strokeWidth="8" strokeLinecap="round" opacity="0.28"/>
            <ellipse cx="-44" cy="88" rx="14" ry="11" fill="url(#skin_lit)"/>
            <ellipse cx="44"  cy="86" rx="13" ry="10" fill="url(#skin_dk)"/>

            {/* BSA HANDBOOK */}
            <rect x="-46" y="52" width="90" height="62" rx="5" fill="#2848A0"/>
            <rect x="-4"  y="54" width="5"  height="58" rx="2" fill="#1A3880"/>
            {[62,72,82,92,100].map(y=>(
              <line key={y} x1="-38" y1={y} x2="-8" y2={y}
                stroke="rgba(255,255,255,0.16)" strokeWidth="1.2"/>
            ))}
            {[62,72,82,92,100].map(y=>(
              <line key={y} x1="4" y1={y} x2="36" y2={y}
                stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
            ))}
            <circle cx="20" cy="78" r="12"
              fill="rgba(240,192,80,0.3)" stroke="rgba(240,192,80,0.5)" strokeWidth="1.2"/>
            <text x="20" y="82" textAnchor="middle"
              style={{fontFamily:"'Oswald',sans-serif",fontSize:"7px",fontWeight:"700",
                fill:"rgba(240,192,80,0.85)"}}>BSA</text>
            <path d="M-36,70 Q-28,68 -22,72 Q-16,76 -12,70"
              fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2"/>
            <rect x="-46" y="52" width="90" height="62" rx="5" fill="url(#flit2)" opacity="0.2"/>

            {/* HEAD */}
            <ellipse cx="-2" cy="-10" rx="30" ry="33" fill="url(#skin_dk)"/>
            <ellipse cx="-16" cy="-5"  rx="18" ry="22" fill="#FF8020" opacity="0.35"/>

            {/* HAIR + PONYTAIL */}
            <ellipse cx="-2" cy="-28" rx="30" ry="12" fill="#160A06"/>
            <path d="M18,-24 Q36,-12 32,8" fill="none" stroke="#1E0E08" strokeWidth="10" strokeLinecap="round"/>
            <path d="M28,6 Q34,14 30,22"   fill="none" stroke="#160A06" strokeWidth="8"  strokeLinecap="round"/>

            {/* Eyes (looking down) */}
            <ellipse cx="8"  cy="-10" rx="5"   ry="3.5" fill="#150808"/>
            <ellipse cx="-8" cy="-10" rx="4.5" ry="3"   fill="#150808"/>

            {/* SCOUT HAT */}
            <ellipse cx="0"  cy="-30" rx="36" ry="9"  fill="#5C3C14"/>
            <ellipse cx="0"  cy="-37" rx="26" ry="16" fill="#6A4820"/>
            <rect x="-22" y="-44" width="44" height="6" rx="3" fill="#1E5228"/>
            <rect x="-20" y="-43" width="40" height="3" rx="1.5" fill="#2A6A34" opacity="0.6"/>
            <circle cx="15" cy="-41" r="4.5" fill="#F0C050"/>
            <circle cx="15" cy="-41" r="3"   fill="#1E5228"/>
            <circle cx="15" cy="-41" r="1.2" fill="#F0C050" opacity="0.8"/>
          </g>

          {/* FIREFLIES */}
          {[[175,318,0,4.5],[210,338,1.4,3.8],[285,358,2.8,5.0],[365,342,0.4,4.2],
            [775,322,0.7,4.7],[840,345,2.1,3.6],[912,332,3.4,5.1],[165,368,1.8,4.0],
            [990,355,0.9,4.4],[430,360,3.1,3.9],[660,348,1.5,5.3],[100,385,2.6,4.1],
          ].map(([x,y,delay,dur],i)=>(
            <g key={i}>
              <circle cx={x} cy={y} r={2.2} fill="#C8FF60">
                <animate attributeName="opacity" values="0;1;0.5;1;0"
                  dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite"/>
              </circle>
              <circle cx={x} cy={y} r={7} fill="#88FF20" opacity="0.18" filter="url(#f2)">
                <animate attributeName="opacity" values="0;0.25;0"
                  dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite"/>
              </circle>
            </g>
          ))}

          {/* VIGNETTE */}
          <defs>
            <radialGradient id="vig" cx="50%" cy="55%" r="62%">
              <stop offset="0%"   stopColor="transparent"/>
              <stop offset="70%"  stopColor="transparent"/>
              <stop offset="100%" stopColor="#030108" stopOpacity="0.92"/>
            </radialGradient>
          </defs>
          <rect width="1100" height="500" fill="url(#vig)"/>

          {/* Troop watermark */}
          <g transform="translate(1058,456)" opacity="0.3">
            <circle cx="0" cy="0" r="22" fill="none" stroke="#3A8C48" strokeWidth="1.2"/>
            <text x="0" y="-4" textAnchor="middle"
              style={{fontFamily:"'Oswald',sans-serif",fontSize:"7px",fill:"#3A8C48",letterSpacing:"1px"}}>
              TROOP
            </text>
            <text x="0" y="7" textAnchor="middle"
              style={{fontFamily:"'Oswald',sans-serif",fontSize:"11px",fontWeight:"700",fill:"#3A8C48"}}>
              242
            </text>
          </g>
        </svg>
      </div>

      {/* Legend */}
      {/* <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginTop:18}}>
        {[["🔥","Animated campfire"],["🌴","Key West palms"],["🌊","Mangrove horizon"],
          ["🏕️","Troop 242 tent"],["🔦","Lighthouse beacon"],["🦟","Fireflies"]].map(([icon,label])=>(
          <div key={label} style={{display:"flex",alignItems:"center",gap:6,
            fontSize:11,color:"rgba(58,140,72,0.55)",letterSpacing:1,
            fontFamily:"'Oswald',sans-serif",fontWeight:600,textTransform:"uppercase"}}>
            <span style={{fontSize:14}}>{icon}</span>{label}
          </div>
        ))}
      </div> */}
    </div>
  );
}
