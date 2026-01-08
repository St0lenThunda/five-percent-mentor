import { defineStore } from 'pinia'
import { api } from '../utils/api-client'
import { useProgressStore } from './progress'

export const useUserStore = defineStore( 'user', {
  state: () => ( {
    currentUser: null,
    userProfile: null,
    isAuthenticated: false,
    initialized: false,
    loading: false,
    error: null
  } ),
  getters: {
    user: ( state ) => state.userProfile
  },
  actions: {
    async init () {
      this.loading = true
      try {
        // Check session via backend API
        console.log( 'Checking session...' )
        const sessionData = await api.getSession()
        console.log( 'Session data:', sessionData )

        if ( sessionData && sessionData.user ) {
          this.currentUser = sessionData.user
          this.isAuthenticated = true

          // Fetch user profile (assuming it's included in session or needs separate call)
          this.userProfile = sessionData.user

          // Load progress
          const progressStore = useProgressStore()
          await progressStore.fetchUserProgress()
        } else {
          console.warn( 'No active session found' )
          this.currentUser = null
          this.isAuthenticated = false
          this.userProfile = null
        }
      } catch ( error ) {
        console.error( 'Auth Init Error:', error )
        this.error = error.message
        this.currentUser = null
        this.isAuthenticated = false
      } finally {
        this.loading = false
        this.initialized = true
      }
    },

    async signUp ( username, email, password ) {
      this.loading = true
      this.error = null
      try {
        // Sign up via backend API
        const result = await api.signUp( email, password, username )

        if ( result && result.user ) {
          this.currentUser = result.user
          this.userProfile = result.user
          this.isAuthenticated = true

          return result.user
        }
      } catch ( error ) {
        console.error( 'Sign Up Error:', error )
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async signIn ( email, password ) {
      this.loading = true
      this.error = null
      try {
        // Sign in via backend API
        const result = await api.signIn( email, password )

        if ( result && result.user ) {
          this.currentUser = result.user
          this.userProfile = result.user
          this.isAuthenticated = true

          // Load user progress
          const progressStore = useProgressStore()
          await progressStore.fetchUserProgress()
        }
      } catch ( error ) {
        console.error( 'Sign In Error:', error )
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async signOut () {
      this.loading = true
      try {
        await api.signOut()
        this.currentUser = null
        this.userProfile = null
        this.isAuthenticated = false
      } catch ( error ) {
        console.error( 'Sign Out Error:', error )
      } finally {
        this.loading = false
      }
    }
  }
} )
