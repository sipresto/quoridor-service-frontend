import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/games/quoridor/',

    server: {
        host: '0.0.0.0',
        port: 5175,
        proxy: {
            '/auth': {
                target: 'http://localhost:8280',
                changeOrigin: true,
                rewrite: (path) => path,
            },

            '/api/platform': {
                target: 'http://localhost:8095',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/platform/, '/api/platform'),
            },

            '/api/games/quoridor': {
                target: 'http://localhost:8097',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/games\/quoridor/, '/api/games/quoridor'),
            },

            '/platform': {
                target: 'http://localhost:5173',
                changeOrigin: true,
                ws: true,
                rewrite: (path) => path
            }
        }
    },

    build: {
        outDir: 'dist',
        sourcemap: false,
    }
})