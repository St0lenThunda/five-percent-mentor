import { ref, computed } from 'vue'

export const principles = {
  1: { name: 'Knowledge', meaning: 'The foundation of all in existence. To look, listen, observe, and respect.', application: 'Gather facts before acting. Listen more than you speak. Establish a solid foundation.' },
  2: { name: 'Wisdom', meaning: 'Wise words, ways, and actions. The application of knowledge.', application: 'Put what you know into action. Speak your truth. Demonstrate your knowledge through deeds.' },
  3: { name: 'Understanding', meaning: 'The mental picture one draws of knowledge. To see things clearly.', application: 'Seek clarity. Ensure you are understood and that you understand others. Visualize the outcome.' },
  4: { name: 'Culture/Freedom', meaning: 'One\'s way of life. Freedom is to be free from mental and physical slavery.', application: 'Practice your culture. Live freely by your own principles. Be self-determined.' },
  5: { name: 'Power/Refinement', meaning: 'The force of truth. To make manifest. Refinement is to be made pure.', application: 'Refine your character. Stand in your truth. Clean up your physical and mental environment.' },
  6: { name: 'Equality', meaning: 'To be equal in all things. Knowledge, Wisdom, and Understanding.', application: 'Treat others with fairness. Share knowledge. Maintain balance in your dealings.' },
  7: { name: 'God', meaning: 'The original man. The black man of Asia. The supreme being.', application: 'Master yourself. Take responsibility for your world. Lead by example.' },
  8: { name: 'Build/Destroy', meaning: 'To add on to or take away from. To build constitutes proper growth and development.', application: 'Build something positive. Remove negativity. Add value to every cipher.' },
  9: { name: 'Born', meaning: 'To be brought into existence. The completion of all things.', application: 'Bring your ideas to completion. Manifest your goals. Birth a new reality.' },
  0: { name: 'Cipher', meaning: 'A circle consisting of 360 degrees. A person, place, or thing. Completion.', application: 'Complete your cycle. Encompass all things. Protect your surroundings.' }
}

export function useMathematics () {
  const today = ref( new Date() )

  const reduceNumber = ( num ) => {
    while ( num > 9 ) {
      num = String( num ).split( '' ).reduce( ( acc, curr ) => acc + parseInt( curr ), 0 )
    }
    return num
  }

  const calculateWordMath = ( word ) => {
    if ( !word ) return null
    const cleanWord = word.toUpperCase().replace( /[^A-Z]/g, '' )
    if ( !cleanWord ) return null

    const breakdown = cleanWord.split( '' ).map( char => {
      const val = char.charCodeAt( 0 ) - 64
      return { char, val }
    } )

    const sum = breakdown.reduce( ( acc, curr ) => acc + curr.val, 0 )
    const number = reduceNumber( sum )

    return {
      input: word,
      breakdown,
      sum,
      number,
      ...principles[number]
    }
  }

  const calculateDateInput = ( dateInput ) => {
    if ( !dateInput ) return null
    // Remove non-digits
    const digits = String( dateInput ).replace( /[^0-9]/g, '' )
    if ( !digits ) return null

    const sum = digits.split( '' ).reduce( ( acc, curr ) => acc + parseInt( curr ), 0 )
    const number = reduceNumber( sum )

    return {
      input: dateInput,
      sum,
      number,
      ...principles[number]
    }
  }

  // Day Math: Sum of digits of the day of the month
  const dayMath = computed( () => {
    const day = today.value.getDate()
    const number = reduceNumber( day )
    return {
      number,
      ...principles[number]
    }
  } )

  // Full Date Math: Sum of Month + Day + Year
  const fullDateMath = computed( () => {
    const month = today.value.getMonth() + 1
    const day = today.value.getDate()
    const year = today.value.getFullYear()

    // Sum all digits from all components
    const dateString = `${month}${day}${year}`
    const sum = dateString.split( '' ).reduce( ( acc, curr ) => acc + parseInt( curr ), 0 )
    const number = reduceNumber( sum )

    return {
      number,
      ...principles[number]
    }
  } )

  const getDayAndMonth = computed( () => {
    return today.value.toLocaleDateString( 'en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    } )
  } )

  return {
    today,
    dayMath,
    fullDateMath,
    getDayAndMonth,
    principles,
    calculateWordMath,
    calculateDateInput
  }
}
