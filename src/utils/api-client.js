/**
 * API Client for Five Percent Mentor Backend
 * Handles all HTTP requests to the Express API
 */

const isProduction = import.meta.env.PROD
const API_BASE_URL = isProduction
  ? '/api'
  : ( import.meta.env.VITE_API_URL || 'http://localhost:3000/api' )

class ApiClient {
  async request( endpoint, options = {} ) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include', // For session cookies
      ...options
    }

    try {
      const response = await fetch( url, config )
      
      if ( !response.ok ) {
        const error = await response.json()
        throw new Error( error.error || 'Request failed' )
      }

      // Handle empty responses
      const text = await response.text()
      return text ? JSON.parse( text ) : null
    } catch ( error ) {
      console.error( `API Error [${endpoint}]:`, error )
      throw error
    }
  }

  // Auth methods
  async signUp( email, password, name ) {
    return this.request( '/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify( { email, password, name } )
    } )
  }

  async signIn( email, password ) {
    return this.request( '/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify( { email, password } )
    } )
  }

  async signOut() {
    return this.request( '/auth/sign-out', {
      method: 'POST'
    } )
  }

  async getSession() {
    return this.request( '/auth/session' )
  }

  // Progress methods
  async getProgress( userId ) {
    return this.request( `/progress/${userId}` )
  }

  async createProgress( data ) {
    return this.request( '/progress', {
      method: 'POST',
      body: JSON.stringify( data )
    } )
  }

  async deleteProgress( id ) {
    return this.request( `/progress/${id}`, {
      method: 'DELETE'
    } )
  }

  // Journal methods
  async getJournalEntries( userId ) {
    return this.request( `/journal/${userId}` )
  }

  async createJournalEntry( data ) {
    return this.request( '/journal', {
      method: 'POST',
      body: JSON.stringify( data )
    } )
  }

  async updateJournalEntry( id, data ) {
    return this.request( `/journal/${id}`, {
      method: 'PUT',
      body: JSON.stringify( data )
    } )
  }

  async deleteJournalEntry( id ) {
    return this.request( `/journal/${id}`, {
      method: 'DELETE'
    } )
  }

  // Attributes methods
  async getAttributes( userId ) {
    return this.request( `/attributes/${userId}` )
  }

  async saveAttribute( data ) {
    return this.request( '/attributes', {
      method: 'POST',
      body: JSON.stringify( data )
    } )
  }

  async logAttributeCompletion( userId, data ) {
    return this.request( `/attributes/${userId}/log`, {
      method: 'POST',
      body: JSON.stringify( data )
    } )
  }

  // Mastery methods
  async getMasteryMetrics( userId ) {
    return this.request( `/mastery/${userId}` )
  }

  async updateMasteryMetric( data ) {
    return this.request( '/mastery', {
      method: 'POST',
      body: JSON.stringify( data )
    } )
  }

  async markAsMastered( id, mastered ) {
    return this.request( `/mastery/${id}`, {
      method: 'PUT',
      body: JSON.stringify( { mastered } )
    } )
  }
}

export const api = new ApiClient()
