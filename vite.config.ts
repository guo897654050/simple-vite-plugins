import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteMockPlugin from './plugins/vite-plugin.mock'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteMockPlugin({
      entry: './mock/index.ts'
    })
  ]
})
