const sacredDark = {
  name: 'Sacred Dark',
  dashboard: {
    bg: 'bg-transparent', // Handled by global css now
    cardBg: 'backdrop-blur-xl bg-white/5',
    cardBorder: 'border-white/10',
    cardHover: 'hover:border-primary-500/50 hover:bg-primary-500/5',
    icon: 'text-5xl drop-shadow-2xl',
    title: 'text-white group-hover:text-primary-400 group-hover:tracking-tight transition-all',
    description: 'text-purple-200/60'
  }
}

export const themes = {
  current: sacredDark,
  minimalist: sacredDark,
  afrocentric: sacredDark,
  darkAcademia: sacredDark,
  brutalist: sacredDark
}

export const themeIcons = {
  current: {
    1: '🔢', 2: '🔤', 3: '📖', 4: '💬',
    5: '📔', 6: '📚', 7: '⭐', 8: '✍️', 9: '🗺️'
  },
  minimalist: {
    1: '▪', 2: '▫', 3: '►', 4: '◄',
    5: '●', 6: '○', 7: '◆', 8: '◇', 9: '◎'
  },
  afrocentric: {
    1: '🔢', 2: '🔤', 3: '📖', 4: '💬',
    5: '📔', 6: '📚', 7: '⭐', 8: '✍️', 9: '🗺️'
  },
  darkAcademia: {
    1: '⚛', 2: '⚖', 3: '✦', 4: '✧',
    5: '⚘', 6: '◈', 7: '⚔', 8: '✒', 9: '⊛'
  },
  brutalist: {
    1: '■', 2: '▲', 3: '●', 4: '◆',
    5: '▼', 6: '◀', 7: '▶', 8: '⬤', 9: '◉'
  }
}
