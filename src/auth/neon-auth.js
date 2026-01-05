export class NeonAuth {
  constructor() {
    // We use a relative path to leverage the Vite proxy in development (avoiding CORS).
    // The proxy in vite.config.js forwards '/neondb/auth' to the real verified Neon URL:
    // https://ep-damp-block-a4y6qb9h.us-east-1.aws.neon.tech
    // In production, this logic might need adjustment if not served from the same origin,
    // but for this dev setup, relative is key.
    this.authUrl = '/neondb/auth'
    console.log( 'Neon Auth URL configured as:', this.authUrl )
  }

  async signUp ( email, password ) {
    const response = await fetch( `${this.authUrl}/sign-up/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { email, password } )
    } )
    return response.json()
  }

  async signIn ( email, password ) {
    const response = await fetch( `${this.authUrl}/sign-in/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { email, password } ),
      credentials: 'include'
    } )
    return response.json()
  }

  async signOut () {
    const response = await fetch( `${this.authUrl}/sign-out`, {
      method: 'POST',
      credentials: 'include'
    } )
    return response.json()
  }

  async getCurrentUser () {
    const response = await fetch( `${this.authUrl}/session`, {
      credentials: 'include'
    } )
    if ( !response.ok ) return null
    return response.json()
  }
}

export const neonAuth = new NeonAuth()
