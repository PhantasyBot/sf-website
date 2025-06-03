import { Image } from '@studio-freight/compono'
import cn from 'clsx'
import { ProjectAccordion } from 'components/project-accordion'
import { renderer } from 'lib/compatibility/renderer'
import { useEffect, useRef } from 'react'
import s from './layout-mobile.module.scss'

const LayoutMobile = ({
  projects,
  phantasy,
  currentAboutSection,
  selectedProject,
  setSelectedProject,
}) => {
  const aboutSectionRef = useRef(null)

  // Determine what content to show in the About section
  const aboutSectionContent = currentAboutSection
    ? renderer(currentAboutSection.content)
    : renderer(phantasy.about)

  const aboutSectionTitle = currentAboutSection
    ? currentAboutSection.name
    : 'About'

  // Handle case where projects might be undefined
  const projectsData = projects?.items || []

  // Scroll to about section when it changes and user is on mobile
  useEffect(() => {
    if (currentAboutSection && aboutSectionRef.current) {
      // Add a small delay to ensure content is rendered
      setTimeout(() => {
        aboutSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100)
    }
  }, [currentAboutSection])

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
        <ProjectAccordion
          data={projectsData}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />
      </section>
      <section className={s.image}>
        <Image
          src={'/mobile-temp-images/sf-game-boy.png'}
          alt={'tetsuo placeholder face'}
          fill
        />
      </section>
      <section className={cn(s.about, 'layout-block')} ref={aboutSectionRef}>
        <p className={cn(s.title, 'p text-bold text-uppercase text-muted')}>
          {aboutSectionTitle}
        </p>
        <div className={s.description}>{aboutSectionContent}</div>
      </section>
    </div>
  )
}

export { LayoutMobile }
