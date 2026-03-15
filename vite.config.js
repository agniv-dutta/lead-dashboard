import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import express from 'express'
import apiApp from './server/index.js'

function expressPlugin() {
  return {
    name: 'configure-server',
    configureServer(server) {
      server.middlewares.use(apiApp);
    }
  }
}

export default defineConfig({
  plugins: [react(), expressPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true
  }
})