import cn from 'clsx'
import dynamic from 'next/dynamic'
import s from './separator.module.scss'

const PixelPlusSolid = dynamic(() => import('icons/pixel-plus-solid.svg'), {
  ssr: false,
})

export function Separator({ className }) {
  return (
    <div className={cn(s.separator, className)}>
      <PixelPlusSolid className={s.icon} />
      <span className={s.line} />
      <PixelPlusSolid className={s.icon} />
    </div>
  )
}
