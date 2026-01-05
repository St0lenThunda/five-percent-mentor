import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../db/client'
import { userProgress, quizLogs } from '../db/schema'
import { eq, and } from 'drizzle-orm'
import { useUserStore } from './user'

export const useProgressStore = defineStore( 'progress', () => {
  const quizCount = ref( 0 )
  const flashcardCount = ref( 0 )
  const masteredCount = ref( 0 )
  const streakDays = ref( 0 )
  const completedContent = ref( [] )
  const isLoading = ref( false )
  const userStore = useUserStore()

  const fetchUserProgress = async () => {
    if ( !userStore.user?.id ) return

    isLoading.value = true
    try {
      // 1. Fetch regular progress
      const progress = await db.select()
        .from( userProgress )
        .where( eq( userProgress.userId, userStore.user.id ) )

      completedContent.value = progress

      // 2. Fetch Quiz Count
      const quizzes = await db.select()
        .from( quizLogs )
        .where( eq( quizLogs.userId, userStore.user.id ) )

      quizCount.value = quizzes.length

    } catch ( error ) {
      console.error( 'Failed to fetch progress:', error )
    } finally {
      isLoading.value = false
    }
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

  const isCompleted = ( contentId ) => {
    return completedContent.value.some( p => p.contentId === contentId )
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
    quizCount,
    flashcardCount,
    masteredCount,
    streakDays,
    isLoading,
    fetchUserProgress,
    markComplete,
    isCompleted,
    saveQuizResult
  }
} )
