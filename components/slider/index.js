import cn from 'clsx'
import { useBlazeSlider } from 'hooks/use-blaze-slider'

export default function Slider({
  children,
  slidesToShow = 1,
  draggable = true,
  slideGap = '10px',
  className,
  enableAutoplay = false,
  autoplayInterval = 4000,
  enablePagination = false,
}) {
  const elRef = useBlazeSlider({
    all: {
      slidesToShow,
      draggable,
      slideGap,
      enableAutoplay,
      autoplayInterval,
      loop: true,
      ...(enablePagination && {
        enablePagination: true,
        paginationButtonClassName: 'custom-pagination-dot',
      }),
    },
  })

  return (
    <div className={cn(className, 'blaze-slider')} ref={elRef}>
      <div className="blaze-container">
        <div className="blaze-track-container">
          <div className="blaze-track">{children}</div>
        </div>
        {enablePagination && (
          <div className="blaze-pagination">
            {/* This will be populated by blaze slider */}
          </div>
        )}
      </div>
    </div>
  )
}
