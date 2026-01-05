import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig( ( { mode } ) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv( mode, process.cwd(), '' )

  return {
    plugins: [vue()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      proxy: {
        '/neondb/auth': {
          target: env.VITE_NEON_AUTH_URL || 'https://ep-damp-block-a4y6qb9h.neonauth.us-east-1.aws.neon.tech',
          changeOrigin: true,
          secure: true,
          configure: ( proxy, options ) => {
            proxy.on( 'proxyReq', ( proxyReq, req, res ) => {
              proxyReq.setHeader( 'Origin', options.target );
            } );
          }
        }
      }
    },
    define: {
      // Expose DATABASE_URL to the client as VITE_DATABASE_URL
      'import.meta.env.VITE_DATABASE_URL': JSON.stringify( env.DATABASE_URL )
    }
  }
} )
