import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0', // Expose to docker
        port: 5173,
        proxy: {
            '/api': 'http://backend:3000',
            '/auth': 'http://backend:3000'
        }
    }
})
