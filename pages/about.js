import { useMediaQuery } from '@studio-freight/hamo'
import cn from 'clsx'
import { ClientOnly } from 'components/isomorphic'
import { LayoutMobile } from 'components/layout-mobile'
import { ScrollableBox } from 'components/scrollable-box'
import { Layout } from 'layouts/default'
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
    principles: ['FUCK BITCHES', 'GET MONEY', 'RINSE AND REPEAT'],
    phoneNumber: '+1 (424) 222-9967',
    email: 'hello@phantasy.bot',
  }

  const footer = {
    linksCollection: {
      items: [
        { name: 'About', url: '/about?section=studio' },
        { name: 'Legal', url: '/about?section=legal' },
        { name: 'Disclaimers', url: '/about?section=disclaimers' },
      ],
    },
  }

  const contact = {
    form: {
      formId: 'mock-form-id',
      fields: [
        {
          name: 'firstname',
          label: 'First Name',
          type: 'text',
          required: true,
        },
        { name: 'lastname', label: 'Last Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'message', label: 'Message', type: 'textarea', required: true },
      ],
    },
    description: {
      json: {
        nodeType: 'document',
        data: {},
        content: [
          {
            nodeType: 'paragraph',
            data: {},
            content: [
              {
                nodeType: 'text',
                value: 'Contact us with any questions you might have.',
                marks: [],
                data: {},
              },
            ],
          },
        ],
      },
    },
    thankYouMessage: {
      json: {
        nodeType: 'document',
        data: {},
        content: [
          {
            nodeType: 'paragraph',
            data: {},
            content: [
              {
                nodeType: 'text',
                value:
                  'Thank you for your message. We will get back to you shortly.',
                marks: [],
                data: {},
              },
            ],
          },
        ],
      },
    },
    faqsCollection: {
      items: [],
    },
  }

  const aboutContent = {
    sections: [
      {
        key: 'studio',
        name: 'Studio',
        subtitle: 'Our Mission',
        content: {
          json: {
            nodeType: 'document',
            data: {},
            content: [
              {
                nodeType: 'paragraph',
                data: {},
                content: [
                  {
                    nodeType: 'text',
                    value:
                      'Phantasy is an 18+ NSFW AI Gaming and Entertainment Studio pushing the boundaries of interactive digital experiences.',
                    marks: [],
                    data: {},
                  },
                ],
              },
              {
                nodeType: 'paragraph',
                data: {},
                content: [
                  {
                    nodeType: 'text',
                    value:
                      'We specialize in creating immersive AI-powered characters and experiences that blur the line between reality and fantasy.',
                    marks: [],
                    data: {},
                  },
                ],
              },
            ],
          },
        },
      },
      {
        key: 'team',
        name: 'Team',
        subtitle: 'Who We Are',
        content: {
          json: {
            nodeType: 'document',
            data: {},
            content: [
              {
                nodeType: 'paragraph',
                data: {},
                content: [
                  {
                    nodeType: 'text',
                    value:
                      'Our team consists of AI researchers, game developers, and digital artists passionate about creating next-generation entertainment experiences.',
                    marks: [],
                    data: {},
                  },
                ],
              },
              {
                nodeType: 'paragraph',
                data: {},
                content: [
                  {
                    nodeType: 'text',
                    value:
                      'We combine cutting-edge technology with creative storytelling to deliver unique and engaging content.',
                    marks: [],
                    data: {},
                  },
                ],
              },
            ],
          },
        },
      },
      {
        key: 'technology',
        name: 'Technology',
        subtitle: 'How We Build',
        content: {
          json: {
            nodeType: 'document',
            data: {},
            content: [
              {
                nodeType: 'paragraph',
                data: {},
                content: [
                  {
                    nodeType: 'text',
                    value:
                      'We leverage state-of-the-art AI models, advanced rendering techniques, and real-time interaction systems to create our experiences.',
                    marks: [],
                    data: {},
                  },
                ],
              },
              {
                nodeType: 'paragraph',
                data: {},
                content: [
                  {
                    nodeType: 'text',
                    value:
                      'Our technology stack includes machine learning, natural language processing, and immersive 3D environments.',
                    marks: [],
                    data: {},
                  },
                ],
              },
            ],
          },
        },
      },
      {
        key: 'legal',
        name: 'Legal',
        subtitle: 'Terms & Privacy',
        content: {
          json: {
            nodeType: 'document',
            data: {},
            content: [
              {
                nodeType: 'heading',
                data: { level: 2 },
                content: [
                  {
                    nodeType: 'text',
                    value: 'Privacy Policy',
                    marks: [],
                    data: {},
                  },
                ],
              },
              {
                nodeType: 'paragraph',
                data: {},
                content: [
                  {
                    nodeType: 'text',
                    value:
                      'We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. We use this information to provide, maintain, and improve our services, process transactions, and communicate with you.',
                    marks: [],
                    data: {},
                  },
                ],
              },
              {
                nodeType: 'heading',
                data: { level: 2 },
                content: [
                  {
                    nodeType: 'text',
                    value: 'Terms of Service',
                    marks: [],
                    data: {},
                  },
                ],
              },
              {
                nodeType: 'paragraph',
                data: {},
                content: [
                  {
                    nodeType: 'text',
                    value:
                      'By accessing and using our services, you accept and agree to be bound by the terms and provision of this agreement. You must be at least 18 years old to use our services. Our platform contains adult content and is not suitable for minors.',
                    marks: [],
                    data: {},
                  },
                ],
              },
              {
                nodeType: 'heading',
                data: { level: 2 },
                content: [
                  {
                    nodeType: 'text',
                    value: 'DMCA Policy',
                    marks: [],
                    data: {},
                  },
                ],
              },
              {
                nodeType: 'paragraph',
                data: {},
                content: [
                  {
                    nodeType: 'text',
                    value:
                      'We respect the intellectual property rights of others and expect our users to do the same. If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please contact us with detailed information.',
                    marks: [],
                    data: {},
                  },
                ],
              },
            ],
          },
        },
      },
      {
        key: 'disclaimers',
        name: 'Disclaimers',
        subtitle: 'Important Notices',
        content: {
          json: {
            nodeType: 'document',
            data: {},
            content: [
              {
                nodeType: 'heading',
                data: { level: 2 },
                content: [
                  {
                    nodeType: 'text',
                    value: 'Content Warning',
                    marks: [],
                    data: {},
                  },
                ],
              },
              {
                nodeType: 'paragraph',
                data: {},
                content: [
                  {
                    nodeType: 'text',
                    value:
                      'This platform contains explicit adult content intended for users 18 years of age or older. All characters and interactions are AI-generated and fictional. They do not represent real individuals and should not be confused with actual persons.',
                    marks: [],
                    data: {},
                  },
                ],
              },
              {
                nodeType: 'heading',
                data: { level: 2 },
                content: [
                  {
                    nodeType: 'text',
                    value: 'Liability Disclaimer',
                    marks: [],
                    data: {},
                  },
                ],
              },
              {
                nodeType: 'paragraph',
                data: {},
                content: [
                  {
                    nodeType: 'text',
                    value:
                      'Your use of our services is at your sole risk. We provide our services on an "as is" and "as available" basis without any warranties of any kind. Our AI characters do not provide professional advice of any kind.',
                    marks: [],
                    data: {},
                  },
                ],
              },
              {
                nodeType: 'heading',
                data: { level: 2 },
                content: [
                  {
                    nodeType: 'text',
                    value: 'AI Technology',
                    marks: [],
                    data: {},
                  },
                ],
              },
              {
                nodeType: 'paragraph',
                data: {},
                content: [
                  {
                    nodeType: 'text',
                    value:
                      'Our platform uses advanced AI technology to generate responses and content. While sophisticated, AI may occasionally produce unexpected or inconsistent responses. User interactions may be processed by AI systems to improve service quality.',
                    marks: [],
                    data: {},
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  }

  return {
    props: {
      phantasy,
      footer,
      contact,
      aboutContent,
      id: 'about',
    },
    revalidate: 30,
  }
}
