import { Router } from 'express'
import { db } from '../db/client.js'
import { masteryMetrics } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'

const router = Router()

/**
 * Mastery Endpoints
 * Track mastery of Supreme Mathematics and Supreme Alphabet
 */

// GET /api/mastery/:userId
router.get( '/:userId', async ( req, res ) => {
  try {
    const { userId } = req.params
    
    const metrics = await db.select()
      .from( masteryMetrics )
      .where( eq( masteryMetrics.userId, userId ) )

    res.json( metrics )
  } catch ( error ) {
    console.error( 'Fetch mastery error:', error )
    res.status( 500 ).json( { error: 'Failed to fetch mastery metrics' } )
  }
} )

// POST /api/mastery
router.post( '/', async ( req, res ) => {
  try {
    const { userId, contentId, contentType, correctCount, mastered } = req.body

    if ( !userId || !contentId || !contentType ) {
      return res.status( 400 ).json( { error: 'Missing required fields' } )
    }

    // Check if metric exists
    const existing = await db.select()
      .from( masteryMetrics )
      .where( and(
        eq( masteryMetrics.userId, userId ),
        eq( masteryMetrics.contentId, contentId ),
        eq( masteryMetrics.contentType, contentType )
      ) )

    if ( existing.length > 0 ) {
      // Update existing
      const [ updated ] = await db.update( masteryMetrics )
        .set( { 
          correctCount: correctCount || existing[0].correctCount,
          mastered: mastered !== undefined ? mastered : existing[0].mastered,
          updatedAt: new Date()
        } )
        .where( and(
          eq( masteryMetrics.userId, userId ),
          eq( masteryMetrics.contentId, contentId ),
          eq( masteryMetrics.contentType, contentType )
        ) )
        .returning()

      return res.json( updated )
    }

    // Create new
    const [ newMetric ] = await db.insert( masteryMetrics )
      .values( { 
        userId, 
        contentId, 
        contentType, 
        correctCount: correctCount || 0,
        mastered: mastered || false
      } )
      .returning()

    res.json( newMetric )
  } catch ( error ) {
    console.error( 'Update mastery error:', error )
    res.status( 500 ).json( { error: 'Failed to update mastery' } )
  }
} )

// PUT /api/mastery/:id - Mark as mastered
router.put( '/:id', async ( req, res ) => {
  try {
    const { id } = req.params
    const { mastered } = req.body

    const [ updated ] = await db.update( masteryMetrics )
      .set( { mastered, updatedAt: new Date() } )
      .where( eq( masteryMetrics.id, id ) )
      .returning()

    res.json( updated )
  } catch ( error ) {
    console.error( 'Update mastery status error:', error )
    res.status( 500 ).json( { error: 'Failed to update mastery status' } )
  }
} )

export default router
