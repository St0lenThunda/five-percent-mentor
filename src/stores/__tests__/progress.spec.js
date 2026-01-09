import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProgressStore } from '../progress'
import { api } from '../../utils/api-client'

// Mock the API client
const mockApi = vi.hoisted( () => ( {
  getMasteryMetrics: vi.fn(),
  updateMasteryProgress: vi.fn(),
  recordCorrectAnswer: vi.fn(),
  markComplete: vi.fn(),
} ) )

vi.mock( '../../utils/api-client', () => ( {
  api: mockApi,
} ) )

// Helper to mock successful API call
const mockApiResult = ( method, data ) => {
  mockApi[method].mockResolvedValue( data )
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
    mockApiResult( 'recordCorrectAnswer', {} )
  } )

  it( 'successfully records a correct answer and increments count', async () => {
    mockApiResult( 'getMasteryMetrics', [] )
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
    mockApiResult( 'getMasteryMetrics', [{ id: 1, correctCount: 4 }] )
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
