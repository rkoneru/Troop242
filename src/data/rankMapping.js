/**
 * Rank Mapping Data
 * Maps each Scout rank to images, colors, descriptions, and metadata
 * Source: Official BSA Scouts BSA Program
 */

// Import rank patch images
import scoutPatch from './RankPatches/Scout.png';
import tenderfootPatch from './RankPatches/Tenderfoot.png';
import secondClassPatch from './RankPatches/SecondClass.png';
import firstClassPatch from './RankPatches/FirstClass.png';
import starPatch from './RankPatches/Star.png';
import lifePatch from './RankPatches/Life.png';
import eaglePatch from './RankPatches/Eagle.png';

export const RANK_MAPPING = {
  0: {
    rankIndex: 0,
    name: 'Scout',
    emoji: '⚜️',
    color: '#4A90E2', // Blue
    bgColor: '#E3F2FD',
    borderColor: '#1976D2',
    description: 'The first rank in Scouts BSA. Scouts learn about the Scout Oath, Law, motto, and slogan.',
    longDescription: 'The Scout rank is the first rank in Scouts BSA. To earn this rank, Scouts must learn and understand the Scout Oath, Scout Law, Scout motto, and Scout slogan. They must also demonstrate knowledge of Scouting fundamentals including the patrol method, merit badges, and advancement. Scouts must participate in a Scoutmaster conference and complete a board of review.',
    imageUrl: scoutPatch,
    patchImageUrl: scoutPatch,
    patchDescription: 'The Scout rank patch features the Fleur-de-lis on a tan/khaki background.',
    badgeColor: '#4A90E2',
    progressColor: '#2196F3',
    requirementCount: 19,
    estimatedTimeWeeks: 4,
    skills: [
      'Scout Oath and Law',
      'Patrol Method',
      'Knot Tying',
      'Outdoor Code',
      'Leadership Basics'
    ],
    prerequisites: ['Cub Scout completion or equivalent'],
    nextRank: 'Tenderfoot',
    funFact: 'The Scout rank is your official entry into Scouts BSA and membership in the troop!'
  },
  1: {
    rankIndex: 1,
    name: 'Tenderfoot',
    emoji: '🎖️',
    color: '#FFA726', // Orange
    bgColor: '#FFF3E0',
    borderColor: '#F57C00',
    description: 'Learn camping, cooking, knot tying, first aid, and outdoor survival skills.',
    longDescription: 'The Tenderfoot rank focuses on outdoor skills and personal fitness. Scouts must complete an overnight camping trip, learn basic cooking, demonstrate first aid knowledge, and develop a fitness improvement plan. This rank introduces the practical outdoor skills that Scouts will use throughout their Scouting career.',
    imageUrl: tenderfootPatch,
    patchImageUrl: tenderfootPatch,
    patchDescription: 'The Tenderfoot rank patch features the Fleur-de-lis on a tan/khaki background.',
    badgeColor: '#FFA726',
    progressColor: '#FF7043',
    requirementCount: 26,
    estimatedTimeWeeks: 6,
    skills: [
      'Camping',
      'Cooking',
      'First Aid',
      'Knot Tying',
      'Physical Fitness',
      'Outdoor Safety'
    ],
    prerequisites: ['Scout rank'],
    nextRank: 'Second Class',
    funFact: 'Tenderfoot scouts learn the essential camping skills needed for all future outdoor adventures!'
  },
  2: {
    rankIndex: 2,
    name: 'Second Class',
    emoji: '🗝️',
    color: '#66BB6A', // Green
    bgColor: '#E8F5E9',
    borderColor: '#388E3C',
    description: 'Develop navigation, wilderness skills, water safety, and community service abilities.',
    longDescription: 'The Second Class rank emphasizes developing practical outdoor skills. Scouts must participate in five troop activities (3+ outdoors), demonstrate navigation with a compass and map, show water safety skills, and complete first aid training for more serious injuries. Community service and citizenship are important components of this rank.',
    imageUrl: secondClassPatch,
    patchImageUrl: secondClassPatch,
    badgeColor: '#66BB6A',
    progressColor: '#43A047',
    requirementCount: 27,
    estimatedTimeWeeks: 8,
    skills: [
      'Navigation',
      'Compass Use',
      'Map Reading',
      'Water Safety',
      'Advanced First Aid',
      'Leave No Trace',
      'Citizenship'
    ],
    prerequisites: ['Tenderfoot rank'],
    nextRank: 'First Class',
    funFact: 'Second Class scouts become skilled navigators and begin to make real contributions to their communities!'
  },
  3: {
    rankIndex: 3,
    name: 'First Class',
    emoji: '⭐',
    color: '#EF5350', // Red
    bgColor: '#FFEBEE',
    borderColor: '#C62828',
    description: 'Master advanced outdoor skills, leadership, and personal development.',
    longDescription: 'First Class is the highest rank before Star, and involves mastering advanced outdoor skills. Scouts must demonstrate high levels of proficiency in camping, cooking, navigation, and wilderness survival. Leadership skills become increasingly important, and Scouts must show a strong commitment to the Scout Oath and Law.',
    imageUrl: firstClassPatch,
    patchImageUrl: firstClassPatch,
    badgeColor: '#EF5350',
    progressColor: '#E53935',
    requirementCount: 28,
    estimatedTimeWeeks: 10,
    skills: [
      'Advanced Camping',
      'Advanced Cooking',
      'Advanced Navigation',
      'Leadership',
      'Emergency Response',
      'Conservation',
      'Personal Fitness'
    ],
    prerequisites: ['Second Class rank'],
    nextRank: 'Star',
    funFact: 'First Class scouts are expected to be role models and leaders in their troops!'
  },
  4: {
    rankIndex: 4,
    name: 'Star',
    emoji: '⭐',
    color: '#FDD835', // Gold/Yellow
    bgColor: '#FFFDE7',
    borderColor: '#F57F17',
    description: 'Demonstrate leadership maturity and complete a service project.',
    longDescription: 'The Star rank requires Scouts to show significant personal growth and leadership maturity. Scouts must earn a Star-required merit badge, complete a service project, and demonstrate a strong commitment to Scouting values. The focus shifts from individual skills to helping others and making a meaningful contribution to the community.',
    imageUrl: starPatch,
    patchImageUrl: starPatch,
    badgeColor: '#FDD835',
    progressColor: '#FBC02D',
    requirementCount: 29,
    estimatedTimeWeeks: 12,
    skills: [
      'Leadership Development',
      'Merit Badge Achievement',
      'Service Project Management',
      'Citizenship',
      'Personal Growth'
    ],
    prerequisites: ['First Class rank'],
    nextRank: 'Life',
    funFact: 'Star scouts are on the path to becoming Life and Eagle Scouts!'
  },
  5: {
    rankIndex: 5,
    name: 'Life',
    emoji: '💎',
    color: '#AB47BC', // Purple
    bgColor: '#F3E5F5',
    borderColor: '#7B1FA2',
    description: 'Earn a merit badge in a specialized area and demonstrate leadership maturity.',
    longDescription: 'The Life rank requires Scouts to show significant personal growth and leadership maturity. Scouts must earn a life-required merit badge, complete a service project, and demonstrate a strong commitment to Scouting values. The focus shifts from individual skills to helping others and making a meaningful contribution to the community.',
    imageUrl: lifePatch,
    patchImageUrl: lifePatch,
    badgeColor: '#AB47BC',
    progressColor: '#8E24AA',
    requirementCount: 29,
    estimatedTimeWeeks: 12,
    skills: [
      'Specialized Merit Badge Skills',
      'Leadership',
      'Service Project Management',
      'Citizenship in the Community',
      'Personal Finance',
      'Wilderness Survival'
    ],
    prerequisites: ['Star rank'],
    nextRank: 'Eagle Scout',
    funFact: 'Life scouts are only one step away from achieving the highest rank in Scouts BSA!'
  },
  6: {
    rankIndex: 6,
    name: 'Eagle Scout',
    emoji: '🦅',
    color: '#29B6F6', // Light Blue
    bgColor: '#E1F5FE',
    borderColor: '#0277BD',
    description: 'The highest rank in Scouts BSA. Complete an Eagle Scout Service Project.',
    longDescription: 'Eagle Scout is the highest rank in Scouts BSA and represents the pinnacle of achievement. To earn this rank, Scouts must earn at least 21 merit badges (including 13 required badges), demonstrate exceptional leadership, and complete a significant Eagle Scout Service Project that benefits their community. Eagle Scouts are respected leaders and exemplars of Scouting values.',
    imageUrl: eaglePatch,
    patchImageUrl: eaglePatch,
    badgeColor: '#29B6F6',
    progressColor: '#0288D1',
    requirementCount: 30,
    estimatedTimeWeeks: 24,
    skills: [
      '21+ Merit Badges',
      'Project Management',
      'Community Leadership',
      'Exceptional Citizenship',
      'Advanced Skills in Multiple Areas',
      'Mentorship'
    ],
    prerequisites: ['Life rank'],
    nextRank: null,
    funFact: 'Only about 6% of Scouts achieve the rank of Eagle Scout - it is a lifetime achievement!'
  },
  7: {
    rankIndex: 7,
    name: 'Palms',
    emoji: '🌴',
    color: '#26C6DA', // Cyan
    bgColor: '#E0F2F1',
    borderColor: '#00838F',
    description: 'Continue earning merit badges and service projects as an Eagle Scout.',
    longDescription: 'After achieving Eagle Scout, Scouts can earn Eagle Palms by completing additional merit badges and service projects. Each Palm represents additional achievement and continued commitment to Scouting. Scouts can earn Bronze Palm, Gold Palm, and Platinum Palm as they accumulate merit badges and complete service projects.',
    imageUrl: eaglePatch,
    patchImageUrl: eaglePatch,
    badgeColor: '#26C6DA',
    progressColor: '#00ACC1',
    requirementCount: 10,
    estimatedTimeWeeks: 8,
    skills: [
      'Continued Merit Badge Achievement',
      'Advanced Service Projects',
      'Leadership in Multiple Areas',
      'Mentoring Younger Scouts'
    ],
    prerequisites: ['Eagle Scout rank'],
    nextRank: null,
    funFact: 'Eagle Palms allow scouts to continue growing and achieving even after reaching Eagle Scout!'
  }
};

