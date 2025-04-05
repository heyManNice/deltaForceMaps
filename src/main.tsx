import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Phone from './phone'
import './main.css'

createRoot(document.body!).render(
  <StrictMode>
    <Phone />
  </StrictMode>
)
