import cn from 'clsx'
import { ComposableImage } from 'components/composable-image'
import { useStore } from 'lib/store'
import { useEffect, useRef, useState } from 'react'
import s from './gallery.module.scss'

export function Gallery({ onBackToProject }) {
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

  const handleBackToProject = () => {
    setGalleryVisible(false)
    if (onBackToProject) {
      onBackToProject()
    }
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
      // Focus management - focus the close button when gallery opens
      setTimeout(() => {
        const closeButton = document.querySelector(`.${s.close}`)
        if (closeButton) {
          closeButton.focus()
        }
      }, 100)
    }
  }, [galleryVisible, selectedProject])

  // Focus trap for gallery modal
  useEffect(() => {
    if (!galleryVisible) return

    const focusableElements = [
      `.${s.close}`,
      `.${s.backToProject}`,
      ...(totalImages > 1 ? [`.${s.prevButton}`, `.${s.nextButton}`] : []),
    ].join(', ')

    const handleTabKeyPress = (e) => {
      if (e.key !== 'Tab') return

      const focusable = Array.from(
        document.querySelectorAll(focusableElements),
      ).filter((el) => !el.disabled && el.offsetParent !== null)

      if (focusable.length === 0) return

      const firstElement = focusable[0]
      const lastElement = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTabKeyPress)
    return () => document.removeEventListener('keydown', handleTabKeyPress)
  }, [galleryVisible, totalImages])

  return (
    <div
      className={cn(s.gallery, galleryVisible && s.visible)}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
      aria-describedby="gallery-counter"
    >
      <div className={cn(s.controls, 'gallery-controls')}>
        <button
          className={s.close}
          onClick={() => setGalleryVisible(false)}
          aria-label="Close gallery"
          autoFocus={galleryVisible}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className={cn(s.text, 'p-xs text-uppercase')}>Close</span>
        </button>

        <button
          className={s.backToProject}
          onClick={handleBackToProject}
          aria-label="Return to project information"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className={cn(s.text, 'p-xs text-uppercase')}>
            Back to Project
          </span>
        </button>

        {totalImages > 1 && (
          <>
            <button
              className={cn(s.navButton, s.prevButton)}
              onClick={goToPrevious}
              disabled={totalImages <= 1}
              aria-label="Previous image"
              tabIndex={galleryVisible && totalImages > 1 ? 0 : -1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
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
              aria-label="Next image"
              tabIndex={galleryVisible && totalImages > 1 ? 0 : -1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
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

      <div
        className={s.imageContainer}
        ref={contentRef}
        role="img"
        aria-label={`Image ${currentImageIndex + 1} of ${totalImages} from ${
          selectedProject?.name || 'project'
        } gallery`}
      >
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
          <div
            className={s.imageCounter}
            id="gallery-counter"
            aria-live="polite"
          >
            <span className="p-xs">
              {currentImageIndex + 1} / {totalImages}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
