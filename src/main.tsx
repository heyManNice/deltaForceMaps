import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Phone from './phone'
import './main.css'

function isMobileDevice(): boolean {
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(navigator.userAgent);
}

//给手机固定的视口，防止键盘弹出改变视口宽度
window.addEventListener("load", () => {
    if (isMobileDevice()) {
        document.body.style.height = window.innerHeight + 'px'
        document.body.style.width = window.innerWidth + 'px'
    }
})

createRoot(document.body!).render(
  <StrictMode>
    <Phone />
  </StrictMode>
)
