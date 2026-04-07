import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig({ command: 'serve', mode: 'test' }),
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      include: ['tests/**/*.{test,spec}.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
      exclude: ['**/node_modules/**', '**/dist/**', 'tests/e2e/**'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json-summary'],
        all: false,
        include: ['src/lib/publicAsset.ts', 'src/lib/brandLogo.ts', 'src/components/BrandLogoImg.tsx'],
        thresholds: {
          lines: 100,
          functions: 100,
          branches: 100,
          statements: 100,
        },
      },
    },
  }),
)
