import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../db/client'
import { userProgress, quizLogs, masteryMetrics as masteryTable } from '../db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { useUserStore } from './user'

export const useProgressStore = defineStore( 'progress', () => {
  const quizCount = ref( 0 )
  const quizHistory = ref( [] )
  const flashcardCount = ref( 0 )
  const masteredCount = ref( 0 )
  const streakDays = ref( 0 )
  const completedContent = ref( [] )
  const masteryMetrics = ref( [] )
  const isLoading = ref( false )
  const userStore = useUserStore()
  const lastMastery = ref( null ) // For notification system

  const fetchUserProgress = async () => {
    if ( !userStore.user?.id ) return

    isLoading.value = true
    try {
      // 1. Fetch regular progress
      const progress = await db.select()
        .from( userProgress )
        .where( eq( userProgress.userId, userStore.user.id ) )

      completedContent.value = progress

      // 2. Fetch Quiz History
      const quizzes = await db.select()
        .from( quizLogs )
        .where( eq( quizLogs.userId, userStore.user.id ) )
        .orderBy( desc( quizLogs.createdAt ) )

      quizHistory.value = quizzes
      quizCount.value = quizzes.length

      // 3. Fetch Mastery Metrics
      const mastery = await db.select()
        .from( masteryTable )
        .where( eq( masteryTable.userId, userStore.user.id ) )
      masteryMetrics.value = mastery

      // 4. Compute derived metrics
      // flashcardCount = sum of all correctCount from mastery metrics
      flashcardCount.value = mastery.reduce( ( sum, m ) => sum + ( m.correctCount || 0 ), 0 )

      // masteredCount = count of mastered items
      masteredCount.value = mastery.filter( m => m.mastered ).length

      // streakDays = calculate consecutive days with activity
      if ( quizzes.length > 0 ) {
        const today = new Date()
        today.setHours( 0, 0, 0, 0 )
        let streak = 0
        let checkDate = new Date( today )

        // Sort quizzes by date descending and get unique dates
        const uniqueDates = [...new Set( quizzes.map( q => {
          const d = new Date( q.createdAt )
          d.setHours( 0, 0, 0, 0 )
          return d.getTime()
        } ) )].sort( ( a, b ) => b - a )

        // Check if most recent activity is today or yesterday
        const mostRecent = uniqueDates[0]
        const dayDiff = Math.floor( ( today.getTime() - mostRecent ) / ( 1000 * 60 * 60 * 24 ) )
        if ( dayDiff > 1 ) {
          streakDays.value = 0
        } else {
          // Count consecutive days
          for ( let i = 0; i < uniqueDates.length; i++ ) {
            const expectedDate = new Date( today )
            expectedDate.setDate( expectedDate.getDate() - i - ( dayDiff === 1 ? 1 : 0 ) )
            expectedDate.setHours( 0, 0, 0, 0 )

            if ( uniqueDates.includes( expectedDate.getTime() ) ) {
              streak++
            } else {
              break
            }
          }
          streakDays.value = streak
        }
      }

    } catch ( error ) {
      console.error( 'Failed to fetch progress:', error )
    } finally {
      isLoading.value = false
    }
  }

  const recordCorrectAnswer = async ( contentId, contentType, name ) => {
    if ( !userStore.user?.id ) return
    try {
      const existing = await db.select().from( masteryTable )
        .where( and(
          eq( masteryTable.userId, userStore.user.id ),
          eq( masteryTable.contentId, contentId )
        ) )

      let newCount = 1
      if ( existing.length > 0 ) {
        newCount = ( existing[0].correctCount || 0 ) + 1
        await db.update( masteryTable )
          .set( { correctCount: newCount, updatedAt: new Date() } )
          .where( eq( masteryTable.id, existing[0].id ) )
      } else {
        await db.insert( masteryTable )
          .values( {
            userId: userStore.user.id,
            contentId,
            contentType,
            correctCount: 1
          } )
      }

      // Update local state
      const metricIdx = masteryMetrics.value.findIndex( m => m.contentId === contentId )
      if ( metricIdx >= 0 ) {
        masteryMetrics.value[metricIdx].correctCount = newCount
      } else {
        masteryMetrics.value.push( { contentId, contentType, correctCount: newCount, mastered: false } )
      }

      // Check for Mastery Born (Threshold = 5)
      if ( newCount === 5 ) {
        await db.update( masteryTable )
          .set( { mastered: true } )
          .where( and( eq( masteryTable.userId, userStore.user.id ), eq( masteryTable.contentId, contentId ) ) )

        const metric = masteryMetrics.value.find( m => m.contentId === contentId )
        if ( metric ) metric.mastered = true

        // Trigger Notification
        lastMastery.value = {
          id: contentId,
          name: name,
          type: contentType,
          message: `${contentType === 'mathematics' ? 'Number' : 'Letter'} Mastered`
        }
      }
    } catch ( error ) {
      console.error( 'Failed to record correct answer:', error )
    }
  }

  const isCompleted = ( contentId ) => {
    return completedContent.value.some( p => p.contentId === contentId ) ||
      masteryMetrics.value.some( m => m.contentId === contentId && m.mastered )
  }

  const isMastered = ( contentId ) => {
    return masteryMetrics.value.some( m => m.contentId === contentId && m.mastered )
  }

  const markComplete = async ( contentId, contentType, score = null ) => {
    if ( !userStore.user?.id ) return

    try {
      // Optimistic update
      completedContent.value.push( {
        userId: userStore.user.id,
        contentId,
        contentType,
        score,
        completedAt: new Date()
      } )

      await db.insert( userProgress ).values( {
        userId: userStore.user.id,
        contentId,
        contentType,
        score
      } )
    } catch ( error ) {
      console.error( 'Failed to save progress:', error )
      // Revert optimistic update if needed
      await fetchUserProgress()
    }
  }

  const saveQuizResult = async ( { score, totalQuestions, topics, details } ) => {
    if ( !userStore.user?.id ) return
    try {
      // Optimistic update
      quizCount.value++

      await db.insert( quizLogs ).values( {
        userId: userStore.user.id,
        score,
        totalQuestions,
        topics,
        details: JSON.stringify( details )
      } )
    } catch ( error ) {
      console.error( 'Failed to save quiz log:', error )
      quizCount.value-- // Revert
    }
  }

  return {
    completedContent,
    masteryMetrics,
    quizCount,
    quizHistory,
    flashcardCount,
    masteredCount,
    streakDays,
    isLoading,
    lastMastery,
    fetchUserProgress,
    markComplete,
    isCompleted,
    isMastered,
    recordCorrectAnswer,
    saveQuizResult
  }
} )
