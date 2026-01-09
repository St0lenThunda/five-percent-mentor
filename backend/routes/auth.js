import express from 'express'
import { Router } from 'express'

const router = Router()

// Helper to sanitize and prepare the Auth URL
const getAuthUrl = () => {
  let url = process.env.NEON_AUTH_URL
  if ( !url ) return null

  // Ensure it has a protocol
  if ( !url.startsWith( 'http' ) ) {
    url = `https://${url}`
  }

  // Remove trailing slash
  return url.replace( /\/+$/, '' )
}

/**
 * Auth Endpoints - Proxy to Neon Auth service
 * Following NGE Knowledge (1) -> Wisdom (2) -> Understanding (3)
 * 
 * Note: We forward cookies between the client and Neon Auth to maintain sessions.
 */

// Helper to forward cookies from Neon Auth response to our client correctly
// Node fetch joins multiple Set-Cookie headers with a comma, which is invalid
// for Set-Cookie. We need to handle this properly.
const forwardCookies = ( neonResponse, res ) => {
  // If using Node 20+ native fetch, we can use getSetCookie()
  if ( typeof neonResponse.headers.getSetCookie === 'function' ) {
    const cookies = neonResponse.headers.getSetCookie()
    if ( cookies && cookies.length > 0 ) {
      res.setHeader( 'Set-Cookie', cookies )
    }
    return
  }

  // Fallback for older environments or when getSetCookie is missing
  const setCookie = neonResponse.headers.get( 'set-cookie' )
  if ( setCookie ) {
    // Note: This is less reliable as cookies can contain commas
    res.setHeader( 'Set-Cookie', setCookie )
  }
}

// Helper to parse JSON safely
const safeJson = async ( response ) => {
  try {
    const text = await response.text()
    return text ? JSON.parse( text ) : null
  } catch ( e ) {
    return null
  }
}

// POST /api/auth/sign-up
router.post( '/sign-up', async ( req, res ) => {
  try {
    const { email, password, name = 'User' } = req.body

    if ( !email || !password ) {
      return res.status( 400 ).json( { error: 'Email and password are required' } )
    }

    const authUrl = getAuthUrl()
    if ( !authUrl ) {
      throw new Error( 'NEON_AUTH_URL is not configured' )
    }

    const response = await fetch( `${authUrl}/neondb/auth/sign-up/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { email, password, name } )
    } )

    const result = await safeJson( response )

    if ( !response.ok ) {
      return res.status( response.status ).json( result || { error: 'Auth service error' } )
    }

    forwardCookies( response, res )
    res.json( result || { success: true } )
  } catch ( error ) {
    console.error( 'Sign-up error:', error )
    res.status( 500 ).json( {
      error: 'Internal server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    } )
  }
} )

// POST /api/auth/sign-in
router.post( '/sign-in', async ( req, res ) => {
  try {
    const { email, password } = req.body

    if ( !email || !password ) {
      return res.status( 400 ).json( { error: 'Email and password are required' } )
    }

    const authUrl = process.env.NEON_AUTH_URL
    console.log( `Attempting sign-in proxy to: ${authUrl}` )

    const response = await fetch( `${authUrl}/neondb/auth/sign-in/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { email, password } )
    } )

    console.log( `Auth service response status: ${response.status}` )
    const result = await safeJson( response )

    if ( !response.ok ) {
      return res.status( response.status ).json( result || { error: 'Auth service error' } )
    }

    forwardCookies( response, res )
    res.json( result )
  } catch ( error ) {
    console.error( 'Sign-in error:', error )
    res.status( 500 ).json( {
      error: 'Internal server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    } )
  }
} )

// POST /api/auth/sign-out
router.post( '/sign-out', async ( req, res ) => {
  try {
    const authUrl = getAuthUrl()
    console.log( `Sign-out proxy to: ${authUrl}` )
    if ( !authUrl ) {
      throw new Error( 'NEON_AUTH_URL is not configured' )
    }

    const response = await fetch( `${authUrl}/neondb/auth/sign-out`, {
      method: 'POST',
      headers: { 'Cookie': req.headers.cookie || '' }
    } )
    forwardCookies( response, res )
    res.json( { success: true } )
  } catch ( error ) {
    console.error( 'Sign-out error:', error )
    res.status( 500 ).json( { error: 'Internal server error' } )
  }
} )

// GET /api/auth/session
router.get( '/session', async ( req, res ) => {
  try {
    const authUrl = getAuthUrl()
    if ( !authUrl ) {
      console.error( 'Session check failed: NEON_AUTH_URL not configured' )
      return res.json( { user: null } )
    }

    const response = await fetch( `${authUrl}/neondb/auth/get-session`, {
      headers: { 'Cookie': req.headers.cookie || '' }
    } )

    // If not logged in, return 200 with user: null to avoid console errors
    if ( response.status === 401 || response.status === 404 ) {
      return res.json( { user: null } )
    }

    const data = await safeJson( response )

    if ( !response.ok || !data ) {
      return res.json( { user: null } )
    }

    res.json( data )
  } catch ( error ) {
    console.error( 'Session check error:', error )
    res.json( { user: null } )
  }
} )

export default router
