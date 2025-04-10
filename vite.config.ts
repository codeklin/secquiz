import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  return {
    plugins: [
      react({
        jsxImportSource: '@emotion/react'
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ['react', 'react-dom'],
      preserveSymlinks: true
    },
    server: {
      port: 8080,
      strictPort: false,
      hmr: {
        overlay: true,
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: !isProduction,
      minify: isProduction,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'supabase-vendor': ['@supabase/supabase-js'],
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@radix-ui/react-tooltip',
        '@emotion/react',
        '@supabase/supabase-js',
        'zustand'
      ],
      force: true
    }
  };
});
