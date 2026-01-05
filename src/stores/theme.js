import { defineStore } from 'pinia'

export const useThemeStore = defineStore( 'theme', {
  state: () => ( {
    currentTheme: localStorage.getItem( 'app_theme' ) || 'current'
  } ),
  actions: {
    setTheme ( themeName ) {
      this.currentTheme = themeName
      localStorage.setItem( 'app_theme', themeName )
    }
  }
} )
