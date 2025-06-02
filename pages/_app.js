import { RealViewport } from '@studio-freight/compono'
import { useLenis } from '@studio-freight/react-lenis'
import Tempus from '@studio-freight/tempus'
// import { Analytics } from '@vercel/analytics/react' // Removed Vercel Analytics
import 'blaze-slider/dist/blaze.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useStore } from 'lib/store'
// import { ProjectProvider, RafDriverProvider } from 'lib/theatre'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import 'styles/global.scss'
import 'styles/themes.scss'

const Dither = dynamic(
  () => import('components/dither').then(({ Dither }) => Dither),
  {
    ssr: false,
  },
)

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.defaults({ markers: process.env.NODE_ENV === 'development' })

  // merge rafs
  gsap.ticker.lagSmoothing(0)
  gsap.ticker.remove(gsap.updateRoot)
  Tempus.add((time) => {
    gsap.updateRoot(time / 1000)
  }, 0)

  // reset scroll position
  window.scrollTo(0, 0)
  window.history.scrollRestoration = 'manual'

  window.CREDIT_ME = {
    id: location.hostname,
    url: 'https://phantasy.bot',
    credits: [
      {
        name: 'Phantasy',
        website: 'https://phantasy.bot',
      },
    ],
  }
}

function MyApp({ Component, pageProps }) {
  const overflow = useStore(({ overflow }) => overflow)
  const lenis = useLenis(ScrollTrigger.update)
  const [currentTheme, setCurrentTheme] = useState('rally')

  useEffect(ScrollTrigger.refresh, [lenis])

  // Watch for theme changes in the DOM
  useEffect(() => {
    const checkTheme = () => {
      // Look for any element with data-theme attribute
      const themeElement = document.querySelector('[data-theme]')
      if (themeElement) {
        const theme = themeElement.getAttribute('data-theme') || 'rally'
        setCurrentTheme(theme)
      }
    }

    // Check theme immediately
    checkTheme()

    // Create observer for any DOM changes that might affect theme
    const observer = new MutationObserver(() => {
      checkTheme()
    })

    // Observe the body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    // Also check periodically as a fallback
    const interval = setInterval(checkTheme, 1000)

    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (overflow) {
      lenis?.start()
      document.documentElement.style.removeProperty('overflow')
    } else {
      lenis?.stop()
      document.documentElement.style.setProperty('overflow', 'hidden')
    }
  }, [lenis, overflow])

  return (
    <>
      {/* <PageTransition /> */}
      <RealViewport />
      <Dither currentTheme={currentTheme} />
      {/* <ProjectProvider
        id="Satus"
        config="/config/Satus-2023-04-17T12_55_21.json"
      >
        <RafDriverProvider id="default"> */}
      <Component {...pageProps} />
      {/* </RafDriverProvider>
      </ProjectProvider> */}
      {/* <Analytics /> */}
      {/* Removed Vercel Analytics component */}
    </>
  )
}

export default MyApp
