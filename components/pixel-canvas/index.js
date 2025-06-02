import { useEffect, useRef } from 'react'
import s from './pixel-canvas.module.scss'

class Pixel {
  constructor(canvas, context, x, y, color, speed, delay) {
    this.width = canvas.width
    this.height = canvas.height
    this.ctx = context
    this.x = x
    this.y = y
    this.color = color
    this.speed = this.getRandomValue(0.1, 0.9) * speed
    this.size = 2 // Start with full size for reverse effect
    this.sizeStep = Math.random() * 0.4
    this.minSize = 0.5
    this.maxSizeInteger = 2
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger)
    this.delay = delay
    this.counter = 0
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01
    this.isIdle = false
    this.isReverse = false
    this.isShimmer = false
    this.isRevealing = false
  }

  getRandomValue(min, max) {
    return Math.random() * (max - min) + min
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5

    this.ctx.fillStyle = this.color
    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size,
    )
  }

  // Reveal effect - pixels disappear from center outward
  reveal() {
    this.isIdle = false

    if (this.counter <= this.delay) {
      this.counter += this.counterStep
      this.draw() // Keep drawing while waiting
      return
    }

    if (this.size <= 0) {
      this.isIdle = true
      return
    }

    this.size -= 0.08 // Smooth disappearing
    if (this.size < 0) this.size = 0

    this.draw()
  }

  // Conceal effect - pixels appear from center outward
  conceal() {
    this.isShimmer = false
    this.counter = 0

    if (this.size >= this.maxSize) {
      this.isIdle = true
      this.draw()
      return
    }

    this.size += 0.1
    if (this.size > this.maxSize) this.size = this.maxSize

    this.draw()
  }

  // Initial state - pixels are visible
  show() {
    this.size = this.maxSize
    this.draw()
  }
}

export function PixelCanvas({
  colors = ['#f8fafc', '#f1f5f9', '#cbd5e1'],
  gap = 5,
  speed = 35,
  isRevealing = false,
  className = '',
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const pixelsRef = useRef([])
  const animationRef = useRef(null)
  const ctxRef = useRef(null)

  // Normalize speed value
  const normalizedSpeed = Math.max(0, Math.min(100, speed)) * 0.001

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    ctxRef.current = ctx

    const resizeObserver = new ResizeObserver(() => {
      initCanvas()
    })

    resizeObserver.observe(container)
    initCanvas()

    return () => {
      resizeObserver.disconnect()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gap, normalizedSpeed])

  useEffect(() => {
    if (isRevealing) {
      startAnimation('reveal')
    } else {
      startAnimation('conceal')
    }
  }, [isRevealing])

  const initCanvas = () => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()
    const width = Math.floor(rect.width)
    const height = Math.floor(rect.height)

    canvas.width = width
    canvas.height = height
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    createPixels()

    // Show all pixels initially
    pixelsRef.current.forEach((pixel) => pixel.show())
  }

  const getDistanceToCanvasCenter = (x, y) => {
    const canvas = canvasRef.current
    if (!canvas) return 0

    const dx = x - canvas.width / 2
    const dy = y - canvas.height / 2
    return Math.sqrt(dx * dx + dy * dy)
  }

  const createPixels = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    pixelsRef.current = []

    for (let x = 0; x < canvas.width; x += gap) {
      for (let y = 0; y < canvas.height; y += gap) {
        const color = colors[Math.floor(Math.random() * colors.length)]
        const delay = getDistanceToCanvasCenter(x, y)

        pixelsRef.current.push(
          new Pixel(
            canvas,
            ctxRef.current,
            x,
            y,
            color,
            normalizedSpeed,
            delay,
          ),
        )
      }
    }
  }

  const startAnimation = (fnName) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    animate(fnName)
  }

  const animate = (fnName) => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return

    animationRef.current = requestAnimationFrame(() => animate(fnName))

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < pixelsRef.current.length; i++) {
      pixelsRef.current[i][fnName]()
    }

    // Stop animation when all pixels are idle
    if (pixelsRef.current.every((pixel) => pixel.isIdle)) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }

  return (
    <div ref={containerRef} className={`${s.container} ${className}`}>
      <canvas ref={canvasRef} className={s.canvas} />
    </div>
  )
}
