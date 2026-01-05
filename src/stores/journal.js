import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../db/client'
import { journalEntries } from '../db/schema'
import { eq, desc } from 'drizzle-orm'
import { useUserStore } from './user'

export const useJournalStore = defineStore( 'journal', () => {
  const entries = ref( [] )
  const isLoading = ref( false )
  const isSaving = ref( false )
  const error = ref( null )

  const fetchEntries = async () => {
    const userStore = useUserStore()
    if ( !userStore.user?.id ) return

    isLoading.value = true
    try {
      const result = await db.select()
        .from( journalEntries )
        .where( eq( journalEntries.userId, userStore.user.id ) )
        .orderBy( desc( journalEntries.createdAt ) )
        .limit( 30 )

      entries.value = result
    } catch ( e ) {
      console.error( 'Failed to fetch journal entries:', e )
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const saveEntry = async ( { date, mathematicsId, entryText } ) => {
    const userStore = useUserStore()
    if ( !userStore.user?.id ) return

    isSaving.value = true
    try {
      const [newEntry] = await db.insert( journalEntries ).values( {
        userId: userStore.user.id,
        date,
        mathematicsId,
        entryText
      } ).returning()

      // Add to beginning of entries list
      entries.value.unshift( newEntry )
      return newEntry
    } catch ( e ) {
      console.error( 'Failed to save journal entry:', e )
      error.value = e.message
      throw e
    } finally {
      isSaving.value = false
    }
  }

  const getTodayEntry = () => {
    const today = new Date().toISOString().split( 'T' )[0]
    return entries.value.find( e => e.date === today )
  }

  const updateEntry = async ( id, { entryText } ) => {
    const userStore = useUserStore()
    if ( !userStore.user?.id ) return

    isSaving.value = true
    try {
      await db.update( journalEntries )
        .set( { entryText } )
        .where( eq( journalEntries.id, id ) )

      // Update local state
      const index = entries.value.findIndex( e => e.id === id )
      if ( index !== -1 ) {
        entries.value[index].entryText = entryText
      }
    } catch ( e ) {
      console.error( 'Failed to update journal entry:', e )
      error.value = e.message
      throw e
    } finally {
      isSaving.value = false
    }
  }

  const deleteEntry = async ( id ) => {
    const userStore = useUserStore()
    if ( !userStore.user?.id ) return

    try {
      await db.delete( journalEntries )
        .where( eq( journalEntries.id, id ) )

      // Remove from local state
      entries.value = entries.value.filter( e => e.id !== id )
    } catch ( e ) {
      console.error( 'Failed to delete journal entry:', e )
      error.value = e.message
      throw e
    }
  }

  return {
    entries,
    isLoading,
    isSaving,
    error,
    fetchEntries,
    saveEntry,
    getTodayEntry,
    updateEntry,
    deleteEntry
  }
} )
