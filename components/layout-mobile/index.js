import { Image } from '@studio-freight/compono'
import cn from 'clsx'
import { ProjectAccordion } from 'components/project-accordion'
import { renderer } from 'lib/compatibility/renderer'
import s from './layout-mobile.module.scss'

const LayoutMobile = ({ projects, phantasy, currentAboutSection }) => {
  // Determine what content to show in the About section
  const aboutSectionContent = currentAboutSection
    ? renderer(currentAboutSection.content)
    : renderer(phantasy.about)

  const aboutSectionTitle = currentAboutSection
    ? currentAboutSection.name
    : 'About'

  // Handle case where projects might be undefined
  const projectsData = projects?.items || []

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
        <ProjectAccordion data={projectsData} />
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
          {aboutSectionTitle}
        </p>
        <div className={s.description}>{aboutSectionContent}</div>
      </section>
    </div>
  )
}

export { LayoutMobile }
