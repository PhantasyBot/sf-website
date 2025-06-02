import cn from 'clsx'
import dynamic from 'next/dynamic'
import s from './separator.module.scss'

const PixelPlusSolid = dynamic(() => import('icons/pixel-plus-solid.svg'), {
  ssr: false,
})

export function Separator({
  className,
  hideIcons = false,
  hideLeftIcon = false,
  hideRightIcon = false,
  rightContent = null,
  useStar = false,
}) {
  const showLeftIcon = !hideIcons && !hideLeftIcon
  const showRightIcon = !hideIcons && !hideRightIcon && !rightContent

  return (
    <div className={cn(s.separator, className)}>
      {showLeftIcon && (
        <>
          {useStar ? (
            <span className={s.icon}>✰</span>
          ) : (
            <PixelPlusSolid className={s.icon} />
          )}
        </>
      )}
      <span
        className={cn(s.line, {
          [s.leftSpace]: showLeftIcon,
          [s.rightSpace]: showRightIcon || rightContent,
        })}
      />
      {showRightIcon && (
        <>
          {useStar ? (
            <span className={s.icon}>✰</span>
          ) : (
            <PixelPlusSolid className={s.icon} />
          )}
        </>
      )}
      {rightContent && <div className={s.customContent}>{rightContent}</div>}
    </div>
  )
}
