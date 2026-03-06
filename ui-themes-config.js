// ==================== UI THEMES SYSTEM ====================
// Système de thèmes visuels pour personnaliser l'interface

const UI_THEMES = {
  medieval: {
    id: 'medieval',
    name: 'Médiéval',
    desc: 'Thème par défaut inspiré des grimoires anciens',
    icon: 'fa-solid fa-book-skull',
    price: 0,
    unlocked: true,
    colors: {
      primary: '#f0a030',
      secondary: '#8a6a4a',
      background: 'radial-gradient(ellipse at 50% 30%, #1a0a00 0%, #000 70%)',
      cardBg: 'rgba(20,15,10,.85)',
      cardBorder: '#5a4a3a',
      text: '#e0c080',
      textDark: '#8a6a4a',
      accent: '#f0a030',
      buttonBg: 'transparent',
      buttonBorder: '#f0a030',
      buttonHover: '#f0a03011'
    },
    fonts: {
      title: "'Cinzel', serif",
      body: "'Crimson Pro', serif"
    },
    effects: {
      glow: '0 0 40px #f0a03088',
      shadow: '0 2px 0 #000',
      blur: 'blur(4px)'
    }
  },
  
  retro: {
    id: 'retro',
    name: 'Rétro Pixel',
    desc: 'Style arcade des années 80',
    icon: 'fa-solid fa-gamepad',
    price: 5000,
    unlocked: false,
    colors: {
      primary: '#ff00ff',
      secondary: '#00ffff',
      background: 'linear-gradient(180deg, #000033 0%, #000000 100%)',
      cardBg: 'rgba(0,0,0,.9)',
      cardBorder: '#ff00ff',
      text: '#00ffff',
      textDark: '#0088aa',
      accent: '#ff00ff',
      buttonBg: '#000033',
      buttonBorder: '#ff00ff',
      buttonHover: '#ff00ff22'
    },
    fonts: {
      title: "'Press Start 2P', monospace",
      body: "'VT323', monospace"
    },
    effects: {
      glow: '0 0 20px #ff00ff, 0 0 40px #00ffff',
      shadow: '2px 2px 0 #ff00ff',
      blur: 'none'
    }
  },
  
  cyber: {
    id: 'cyber',
    name: 'Cyberpunk',
    desc: 'Interface futuriste néon',
    icon: 'fa-solid fa-microchip',
    price: 8000,
    unlocked: false,
    colors: {
      primary: '#00ffff',
      secondary: '#ff0080',
      background: 'radial-gradient(ellipse at 50% 50%, #001a1a 0%, #000 70%)',
      cardBg: 'rgba(0,25,25,.85)',
      cardBorder: '#00ffff',
      text: '#00ffff',
      textDark: '#008888',
      accent: '#ff0080',
      buttonBg: 'rgba(0,255,255,.05)',
      buttonBorder: '#00ffff',
      buttonHover: '#00ffff22'
    },
    fonts: {
      title: "'Orbitron', sans-serif",
      body: "'Rajdhani', sans-serif"
    },
    effects: {
      glow: '0 0 30px #00ffff, 0 0 60px #ff0080',
      shadow: '0 0 10px #00ffff',
      blur: 'blur(2px)'
    }
  },
  
  dark: {
    id: 'dark',
    name: 'Ténèbres',
    desc: 'Minimaliste et sombre',
    icon: 'fa-solid fa-moon',
    price: 3000,
    unlocked: false,
    colors: {
      primary: '#aaaaaa',
      secondary: '#666666',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)',
      cardBg: 'rgba(15,15,15,.95)',
      cardBorder: '#333333',
      text: '#cccccc',
      textDark: '#666666',
      accent: '#ffffff',
      buttonBg: 'rgba(255,255,255,.05)',
      buttonBorder: '#666666',
      buttonHover: '#ffffff22'
    },
    fonts: {
      title: "'Raleway', sans-serif",
      body: "'Inter', sans-serif"
    },
    effects: {
      glow: 'none',
      shadow: '0 2px 8px rgba(0,0,0,.5)',
      blur: 'blur(1px)'
    }
  },
  
  nature: {
    id: 'nature',
    name: 'Nature',
    desc: 'Thème organique et naturel',
    icon: 'fa-solid fa-leaf',
    price: 6000,
    unlocked: false,
    colors: {
      primary: '#88dd44',
      secondary: '#5a8a2a',
      background: 'radial-gradient(ellipse at 50% 30%, #0a1a00 0%, #000 70%)',
      cardBg: 'rgba(10,20,5,.85)',
      cardBorder: '#4a6a2a',
      text: '#c0e080',
      textDark: '#6a8a4a',
      accent: '#88dd44',
      buttonBg: 'rgba(136,221,68,.05)',
      buttonBorder: '#88dd44',
      buttonHover: '#88dd4422'
    },
    fonts: {
      title: "'Cinzel', serif",
      body: "'Lora', serif"
    },
    effects: {
      glow: '0 0 30px #88dd4466',
      shadow: '0 2px 0 #000',
      blur: 'blur(3px)'
    }
  },
  
  blood: {
    id: 'blood',
    name: 'Sang',
    desc: 'Sombre et menaçant',
    icon: 'fa-solid fa-skull',
    price: 10000,
    unlocked: false,
    colors: {
      primary: '#dd0000',
      secondary: '#880000',
      background: 'radial-gradient(ellipse at 50% 30%, #1a0000 0%, #000 70%)',
      cardBg: 'rgba(20,0,0,.85)',
      cardBorder: '#8a2a2a',
      text: '#e08080',
      textDark: '#8a4a4a',
      accent: '#dd0000',
      buttonBg: 'rgba(221,0,0,.05)',
      buttonBorder: '#dd0000',
      buttonHover: '#dd000022'
    },
    fonts: {
      title: "'Cinzel', serif",
      body: "'Crimson Pro', serif"
    },
    effects: {
      glow: '0 0 40px #dd000088',
      shadow: '0 2px 0 #000',
      blur: 'blur(4px)'
    }
  },
  
  gold: {
    id: 'gold',
    name: 'Or Royal',
    desc: 'Luxe et opulence',
    icon: 'fa-solid fa-crown',
    price: 15000,
    unlocked: false,
    colors: {
      primary: '#ffd700',
      secondary: '#b8860b',
      background: 'radial-gradient(ellipse at 50% 30%, #1a1000 0%, #000 70%)',
      cardBg: 'rgba(25,20,0,.85)',
      cardBorder: '#8a7a3a',
      text: '#ffe080',
      textDark: '#aa8a4a',
      accent: '#ffd700',
      buttonBg: 'rgba(255,215,0,.05)',
      buttonBorder: '#ffd700',
      buttonHover: '#ffd70022'
    },
    fonts: {
      title: "'Cinzel', serif",
      body: "'Lora', serif"
    },
    effects: {
      glow: '0 0 40px #ffd70088, 0 0 80px #ffd70044',
      shadow: '0 2px 0 #000',
      blur: 'blur(4px)'
    }
  },
  
  ice: {
    id: 'ice',
    name: 'Glace',
    desc: 'Froid et cristallin',
    icon: 'fa-solid fa-snowflake',
    price: 7000,
    unlocked: false,
    colors: {
      primary: '#66ddff',
      secondary: '#4488aa',
      background: 'radial-gradient(ellipse at 50% 30%, #001a2a 0%, #000 70%)',
      cardBg: 'rgba(0,20,30,.85)',
      cardBorder: '#4a6a8a',
      text: '#c0e0ff',
      textDark: '#6a8aaa',
      accent: '#66ddff',
      buttonBg: 'rgba(102,221,255,.05)',
      buttonBorder: '#66ddff',
      buttonHover: '#66ddff22'
    },
    fonts: {
      title: "'Cinzel', serif",
      body: "'Crimson Pro', serif"
    },
    effects: {
      glow: '0 0 30px #66ddff66',
      shadow: '0 2px 4px rgba(102,221,255,.3)',
      blur: 'blur(3px)'
    }
  }
};

