import { useNavigate } from 'react-router-dom';
import '../styles/GamesLanding.css';

const GAMES = [
  {
    id: 'kims-game',
    title: 'Kim\'s Game',
    icon: '🧠',
    description: 'Study a tray of Scout items for 30 seconds, then recall as many as possible.',
    tags: ['Memory', '⏱ 30 sec'],
    href: '/Troop242/Games/kims-game.html'
  },
  {
    id: 'knot-quiz',
    title: 'Knot Quiz',
    icon: '🪢',
    description: 'Match the knot to its real-world use case.',
    tags: ['Skills', '10 questions'],
    href: '/Troop242/Games/knot-quiz.html'
  },
  {
    id: 'rank-trivia',
    title: 'Scout Rank Trivia',
    icon: '🎖️',
    description: 'BSA history, Scout Law, and rank requirements.',
    tags: ['Trivia', '15 questions'],
    href: '/Troop242/Games/rank-trivia.html'
  },
  {
    id: 'morse-code',
    title: 'Morse Code Challenge',
    icon: '📡',
    description: 'Decode words transmitted in dots and dashes.',
    tags: ['Signals', '10 rounds'],
    href: '/Troop242/Games/morse-code.html'
  },
  {
    id: 'eight-ball',
    title: 'Magic 8-Ball',
    icon: '🎱',
    description: 'Ask the mystical 8-ball any yes-or-no question.',
    tags: ['Fun', '∞ Questions'],
    href: '/Troop242/Games/eight-ball.html'
  },
  {
    id: 'chess',
    title: 'Chess',
    icon: '♟️',
    description: 'Play a strategic game of chess against an opponent.',
    tags: ['Strategy', '1v1'],
    href: '/Troop242/Games/chess.html'
  },
  {
    id: 'camping-scene',
    title: 'A Day in the Life of Camping',
    icon: '🌅',
    description: 'Watch a full day-night cycle of Scout camping life.',
    tags: ['Animation', 'Relaxing'],
    href: '/Troop242/Games/troop242-day-night.html'
  },
  {
    id: 'wilderness-survival',
    title: 'Wilderness Survival Quiz',
    icon: '🏕️',
    description: 'Test your outdoor survival knowledge.',
    tags: ['Survival', '10 questions'],
    href: '/Troop242/Games/wilderness-survival.html'
  },
  {
    id: 'navigation-challenge',
    title: 'Navigation Challenge',
    icon: '🗺️',
    description: 'Master compass, maps, and direction finding.',
    tags: ['Navigation', '10 questions'],
    href: '/Troop242/Games/navigation-challenge.html'
  },
  {
    id: 'first-aid-scenarios',
    title: 'First Aid Scenarios',
    icon: '🚑',
    description: 'Learn emergency response skills with real-world situations.',
    tags: ['First Aid', '5 scenarios'],
    href: '/Troop242/Games/first-aid-scenarios.html'
  },
  {
    id: 'communication-game',
    title: 'Communication Game',
    icon: '💬',
    description: 'Give clear instructions to describe a word without saying it.',
    tags: ['Skills', '5 rounds'],
    href: '/Troop242/Games/communication-game.html'
  },
  {
    id: 'leadership-challenge',
    title: 'Leadership Challenge',
    icon: '👥',
    description: 'Make smart decisions in leadership scenarios.',
    tags: ['Leadership', '6 scenarios'],
    href: '/Troop242/Games/leadership-challenge.html'
  },
  {
    id: 'rope-climbing',
    title: 'Rope & Climbing Challenge',
    icon: '🧗',
    description: 'Master rope safety, knots, and climbing skills.',
    tags: ['Safety', '8 questions'],
    href: '/Troop242/Games/rope-climbing-challenge.html'
  },
  {
    id: 'accuracy-challenge',
    title: 'Accuracy Challenge',
    icon: '🎯',
    description: 'Click all the targets before time runs out.',
    tags: ['Reflex', '30 seconds'],
    href: '/Troop242/Games/accuracy-challenge.html'
  },
  {
    id: 'quick-reflexes',
    title: 'Quick Reflexes',
    icon: '⚡',
    description: 'Click when the box turns green to measure reaction time.',
    tags: ['Speed', '5 rounds'],
    href: '/Troop242/Games/quick-reflexes.html'
  },
  {
    id: 'puzzle-solver',
    title: 'Puzzle Solver',
    icon: '🧩',
    description: 'Solve logic puzzles and brain teasers.',
    tags: ['Logic', '5 puzzles'],
    href: '/Troop242/Games/puzzle-solver.html'
  },
  {
    id: 'star-quiz',
    title: 'Star Navigation Quiz',
    icon: '⭐',
    description: 'Identify constellations and learn to navigate by the night sky.',
    tags: ['Navigation', '8 questions'],
    href: '/Troop242/scout-portal?panel=star-quiz'
  },
  {
    id: 'first-aid-sim',
    title: 'First Aid Simulator',
    icon: '🩹',
    description: 'Make critical decisions in branching emergency scenarios.',
    tags: ['First Aid', '3 scenarios'],
    href: '/Troop242/scout-portal?panel=first-aid'
  },
  {
    id: 'cipher-challenge',
    title: 'Cipher Challenge',
    icon: '🔐',
    description: 'Decode secret Scout messages using the pigpen cipher.',
    tags: ['Codes', '6 messages'],
    href: '/Troop242/scout-portal?panel=cipher'
  },
  {
    id: 'story-builder',
    title: 'Campfire Story Builder',
    icon: '🔥',
    description: 'Generate unique Scout adventure stories with custom settings.',
    tags: ['Creative', '∞ Stories'],
    href: '/Troop242/scout-portal?panel=story'
  }
];

export default function GamesLanding() {
  return (
    <div className="games-landing">
      <div className="games-header">
        <h1>Scout Games Hub</h1>
        <p className="games-subtitle">Test your knowledge · Sharpen your skills · Have fun</p>
        <div className="games-stats">
          <div className="stat">
            <span className="stat-num">20</span>
            <span className="stat-label">Games</span>
          </div>
          <div className="stat">
            <span className="stat-num">45+</span>
            <span className="stat-label">Questions</span>
          </div>
          <div className="stat">
            <span className="stat-num">∞</span>
            <span className="stat-label">Replay</span>
          </div>
        </div>
      </div>

      <div className="games-grid">
        {GAMES.map(game => (
          <a key={game.id} href={game.href} className="game-card">
            <div className="card-top">
              <div className="game-icon">{game.icon}</div>
              <div className="card-head">
                <h2>{game.title}</h2>
                <p>{game.description}</p>
              </div>
            </div>
            <div className="card-foot">
              {game.tags.map((tag, idx) => (
                <span key={idx} className={`tag ${idx === 1 ? 'tag-accent' : ''}`}>
                  {tag}
                </span>
              ))}
              <span className="play-btn">Play →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
