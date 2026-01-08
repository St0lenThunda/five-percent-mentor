import { pgTable, uuid, text, timestamp, boolean, integer, date } from 'drizzle-orm/pg-core'

export const userProfiles = pgTable( 'user_profiles', {
  id: uuid( 'id' ).primaryKey().defaultRandom(),
  username: text( 'username' ).notNull().unique(),
  email: text( 'email' ).notNull().unique(),
  currentModule: text( 'current_module' ).default( 'dashboard' ),
  themePreference: text( 'theme_preference' ).default( 'dark' ),
  createdAt: timestamp( 'created_at' ).defaultNow(),
  updatedAt: timestamp( 'updated_at' ).defaultNow()
} )

export const userProgress = pgTable( 'user_progress', {
  id: uuid( 'id' ).primaryKey().defaultRandom(),
  userId: uuid( 'user_id' ).references( () => userProfiles.id, { onDelete: 'cascade' } ),
  contentType: text( 'content_type' ).notNull(),
  contentId: text( 'content_id' ).notNull(),
  completedAt: timestamp( 'completed_at' ).defaultNow(),
  score: integer( 'score' )
} )

export const journalEntries = pgTable( 'journal_entries', {
  id: uuid( 'id' ).primaryKey().defaultRandom(),
  userId: uuid( 'user_id' ).references( () => userProfiles.id, { onDelete: 'cascade' } ),
  date: date( 'date' ).notNull(),
  mathematicsId: text( 'mathematics_id' ),
  entryText: text( 'entry_text' ).notNull(),
  createdAt: timestamp( 'created_at' ).defaultNow()
} )

export const cipherSessions = pgTable( 'cipher_sessions', {
  id: uuid( 'id' ).primaryKey().defaultRandom(),
  topic: text( 'topic' ).notNull(),
  createdBy: uuid( 'created_by' ).references( () => userProfiles.id ),
  createdAt: timestamp( 'created_at' ).defaultNow(),
  isActive: boolean( 'is_active' ).default( true )
} )

export const cipherMessages = pgTable( 'cipher_messages', {
  id: uuid( 'id' ).primaryKey().defaultRandom(),
  sessionId: uuid( 'session_id' ).references( () => cipherSessions.id, { onDelete: 'cascade' } ),
  userId: uuid( 'user_id' ).references( () => userProfiles.id ),
  message: text( 'message' ).notNull(),
  createdAt: timestamp( 'created_at' ).defaultNow()
} )

export const attributeLogs = pgTable( 'attribute_logs', {
  id: uuid( 'id' ).primaryKey().defaultRandom(),
  userId: uuid( 'user_id' ).references( () => userProfiles.id, { onDelete: 'cascade' } ),
  attributeId: text( 'attribute_id' ).notNull(),
  date: date( 'date' ).notNull(),
  completed: boolean( 'completed' ).default( false )
} )

export const assessmentResults = pgTable( 'assessment_results', {
  id: uuid( 'id' ).primaryKey().defaultRandom(),
  userId: uuid( 'user_id' ).references( () => userProfiles.id, { onDelete: 'cascade' } ),
  questionId: text( 'question_id' ).notNull(),
  response: text( 'response' ).notNull(),
  createdAt: timestamp( 'created_at' ).defaultNow()
} )

export const quizLogs = pgTable( 'quiz_logs', {
  id: uuid( 'id' ).primaryKey().defaultRandom(),
  userId: uuid( 'user_id' ).references( () => userProfiles.id, { onDelete: 'cascade' } ),
  score: integer( 'score' ).notNull(),
  totalQuestions: integer( 'total_questions' ).notNull(),
  topics: text( 'topics' ).array(),
  details: text( 'details' ),
  createdAt: timestamp( 'created_at' ).defaultNow()
} )

export const userAttributes = pgTable( 'user_attributes', {
  id: uuid( 'id' ).primaryKey().defaultRandom(),
  userId: uuid( 'user_id' ).references( () => userProfiles.id, { onDelete: 'cascade' } ),
  attributeId: text( 'attribute_id' ).notNull(),
  level: integer( 'level' ).default( 0 ),
  isBuilding: boolean( 'is_building' ).default( false ),
  updatedAt: timestamp( 'updated_at' ).defaultNow()
} )

export const masteryMetrics = pgTable( 'mastery_metrics', {
  id: uuid( 'id' ).primaryKey().defaultRandom(),
  userId: uuid( 'user_id' ).references( () => userProfiles.id, { onDelete: 'cascade' } ),
  contentId: text( 'content_id' ).notNull(),
  contentType: text( 'content_type' ).notNull(),
  correctCount: integer( 'correct_count' ).default( 0 ),
  mastered: boolean( 'mastered' ).default( false ),
  updatedAt: timestamp( 'updated_at' ).defaultNow()
} )
