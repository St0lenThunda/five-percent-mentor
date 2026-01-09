import express from 'express'
import { Router } from 'express'

const router = Router()

/**
 * Auth Endpoints - Proxy to Neon Auth service
 * Following NGE Knowledge (1) -> Wisdom (2) -> Understanding (3)
 * 
 * Note: Neon Auth service requires the database name in the path.
 */

// POST /api/auth/sign-up
router.post( '/sign-up', async ( req, res ) => {
  try {
    const { email, password, name = 'User' } = req.body

    if ( !email || !password ) {
      return res.status( 400 ).json( { error: 'Email and password are required' } )
    }

    // Proxy to Neon Auth service
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
    await fetch( `${authUrl}/neondb/auth/sign-out`, { method: 'POST' } )
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
    const response = await fetch( `${authUrl}/neondb/auth/get-session` )

    if ( response.status === 401 || response.status === 404 ) {
      return res.status( 401 ).json( { user: null } )
    }

    if ( !response.ok ) {
      const text = await response.text()
      if ( text === 'null' ) {
        return res.status( 401 ).json( { user: null } )
      }
      throw new Error( 'Failed to fetch session' )
    }

    const data = await response.json()
    res.json( data )
  } catch ( error ) {
    console.error( 'Session check error:', error )
    res.status( 401 ).json( { user: null } )
  }
} )

export default router
