import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import App from './App.tsx'
import { BeamsLoadingProvider } from './hooks/useBeamsLoading'
import { dismissAppBootLoaderAfterPaint } from './lib/appBootLoader'
import { ThemeProvider } from './theme/ThemeProvider'

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
