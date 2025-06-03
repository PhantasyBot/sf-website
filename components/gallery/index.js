import cn from 'clsx'
import { ComposableImage } from 'components/composable-image'
import { useStore } from 'lib/store'
import { useEffect, useRef, useState } from 'react'
import s from './gallery.module.scss'

export function Gallery() {
  const contentRef = useRef(null)
  const [selectedProject, galleryVisible, setGalleryVisible] = useStore(
    (state) => [
      state.selectedProject,
      state.galleryVisible,
      state.setGalleryVisible,
    ],
  )

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const totalImages = selectedProject?.assetsCollection?.items?.length || 0

  // Handle backdrop clicks to close gallery
  const handleBackdropClick = (e) => {
    // Only close if clicking directly on the gallery backdrop (not on children)
    if (e.target === e.currentTarget) {
      setGalleryVisible(false)
    }
  }

  const goToPrevious = (e) => {
    e?.preventDefault()
    e?.stopPropagation()
    // Only navigate if we're not interacting with video controls
    if (e?.target?.tagName === 'VIDEO' || e?.target?.closest('video')) {
      return
    }
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1))
  }

  const goToNext = (e) => {
    e?.preventDefault()
    e?.stopPropagation()
    // Only navigate if we're not interacting with video controls
    if (e?.target?.tagName === 'VIDEO' || e?.target?.closest('video')) {
      return
    }
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!galleryVisible) return

      switch (event.keyCode) {
        case 27: // Escape
          setGalleryVisible(false)
          break
        case 37: // Left arrow
          goToPrevious()
          break
        case 39: // Right arrow
          goToNext()
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress, false)
    return () => document.removeEventListener('keydown', handleKeyPress, false)
  }, [galleryVisible, totalImages])

  // Reset image index when gallery opens or project changes
  useEffect(() => {
    if (galleryVisible) {
      setCurrentImageIndex(0)
    }
  }, [galleryVisible, selectedProject])

  return (
    <div
      className={cn(s.gallery, galleryVisible && s.visible)}
      onClick={handleBackdropClick}
    >
      <div className={cn(s.controls, 'gallery-controls')}>
        <button className={s.close} onClick={() => setGalleryVisible(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className={cn(s.text, 'p-xs text-uppercase')}>Close</span>
        </button>

        {totalImages > 1 && (
          <>
            <button
              className={cn(s.navButton, s.prevButton)}
              onClick={goToPrevious}
              disabled={totalImages <= 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className={cn(s.text, 'p-xs text-uppercase')}>Prev</span>
            </button>

            <button
              className={cn(s.navButton, s.nextButton)}
              onClick={goToNext}
              disabled={totalImages <= 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className={cn(s.text, 'p-xs text-uppercase')}>Next</span>
            </button>
          </>
        )}
      </div>

      <div className={s.imageContainer} ref={contentRef}>
        {selectedProject?.assetsCollection?.items?.[currentImageIndex] && (
          <ComposableImage
            sources={
              selectedProject.assetsCollection.items[currentImageIndex]
                .imagesCollection
            }
            width={1557}
            height={916.5}
            large
          />
        )}

        {totalImages > 1 && (
          <div className={s.imageCounter}>
            <span className="p-xs">
              {currentImageIndex + 1} / {totalImages}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
