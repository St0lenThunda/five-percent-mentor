import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import progressRoutes from './routes/progress.js'
import journalRoutes from './routes/journal.js'
import attributesRoutes from './routes/attributes.js'
import masteryRoutes from './routes/mastery.js'

/**
 * Five Percent Mentor Backend API / Full-Stack Server
 * Knowledge (1) -> Wisdom (2) -> Understanding (3)
 * 
 * This server handles database operations, authentication,
 * and serves the frontend application in production.
 */

const __dirname = path.dirname( fileURLToPath( import.meta.url ) )
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
  // Only log if not a static file request
  if ( !req.path.includes( '.' ) ) {
    console.log( `${req.method} ${req.path}` )
  }
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

// Serve static files from frontend build
const distPath = path.join( __dirname, '../dist' )
app.use( express.static( distPath ) )

// SPA Routing: Redirect all non-API requests to index.html
app.get( '*', ( req, res ) => {
  if ( !req.path.startsWith( '/api' ) ) {
    res.sendFile( path.join( distPath, 'index.html' ) )
  } else {
    res.status( 404 ).json( { error: 'API route not found' } )
  }
} )

// Error handling middleware
app.use( ( err, req, res, next ) => {
  console.error( 'Server error:', err )
  res.status( 500 ).json( { error: 'Internal server error' } )
} )

// Start server
app.listen( PORT, () => {
  console.log( `\n🌟 Five Percent Mentor - Full Stack Server` )
  console.log( `📐 Server running on port ${PORT}` )
  console.log( `📦 Serving UI from: ${distPath}` )
  console.log( `✊🏿 Peace.\n` )
} )
