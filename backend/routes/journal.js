import { Router } from 'express'
import { db } from '../db/client.js'
import { journalEntries } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const router = Router()

/**
 * Journal Endpoints
 * Born Day journals aligned with Supreme Mathematics
 */

// GET /api/journal/:userId
router.get( '/:userId', async ( req, res ) => {
  try {
    const { userId } = req.params
    
    const entries = await db.select()
      .from( journalEntries )
      .where( eq( journalEntries.userId, userId ) )
      .orderBy( journalEntries.date )

    res.json( entries )
  } catch ( error ) {
    console.error( 'Fetch journal error:', error )
    res.status( 500 ).json( { error: 'Failed to fetch journal entries' } )
  }
} )

// POST /api/journal
router.post( '/', async ( req, res ) => {
  try {
    const { userId, date, mathematicsId, entryText } = req.body

    if ( !userId || !date || !entryText ) {
      return res.status( 400 ).json( { error: 'Missing required fields' } )
    }

    const [ newEntry ] = await db.insert( journalEntries )
      .values( { userId, date, mathematicsId, entryText } )
      .returning()

    res.json( newEntry )
  } catch ( error ) {
    console.error( 'Create journal entry error:', error )
    res.status( 500 ).json( { error: 'Failed to create journal entry' } )
  }
} )

// PUT /api/journal/:id
router.put( '/:id', async ( req, res ) => {
  try {
    const { id } = req.params
    const { mathematicsId, entryText } = req.body

    const [ updated ] = await db.update( journalEntries )
      .set( { mathematicsId, entryText } )
      .where( eq( journalEntries.id, id ) )
      .returning()

    res.json( updated )
  } catch ( error ) {
    console.error( 'Update journal entry error:', error )
    res.status( 500 ).json( { error: 'Failed to update journal entry' } )
  }
} )

// DELETE /api/journal/:id
router.delete( '/:id', async ( req, res ) => {
  try {
    const { id } = req.params

    await db.delete( journalEntries )
      .where( eq( journalEntries.id, id ) )

    res.json( { success: true } )
  } catch ( error ) {
    console.error( 'Delete journal entry error:', error )
    res.status( 500 ).json( { error: 'Failed to delete journal entry' } )
  }
} )

export default router
