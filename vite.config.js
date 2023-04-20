import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
// may need to set base
export default defineConfig({
  plugins: [react()],
  base: '/guitar-quiz/',
})