/**
 * Color palette for each rank
 */
export const RANK_COLORS = {
  Scout: '#4A90E2',
  Tenderfoot: '#FFA726',
  'Second Class': '#66BB6A',
  'First Class': '#EF5350',
  Life: '#AB47BC',
  'Eagle Scout': '#29B6F6',
  Palms: '#26C6DA'
};

/**
 * Get rank info by index
 */
export const getRankByIndex = (index) => {
  return RANK_MAPPING[index] || null;
};

/**
 * Get rank info by name
 */
export const getRankByName = (name) => {
  return Object.values(RANK_MAPPING).find(rank => rank.name === name) || null;
};

/**
 * Get all ranks sorted by index
 */
export const getAllRanks = () => {
  return Object.values(RANK_MAPPING).sort((a, b) => a.rankIndex - b.rankIndex);
};

/**
 * Calculate progress percentage for a rank
 */
export const calculateRankProgress = (completedRequirements, totalRequirements) => {
  if (totalRequirements === 0) return 0;
  return Math.round((completedRequirements / totalRequirements) * 100);
};

/**
 * Get rank difficulty level
 */
export const getRankDifficulty = (rankIndex) => {
  const difficulties = ['Easy', 'Easy', 'Medium', 'Medium', 'Hard', 'Very Hard', 'Expert'];
  return difficulties[rankIndex] || 'Unknown';
};

