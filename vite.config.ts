import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteMockPlugin from './plugins/vite-plugin.mock'
import path from 'path'
// 自己的i18n
import I18n from './plugins/vite-plugin-vue-i18n'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteMockPlugin({
      entry: './mock/index.ts'
    }),
    I18n
  ]
})
