/**
 * Optimized Vite configuration for production
 * Implements code-splitting, minification, and caching strategies
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  build: {
    // Output directory
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production

    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
      },
    },

    // Code-splitting configuration
    rollupOptions: {
      output: {
        // Manual chunks for code-splitting
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase', 'firebase-admin'],
          'vendor-ui': ['framer-motion', 'lucide-react'],
          'vendor-validation': ['zod'],

          // Feature chunks
          'features-auth': [
            'src/contexts/AuthContext.jsx',
            'src/pages/MemberLogin.jsx',
            'src/pages/RegisterWithInvite.jsx',
          ],
          'features-admin': [
            'src/pages/AdminDashboard.jsx',
            'src/pages/TroopFinances.jsx',
          ],
          'features-leader': [
            'src/pages/LeaderDashboard.jsx',
            'src/components/leader/ActivityForm.jsx',
            'src/components/leader/ActivityList.jsx',
            'src/components/leader/ScoutRoster.jsx',
          ],
          'features-scout': [
            'src/pages/ScoutDashboard.jsx',
            'src/pages/RankTrackerWizard.jsx',
            'src/pages/MeritTrackerWizard.jsx',
          ],
          'features-portal': [
            'src/pages/ScoutToolsPortal.jsx',
          ],
        },

        // Optimize chunk names
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'images/[name]-[hash][extname]';
          } else if (/\.css$/.test(name ?? '')) {
            return 'css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },

    // Optimize dependencies
    commonjsOptions: {
      transformMixedEsModules: true,
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 200,

    // Report compressed size
    reportCompressedSize: true,
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'firebase',
      'framer-motion',
      'lucide-react',
      'zod',
    ],
  },

  // Performance hints
  server: {
    middlewareMode: true,
  },
});
