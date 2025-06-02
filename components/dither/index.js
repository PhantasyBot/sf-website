import { useFrame } from '@studio-freight/hamo'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useWindowSize } from 'react-use'
import s from './dither.module.scss'

export function Dither({ currentTheme = 'rally' }) {
  const el = useRef()
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 }) // Start off-screen

  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const canvas = useMemo(() => document.createElement('canvas'), [])
  const context = useMemo(() => canvas.getContext('2d'), [])

  // Theme-based color mapping using exact CSS variable colors
  const themeColors = useMemo(
    () => ({
      rally: {
        primary: '#f598aa', // Sakura Pink
        secondary: '#ffb6c1', // Light Pink
        hover: '#ff8fab', // From gradient
      },
      banshee: {
        primary: '#cad2e2', // Pale blue/grey
        secondary: '#e0d8e9', // Pale lavender/grey
        hover: '#b8c6db', // Slightly deeper than primary
      },
      munny: {
        primary: '#558b2f', // Matcha Green
        secondary: '#a5d6a7', // Lighter green
        hover: '#7cb342', // From gradient
      },
      merchandise: {
        primary: '#a0c4ff', // Blue from gradient
        secondary: '#ffd6a5', // Orange from gradient
        hover: '#bdb2ff', // Purple from gradient
      },
    }),
    [],
  )

  const currentColors = themeColors[currentTheme] || themeColors.rally

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    const handleMouseLeave = () => {
      setMousePos({ x: -1000, y: -1000 }) // Move off-screen when mouse leaves
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    el.current.appendChild(canvas)
    return () => canvas.remove()
  }, [canvas])

  useEffect(() => {
    canvas.width = windowWidth
    canvas.height = windowHeight
    canvas.style.width = `${windowWidth}px`
    canvas.style.height = `${windowHeight}px`

    context.imageSmoothingEnabled = false // Crisp pixels for dither effect
  }, [windowWidth, windowHeight, canvas, context])

  // Render dither pattern only around cursor
  const renderDither = useMemo(() => {
    return () => {
      if (!canvas.width || !canvas.height) return

      context.clearRect(0, 0, canvas.width, canvas.height)

      // Only render if mouse is on screen
      if (mousePos.x < 0 || mousePos.y < 0) return

      const ditherSize = 4 // Much smaller squares for cursor-sized effect
      const effectRadius = 80 // Much smaller radius to match cursor size

      // Add subtle time-based variation
      const time = Date.now() * 0.003

      // Calculate bounds to only iterate over area around cursor
      const startX = Math.max(0, mousePos.x - effectRadius)
      const endX = Math.min(canvas.width, mousePos.x + effectRadius)
      const startY = Math.max(0, mousePos.y - effectRadius)
      const endY = Math.min(canvas.height, mousePos.y + effectRadius)

      for (
        let x = Math.floor(startX / ditherSize) * ditherSize;
        x < endX;
        x += ditherSize
      ) {
        for (
          let y = Math.floor(startY / ditherSize) * ditherSize;
          y < endY;
          y += ditherSize
        ) {
          // Calculate distance from cursor
          const distanceFromCursor = Math.sqrt(
            (x - mousePos.x) ** 2 + (y - mousePos.y) ** 2,
          )

          // Only render within effect radius
          if (distanceFromCursor > effectRadius) continue

          // Create dither pattern with higher density for smaller area
          const normalizedDistance = distanceFromCursor / effectRadius
          let density = (1 - normalizedDistance) * 0.9 // Higher density for small area

          // Add subtle animation with faster frequency for small area
          density += Math.sin(x * 0.1 + time) * 0.15
          density += Math.cos(y * 0.08 + time * 1.2) * 0.15

          if (Math.random() < density) {
            // Choose color and alpha based on distance from cursor center
            let color = currentColors.primary
            let alpha = 0.9

            if (distanceFromCursor < effectRadius * 0.4) {
              color = currentColors.hover
              alpha = 1.0 // Full opacity in center
            } else if (distanceFromCursor < effectRadius * 0.7) {
              color = currentColors.secondary
              alpha = 0.95
            }

            // Sharp fade out towards edges for crisp cursor effect
            alpha *= Math.pow(1 - normalizedDistance, 2)

            // Apply color with transparency
            context.fillStyle =
              color +
              Math.floor(alpha * 255)
                .toString(16)
                .padStart(2, '0')
            context.fillRect(x, y, ditherSize, ditherSize)
          }
        }
      }
    }
  }, [mousePos, currentColors, canvas, context])

  // Render at 60fps for smooth cursor following
  useFrame(() => {
    renderDither()
  })

  return <div ref={el} className={s.canvas} />
}
