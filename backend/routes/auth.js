import express from 'express'
import { Router } from 'express'

const router = Router()

/**
 * Auth Endpoints - Proxy to Neon Auth service
 * Following NGE Knowledge (1) -> Wisdom (2) -> Understanding (3)
 * 
 * Note: We forward cookies between the client and Neon Auth to maintain sessions.
 */

// Helper to forward cookies from Neon Auth response to our client
const forwardCookies = ( neonResponse, res ) => {
  const setCookie = neonResponse.headers.get( 'set-cookie' )
  if ( setCookie ) {
    res.setHeader( 'Set-Cookie', setCookie )
  }
}

// POST /api/auth/sign-up
router.post( '/sign-up', async ( req, res ) => {
  try {
    const { email, password, name = 'User' } = req.body

    if ( !email || !password ) {
      return res.status( 400 ).json( { error: 'Email and password are required' } )
    }

    const authUrl = process.env.NEON_AUTH_URL
    const response = await fetch( `${authUrl}/neondb/auth/sign-up/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { email, password, name } )
    } )

    if ( !response.ok ) {
      const error = await response.json()
      return res.status( response.status ).json( error )
    }

    forwardCookies( response, res )
    const text = await response.text()
    const result = text ? JSON.parse( text ) : { success: true }
    
    res.json( result )
  } catch ( error ) {
    console.error( 'Sign-up error:', error )
    res.status( 500 ).json( { error: 'Internal server error' } )
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
    const response = await fetch( `${authUrl}/neondb/auth/sign-in/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { email, password } )
    } )

    if ( !response.ok ) {
      const error = await response.json()
      return res.status( response.status ).json( error )
    }

    forwardCookies( response, res )
    const result = await response.json()
    res.json( result )
  } catch ( error ) {
    console.error( 'Sign-in error:', error )
    res.status( 500 ).json( { error: 'Internal server error' } )
  }
} )

// POST /api/auth/sign-out
router.post( '/sign-out', async ( req, res ) => {
  try {
    const authUrl = process.env.NEON_AUTH_URL
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
    const authUrl = process.env.NEON_AUTH_URL
    const response = await fetch( `${authUrl}/neondb/auth/get-session`, {
      headers: { 'Cookie': req.headers.cookie || '' }
    } )

    // If not logged in, return 200 with user: null to avoid console errors
    if ( response.status === 401 || response.status === 404 ) {
      return res.json( { user: null } )
    }

    if ( !response.ok ) {
      const text = await response.text()
      if ( text === 'null' ) {
        return res.json( { user: null } )
      }
      throw new Error( 'Failed to fetch session' )
    }

    const data = await response.json()
    res.json( data )
  } catch ( error ) {
    console.error( 'Session check error:', error )
    res.json( { user: null } )
  }
} )

export default router