// Current active theme
var currentTheme = 'medieval';

// Apply theme to UI
function applyUITheme(themeId) {
  const theme = UI_THEMES[themeId];
  if (!theme) {
    console.warn('Theme not found:', themeId);
    return;
  }
  
  currentTheme = themeId;
  const root = document.documentElement;
  
  // Apply CSS variables
  root.style.setProperty('--primary-color', theme.colors.primary);
  root.style.setProperty('--secondary-color', theme.colors.secondary);
  root.style.setProperty('--background', theme.colors.background);
  root.style.setProperty('--card-bg', theme.colors.cardBg);
  root.style.setProperty('--card-border', theme.colors.cardBorder);
  root.style.setProperty('--text-color', theme.colors.text);
  root.style.setProperty('--text-dark', theme.colors.textDark);
  root.style.setProperty('--accent-color', theme.colors.accent);
  root.style.setProperty('--button-bg', theme.colors.buttonBg);
  root.style.setProperty('--button-border', theme.colors.buttonBorder);
  root.style.setProperty('--button-hover', theme.colors.buttonHover);
  
  root.style.setProperty('--font-title', theme.fonts.title);
  root.style.setProperty('--font-body', theme.fonts.body);
  
  root.style.setProperty('--effect-glow', theme.effects.glow);
  root.style.setProperty('--effect-shadow', theme.effects.shadow);
  root.style.setProperty('--effect-blur', theme.effects.blur);
  
  // Save preference
  if (GameState && GameState.saveData) {
    GameState.saveData.selectedTheme = themeId;
    saveGame();
  }
  
  addNotif(`🎨 Thème "${theme.name}" activé !`, theme.colors.primary);
}

// Get theme info
function getThemeInfo(themeId) {
  return UI_THEMES[themeId] || UI_THEMES.medieval;
}

// Get all themes
function getAllThemes() {
  return Object.values(UI_THEMES);
}

function getUnifiedCurrency() {
  const money = (GameState && GameState.saveData && typeof GameState.saveData.money === 'number')
    ? GameState.saveData.money
    : 0;
  const gold = (GameState && GameState.saveData && typeof GameState.saveData.gold === 'number')
    ? GameState.saveData.gold
    : 0;
  return Math.max(money, gold);
}

function setUnifiedCurrency(amount) {
  const safeAmount = Math.max(0, Math.floor(amount));
  GameState.saveData.money = safeAmount;
  GameState.saveData.gold = safeAmount;
}

// Check if theme is unlocked
function isThemeUnlocked(themeId) {
  const theme = UI_THEMES[themeId];
  if (!theme) return false;
  if (theme.price === 0) return true;
  return GameState.saveData.unlockedThemes.includes(themeId);
}

// Buy theme
function buyTheme(themeId) {
  const theme = UI_THEMES[themeId];
  if (!theme) return false;
  
  if (isThemeUnlocked(themeId)) {
    addNotif('⚠ Thème déjà débloqué', '#ffaa00');
    return false;
  }
  
  const currentCurrency = getUnifiedCurrency();
  if (currentCurrency < theme.price) {
    addNotif('⚠ Pas assez de pièces d\'or', '#ff4444');
    return false;
  }
  
  setUnifiedCurrency(currentCurrency - theme.price);
  GameState.saveData.unlockedThemes.push(themeId);
  saveGame();
  
  addNotif(`✅ Thème "${theme.name}" acheté !`, '#00ff00');
  applyUITheme(themeId);
  
  return true;
}
