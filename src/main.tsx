import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from '@/app/App'
import { BeamsLoadingProvider } from '@/features/hero'
import { dismissAppBootLoaderAfterPaint } from '@/shared/lib/appBootLoader'
import { ThemeProvider } from '@/features/theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BeamsLoadingProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BeamsLoadingProvider>
  </StrictMode>,
)

dismissAppBootLoaderAfterPaint()
