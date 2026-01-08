import { Router } from 'express'
import { db } from '../db/client.js'
import { userAttributes, attributeLogs } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'

const router = Router()

/**
 * Attributes Endpoints
 * Track the 14 Attributes of a Righteous Person
 */

// GET /api/attributes/:userId
router.get( '/:userId', async ( req, res ) => {
  try {
    const { userId } = req.params
    
    const attributes = await db.select()
      .from( userAttributes )
      .where( eq( userAttributes.userId, userId ) )

    res.json( attributes )
  } catch ( error ) {
    console.error( 'Fetch attributes error:', error )
    res.status( 500 ).json( { error: 'Failed to fetch attributes' } )
  }
} )

// POST /api/attributes
router.post( '/', async ( req, res ) => {
  try {
    const { userId, attributeId, level, isBuilding } = req.body

    if ( !userId || !attributeId ) {
      return res.status( 400 ).json( { error: 'Missing required fields' } )
    }

    // Check if attribute already exists
    const existing = await db.select()
      .from( userAttributes )
      .where( and(
        eq( userAttributes.userId, userId ),
        eq( userAttributes.attributeId, attributeId )
      ) )

    if ( existing.length > 0 ) {
      // Update existing
      const [ updated ] = await db.update( userAttributes )
        .set( { level, isBuilding, updatedAt: new Date() } )
        .where( and(
          eq( userAttributes.userId, userId ),
          eq( userAttributes.attributeId, attributeId )
        ) )
        .returning()

      return res.json( updated )
    }

    // Create new
    const [ newAttribute ] = await db.insert( userAttributes )
      .values( { userId, attributeId, level: level || 0, isBuilding: isBuilding || false } )
      .returning()

    res.json( newAttribute )
  } catch ( error ) {
    console.error( 'Create/update attribute error:', error )
    res.status( 500 ).json( { error: 'Failed to save attribute' } )
  }
} )

// POST /api/attributes/:userId/log
router.post( '/:userId/log', async ( req, res ) => {
  try {
    const { userId } = req.params
    const { attributeId, date, completed } = req.body

    if ( !attributeId || !date ) {
      return res.status( 400 ).json( { error: 'Missing required fields' } )
    }

    const [ log ] = await db.insert( attributeLogs )
      .values( { userId, attributeId, date, completed: completed || false } )
      .returning()

    res.json( log )
  } catch ( error ) {
    console.error( 'Log attribute error:', error )
    res.status( 500 ).json( { error: 'Failed to log attribute' } )
  }
} )

export default router
