// Build a flat array of searchable documents
const PAGES = [
  {
    title: 'Home',
    excerpt: 'BSA Troop 242 main homepage — events, ranks, resources',
    url: '#home',
    category: 'Page',
    icon: '🏠',
  },
  {
    title: 'Ranks',
    excerpt: 'Scout rank progression — Scout to Eagle. Requirements and advancement path.',
    url: '#ranks',
    category: 'Page',
    icon: '⭐',
  },
  {
    title: 'Merit Badges',
    excerpt: 'Explore 100+ merit badges across outdoor, tech, sports, and leadership categories.',
    url: '#badges',
    category: 'Page',
    icon: '🎖️',
  },
  {
    title: 'Contact',
    excerpt: 'Get in touch with Troop 242. Meetings every Tuesday at 7:00 PM in Sanford, FL.',
    url: '#contact',
    category: 'Page',
    icon: '📧',
  },
];

const RANKS = [
  {
    title: 'Scout Rank',
    excerpt: 'Scout rank requirements and advancement. Basic outdoor skills and leadership foundation.',
    url: '#ranks',
    category: 'Rank',
    icon: '⚜️',
  },
  {
    title: 'Tenderfoot Rank',
    excerpt: 'Tenderfoot rank requirements. Build camping and outdoor cooking skills.',
    url: '#ranks',
    category: 'Rank',
    icon: '🎖️',
  },
  {
    title: '2nd Class Rank',
    excerpt: '2nd Class rank requirements. Develop leadership and advanced camping skills.',
    url: '#ranks',
    category: 'Rank',
    icon: '🗝️',
  },
  {
    title: '1st Class Rank',
    excerpt: '1st Class rank requirements. Master outdoor skills and emergency preparedness.',
    url: '#ranks',
    category: 'Rank',
    icon: '🛡️',
  },
  {
    title: 'Star Rank',
    excerpt: 'Star rank requirements. Leadership and community service focus.',
    url: '#ranks',
    category: 'Rank',
    icon: '⭐',
  },
  {
    title: 'Life Rank',
    excerpt: 'Life rank requirements. Earn Eagle-required merit badges and leadership skills.',
    url: '#ranks',
    category: 'Rank',
    icon: '✨',
  },
  {
    title: 'Eagle Scout Rank',
    excerpt: 'Eagle Scout rank — the highest rank in Scouting. Requirements, merit badges, and Eagle Project.',
    url: '#ranks',
    category: 'Rank',
    icon: '🦅',
  },
];

const MERIT_BADGES = [
  {
    title: 'First Aid Merit Badge',
    excerpt: 'First Aid badge — learn CPR, wound care, and emergency response.',
    url: '#badges',
    category: 'Merit Badge',
    icon: '🏥',
  },
  {
    title: 'Camping Merit Badge',
    excerpt: 'Camping badge — master outdoor camping, gear, and Leave No Trace principles.',
    url: '#badges',
    category: 'Merit Badge',
    icon: '⛺',
  },
  {
    title: 'Hiking Merit Badge',
    excerpt: 'Hiking badge — trail skills, navigation, and backcountry adventure.',
    url: '#badges',
    category: 'Merit Badge',
    icon: '🥾',
  },
  {
    title: 'Swimming Merit Badge',
    excerpt: 'Swimming badge — water safety, strokes, and rescue techniques.',
    url: '#badges',
    category: 'Merit Badge',
    icon: '🏊',
  },
  {
    title: 'Cooking Merit Badge',
    excerpt: 'Cooking badge — meal planning, nutrition, and outdoor cooking.',
    url: '#badges',
    category: 'Merit Badge',
    icon: '🍳',
  },
  {
    title: 'Citizenship in the Community Merit Badge',
    excerpt: 'Citizenship badge — community service and civic responsibility.',
    url: '#badges',
    category: 'Merit Badge',
    icon: '🤝',
  },
  {
    title: 'Environmental Science Merit Badge',
    excerpt: 'Environmental Science badge — ecology, conservation, and sustainability.',
    url: '#badges',
    category: 'Merit Badge',
    icon: '🌍',
  },
  {
    title: 'Lifesaving Merit Badge',
    excerpt: 'Lifesaving badge — water rescue, CPR, and emergency response.',
    url: '#badges',
    category: 'Merit Badge',
    icon: '💪',
  },
];

const EVENTS = [
  {
    title: 'Troop Meeting',
    excerpt: 'Regular troop meeting every Tuesday at 7:00 PM. Games, skills, and planning.',
    url: '#home',
    category: 'Event',
    icon: '📅',
  },
  {
    title: 'Spring Campout',
    excerpt: 'Spring Campout — March 19-22. Camping at Ocala National Forest.',
    url: '#home',
    category: 'Event',
    icon: '🏕️',
  },
  {
    title: 'Board of Review',
    excerpt: 'Rank advancement board of review. Prepare your rank requirements.',
    url: '#home',
    category: 'Event',
    icon: '📋',
  },
];

const TRIVIA = [
  {
    title: 'Scout Trivia',
    excerpt: 'Did you know? The highest rank in Scouting is Eagle Scout.',
    url: '#home',
    category: 'Trivia',
    icon: '💡',
  },
  {
    title: 'Scout Trivia',
    excerpt: 'Scouting was founded in 1907 in the United Kingdom.',
    url: '#home',
    category: 'Trivia',
    icon: '💡',
  },
  {
    title: 'Scout Trivia',
    excerpt: 'The Scout Oath and Scout Law guide all Scouts worldwide.',
    url: '#home',
    category: 'Trivia',
    icon: '💡',
  },
];

export const SEARCH_CORPUS = [...PAGES, ...RANKS, ...MERIT_BADGES, ...EVENTS, ...TRIVIA];

// Simple scoring: exact title match=100, title contains=60, excerpt contains=30
export function search(query) {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/);

  return SEARCH_CORPUS.map((doc) => {
    const titleLower = doc.title.toLowerCase();
    const excerptLower = doc.excerpt.toLowerCase();
    let score = 0;

    for (const term of terms) {
      if (titleLower === term) score += 100;
      else if (titleLower.startsWith(term)) score += 70;
      else if (titleLower.includes(term)) score += 50;
      if (excerptLower.includes(term)) score += 20;
    }

    return { ...doc, score };
  })
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}
