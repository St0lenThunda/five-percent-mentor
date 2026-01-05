import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'

import { useUserStore } from './stores/user'

const app = createApp( App )
const pinia = createPinia()

app.use( pinia )
app.use( router )

// Initialize user store before mounting
const userStore = useUserStore()
userStore.init().then( () => {
  app.mount( '#app' )
} )
