import { Image } from '@studio-freight/compono'
import cn from 'clsx'
import { ProjectAccordion } from 'components/project-accordion'
import { renderer } from 'lib/compatibility/renderer'
import s from './layout-mobile.module.scss'

const LayoutMobile = ({ projects, phantasy }) => {
  return (
    <div className={s.content}>
      <section className={s['hero-image']}>
        <Image
          src="/mobile-temp-images/tetsuo.jpg"
          alt="tetsuo placeholder face"
          fill
        />
      </section>
      <section className={cn(s.projects, 'layout-block')}>
        <ProjectAccordion data={projects.items} />
      </section>
      <section className={s.image}>
        <Image
          src={'/mobile-temp-images/sf-game-boy.png'}
          alt={'tetsuo placeholder face'}
          fill
        />
      </section>
      <section className={cn(s.about, 'layout-block')}>
        <p className={cn(s.title, 'p text-bold text-uppercase text-muted')}>
          About
        </p>
        <div className={s.description}>{renderer(phantasy.about)}</div>
      </section>
    </div>
  )
}

export { LayoutMobile }
