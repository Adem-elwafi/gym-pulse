import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { prefetchAllExerciseImages } from './data/exerciseImages'
import './index.css'
import App from './App.tsx'

registerSW({ immediate: true })
prefetchAllExerciseImages()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
