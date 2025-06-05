import { RealViewport } from '@studio-freight/compono'
import { useLenis } from '@studio-freight/react-lenis'
import Tempus from '@studio-freight/tempus'
import 'blaze-slider/dist/blaze.css'
import ErrorBoundary from 'components/error-boundary'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useStore } from 'lib/store'
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

    // Observe the document for changes since theme can be set anywhere
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => {
      observer.disconnect()
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
    <ErrorBoundary>
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
    </ErrorBoundary>
  )
}

export default MyApp
