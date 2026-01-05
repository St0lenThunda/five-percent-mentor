import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

// Lazy-loaded views
const Dashboard = () => import( '../views/Dashboard.vue' )
const Login = () => import( '../views/Login.vue' )
const Signup = () => import( '../views/Signup.vue' )

// Module views
const SupremeMathematics = () => import( '../views/modules/SupremeMathematics.vue' )
const SupremeAlphabet = () => import( '../views/modules/SupremeAlphabet.vue' )
const Lessons120 = () => import( '../views/modules/Lessons120.vue' )
const CipherBuilder = () => import( '../views/modules/CipherBuilder.vue' )
const BornDayJournal = () => import( '../views/modules/BornDayJournal.vue' )
const KnowledgeLibrary = () => import( '../views/modules/KnowledgeLibrary.vue' )
const AttributeBuilder = () => import( '../views/modules/AttributeBuilder.vue' )
const SelfAssessment = () => import( '../views/modules/SelfAssessment.vue' )
const Quizzes = () => import( '../views/modules/Quizzes.vue' )
const Flashcards = () => import( '../views/modules/Flashcards.vue' )
const JournalHistory = () => import( '../views/modules/JournalHistory.vue' )
const QuizHistory = () => import( '../views/modules/QuizHistory.vue' )

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/supreme-mathematics',
    name: 'supreme-mathematics',
    component: SupremeMathematics,
    meta: { requiresAuth: true }
  },
  {
    path: '/supreme-alphabet',
    name: 'supreme-alphabet',
    component: SupremeAlphabet,
    meta: { requiresAuth: true }
  },
  {
    path: '/120-lessons',
    name: '120-lessons',
    component: Lessons120,
    meta: { requiresAuth: true }
  },
  {
    path: '/cipher-builder',
    name: 'cipher-builder',
    component: CipherBuilder,
    meta: { requiresAuth: true }
  },
  {
    path: '/born-day-journal',
    name: 'born-day-journal',
    component: BornDayJournal,
    meta: { requiresAuth: true }
  },
  {
    path: '/journal-history',
    name: 'journal-history',
    component: JournalHistory,
    meta: { requiresAuth: true }
  },
  {
    path: '/knowledge-library',
    name: 'knowledge-library',
    component: KnowledgeLibrary,
    meta: { requiresAuth: true }
  },
  {
    path: '/attribute-builder',
    name: 'attribute-builder',
    component: AttributeBuilder,
    meta: { requiresAuth: true }
  },
  {
    path: '/self-assessment',
    name: 'self-assessment',
    component: SelfAssessment,
    meta: { requiresAuth: true }
  },
  {
    path: '/quizzes',
    name: 'quizzes',
    component: Quizzes,
    meta: { requiresAuth: true }
  },
  {
    path: '/quiz-history',
    name: 'quiz-history',
    component: QuizHistory,
    meta: { requiresAuth: true }
  },
  {
    path: '/flashcards',
    name: 'flashcards',
    component: Flashcards,
    meta: { requiresAuth: true }
  }
]

const router = createRouter( {
  history: createWebHistory(),
  routes
} )

// Navigation guards
router.beforeEach( async ( to, from, next ) => {
  const userStore = useUserStore()

  // Wait for the store to initialize if it hasn't yet
  if ( !userStore.initialized ) {
    await userStore.init()
  }

  if ( to.meta.requiresAuth && !userStore.isAuthenticated ) {
    next( { name: 'login' } )
  } else if ( to.meta.requiresGuest && userStore.isAuthenticated ) {
    next( { name: 'dashboard' } )
  } else {
    next()
  }
} )

export default router
