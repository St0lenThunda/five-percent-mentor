// Mock authentication service - simulates backend without actual API calls
export class MockAuth {
  constructor() {
    this.storageKey = 'mock_auth_user'
  }

  async signUp ( email, password, username ) {
    // Simulate network delay
    await this.delay( 500 )

    // Create mock user
    const user = {
      id: this.generateId(),
      email,
      username: username || email.split( '@' )[0],
      createdAt: new Date().toISOString()
    }

    // Store in localStorage
    localStorage.setItem( this.storageKey, JSON.stringify( user ) )

    return user
  }

  async signIn ( email, password ) {
    // Simulate network delay
    await this.delay( 500 )

    // Check if user exists in localStorage
    let user = this.getCurrentUser()

    // If no user exists, create a demo user
    if ( !user ) {
      user = {
        id: this.generateId(),
        email,
        username: email.split( '@' )[0],
        createdAt: new Date().toISOString()
      }
      localStorage.setItem( this.storageKey, JSON.stringify( user ) )
    }

    return user
  }

  async signOut () {
    // Simulate network delay
    await this.delay( 300 )

    localStorage.removeItem( this.storageKey )
    return { success: true }
  }

  getCurrentUser () {
    const userJson = localStorage.getItem( this.storageKey )
    if ( !userJson ) return null

    try {
      return JSON.parse( userJson )
    } catch ( e ) {
      return null
    }
  }

  // Helper methods
  delay ( ms ) {
    return new Promise( resolve => setTimeout( resolve, ms ) )
  }

  generateId () {
    return 'user_' + Math.random().toString( 36 ).substr( 2, 9 )
  }
}

export const mockAuth = new MockAuth()