/**
 * Get estimated time to earn rank
 */
export const getEstimatedTimeToRank = (rankIndex) => {
  const rank = RANK_MAPPING[rankIndex];
  return rank ? rank.estimatedTimeWeeks : 0;
};

/**
 * Patch information for each rank
 * Source: Official BSA Scout Rank Patches
 */
export const RANK_PATCHES = {
  Scout: {
    name: 'Scout Rank Patch',
    description: 'The Scout rank patch features the Fleur-de-lis on a tan/khaki background, representing Scouting tradition.',
    colors: ['Gold/Yellow', 'Tan/Khaki'],
    style: 'Embroidered oval with Fleur-de-lis',
    placement: 'Upper left pocket or sleeve',
    width: '2 inches',
    height: '2.5 inches',
    earned: 'Upon completion of Scout rank requirements and board of review'
  },
  Tenderfoot: {
    name: 'Tenderfoot Rank Patch',
    description: 'The Tenderfoot patch features the Fleur-de-lis on a tan/khaki background with red accents, representing outdoor skills and camping proficiency.',
    colors: ['Gold/Yellow', 'Red/Crimson', 'Tan/Khaki'],
    style: 'Embroidered oval with Fleur-de-lis and Scouts BSA design',
    placement: 'Upper left pocket or sleeve',
    width: '2 inches',
    height: '2.5 inches',
    keySkills: ['Camping', 'Cooking', 'First Aid', 'Outdoor Safety', 'Knot Tying'],
    earned: 'Upon completion of Tenderfoot rank requirements and board of review',
    requirements: '26 requirements',
    estimatedTime: '6 weeks'
  },
  'Second Class': {
    name: 'Second Class Rank Patch',
    description: 'The Second Class patch represents advancement in outdoor and personal skills.',
    colors: ['Green', 'White'],
    style: 'Embroidered patch with Scouts BSA design',
    placement: 'Upper left pocket or sleeve',
    width: '2 inches',
    height: '2.5 inches',
    earned: 'Upon completion of Second Class rank requirements and board of review'
  },
  'First Class': {
    name: 'First Class Rank Patch',
    description: 'The First Class patch represents high achievement in all outdoor skills.',
    colors: ['Red', 'White'],
    style: 'Embroidered patch with Scouts BSA design',
    placement: 'Upper left pocket or sleeve',
    width: '2 inches',
    height: '2.5 inches',
    earned: 'Upon completion of First Class rank requirements and board of review'
  },
  Life: {
    name: 'Life Rank Patch',
    description: 'The Life patch represents personal growth and leadership development.',
    colors: ['Purple', 'White'],
    style: 'Embroidered patch with Scouts BSA design',
    placement: 'Upper left pocket or sleeve',
    width: '2 inches',
    height: '2.5 inches',
    earned: 'Upon completion of Life rank requirements and board of review'
  },
  'Eagle Scout': {
    name: 'Eagle Scout Rank Patch',
    description: 'The Eagle Scout patch is the highest honor in Scouts BSA, featuring an eagle design.',
    colors: ['Blue', 'Gold', 'White'],
    style: 'Embroidered patch with eagle',
    placement: 'Upper left pocket or sleeve',
    width: '3 inches',
    height: '3 inches',
    earned: 'Upon completion of Eagle Scout rank requirements, Eagle Scout service project, and board of review'
  },
  Palms: {
    name: 'Eagle Palm Patch',
    description: 'Eagle Palms recognize continued achievement after Eagle Scout rank.',
    colors: ['Various - Bronze, Gold, Platinum'],
    style: 'Embroidered patch with palm design',
    placement: 'Below Eagle Scout patch',
    width: '1.5 inches',
    height: '1.5 inches',
    earned: 'Upon completion of additional merit badges and service projects after Eagle Scout'
  }
};

/**
 * Get patch information by rank name
 */
export const getPatchByRankName = (rankName) => {
  return RANK_PATCHES[rankName] || null;
};

/**
 * Get patch information by rank index
 */
export const getPatchByRankIndex = (rankIndex) => {
  const rank = RANK_MAPPING[rankIndex];
  return rank ? RANK_PATCHES[rank.name] : null;
};
