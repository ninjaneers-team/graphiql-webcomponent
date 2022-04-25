import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import * as path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    cssCodeSplit: true,
    lib: {
      formats: ['es'],
      entry: path.resolve(__dirname, 'src/main.jsx'),
      name: 'graphiql-webcomponent',
      fileName: (format) => `graphiql-webcomponent.${format}.js`,
    },
  },
})
