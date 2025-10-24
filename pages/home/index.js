import { Link } from '@studio-freight/compono'
import { useMediaQuery } from '@studio-freight/hamo'
import cn from 'clsx'
import { ComposableImage } from 'components/composable-image'
import { ClientOnly } from 'components/isomorphic'
import { LayoutMobile } from 'components/layout-mobile'
import { ScrollableBox } from 'components/scrollable-box'
import { Layout } from 'layouts/default'
import { getPageContent } from 'lib/content'
import { renderer } from 'lib/simple-renderer'
import { slugify } from 'lib/slugify'
import { useStore } from 'lib/store'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import s from './home.module.scss'

const PixelCopySolid = dynamic(() => import('icons/pixel-copy-solid.svg'), {
  ssr: false,
})
const TokenBaseIcon = dynamic(() => import('icons/token-base.svg'), {
  ssr: false,
})
const PixelExternalIcon = dynamic(
  () => import('icons/pixel-external-link-solid.svg'),
  {
    ssr: false,
  },
)
const PixelImageSolid = dynamic(() => import('icons/pixel-image-solid.svg'), {
  ssr: false,
})
const PixelFinance = dynamic(() => import('icons/pixel-finance.svg'), {
  ssr: false,
})
const PixelX = dynamic(() => import('icons/pixel-x.svg'), {
  ssr: false,
})
const PixelAt = dynamic(() => import('icons/pixel-at-solid.svg'), {
  ssr: false,
})
const PixelInstagram = dynamic(() => import('icons/pixel-instagram.svg'), {
  ssr: false,
})
const PixelGlobeSolid = dynamic(() => import('icons/pixel-globe-solid.svg'), {
  ssr: false,
})
const PixelBookHeart = dynamic(
  () => import('icons/pixel-book-heart-solid.svg'),
  {
    ssr: false,
  },
)

const Gallery = dynamic(
  () => import('components/gallery').then(({ Gallery }) => Gallery),
  {
    ssr: false,
  },
)

