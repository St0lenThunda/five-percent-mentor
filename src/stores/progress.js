import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../utils/api-client'
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
      // Fetch progress from API
      const progress = await api.getProgress( userStore.user.id )
      completedContent.value = progress || []

      // Fetch mastery metrics from API
      const mastery = await api.getMasteryMetrics( userStore.user.id )
      masteryMetrics.value = mastery || []

      // Compute derived metrics
      flashcardCount.value = mastery.reduce( ( sum, m ) => sum + ( m.correctCount || 0 ), 0 )
      masteredCount.value = mastery.filter( m => m.mastered ).length

      // Calculate streak (simplified - can enhance based on quiz logs if needed)
      streakDays.value = 0 // TODO: Implement streak calculation when quiz logs are available
      quizCount.value = 0 // TODO: Fetch quiz logs from API

    } catch ( error ) {
      console.error( 'Failed to fetch progress:', error )
    } finally {
      isLoading.value = false
    }
  }

  const recordCorrectAnswer = async ( contentId, contentType, name ) => {
    if ( !userStore.user?.id ) return

    try {
      // Find existing metric
      const existing = masteryMetrics.value.find( m => m.contentId === contentId )
      const newCount = existing ? ( existing.correctCount + 1 ) : 1

      // Update via API
      const updated = await api.updateMasteryMetric( {
        userId: userStore.user.id,
        contentId,
        contentType,
        correctCount: newCount
      } )

      // Update local state
      const metricIdx = masteryMetrics.value.findIndex( m => m.contentId === contentId )
      if ( metricIdx >= 0 ) {
        masteryMetrics.value[metricIdx] = updated
      } else {
        masteryMetrics.value.push( updated )
      }

      // Check for Mastery Born (Threshold = 5)
      if ( newCount === 5 && !updated.mastered ) {
        await api.markAsMastered( updated.id, true )

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
      // Create progress entry via API
      const newProgress = await api.createProgress( {
        userId: userStore.user.id,
        contentId,
        contentType,
        score
      } )

      // Optimistic update
      completedContent.value.push( newProgress )
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

      // TODO: Create quiz log API endpoint and call it here
      // await api.createQuizLog( {
      //   userId: userStore.user.id,
      //   score,
      //   totalQuestions,
      //   topics,
      //   details: JSON.stringify( details )
      // } )
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
