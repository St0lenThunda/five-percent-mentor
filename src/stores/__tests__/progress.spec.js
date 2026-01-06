import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProgressStore } from '../progress'
import { db } from '../../db/client'

// Mock the database client
const mockDb = vi.hoisted( () => ( {
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
} ) )

vi.mock( '../../db/client', () => ( {
  db: mockDb,
} ) )

// Helper to mock a successful select result
const mockSelectResult = ( data ) => {
  mockDb.select.mockReturnValue( {
    from: vi.fn( () => ( {
      where: vi.fn( () => Promise.resolve( data ) ),
      orderBy: vi.fn( () => Promise.resolve( data ) ),
    } ) ),
  } )
}

// Helper to mock successful insert/update
const mockMutationResult = () => {
  mockDb.insert.mockReturnValue( {
    values: vi.fn( () => Promise.resolve() ),
  } )
  mockDb.update.mockReturnValue( {
    set: vi.fn( () => ( {
      where: vi.fn( () => Promise.resolve() ),
    } ) ),
  } )
}

// Mock the user store
vi.mock( '../user', () => ( {
  useUserStore: vi.fn( () => ( {
    user: { id: 'test-user-123' },
  } ) ),
} ) )

describe( 'Progress Store Mastery Logic', () => {
  beforeEach( () => {
    setActivePinia( createPinia() )
    vi.clearAllMocks()
    mockMutationResult()
  } )

  it( 'successfully records a correct answer and increments count', async () => {
    mockSelectResult( [] )
    const store = useProgressStore()

    // Initial state
    expect( store.masteryMetrics ).toHaveLength( 0 )

    // First correct answer
    await store.recordCorrectAnswer( 'math_1', 'mathematics', 'Knowledge' )

    expect( store.masteryMetrics ).toHaveLength( 1 )
    expect( store.masteryMetrics[0].contentId ).toBe( 'math_1' )
    expect( store.masteryMetrics[0].correctCount ).toBe( 1 )
    expect( store.masteryMetrics[0].mastered ).toBe( false )
  } )

  it( 'triggers mastery "Born" status at 5 correct answers', async () => {
    mockSelectResult( [{ id: 1, correctCount: 4 }] )
    const store = useProgressStore()

    // Mock existing local state
    store.masteryMetrics = [{
      contentId: 'math_1',
      contentType: 'mathematics',
      correctCount: 4,
      mastered: false
    }]

    // 5th correct answer
    await store.recordCorrectAnswer( 'math_1', 'mathematics', 'Knowledge' )

    const metric = store.masteryMetrics.find( m => m.contentId === 'math_1' )
    expect( metric.correctCount ).toBe( 5 )
    expect( metric.mastered ).toBe( true )
    expect( store.lastMastery ).not.toBeNull()
    expect( store.lastMastery.name ).toBe( 'Knowledge' )
  } )

  it( 'correctly reports completion and mastery status', () => {
    const store = useProgressStore()

    store.masteryMetrics = [
      { contentId: 'math_1', mastered: true },
      { contentId: 'math_2', mastered: false }
    ]
    store.completedContent = [
      { contentId: 'lesson_se_1' }
    ]

    expect( store.isMastered( 'math_1' ) ).toBe( true )
    expect( store.isMastered( 'math_2' ) ).toBe( false )
    expect( store.isCompleted( 'math_1' ) ).toBe( true )
    expect( store.isCompleted( 'lesson_se_1' ) ).toBe( true )
  } )
} )