export default function Home({ phantasy, contact, projects, aboutContent }) {
  const router = useRouter()

  const [showInfoModal, setShowInfoModal] = useState(true)
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

  // Copy to clipboard function
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      // Optional: Add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  // Keyboard event handler for gallery
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only handle if gallery is visible
      if (!useStore.getState().galleryVisible) return

      switch (event.key) {
        case 'Escape':
          setGalleryVisible(false)
          break
        case 'ArrowLeft':
          // Gallery component will handle these
          break
        case 'ArrowRight':
          // Gallery component will handle these
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Manage tabindex for action buttons based on showInfoModal state
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Gallery button (should be focusable when info is hidden)
    const galleryButtons = document.querySelectorAll(`.${s.galleryButton}`)
    galleryButtons.forEach((element) => {
      if (showInfoModal) {
        // Make gallery button unfocusable when info is shown
        element.setAttribute('tabindex', '-1')
      } else {
        // Allow gallery button to be focusable when info is hidden
        element.removeAttribute('tabindex')
      }
    })

    // Action buttons in info section (should be focusable when info is shown)
    const infoActionSelectors = [
      `.${s.platformButton}`,
      `.${s.copyButton}`,
      `.${s.dexButton}`,
    ]

    infoActionSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(`.${s.info} ${selector}`)
      elements.forEach((element) => {
        if (showInfoModal) {
          // Remove any previously set tabindex to restore natural tab order
          element.removeAttribute('tabindex')
        } else {
          // Make unfocusable when info is hidden
          element.setAttribute('tabindex', '-1')
        }
      })
    })
  }, [showInfoModal])

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
      case 'Lorelei':
        return 'lorelei' // Rainbow theme (changed from merchandise)
      case 'Alchemist':
        return 'alchemist' // Japanese cyberpunk neon red theme
      case 'Alkahest':
        return 'alchemist' // Use alchemist theme for Alkahest
      case 'Maho':
        return 'lorelei' // Use lorelei theme for Maho
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
          name: 'Disclaimer',
          url: selectedProject
            ? `/?section=disclaimers&project=${encodeURIComponent(
                selectedProject.name.toLowerCase(),
              )}`
            : '/?section=disclaimers',
        },
        {
          name: 'Shop',
          url: 'https://shop.phantasy.bot',
          external: true,
        },
        // Add agent platform link if available - desktop only and last
        ...(selectedProject?.platform?.link
          ? [
              {
                name: selectedProject.platform.name,
                url: selectedProject.platform.link,
                external: true,
                themeColor: true,
                desktopOnly: true,
              },
            ]
          : []),
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
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />
      ) : (
        <ClientOnly>
          <div className={cn(s.content, 'layout-grid')}>
            <section className={s.about} aria-labelledby="about-heading">
              <h1
                id="about-heading"
                className={cn(s.title, 'p text-bold text-uppercase text-muted')}
              >
                {aboutSectionTitle}
              </h1>
              <ScrollableBox className={s.description}>
                {aboutSectionContent}
              </ScrollableBox>
            </section>
            <section className={s.projects} aria-labelledby="projects-heading">
              <h2
                id="projects-heading"
                className={cn(s.title, 'p text-bold text-uppercase text-muted')}
              >
                Apps & Games
              </h2>
              <ScrollableBox className={s.list}>
                <ul role="listbox" aria-label="Project selection">
                  {projects.items.map((project) => (
                    <li
                      key={project.sys.id}
                      className={cn(
                        selectedProject?.sys?.id === project.sys.id && s.active,
                        s['list-item'],
                      )}
                      role="option"
                      aria-selected={
                        selectedProject?.sys?.id === project.sys.id
                      }
                    >
                      <button
                        onClick={() => {
                          setSelectedProject(project)
                        }}
                        aria-pressed={
                          selectedProject?.sys?.id === project.sys.id
                        }
                        aria-describedby={`project-${project.sys.id}-description`}
                      >
                        <p className="p text-bold text-uppercase">
                          {project.name}
                        </p>
                        <p
                          className="p-xs text-uppercase"
                          id={`project-${project.sys.id}-description`}
                        >
                          {project.industry}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              </ScrollableBox>
            </section>
            <main
              className={s['project-details']}
              aria-labelledby="project-details-heading"
            >
              <div className={s['project-header']}>
                <h2
                  id="project-details-heading"
                  className={cn(
                    'p text-bold text-uppercase text-muted',
                    s['project-title'],
                  )}
                >
                  {selectedProject?.name}
                </h2>
                <button
                  className={s['toggle-button']}
                  onClick={() => {
                    setShowInfoModal(!showInfoModal)
                  }}
                  aria-label={`${
                    showInfoModal ? 'Hide' : 'Show'
                  } project information`}
                  aria-pressed={showInfoModal}
                >
                  {showInfoModal ? 'Hide Info' : 'Show Info'}
                </button>
              </div>
              <div className={s['details-content']}>
                <div className={cn(s.images, !showInfoModal && s.visible)}>
                  <div className={s.buttonsContainer}>
                    <button
                      className={cn(s['modal-trigger'], 'p-s')}
                      onClick={() => {
                        setGalleryVisible(true)
                      }}
                      aria-label="Open gallery in full screen mode"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 26 26"
                        aria-hidden="true"
                      >
                        <path
                          stroke="var(--primary-accent)"
                          d="M11 1H1v10M15 1h10v10M15 25h10V15M11 25H1V15m12-8v12m6-6H7"
                        />
                      </svg>
                      Enlarge
                    </button>

                    <button
                      className={cn(s['back-to-project'], 'p-s')}
                      onClick={() => {
                        setShowInfoModal(true)
                      }}
                      aria-label="Return to project information"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Back to Project
                    </button>
                  </div>
                  <ScrollableBox reset={showInfoModal || resetScroll}>
                    {selectedProject?.assetsCollection?.items.map(
                      (asset, i) => (
                        <div className={s.assetContainer} key={i}>
                          <ComposableImage
                            sources={asset.imagesCollection}
                            priority={i === 0}
                            width={1026}
                            height={604}
                            isNSFW={asset.isNSFW || false}
                            onImageClick={() => setGalleryVisible(true)}
                          />
                        </div>
                      ),
                    )}
                  </ScrollableBox>
                </div>
                <ScrollableBox
                  className={cn(s.info, showInfoModal && s.visible)}
                  reset={!showInfoModal || resetScroll}
                >
                  <div>
                    {selectedProject?.platform && (
                      <div className={s.platform}>
                        <div className={s.platformLayout}>
                          <div className={s.platformDetails}>
                            <div className={s.platformContent}>
                              {selectedProject.platform.image && (
                                <img
                                  src={selectedProject.platform.image}
                                  alt={selectedProject.platform.name}
                                  className={s.platformImage}
                                />
                              )}
                              <div className={s.platformInfo}>
                                <div className={s.platformText}>
                                  <div className={s.platformHeader}>
                                    <p
                                      className={cn(
                                        s.platformTitle,
                                        'p-s text-uppercase text-bold',
                                      )}
                                    >
                                      Platform
                                    </p>
                                    <p
                                      className={cn(
                                        'p text-bold',
                                        s.platformName,
                                      )}
                                    >
                                      {selectedProject.platform.name}
                                    </p>
                                  </div>
                                  <p className={cn('p-s', s.platformSummary)}>
                                    {selectedProject.platform.summary}
                                  </p>
                                  {selectedProject.platform.links && (
                                    <div className={s.platformLinks}>
                                      {selectedProject.platform.links.map(
                                        (link, index) => {
                                          const getIcon = (type) => {
                                            switch (type) {
                                              case 'twitter-profile':
                                                return (
                                                  <PixelX
                                                    className={
                                                      s.platformLinkIcon
                                                    }
                                                  />
                                                )
                                              case 'twitter-agent':
                                                return (
                                                  <PixelAt
                                                    className={
                                                      s.platformLinkIcon
                                                    }
                                                  />
                                                )
                                              case 'instagram':
                                                return (
                                                  <PixelInstagram
                                                    className={
                                                      s.platformLinkIcon
                                                    }
                                                  />
                                                )
                                              case 'website':
                                                return (
                                                  <PixelGlobeSolid
                                                    className={
                                                      s.platformLinkIcon
                                                    }
                                                  />
                                                )
                                              case 'docs':
                                                return (
                                                  <PixelBookHeart
                                                    className={
                                                      s.platformLinkIcon
                                                    }
                                                  />
                                                )
                                              default:
                                                return null
                                            }
                                          }

                                          return (
                                            <a
                                              key={index}
                                              href={link.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className={s.platformLink}
                                              aria-label={
                                                link.label ||
                                                `Visit ${link.type}`
                                              }
                                            >
                                              {getIcon(link.type)}
                                            </a>
                                          )
                                        },
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {selectedProject.platform.link && (
                            <div className={s.platformActions}>
                              <Link
                                href={selectedProject.platform.link}
                                className={s.platformButton}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Visit ${selectedProject.platform.name} app in new tab`}
                              >
                                Visit App
                                <PixelExternalIcon className={s.externalIcon} />
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {selectedProject?.agent && (
                      <div className={s.agent}>
                        <div className={s.agentLayout}>
                          <div className={s.agentDetails}>
                            <div className={s.agentProfileContainer}>
                              <img
                                src={selectedProject.agent.profileImage}
                                alt={selectedProject.agent.name}
                                className={s.agentProfile}
                              />
                            </div>
                            <div className={s.agentInfo}>
                              <div className={s.agentText}>
                                <div className={s.agentHeader}>
                                  <p
                                    className={cn(
                                      s.agentTitle,
                                      'p-s text-uppercase text-bold',
                                    )}
                                  >
                                    Agent
                                  </p>
                                  <p className={cn('p text-bold', s.agentName)}>
                                    {selectedProject.agent.name}
                                  </p>
                                </div>
                                <p className={cn('p-s', s.agentDescription)}>
                                  A specialized AI agent designed to assist with
                                  various tasks and provide engaging
                                  interactions.
                                </p>
                                <div className={s.agentGoal}>
                                  <span className={cn('p-s', s.goalLabel)}>
                                    Goal:
                                  </span>
                                  <span className={cn('p-s', s.goalText)}>
                                    {selectedProject.agent.goal}
                                  </span>
                                </div>
                                <div className={s.agentSkills}>
                                  <span className={cn('p-s', s.skillsLabel)}>
                                    Skills:
                                  </span>
                                  <div className={cn('p-s', s.skillsList)}>
                                    {selectedProject.agent.skills
                                      .split(',')
                                      .map((skill, index) => (
                                        <span
                                          key={index}
                                          className={s.skillTag}
                                        >
                                          # {skill.trim()}
                                        </span>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={s.agentActions}>
                            <button
                              className={s.galleryButton}
                              onClick={() => {
                                setShowInfoModal(!showInfoModal)
                              }}
                              aria-label="Toggle between project gallery and information"
                              aria-pressed={!showInfoModal}
                            >
                              <PixelImageSolid className={s.galleryIcon} />
                              Gallery
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedProject?.token && (
                      <div className={s.token}>
                        <p
                          className={cn(
                            s.tokenTitle,
                            'p-xs text-uppercase text-bold',
                          )}
                        >
                          <span className={s.projectName}>
                            {selectedProject.token.ticker}
                          </span>{' '}
                          Token
                        </p>
                        <div className={s.tokenLayout}>
                          <div className={s.tokenDetails}>
                            <div className={s.addressContainer}>
                              <TokenBaseIcon className={s.tokenIcon} />
                              <code className="p-s">
                                {selectedProject.token.address}
                              </code>
                              <button
                                className={s.copyButton}
                                onClick={() =>
                                  copyToClipboard(selectedProject.token.address)
                                }
                                aria-label={`Copy token address ${selectedProject.token.address} to clipboard`}
                                title="Copy address to clipboard"
                              >
                                <PixelCopySolid />
                              </button>
                              {selectedProject.token.dexLink && (
                                <Link
                                  href={selectedProject.token.dexLink}
                                  className={s.dexButton}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Trade ${selectedProject.name} token on decentralized exchange in new tab`}
                                >
                                  <PixelFinance />
                                </Link>
                              )}
                            </div>
                            <p className={s.tokenDisclaimer}>
                              This token is provided for entertainment purposes
                              only and does not constitute an investment
                              opportunity.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedProject?.agent?.walletAddress && (
                      <div className={s.wallet}>
                        <p
                          className={cn(
                            s.walletTitle,
                            'p-xs text-uppercase text-bold',
                          )}
                        >
                          <span className={s.agentName}>
                            {selectedProject.agent.name}
                          </span>
                          <span className={s.agentName}>'s</span> Wallet
                        </p>
                        <div className={s.walletLayout}>
                          <div className={s.walletDetails}>
                            <div className={s.addressContainer}>
                              <TokenBaseIcon className={s.walletIcon} />
                              <code className="p-s">
                                {selectedProject.agent.walletAddress}
                              </code>
                              <button
                                className={s.copyButton}
                                onClick={() =>
                                  copyToClipboard(
                                    selectedProject.agent.walletAddress,
                                  )
                                }
                                aria-label={`Copy agent wallet address ${selectedProject.agent.walletAddress} to clipboard`}
                                title="Copy address to clipboard"
                              >
                                <PixelCopySolid />
                              </button>
                            </div>
                            <p className={s.walletDisclaimer}>
                              This is the agent's on-chain wallet address for
                              direct interactions.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollableBox>
              </div>
            </main>
          </div>
        </ClientOnly>
      )}

      <Gallery onBackToProject={() => setShowInfoModal(true)} />
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
                  'Phantasy is an 18+ NSFW gaming and entertainment studio pushing the boundaries of interactive digital experiences using artificial intelligence.',
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
                  'We specialize in creating AI-powered characters and experiences that blur the line between reality and fantasy.',
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
                        'Phantasy is an 18+ NSFW gaming and entertainment studio pushing the boundaries of interactive digital experiences using artificial intelligence.',
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
          name: 'Alkahest',
          industry: 'Deep Research',
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
            name: 'Alkahest Platform',
            summary:
              'Advanced AI technology platform for next-generation digital experiences.',
            link: 'https://alkahest.ai/',
            image: '/mobile-temp-images/rally_pfp.png',
          },
          agent: {
            name: 'Alkahest',
            goal: 'Deep research and analysis specialist',
            skills: 'Deep Research, Data Analysis, Knowledge Discovery',
            profileImage: '/mobile-temp-images/rally_pfp.png',
          },
          link: 'https://example.com/alkahest',
          assetsCollection: {
            items: [
              {
                imagesCollection: {
                  items: [
                    {
                      url: '/mobile-temp-images/rally_pfp.png',
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
                      url: '/alchemist.mp4',
                      width: 1026,
                      height: 604,
                    },
                  ],
                },
                isNSFW: true,
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
            name: 'Rally.sh',
            summary:
              'An interactive AI companion platform featuring Rally, your virtual girlfriend experience.',
            link: 'https://rally.sh',
            image: 'https://r2.rally.sh/photos/rally_pfp.png',
            links: [
              {
                type: 'twitter-profile',
                url: 'https://x.com/rallyonbase',
                label: 'Rally Profile on X',
              },
              {
                type: 'twitter-agent',
                url: 'https://x.com/rally_agent',
                label: 'Rally Agent on X',
              },
              {
                type: 'website',
                url: 'https://rally.sh',
                label: 'Rally Website',
              },
              {
                type: 'docs',
                url: 'https://docs.rally.sh',
                label: 'Rally Documentation',
              },
            ],
          },
          agent: {
            name: 'Rally',
            goal: 'Marketing and promotional campaigns specialist',
            skills: 'Marketing, Promotions, Community Building',
            profileImage: 'https://r2.rally.sh/photos/rally_pfp.png',
            walletAddress: '0xrally1234567890abcdef1234567890abcdef12',
          },
          token: {
            address: '0x1234567890abcdef1234567890abcdef12345678',
            ticker: '$RALLY',
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
                      url: '/alchemist.mp4',
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
          industry: 'AI Live Cams',
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
            image: '/mobile-temp-images/rally_pfp.png',
          },
          agent: {
            name: 'Banshee',
            goal: 'Live streaming and interactive entertainment specialist',
            skills:
              'Live Streaming, Interactive Entertainment, Real-time Engagement',
            profileImage: '/mobile-temp-images/rally_pfp.png',
          },
          link: 'https://example.com/project2',
          assetsCollection: {
            items: [
              {
                imagesCollection: {
                  items: [
                    {
                      url: '/mobile-temp-images/rally_pfp.png',
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
          sys: { id: 'project6' },
          name: 'Maho',
          industry: 'Companions',
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
                        'Magical companions with immersive, character-driven experiences.',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
          },
          platform: {
            name: 'Maho Platform',
            summary:
              'A platform for interactive AI companions with a focus on story and personality.',
            link: 'https://example.com/maho',
            image: '/mobile-temp-images/rally_pfp.png',
          },
          agent: {
            name: 'Maho',
            goal: 'Immersive companion interactions and narratives',
            skills: 'Storytelling, Engagement, Personalization',
            profileImage: '/mobile-temp-images/rally_pfp.png',
          },
          link: 'https://example.com/maho',
          assetsCollection: {
            items: [
              {
                imagesCollection: {
                  items: [
                    {
                      url: '/mobile-temp-images/rally_pfp.png',
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
          industry: 'Storytelling',
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
            name: 'Lorelei.app',
            summary:
              'An everlasting visual novel platform powered by AI that creates infinite stories and worlds. Coming soon.',
            link: 'https://lorelei.app',
            image: '/mobile-temp-images/rally_pfp.png',
          },
          agent: {
            name: 'Lorelei',
            goal: 'Storytelling and world creation specialist',
            skills: 'Storytelling, World Building, Visual Novel Creation',
            profileImage: '/mobile-temp-images/rally_pfp.png',
          },
          link: 'https://example.com/project2',
          assetsCollection: {
            items: [
              {
                imagesCollection: {
                  items: [
                    {
                      url: '/mobile-temp-images/rally_pfp.png',
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

  const aboutContent = getPageContent('home')

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
