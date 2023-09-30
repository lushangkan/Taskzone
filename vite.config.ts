import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import px2vw from '@yuo/postcss-px2vw'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import { resolve, dirname } from 'node:path'
import {fileURLToPath} from "url";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy(),
    vueI18n({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './path/to/src/locales/**'),
    })
  ],
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        px2vw({
          unitToConvert: 'px',
          viewportWidth: 390,
          unitPrecision: 5,
          propList: ['*'],
          viewportUnit: 'vw',
          fontViewportUnit: 'vw',
          selectorBlackList: [],
          minPixelValue: 1,
          mediaQuery: false,
          replace: true,
          exclude: undefined,
          include: undefined,
          landscape: false,
          landscapeUnit: 'vw',
          landscapeWidth: 568
        })
      ],
    },
  },
  optimizeDeps: {
    exclude: ['jeep-sqlite/loader'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    hmr: true,
    host: '0.0.0.0',
    port: 80,
  },
})
