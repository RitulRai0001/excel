
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// Importing Tailwind CSS for styling



// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //  base: '/excel analytic/',
  server: {
    proxy: {
      '/api': 'http://localhost:5000/',
    }
    
  }
  
})

