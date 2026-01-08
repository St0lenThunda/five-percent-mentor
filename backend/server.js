import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import progressRoutes from './routes/progress.js'
import journalRoutes from './routes/journal.js'
import attributesRoutes from './routes/attributes.js'
import masteryRoutes from './routes/mastery.js'

/**
 * Five Percent Mentor Backend API
 * Knowledge (1) -> Wisdom (2) -> Understanding (3)
 * 
 * This server handles database operations and authentication
 * for the NGE knowledge management system.
 */

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use( cors( {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
} ) )
app.use( express.json() )

// Request logging
app.use( ( req, res, next ) => {
  console.log( `${req.method} ${req.path}` )
  next()
} )

// Health check
app.get( '/health', ( req, res ) => {
  res.json( { 
    status: 'operational',
    message: 'Knowledge is the foundation. Peace.' 
  } )
} )

// API Routes
app.use( '/api/auth', authRoutes )
app.use( '/api/progress', progressRoutes )
app.use( '/api/journal', journalRoutes )
app.use( '/api/attributes', attributesRoutes )
app.use( '/api/mastery', masteryRoutes )

// Error handling middleware
app.use( ( err, req, res, next ) => {
  console.error( 'Server error:', err )
  res.status( 500 ).json( { error: 'Internal server error' } )
} )

// 404 handler
app.use( ( req, res ) => {
  res.status( 404 ).json( { error: 'Route not found' } )
} )

// Start server
app.listen( PORT, () => {
  console.log( `\n🌟 Five Percent Mentor API` )
  console.log( `📐 Server running on port ${PORT}` )
  console.log( `🔗 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}` )
  console.log( `✊🏿 Peace.\n` )
} )
