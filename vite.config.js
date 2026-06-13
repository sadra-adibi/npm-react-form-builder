import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));


export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'NpmReactFormBuilder',
      fileName: (format) =>
        format === 'umd'
          ? 'npm-react-form-builder.umd.cjs'
          : 'npm-react-form-builder.js',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJsxRuntime',
        },
        assetFileNames: (assetInfo) => {
          // All CSS assets → style.css
          if (assetInfo.name && assetInfo.name.endsWith('.css')) return 'style.css';
          return assetInfo.name || '[name][extname]';
        },
      },
    },
    cssCodeSplit: false,
  },
});
