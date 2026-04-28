import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,       // 👈 Fuerza a usar siempre el puerto 5173
    strictPort: true, // 👈 Si el 5173 está ocupado, lanzará error en vez de usar otro
    open: true        // (opcional) abre el navegador automáticamente
  }
})
