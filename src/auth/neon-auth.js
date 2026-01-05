export class NeonAuth {
  constructor() {
    // We use a relative path to leverage the Vite proxy in development (avoiding CORS).
    // The managed Neon Auth service is a storage proxy that requires the database name in the path.
    this.baseUrl = '/neondb/auth'
  }

  async signUp ( email, password, name = 'User' ) {
    try {
      console.log( 'Auth: Registering', email )
      // Standard Better Auth endpoint for signup is /sign-up/email (requires name)
      const response = await fetch( `${this.baseUrl}/sign-up/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email, password, name } )
      } )

      if ( !response.ok ) {
        const error = await response.json()
        throw new Error( error.message || 'Sign up failed' )
      }

      // Handle empty response body
      const text = await response.text()
      if ( !text ) return { success: true }
      return JSON.parse( text )?.user || { success: true }
    } catch ( error ) {
      console.error( 'Auth Sign Up Error:', error )
      throw error
    }
  }

  async signIn ( email, password ) {
    try {
      console.log( 'Auth: Signing in', email )
      // Standard Better Auth endpoint for email/password is /sign-in/email
      const response = await fetch( `${this.baseUrl}/sign-in/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( {
          email,
          password
        } )
      } )

      if ( !response.ok ) {
        const error = await response.json()
        throw new Error( error.message || 'Sign in failed' )
      }

      const result = await response.json()
      return result.user
    } catch ( error ) {
      console.error( 'Auth Sign In Error:', error )
      throw error
    }
  }

  async signOut () {
    try {
      await fetch( `${this.baseUrl}/sign-out`, { method: 'POST' } )
      return { success: true }
    } catch ( error ) {
      console.error( 'Auth Sign Out Error:', error )
      throw error
    }
  }

  async getCurrentUser () {
    try {
      console.log( 'Auth: Checking session' )
      // Standard Better Auth endpoint for session is /get-session
      const response = await fetch( `${this.baseUrl}/get-session` )

      if ( response.status === 401 || response.status === 404 ) {
        return null
      }

      if ( !response.ok ) {
        const text = await response.text()
        // If it's the string "null", it means no session
        if ( text === 'null' ) return null
        throw new Error( 'Failed to fetch session' )
      }

      const data = await response.json()
      return data?.user || null
    } catch ( error ) {
      // Quietly return null for session checks
      return null
    }
  }
}

export const neonAuth = new NeonAuth()
