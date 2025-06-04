import { useMediaQuery } from '@studio-freight/hamo'
import cn from 'clsx'
import { ClientOnly } from 'components/isomorphic'
import { LayoutMobile } from 'components/layout-mobile'
import { ScrollableBox } from 'components/scrollable-box'
import { Layout } from 'layouts/default'
import { aboutContent } from 'lib/content'
import { renderer } from 'lib/simple-renderer'
import { useStore } from 'lib/store'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import s from './about.module.scss'

export default function About({ phantasy, footer, contact, aboutContent }) {
  const router = useRouter()
  const isDesktop = useMediaQuery('(min-width: 800px)')
  const [selectedSection, setSelectedSection] = useStore((state) => [
    state.selectedAboutSection,
    state.setSelectedAboutSection,
  ])

  // Default to Studio section
  useEffect(() => {
    const section = router.query.section || 'studio'
    const matchingSection = aboutContent.sections.find((s) => s.key === section)
    setSelectedSection(matchingSection || aboutContent.sections[0])
  }, [router.query.section, aboutContent.sections, setSelectedSection])

  // Theme switching based on section
  const getSectionTheme = (sectionKey) => {
    switch (sectionKey) {
      case 'legal':
        return 'banshee' // Light theme for legal content
      case 'disclaimers':
        return 'munny' // Green theme for disclaimers
      default:
        return 'rally' // Default theme for about/studio/team/technology
    }
  }

  const currentTheme = getSectionTheme(selectedSection?.key)

  return (
    <Layout
      currentTheme={currentTheme}
      theme="dark"
      principles={phantasy.principles}
      contactData={contact}
      footerLinks={footer.linksCollection.items}
    >
      {!isDesktop ? (
        <LayoutMobile phantasy={phantasy} />
      ) : (
        <ClientOnly>
          <div className={cn(s.content, 'layout-grid')}>
            <section className={s.navigation}>
              <p
                className={cn(s.title, 'p text-bold text-uppercase text-muted')}
              >
                About
              </p>
              <ScrollableBox className={s.list}>
                <ul>
                  {aboutContent.sections.map((section) => (
                    <li
                      key={section.key}
                      className={cn(
                        selectedSection?.key === section.key && s.active,
                        s['list-item'],
                      )}
                    >
                      <button
                        onClick={() => {
                          setSelectedSection(section)
                          router.push(
                            `/about?section=${section.key}`,
                            undefined,
                            {
                              shallow: true,
                            },
                          )
                        }}
                      >
                        <p className="p text-bold text-uppercase">
                          {section.name}
                        </p>
                        <p className="p-xs text-uppercase">
                          {section.subtitle}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              </ScrollableBox>
            </section>

            <section className={s.content}>
              <div className={s.heading}>
                <p
                  className={cn(
                    s.title,
                    'p text-bold text-uppercase text-muted',
                  )}
                >
                  {selectedSection?.name || 'Studio'}
                </p>
              </div>
              <ScrollableBox className={s.description}>
                {selectedSection?.content && renderer(selectedSection.content)}
              </ScrollableBox>
            </section>
          </div>
        </ClientOnly>
      )}
    </Layout>
  )
}

export async function getStaticProps() {
  const phantasy = {
    principles: ['AI COMPANIONS', 'NSFW ENTERTAINMENT', 'VIRTUAL LOVE'],
  }

  const footer = {
    linksCollection: {
      items: [
        { name: 'About', url: '/about?section=studio' },
        { name: 'Legal', url: '/about?section=legal' },
        { name: 'Disclaimer', url: '/about?section=disclaimers' },
      ],
    },
  }

  const contact = {
    faqsCollection: {
      items: [],
    },
  }

  return {
    props: {
      phantasy,
      footer,
      contact,
      aboutContent,
    },
  }
}
