import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useContentStore = defineStore( 'content', () => {
  const mathematics = ref( [] )
  const alphabet = ref( [] )
  const jewels = ref( [] )
  const lessons = ref( [] )
  const library = ref( [] )
  const actualFacts = ref( [] )
  const solarFacts = ref( [] )
  const isLoading = ref( false )
  const error = ref( null )

  const fetchAllContent = async () => {
    isLoading.value = true
    error.value = null
    try {
      const [mathRes, alphaRes, jewelsRes, lessonsRes, libraryRes, actualRes, solarRes] = await Promise.all( [
        fetch( '/content-packs/supreme-mathematics.json' ),
        fetch( '/content-packs/supreme-alphabet.json' ),
        fetch( '/content-packs/12-jewels.json' ),
        fetch( '/content-packs/120-lessons.json' ),
        fetch( '/content-packs/knowledge-library.json' ),
        fetch( '/content-packs/actual-facts.json' ),
        fetch( '/content-packs/solar-facts.json' )
      ] )

      if ( mathRes.ok ) mathematics.value = await mathRes.json()
      if ( alphaRes.ok ) alphabet.value = await alphaRes.json()
      if ( jewelsRes.ok ) jewels.value = await jewelsRes.json()
      if ( lessonsRes.ok ) lessons.value = await lessonsRes.json()
      if ( libraryRes.ok ) library.value = await libraryRes.json()
      if ( actualRes.ok ) actualFacts.value = await actualRes.json()
      if ( solarRes.ok ) solarFacts.value = await solarRes.json()
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
  const getActualFactByNumber = ( num ) => actualFacts.value.find( f => f.number === Number( num ) )
  const getSolarFactByNumber = ( num ) => solarFacts.value.find( f => f.number === Number( num ) )

  // Correlation Helpers
  const getCorrelatedAlphabet = ( name ) => {
    if ( !name ) return []
    const lowerName = name.toLowerCase()
    return alphabet.value.filter( a =>
      a.name.toLowerCase().includes( lowerName ) ||
      lowerName.includes( a.name.toLowerCase() )
    )
  }

  const getCorrelatedJewels = ( name ) => {
    if ( !name ) return []
    const lowerName = name.toLowerCase()
    return jewels.value.filter( j =>
      j.name.toLowerCase() === lowerName ||
      j.name.toLowerCase().includes( lowerName )
    )
  }

  // Numerology: Reduce a number to a single digit
  const reduceToSingleDigit = ( num ) => {
    let result = num
    while ( result >= 10 ) {
      result = String( result ).split( '' ).reduce( ( sum, d ) => sum + Number( d ), 0 )
    }
    return result
  }

  // Get Numerology Breakdown for a number
  const getNumerologyBreakdown = ( num ) => {
    const doubled = num + num
    const reduced = reduceToSingleDigit( doubled )
    const relatedMath = getMathByNumber( reduced )
    return {
      original: num,
      doubled,
      reduced,
      relatedMath
    }
  }

  return {
    mathematics,
    alphabet,
    jewels,
    lessons,
    library,
    actualFacts,
    solarFacts,
    isLoading,
    error,
    fetchAllContent,
    getMathByNumber,
    getLetterByChar,
    getJewelByName,
    getActualFactByNumber,
    getSolarFactByNumber,
    getLessonById: ( id ) => lessons.value.find( l => l.id === id ),
    getCorrelatedAlphabet,
    getCorrelatedJewels,
    reduceToSingleDigit,
    getNumerologyBreakdown
  }
} )
