import { Router } from 'express'
import { db } from '../db/client.js'
import { userProgress } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'

const router = Router()

/**
 * Progress Endpoints
 * Track user completion and mastery of NGE content
 */

// GET /api/progress/:userId
router.get( '/:userId', async ( req, res ) => {
  try {
    const { userId } = req.params
    
    const progress = await db.select()
      .from( userProgress )
      .where( eq( userProgress.userId, userId ) )

    res.json( progress )
  } catch ( error ) {
    console.error( 'Fetch progress error:', error )
    res.status( 500 ).json( { error: 'Failed to fetch progress' } )
  }
} )

// POST /api/progress
router.post( '/', async ( req, res ) => {
  try {
    const { userId, contentType, contentId, score } = req.body

    if ( !userId || !contentType || !contentId ) {
      return res.status( 400 ).json( { error: 'Missing required fields' } )
    }

    const [ newProgress ] = await db.insert( userProgress )
      .values( { userId, contentType, contentId, score } )
      .returning()

    res.json( newProgress )
  } catch ( error ) {
    console.error( 'Create progress error:', error )
    res.status( 500 ).json( { error: 'Failed to create progress' } )
  }
} )

// DELETE /api/progress/:id
router.delete( '/:id', async ( req, res ) => {
  try {
    const { id } = req.params

    await db.delete( userProgress )
      .where( eq( userProgress.id, id ) )

    res.json( { success: true } )
  } catch ( error ) {
    console.error( 'Delete progress error:', error )
    res.status( 500 ).json( { error: 'Failed to delete progress' } )
  }
} )

export default router
