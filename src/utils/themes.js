export const THEMES = {
  current: {
    name: 'Current (Dark)',
    description: 'Original dark theme with scout green accent',
    tokens: {
      '--bg-primary': '#050a24',
      '--bg-secondary': '#0a1628',
      '--bg-tertiary': '#0d2137',
      '--text-primary': '#ffffff',
      '--text-muted': '#9ca3af',
      '--accent': '#00d68f',
      '--accent-dim': 'rgba(0, 214, 143, 0.12)',
      '--accent-border': 'rgba(0, 214, 143, 0.3)',
      '--glass-bg': 'rgba(255, 255, 255, 0.06)',
      '--glass-border': 'rgba(255, 255, 255, 0.1)',
      '--input-bg': 'rgba(255, 255, 255, 0.04)',
      '--input-border': 'rgba(255, 255, 255, 0.1)',
      '--divider': 'rgba(255, 255, 255, 0.08)',
      '--header-bg': 'rgba(5, 16, 41, 0.95)'
    }
  },
  white: {
    name: 'Light',
    description: 'Clean white background with scout green text',
    tokens: {
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f3f4f6',
      '--bg-tertiary': '#e5e7eb',
      '--text-primary': '#1a472a',
      '--text-muted': '#4a6e5c',
      '--accent': '#00a86b',
      '--accent-dim': 'rgba(0, 168, 107, 0.12)',
      '--accent-border': 'rgba(0, 168, 107, 0.3)',
      '--glass-bg': 'rgba(255, 255, 255, 0.6)',
      '--glass-border': 'rgba(255, 255, 255, 0.8)',
      '--input-bg': 'rgba(0, 0, 0, 0.03)',
      '--input-border': 'rgba(0, 0, 0, 0.08)',
      '--divider': 'rgba(0, 0, 0, 0.06)',
      '--header-bg': 'rgba(255, 255, 255, 0.95)'
    }
  },
  green: {
    name: 'Scout Green',
    description: 'Deep scout green background',
    tokens: {
      '--bg-primary': '#243E2C',
      '--bg-secondary': '#1d3324',
      '--bg-tertiary': '#16281d',
      '--text-primary': '#ffffff',
      '--text-muted': '#c8e6c9',
      '--accent': '#66BB6A',
      '--accent-dim': 'rgba(102, 187, 106, 0.12)',
      '--accent-border': 'rgba(102, 187, 106, 0.3)',
      '--glass-bg': 'rgba(255, 255, 255, 0.08)',
      '--glass-border': 'rgba(255, 255, 255, 0.15)',
      '--input-bg': 'rgba(255, 255, 255, 0.05)',
      '--input-border': 'rgba(255, 255, 255, 0.12)',
      '--divider': 'rgba(255, 255, 255, 0.1)',
      '--header-bg': 'rgba(18, 32, 24, 0.95)'
    }
  },
  tan: {
    name: 'Scout Tan',
    description: 'Traditional scout tan background',
    tokens: {
      '--bg-primary': '#f5f5f0',
      '--bg-secondary': '#ede8df',
      '--bg-tertiary': '#e5dfd4',
      '--text-primary': '#515354',
      '--text-muted': '#515354',
      '--accent': '#7A5C3E',
      '--accent-dim': 'rgba(122, 92, 62, 0.12)',
      '--accent-border': 'rgba(122, 92, 62, 0.3)',
      '--glass-bg': 'rgba(0, 0, 0, 0.04)',
      '--glass-border': 'rgba(0, 0, 0, 0.08)',
      '--input-bg': 'rgba(0, 0, 0, 0.03)',
      '--input-border': 'rgba(0, 0, 0, 0.07)',
      '--divider': 'rgba(0, 0, 0, 0.05)',
      '--header-bg': 'rgba(214, 206, 189, 0.95)'
    }
  },
  blue: {
    name: 'Scout Blue',
    description: 'Deep scout blue background with bright accents',
    tokens: {
      '--bg-primary': '#003f87',
      '--bg-secondary': '#082854',
      '--bg-tertiary': '#0a3366',
      '--text-primary': '#ffffff',
      '--text-muted': '#b3d9ff',
      '--accent': '#2196F3',
      '--accent-dim': 'rgba(33, 150, 243, 0.12)',
      '--accent-border': 'rgba(33, 150, 243, 0.3)',
      '--glass-bg': 'rgba(255, 255, 255, 0.08)',
      '--glass-border': 'rgba(255, 255, 255, 0.15)',
      '--input-bg': 'rgba(255, 255, 255, 0.05)',
      '--input-border': 'rgba(255, 255, 255, 0.12)',
      '--divider': 'rgba(255, 255, 255, 0.1)',
      '--header-bg': 'rgba(0, 63, 135, 0.95)'
    }
  },
  brown: {
    name: 'Scout Brown',
    description: 'Rich brown background inspired by campfire and nature',
    tokens: {
      '--bg-primary': '#3d2817',
      '--bg-secondary': '#2f1f0f',
      '--bg-tertiary': '#251608',
      '--text-primary': '#ffffff',
      '--text-muted': '#e8d4b8',
      '--accent': '#D4A574',
      '--accent-dim': 'rgba(212, 165, 116, 0.12)',
      '--accent-border': 'rgba(212, 165, 116, 0.3)',
      '--glass-bg': 'rgba(255, 255, 255, 0.08)',
      '--glass-border': 'rgba(255, 255, 255, 0.15)',
      '--input-bg': 'rgba(255, 255, 255, 0.05)',
      '--input-border': 'rgba(255, 255, 255, 0.12)',
      '--divider': 'rgba(255, 255, 255, 0.1)',
      '--header-bg': 'rgba(39, 24, 15, 0.95)'
    }
  },
  gold: {
    name: 'Scout Gold',
    description: 'Bright gold background symbolizing achievement and excellence',
    tokens: {
      '--bg-primary': '#2d2416',
      '--bg-secondary': '#1f180f',
      '--bg-tertiary': '#16100a',
      '--text-primary': '#ffffff',
      '--text-muted': '#ffe9b5',
      '--accent': '#FFD700',
      '--accent-dim': 'rgba(255, 215, 0, 0.12)',
      '--accent-border': 'rgba(255, 215, 0, 0.3)',
      '--glass-bg': 'rgba(255, 255, 255, 0.08)',
      '--glass-border': 'rgba(255, 255, 255, 0.15)',
      '--input-bg': 'rgba(255, 255, 255, 0.05)',
      '--input-border': 'rgba(255, 255, 255, 0.12)',
      '--divider': 'rgba(255, 255, 255, 0.1)',
      '--header-bg': 'rgba(32, 28, 18, 0.95)'
    }
  },
  red: {
    name: 'Scout Red',
    description: 'Deep red background representing leadership and courage',
    tokens: {
      '--bg-primary': '#3d1a1f',
      '--bg-secondary': '#2f1219',
      '--bg-tertiary': '#250d12',
      '--text-primary': '#ffffff',
      '--text-muted': '#f5c5cc',
      '--accent': '#FF5252',
      '--accent-dim': 'rgba(255, 82, 82, 0.12)',
      '--accent-border': 'rgba(255, 82, 82, 0.3)',
      '--glass-bg': 'rgba(255, 255, 255, 0.08)',
      '--glass-border': 'rgba(255, 255, 255, 0.15)',
      '--input-bg': 'rgba(255, 255, 255, 0.05)',
      '--input-border': 'rgba(255, 255, 255, 0.12)',
      '--divider': 'rgba(255, 255, 255, 0.1)',
      '--header-bg': 'rgba(40, 18, 22, 0.95)'
    }
  }
};

