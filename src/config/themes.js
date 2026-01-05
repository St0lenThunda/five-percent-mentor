export const themes = {
  current: {
    name: 'Current (Vibrant)',
    dashboard: {
      bg: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900',
      cardBg: 'bg-gradient-to-br from-white/10 to-white/5',
      cardBorder: 'border-white/20',
      cardHover: 'hover:border-primary-500/50',
      icon: 'text-5xl',
      title: 'text-white group-hover:text-primary-400',
      description: 'text-purple-200'
    }
  },

  minimalist: {
    name: 'Minimalist Professional',
    dashboard: {
      bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900',
      cardBg: 'bg-slate-800/50',
      cardBorder: 'border-slate-700',
      cardHover: 'hover:border-slate-500',
      icon: 'text-4xl text-slate-400',
      title: 'text-slate-100 group-hover:text-slate-50',
      description: 'text-slate-400'
    }
  },

  afrocentric: {
    name: 'Elegant Afrocentric',
    dashboard: {
      bg: 'bg-gradient-to-br from-orange-950 via-amber-950 to-stone-950',
      cardBg: 'bg-gradient-to-br from-orange-900/30 to-amber-900/20',
      cardBorder: 'border-orange-800/50',
      cardHover: 'hover:border-orange-600/80 hover:shadow-orange-900/50',
      icon: 'text-5xl',
      title: 'text-orange-100 group-hover:text-orange-400',
      description: 'text-amber-200/80'
    }
  },

  darkAcademia: {
    name: 'Dark Academia',
    dashboard: {
      bg: 'bg-gradient-to-br from-neutral-950 via-stone-950 to-zinc-950',
      cardBg: 'bg-stone-900/40',
      cardBorder: 'border-stone-800/60',
      cardHover: 'hover:border-amber-900/80 hover:shadow-2xl',
      icon: 'text-4xl text-amber-800',
      title: 'text-stone-200 group-hover:text-amber-600',
      description: 'text-stone-400'
    }
  },

  brutalist: {
    name: 'Neo-Brutalist',
    dashboard: {
      bg: 'bg-black',
      cardBg: 'bg-white/5',
      cardBorder: 'border-white border-2',
      cardHover: 'hover:bg-amber-500/10 hover:translate-x-1 hover:translate-y-1',
      icon: 'text-4xl text-white font-black',
      title: 'text-white group-hover:text-amber-500 font-black uppercase',
      description: 'text-gray-300 font-mono text-xs'
    }
  }
}

export const themeIcons = {
  current: {
    1: '🔢', 2: '🔤', 3: '📖', 4: '💬',
    5: '📔', 6: '📚', 7: '⭐', 8: '✍️'
  },
  minimalist: {
    1: '▪', 2: '▫', 3: '►', 4: '◄',
    5: '●', 6: '○', 7: '◆', 8: '◇'
  },
  afrocentric: {
    1: '🔢', 2: '🔤', 3: '📖', 4: '💬',
    5: '📔', 6: '📚', 7: '⭐', 8: '✍️'
  },
  darkAcademia: {
    1: '⚛', 2: '⚖', 3: '✦', 4: '✧',
    5: '⚘', 6: '◈', 7: '⚔', 8: '✒'
  },
  brutalist: {
    1: '■', 2: '▲', 3: '●', 4: '◆',
    5: '▼', 6: '◀', 7: '▶', 8: '⬤'
  }
}
