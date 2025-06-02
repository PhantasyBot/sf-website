import cn from 'clsx'
import dynamic from 'next/dynamic'
import s from './separator.module.scss'

const PixelPlusSolid = dynamic(() => import('icons/pixel-plus-solid.svg'), {
  ssr: false,
})

export function Separator({
  className,
  hideIcons = false,
  hideLeftIcon = true,
  hideRightIcon = true,
  rightContent = null,
}) {
  return (
    <div className={cn(s.separator, className)}>
      {!hideIcons && !hideLeftIcon && <PixelPlusSolid className={s.icon} />}
      <span className={s.line} />
      {!hideIcons && !hideRightIcon && !rightContent && (
        <PixelPlusSolid className={s.icon} />
      )}
      {rightContent && <div className={s.customContent}>{rightContent}</div>}
    </div>
  )
}