export const FRAMEWORKS = {
  glass: {
    name: 'Glassmorphism',
    description: 'Frosted glass panels with deep blur and light refraction',
    emoji: '🪟',
    preview: { bg: 'linear-gradient(135deg, #0a1628, #050a24)', card: 'rgba(255,255,255,0.15)', border: 'rgba(255,255,255,0.3)' }
  },
  skeu: {
    name: 'Skeuomorphism',
    description: 'Physical texture — leather cards, raised 3D buttons',
    emoji: '📚',
    preview: { bg: '#c8a96e', card: '#b8935a', border: '#8b6914' }
  },
  brutal: {
    name: 'Neo-Brutalism',
    description: 'Raw, bold — thick black borders, hard offset shadows',
    emoji: '💥',
    preview: { bg: '#FFFBF0', card: '#ffffff', border: '#000000' }
  },
  clay: {
    name: 'Claymorphism',
    description: 'Puffy, inflated 3D — soft pastel with clay-like depth',
    emoji: '🫧',
    preview: { bg: '#f0f4ff', card: '#ffffff', border: 'rgba(255,255,255,0.8)' }
  },
  minimal: {
    name: 'Minimalism',
    description: 'Whitespace first — thin borders, no shadows, content leads',
    emoji: '◽',
    preview: { bg: '#ffffff', card: 'rgba(0,0,0,0.01)', border: '#e5e7eb' }
  },
  liquid: {
    name: 'Liquid Glass',
    description: 'Apple visionOS style — ultra-blur, deep refraction, specular highlights',
    emoji: '💧',
    preview: { bg: 'linear-gradient(135deg, #0a1628, #050a24)', card: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.2)' }
  }
};
