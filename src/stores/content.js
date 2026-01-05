import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useContentStore = defineStore( 'content', () => {
  const mathematics = ref( [] )
  const alphabet = ref( [] )
  const jewels = ref( [] )
  const lessons = ref( [] )
  const library = ref( [] )
  const isLoading = ref( false )
  const error = ref( null )

  const fetchAllContent = async () => {
    isLoading.value = true
    error.value = null
    try {
      const [mathRes, alphaRes, jewelsRes, lessonsRes, libraryRes] = await Promise.all( [
        fetch( '/content-packs/supreme-mathematics.json' ),
        fetch( '/content-packs/supreme-alphabet.json' ),
        fetch( '/content-packs/12-jewels.json' ),
        fetch( '/content-packs/120-lessons.json' ),
        fetch( '/content-packs/knowledge-library.json' )
      ] )

      if ( mathRes.ok ) mathematics.value = await mathRes.json()
      if ( alphaRes.ok ) alphabet.value = await alphaRes.json()
      if ( jewelsRes.ok ) jewels.value = await jewelsRes.json()
      if ( lessonsRes.ok ) lessons.value = await lessonsRes.json()
      if ( libraryRes.ok ) library.value = await libraryRes.json()
    } catch ( e ) {
      console.error( 'Content fetch error:', e )
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const getMathByNumber = ( num ) => mathematics.value.find( m => m.number === Number( num ) )
  const getLetterByChar = ( char ) => alphabet.value.find( l => l.letter === char.toUpperCase() )
  const getJewelByName = ( name ) => jewels.value.find( j => j.name.toLowerCase() === name.toLowerCase() )

  return {
    mathematics,
    alphabet,
    jewels,
    isLoading,
    error,
    fetchAllContent,
    getMathByNumber,
    getLetterByChar,
    getJewelByName,
    lessons,
    getLessonById: ( id ) => lessons.value.find( l => l.id === id )
  }
} )
