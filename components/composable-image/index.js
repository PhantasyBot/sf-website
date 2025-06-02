import { Image } from '@studio-freight/compono'
import cn from 'clsx'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { PixelCanvas } from '../pixel-canvas'
import s from './composable-image.module.scss'

const PixelEye = dynamic(() => import('icons/pixel-eye.svg'), { ssr: false })
const PixelEyeCross = dynamic(() => import('icons/pixel-eye-cross.svg'), {
  ssr: false,
})

export function ComposableImage({
  sources,
  width = 684,
  height = 403,
  large = false,
  small = false,
  priority = false,
  isNSFW = false,
}) {
  const [showNSFW, setShowNSFW] = useState(false)
  const amount = sources.items.length

  const toggleNSFW = (e) => {
    e.stopPropagation() // Prevent event bubbling to avoid triggering modal
    setShowNSFW(!showNSFW)
  }

  return (
    <div className={s.images}>
      {sources.items.map((source) =>
        source.url.includes('videos.ctfassets.net') ? (
          <div
            className={cn(
              s.image,
              s.videoWrap,
              large && s.large,
              small && s.small,
              isNSFW && s.nsfw,
              isNSFW && showNSFW && s.revealed,
            )}
            key={source.url}
          >
            <video
              src={source.url}
              muted
              loop
              autoPlay
              playsInline
              preload="auto"
            />
            {isNSFW && (
              <>
                <PixelCanvas
                  colors={['#f598aa', '#ffb6c1', '#ff8fab']}
                  gap={4}
                  speed={25}
                  isRevealing={showNSFW}
                />
                <div className={cn(s.nsfwOverlay, showNSFW && s.revealed)}>
                  <div className={s.nsfwContent}>
                    {!showNSFW && <span className={s.ageWarning}>18+</span>}
                    <button
                      className={cn(s.eyeButton, showNSFW && s.minimal)}
                      onClick={toggleNSFW}
                      aria-label={
                        showNSFW ? 'Hide NSFW content' : 'Show NSFW content'
                      }
                    >
                      {showNSFW ? <PixelEyeCross /> : <PixelEye />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div
            key={source.url}
            className={cn(
              s.imageWrapper,
              large && s.large,
              small && s.small,
              isNSFW && s.nsfw,
              isNSFW && showNSFW && s.revealed,
            )}
          >
            <Image
              src={source.url}
              alt={source.title}
              width={width / amount}
              height={height}
              className={cn(s.image)}
              style={{ '--height': height, '--width': width / amount }}
              priority={priority}
              quality={95}
              sizes="(max-width: 768px) 100vw, 75vw"
            />
            {isNSFW && (
              <>
                <PixelCanvas
                  colors={['#f598aa', '#ffb6c1', '#ff8fab']}
                  gap={4}
                  speed={25}
                  isRevealing={showNSFW}
                />
                <div className={cn(s.nsfwOverlay, showNSFW && s.revealed)}>
                  <div className={s.nsfwContent}>
                    {!showNSFW && <span className={s.ageWarning}>18+</span>}
                    <button
                      className={cn(s.eyeButton, showNSFW && s.minimal)}
                      onClick={toggleNSFW}
                      aria-label={
                        showNSFW ? 'Hide NSFW content' : 'Show NSFW content'
                      }
                    >
                      {showNSFW ? <PixelEyeCross /> : <PixelEye />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ),
      )}
    </div>
  )
}
