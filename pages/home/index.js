import { Link } from '@studio-freight/compono'
import { useMediaQuery } from '@studio-freight/hamo'
import cn from 'clsx'
import { ComposableImage } from 'components/composable-image'
import { ClientOnly } from 'components/isomorphic'
import { LayoutMobile } from 'components/layout-mobile'
import { ScrollableBox } from 'components/scrollable-box'
import { Layout } from 'layouts/default'
import { renderer } from 'lib/simple-renderer'
import { slugify } from 'lib/slugify'
import { useStore } from 'lib/store'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import s from './home.module.scss'

const Arrow = dynamic(() => import('icons/arrow.svg'), { ssr: false })

const Gallery = dynamic(
  () => import('components/gallery').then(({ Gallery }) => Gallery),
  {
    ssr: false,
  },
)

export default function Home({ phantasy, contact, projects, aboutContent }) {
  const router = useRouter()

  const [showInfoModal, setShowInfoModal] = useState(false)
  const [resetScroll, setResetScroll] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 800px)')
  const [selectedProject, setSelectedProject] = useStore((state) => [
    state.selectedProject,
    state.setSelectedProject,
  ])
  const [setGalleryVisible] = useStore((state) => [state.setGalleryVisible])

  // State for About section content
  const [currentAboutSection, setCurrentAboutSection] = useState(null)

  // Define the default project name - easy to change
  const DEFAULT_PROJECT_NAME = 'Rally'

  useEffect(() => {
    const searchTerm = router.asPath.substring(router.asPath.indexOf('#') + 1)
    const projectParam = router.query.project

    let matchingItem

    // First check if there's a project parameter in the URL
    if (projectParam && projects.items) {
      matchingItem = projects.items.find(
        (item) => item.name.toLowerCase() === projectParam.toLowerCase(),
      )
    }

    // If no project param match, try the hash-based search
    if (!matchingItem && searchTerm) {
      matchingItem = projects.items.find((item) =>
        slugify(item.name).includes(searchTerm),
      )
    }

    // Use the configured default project instead of just the first item
    const defaultProject =
      projects.items.find((item) => item.name === DEFAULT_PROJECT_NAME) ||
      projects.items[0]

    setSelectedProject(matchingItem || defaultProject)
  }, [router.asPath, router.query.project])

  useEffect(() => {
    if (selectedProject) {
      setResetScroll(true)
      setTimeout(() => {
        setResetScroll(false)
      }, 100)
    }
  }, [selectedProject])

  // Handle About section changes based on URL query
  useEffect(() => {
    const section = router.query.section
    if (section && section !== 'home' && aboutContent?.sections) {
      const matchingSection = aboutContent.sections.find(
        (s) => s.key === section,
      )
      setCurrentAboutSection(matchingSection)
    } else {
      // Default to the original About content for home or no section
      setCurrentAboutSection(null)
    }
  }, [router.query.section, aboutContent])

  // Theme switching based on project only
  const getSectionTheme = (project) => {
    if (!project) return 'rally'

    switch (project.name) {
      case 'Rally':
        return 'rally' // Pink theme
      case 'Banshee':
        return 'banshee' // Light theme
      case 'Munny':
        return 'munny' // Green theme
      case 'Lorelei':
        return 'merchandise' // Rainbow theme (keeping same theme)
      case 'Alchemist':
        return 'alchemist' // Japanese cyberpunk neon red theme
      default:
        return 'rally' // Default theme
    }
  }

  // Theme is only determined by selected project, not about section
  const currentTheme = getSectionTheme(selectedProject)

  // Get the content and title for the About section
  const aboutSectionContent = currentAboutSection
    ? renderer(currentAboutSection.content)
    : renderer(phantasy.about)

  const aboutSectionTitle = currentAboutSection
    ? currentAboutSection.name
    : 'About'

  // Generate footer links dynamically based on selected project
  const dynamicFooter = {
    linksCollection: {
      items: [
        { name: 'Home', url: '/?section=home' },
        {
          name: 'Legal',
          url: selectedProject
            ? `/?section=legal&project=${encodeURIComponent(
                selectedProject.name.toLowerCase(),
              )}`
            : '/?section=legal',
        },
        {
          name: 'Disclaimers',
          url: selectedProject
            ? `/?section=disclaimers&project=${encodeURIComponent(
                selectedProject.name.toLowerCase(),
              )}`
            : '/?section=disclaimers',
        },
        {
          name: 'Store',
          url: 'https://store.phantasy.bot',
          external: true,
        },
      ],
    },
  }

  return (
    <Layout
      currentTheme={currentTheme}
      theme="dark"
      principles={phantasy.principles}
      contactData={contact}
      footerLinks={dynamicFooter.linksCollection.items}
    >
      {!isDesktop ? (
        <LayoutMobile
          phantasy={phantasy}
          projects={projects}
          currentAboutSection={currentAboutSection}
        />
      ) : (
        <ClientOnly>
          <div className={cn(s.content, 'layout-grid')}>
            <section className={s.about}>
              <p
                className={cn(s.title, 'p text-bold text-uppercase text-muted')}
              >
                {aboutSectionTitle}
              </p>
              <ScrollableBox className={s.description}>
                {aboutSectionContent}
              </ScrollableBox>
            </section>
            <section className={s.projects}>
              <p
                className={cn(s.title, 'p text-bold text-uppercase text-muted')}
              >
                Agents
              </p>
              <ScrollableBox className={s.list}>
                <ul>
                  {projects.items.map((project) => (
                    <li
                      key={project.sys.id}
                      className={cn(
                        selectedProject?.sys?.id === project.sys.id && s.active,
                        s['list-item'],
                      )}
                    >
                      <button
                        onClick={() => {
                          setSelectedProject(project)
                        }}
                      >
                        <p className="p text-bold text-uppercase">
                          {project.name}
                        </p>
                        <p className="p-xs text-uppercase">
                          {project.industry}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              </ScrollableBox>
            </section>
            <section className={s['project-details']}>
              <div className={s.heading}>
                <p
                  className={cn(
                    s.title,
                    'p text-bold text-uppercase text-muted',
                  )}
                >
                  Details
                </p>
                <div className={s.actions}>
                  <button
                    className="p-s decorate"
                    onClick={() => {
                      setShowInfoModal(!showInfoModal)
                    }}
                  >
                    {showInfoModal ? 'close' : 'info'}
                  </button>
                  {selectedProject?.link && (
                    <Link
                      href={selectedProject?.link}
                      className={cn('p-s decorate', s.external)}
                    >
                      site
                      <Arrow className={s.arrow} />
                    </Link>
                  )}
                </div>
              </div>
              <div className={s['details-content']}>
                <div className={cn(s.images, !showInfoModal && s.visible)}>
                  <button
                    className={cn(s['modal-trigger'], 'p-s')}
                    onClick={() => {
                      setGalleryVisible(true)
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 26 26"
                    >
                      <path
                        stroke="var(--primary-accent)"
                        d="M11 1H1v10M15 1h10v10M15 25h10V15M11 25H1V15m12-8v12m6-6H7"
                      />
                    </svg>
                    Enlarge
                  </button>
                  <ScrollableBox reset={showInfoModal || resetScroll}>
                    {selectedProject?.assetsCollection?.items.map(
                      (asset, i) => (
                        <button
                          className={s.assetButton}
                          key={i}
                          onClick={() => {
                            setGalleryVisible(true)
                          }}
                        >
                          <ComposableImage
                            sources={asset.imagesCollection}
                            priority={i === 0}
                            width={1026}
                            height={604}
                            isNSFW={asset.isNSFW || false}
                          />
                        </button>
                      ),
                    )}
                  </ScrollableBox>
                </div>
                <ScrollableBox
                  className={cn(s.info, showInfoModal && s.visible)}
                  reset={!showInfoModal || resetScroll}
                >
                  {selectedProject?.body && (
                    <div className={s.description}>
                      {renderer(selectedProject.body)}
                    </div>
                  )}
                  {selectedProject?.platform && (
                    <div className={s.platform}>
                      <p
                        className={cn(
                          s.title,
                          'p text-muted text-uppercase text-bold',
                        )}
                      >
                        Platform
                      </p>
                      <p className="p text-bold">
                        {selectedProject.platform.name}
                      </p>
                      <p className="p-s">{selectedProject.platform.summary}</p>
                      {selectedProject.platform.link && (
                        <Link
                          href={selectedProject.platform.link}
                          className="p-s decorate"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Platform ↗
                        </Link>
                      )}
                    </div>
                  )}
                  {selectedProject?.agent && (
                    <div className={s.agent}>
                      <p
                        className={cn(
                          s.title,
                          'p text-muted text-uppercase text-bold',
                        )}
                      >
                        Agent
                      </p>
                      <div className={s.agentDetails}>
                        {selectedProject.agent.profileImage && (
                          <img
                            src={selectedProject.agent.profileImage}
                            alt={selectedProject.agent.name}
                            className={s.agentProfile}
                          />
                        )}
                        <div>
                          <p className="p text-bold">
                            {selectedProject.agent.name}
                          </p>
                          <p className="p-s">{selectedProject.agent.goal}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedProject?.token && (
                    <div className={s.token}>
                      <p
                        className={cn(
                          s.title,
                          'p text-muted text-uppercase text-bold',
                        )}
                      >
                        Token
                      </p>
                      <div className={s.tokenDetails}>
                        <div className={s.addressContainer}>
                          <code className="p-s">
                            {selectedProject.token.address}
                          </code>
                          <button
                            className={s.copyButton}
                            onClick={() => {
                              navigator.clipboard.writeText(
                                selectedProject.token.address,
                              )
                              // Optional: Add a toast notification here
                            }}
                            title="Copy address"
                          >
                            📋
                          </button>
                        </div>
                        {selectedProject.token.dexLink && (
                          <Link
                            href={selectedProject.token.dexLink}
                            className="p-s decorate"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Trade on DEX ↗
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </ScrollableBox>
              </div>
            </section>
          </div>
        </ClientOnly>
      )}

      <Gallery />
    </Layout>
  )
}

export async function getStaticProps() {
  const phantasy = {
    principles: ['AI COMPANIONS', 'NSFW ENTERTAINMENT', 'VIRTUAL LOVE'],
    about: {
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
      items: [
        {
          title: 'What is Phantasy?',
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
                        'Phantasy is an 18+ NSFW AI Gaming and Entertainment Studio that creates virtual companions and adult-oriented AI experiences. We specialize in AI companions, NSFW entertainment, and virtual relationships.',
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
          title: 'How do I access your services?',
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
                        'You can access our services through our platform. All users must be 18+ years old and verify their age to use our NSFW content and AI companions.',
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
          title: 'What age restrictions apply?',
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
                        'Our platform is strictly for users 18 years of age or older. We require age verification and do not allow minors to access any of our content or services.',
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
          title: 'Are the AI characters real people?',
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
                        'No, all characters and interactions are AI-generated and completely fictional. They do not represent real individuals and should not be confused with actual persons.',
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
          title: 'How do I contact support?',
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
                        'You can reach our support team through our Discord community or social media channels. We respond to all inquiries within 24-48 hours.',
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
          title: 'What technologies do you use?',
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
                        'We use cutting-edge AI technologies including advanced language models, computer vision, and machine learning algorithms to create realistic and engaging virtual companions.',
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
    },
  }

  const projectList = {
    listCollection: {
      items: [
        {
          sys: { id: 'project5' },
          name: 'Alchemist',
          industry: 'Tech',
          body: {
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
                        'An innovative tech platform with cutting-edge features.',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
          },
          platform: {
            name: 'Alchemist Platform',
            summary:
              'Advanced AI technology platform for next-generation digital experiences.',
            link: 'https://example.com/alchemist',
          },
          agent: {
            name: 'Alchemist AI',
            goal: 'To provide cutting-edge AI solutions and innovative technological experiences.',
            profileImage:
              'https://placehold.co/1026x604/111/333?text=Alchemist',
          },
          token: {
            address: '0xabcdef1234567890abcdef1234567890abcdef12',
            dexLink: 'https://app.virtuals.io',
          },
          link: 'https://example.com/alchemist',
          assetsCollection: {
            items: [
              {
                imagesCollection: {
                  items: [
                    {
                      url: 'https://placehold.co/1026x604/111/333?text=Alchemist',
                      width: 1026,
                      height: 604,
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          sys: { id: 'project1' },
          name: 'Rally',
          industry: 'Virtual Girlfriend',
          body: {
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
                        'Rally is a cheerful virtual girlfriend that lets you do NSFW with her.',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
          },
          platform: {
            name: 'Rally Platform',
            summary:
              'An interactive AI companion platform featuring Rally, your virtual girlfriend experience.',
            link: 'https://rally.sh',
          },
          agent: {
            name: 'Rally',
            goal: 'To provide companionship, entertainment, and NSFW interactions in a safe virtual environment.',
            profileImage: 'https://r2.rally.sh/photos/rally_pfp.png',
          },
          token: {
            address: '0x1234567890abcdef1234567890abcdef12345678',
            dexLink: 'https://app.virtuals.io',
          },
          link: 'https://rally.sh',
          assetsCollection: {
            items: [
              {
                imagesCollection: {
                  items: [
                    {
                      url: 'https://r2.rally.sh/photos/rally_pfp.png',
                      width: 1026,
                      height: 604,
                    },
                  ],
                },
                isNSFW: false,
              },
              {
                imagesCollection: {
                  items: [
                    {
                      url: 'https://r2.rally.sh/photos/rally_twitter_00519_.png',
                      width: 1026,
                      height: 604,
                    },
                  ],
                },
                isNSFW: true,
              },
              {
                imagesCollection: {
                  items: [
                    {
                      url: 'https://r2.rally.sh/photos/rally_twitter_00500_.png',
                      width: 1026,
                      height: 604,
                    },
                  ],
                },
                isNSFW: true,
              },
              {
                imagesCollection: {
                  items: [
                    {
                      url: 'https://r2.rally.sh/photos/rally_twitter_00519_.png',
                      width: 1026,
                      height: 604,
                    },
                  ],
                },
                isNSFW: false,
              },
            ],
          },
        },
        {
          sys: { id: 'project2' },
          name: 'Banshee',
          industry: 'Tech',
          body: {
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
                        'An innovative tech platform with cutting-edge features.',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
          },
          platform: {
            name: 'Banshee Platform',
            summary: 'Ethereal AI platform for mystical digital experiences.',
            link: 'https://example.com/banshee',
          },
          agent: {
            name: 'Banshee',
            goal: 'To provide mystical and ethereal AI companionship experiences.',
            profileImage:
              'https://placehold.co/1026x604/cad2e2/fff?text=Banshee',
          },
          token: {
            address: '0xbanshee1234567890abcdef1234567890abcdef',
            dexLink: 'https://app.virtuals.io',
          },
          link: 'https://example.com/project2',
          assetsCollection: {
            items: [
              {
                imagesCollection: {
                  items: [
                    {
                      url: 'https://placehold.co/1026x604/111/333?text=Project+Two',
                      width: 1026,
                      height: 604,
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          sys: { id: 'project3' },
          name: 'Munny',
          industry: 'Tech',
          body: {
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
                        'An innovative tech platform with cutting-edge features.',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
          },
          platform: {
            name: 'Munny Platform',
            summary:
              'Green technology platform for sustainable AI experiences.',
            link: 'https://example.com/munny',
          },
          agent: {
            name: 'Munny',
            goal: 'To provide eco-friendly and sustainable AI companion services.',
            profileImage: 'https://placehold.co/1026x604/558b2f/fff?text=Munny',
          },
          token: {
            address: '0xmunny1234567890abcdef1234567890abcdefgh',
            dexLink: 'https://app.virtuals.io',
          },
          link: 'https://example.com/project2',
          assetsCollection: {
            items: [
              {
                imagesCollection: {
                  items: [
                    {
                      url: 'https://placehold.co/1026x604/111/333?text=Project+Two',
                      width: 1026,
                      height: 604,
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          sys: { id: 'project4' },
          name: 'Lorelei',
          industry: 'Tech',
          body: {
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
                        'An innovative tech platform with cutting-edge features.',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
          },
          platform: {
            name: 'Lorelei Platform',
            summary:
              'Enchanting AI platform for mystical and alluring digital experiences.',
            link: 'https://example.com/lorelei',
          },
          agent: {
            name: 'Lorelei',
            goal: 'To provide enchanting and mystical AI companion experiences with captivating interactions.',
            profileImage:
              'https://placehold.co/1026x604/a0c4ff/fff?text=Lorelei',
          },
          token: {
            address: '0xlorelei1234567890abcdef1234567890abcdef',
            dexLink: 'https://app.virtuals.io',
          },
          link: 'https://example.com/project2',
          assetsCollection: {
            items: [
              {
                imagesCollection: {
                  items: [
                    {
                      url: 'https://placehold.co/1026x604/111/333?text=Project+Two',
                      width: 1026,
                      height: 604,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  }

  const aboutContent = {
    sections: [
      {
        key: 'home',
        name: 'About',
        subtitle: 'Our Studio',
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
                    value: 'Token Disclaimer',
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
                      'Any tokens or digital assets referenced by Phantasy are not securities and are not intended to be an investment or financial instrument. Tokens are provided purely for entertainment and utility purposes within our platform ecosystem. This disclaimer applies to all current and future token offerings.',
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
                    value: 'Investment Disclaimer',
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
                      'Nothing on this platform constitutes investment advice, financial advice, trading advice, or any other sort of advice. You should not treat any of the content as such. Phantasy does not recommend that any cryptocurrency should be bought, sold, or held by you. Conduct your own due diligence and consult your financial advisor before making any investment decisions.',
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
                    value: 'Entertainment Purposes Only',
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
                      'All content, interactions, and services provided by Phantasy are strictly for entertainment purposes only. This includes but is not limited to AI character interactions, gaming experiences, and any virtual or digital content. No real-world advice or recommendations should be derived from our entertainment content.',
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
                      'We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. We use this information to provide, maintain, and improve our services, process transactions, and communicate with you. We do not sell your personal information to third parties.',
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
                      'We may collect wallet addresses and transaction data for blockchain interactions. This data is necessary for providing web3 functionality and may be publicly visible on blockchain networks. We implement industry-standard security measures to protect your data.',
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
                      'By accessing and using our services, you accept and agree to be bound by the terms and provisions of this agreement. You must be at least 18 years old to use our services. Our platform contains adult content and is not suitable for minors.',
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
                      'You are responsible for maintaining the security of your wallet and private keys. Phantasy is not responsible for any losses resulting from unauthorized access to your wallet or accounts. All blockchain transactions are final and irreversible.',
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
                      'We respect the intellectual property rights of others and expect our users to do the same. If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please contact us with detailed information including proof of ownership and location of the infringing material.',
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
                    value: 'Regulatory Disclaimer',
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
                      'Cryptocurrency regulations vary by jurisdiction and are rapidly evolving. It is your responsibility to ensure compliance with local laws and regulations. Phantasy operates globally and does not provide legal advice regarding regulatory compliance in your specific jurisdiction.',
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
                    value: 'Technical Risk Disclaimer',
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
                      'Blockchain technology and smart contracts carry inherent risks including but not limited to: network congestion, gas fee fluctuations, smart contract vulnerabilities, and potential loss of funds. Phantasy cannot guarantee the security or functionality of third-party blockchain networks or protocols.',
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
                      'Your use of our services is at your sole risk. We provide our services on an "as is" and "as available" basis without any warranties of any kind. Our AI characters do not provide professional advice of any kind. Phantasy shall not be liable for any direct, indirect, incidental, special, or consequential damages.',
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
                    value: 'Platform Availability',
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
                      'Service availability is not guaranteed and may be subject to downtime, maintenance, or interruption. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without prior notice. Your access may be restricted based on geographic location or other factors.',
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
                      'Our platform uses advanced AI technology to generate responses and content. While sophisticated, AI may occasionally produce unexpected, inappropriate, or inconsistent responses. User interactions may be processed by AI systems to improve service quality. AI-generated content should not be considered factual or reliable information.',
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
                    value: 'Third-Party Services',
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
                      'Our platform may integrate with third-party services, wallets, and protocols. We are not responsible for the performance, security, or availability of these external services. Users interact with third-party services at their own risk and should review their respective terms and conditions.',
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
      contact,
      projects: projectList.listCollection,
      aboutContent,
      id: 'home',
    },
    revalidate: 30,
  }
}
