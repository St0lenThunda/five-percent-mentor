import { defineStore } from 'pinia'
import { neonAuth } from '../auth/neon-auth'
import { db } from '../db/client'
import { userProfiles } from '../db/schema'
import { eq } from 'drizzle-orm'
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
        // 1. Check Neon Auth Session
        console.log( 'Checking Neon Auth Session...' )
        const neonUser = await neonAuth.getCurrentUser()
        console.log( 'Neon User Session:', neonUser )

        if ( neonUser ) {
          this.currentUser = neonUser
          this.isAuthenticated = true
          // 2. Fetch or Create Profile
          await this.fetchUserProfile( neonUser.email )

          // 3. Load progress if profile found
          if ( this.userProfile ) {
            const progressStore = useProgressStore()
            await progressStore.fetchUserProgress()
          }
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
        // 1. Create Neon Auth User
        const authResult = await neonAuth.signUp( email, password )
        if ( authResult.error ) throw new Error( authResult.error )

        // 2. Create DB Profile
        const [profile] = await db.insert( userProfiles ).values( {
          username,
          email,
          themePreference: 'current', // Default theme
          currentModule: 'dashboard'
        } ).returning()

        this.currentUser = authResult
        this.userProfile = profile
        this.isAuthenticated = true

        return profile
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
        // 1. Neon Auth Sign In
        const authResult = await neonAuth.signIn( email, password )
        if ( authResult.error ) throw new Error( authResult.error )

        // 2. Set State
        this.currentUser = authResult
        this.isAuthenticated = true

        // 3. Fetch Profile
        await this.fetchUserProfile( email )

        // 4. Load User Progress
        const progressStore = useProgressStore()
        await progressStore.fetchUserProgress()

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
        await neonAuth.signOut()
        this.currentUser = null
        this.userProfile = null
        this.isAuthenticated = false
      } catch ( error ) {
        console.error( 'Sign Out Error:', error )
      } finally {
        this.loading = false
      }
    },

    async fetchUserProfile ( email ) {
      try {
        const [profile] = await db.select()
          .from( userProfiles )
          .where( eq( userProfiles.email, email ) )

        if ( profile ) {
          this.userProfile = profile
        }
      } catch ( error ) {
        console.error( 'Fetch Profile Error:', error )
      }
    }
  }
} )
