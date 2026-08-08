import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const plugins = [react()];

  // Emit pre-compressed twins next to each asset. nginx `gzip_static on` serves
  // the .gz (higher ratio than on-the-fly, zero request-time CPU); add
  // `brotli_static on` on the server to serve the smaller .br where supported.
  // Loaded optionally so the build still works before `vite-plugin-compression`
  // is installed (it just skips pre-compression until then).
  try {
    const { default: viteCompression } = await import('vite-plugin-compression');
    plugins.push(
      viteCompression({ algorithm: 'gzip', ext: '.gz', threshold: 1024 }),
      viteCompression({ algorithm: 'brotliCompress', ext: '.br', threshold: 1024 }),
    );
  } catch {
    // vite-plugin-compression not installed yet — build without pre-compression.
  }

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@styles': path.resolve(__dirname, './src/assets/styles'),
        '@components': path.resolve(__dirname, './src/components'),
        '@lego': path.resolve(__dirname, './src/lego'),
      },
    },
    plugins,
    optimizeDeps: {
      exclude: ['js-big-decimal'],
    },
    build: {
      rollupOptions: {
        output: {
          // Split only the pure, static vendor libs into stable, separately-
          // cacheable chunks (they change rarely, so an app change won't bust
          // them). Everything else — crucially @10gzv/frontend-core, which
          // dynamically imports the emoji-picker (~300kB) and giphy on demand —
          // is left to Rollup's default chunking so those stay as lazy chunks.
          //
          // react + mobx MUST share one chunk. mobx-react-lite reads React at
          // module-init; splitting react and mobx into separate chunks lets
          // Rollup place a shared interop helper in one and import it from the
          // other, creating a react⇄mobx cycle. On load the second chunk sees
          // the first's exports still undefined → "Cannot read properties of
          // undefined (reading 'useState')". Keeping them together removes the
          // cross-chunk cycle.
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('/scheduler/') ||
              id.includes('/mobx/') ||
              id.includes('/mobx-react-lite/')
            )
              return 'react-vendor';
            if (id.includes('/decimal.js/')) return 'decimal';
          },
        },
      },
    },
  };
})
