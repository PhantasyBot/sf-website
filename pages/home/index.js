import { Link } from '@studio-freight/compono'
import { useMediaQuery } from '@studio-freight/hamo'
import va from '@vercel/analytics'
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

export default function Home({ phantasy, footer, contact, projects }) {
  const router = useRouter()

  const [showInfoModal, setShowInfoModal] = useState(false)
  const [resetScroll, setResetScroll] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 800px)')
  const [selectedProject, setSelectedProject] = useStore((state) => [
    state.selectedProject,
    state.setSelectedProject,
  ])
  const [setGalleryVisible] = useStore((state) => [state.setGalleryVisible])

  useEffect(() => {
    const searchTerm = router.asPath.substring(router.asPath.indexOf('#') + 1)

    const matchingItem = projects.items.find((item) =>
      slugify(item.name).includes(searchTerm),
    )

    setSelectedProject(matchingItem || projects.items[0])
  }, [router.asPath])

  useEffect(() => {
    if (selectedProject) {
      setResetScroll(true)
      setTimeout(() => {
        setResetScroll(false)
      }, 100)
    }
  }, [selectedProject])

  return (
    <Layout
      theme="dark"
      principles={phantasy.principles}
      studioInfo={{
        phone: phantasy.phoneNumber,
        email: phantasy.email,
      }}
      contactData={contact}
      footerLinks={footer.linksCollection.items}
    >
      {!isDesktop ? (
        <LayoutMobile phantasy={phantasy} projects={projects} />
      ) : (
        <ClientOnly>
          <div className={cn(s.content, 'layout-grid')}>
            <section className={s.about}>
              <p
                className={cn(s.title, 'p text-bold text-uppercase text-muted')}
              >
                About
              </p>
              <ScrollableBox className={s.description}>
                {renderer(phantasy.about)}
              </ScrollableBox>
            </section>
            <section className={s.projects}>
              <p
                className={cn(s.title, 'p text-bold text-uppercase text-muted')}
              >
                Projects
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
                          va.track('Selected:', {
                            project: project.name,
                          })
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
                  Project detail
                </p>
                <div className={s.actions}>
                  <button
                    className="p-s decorate"
                    onClick={() => {
                      va.track('Read info:', {
                        project: selectedProject.name,
                      })
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
                      va.track('Opened Gallery:', {
                        project: selectedProject.name,
                      })
                      setGalleryVisible(true)
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 26 26"
                    >
                      <path
                        stroke="var(--green)"
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
                            va.track('Opened Gallery:', {
                              project: selectedProject.name,
                            })
                            setGalleryVisible(true)
                          }}
                        >
                          <ComposableImage
                            sources={asset.imagesCollection}
                            priority={i === 0}
                            width={1026}
                            height={604}
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
                  {selectedProject.body && (
                    <div className={s.description}>
                      {renderer(selectedProject.body)}
                    </div>
                  )}
                  {selectedProject.testimonial && (
                    <div className={s.testimonial}>
                      <p
                        className={cn(
                          s.title,
                          'p text-muted text-uppercase text-bold',
                        )}
                      >
                        Testimonial
                      </p>
                      <p className="p">{selectedProject.testimonial}</p>
                    </div>
                  )}
                  {selectedProject?.services?.length > 0 && (
                    <div className={s.services}>
                      <p
                        className={cn(
                          s.title,
                          'p text-muted text-uppercase text-bold',
                        )}
                      >
                        Services
                      </p>
                      <p className="p-s text-uppercase">
                        {selectedProject?.services?.map((service, i) =>
                          i === selectedProject.services.length - 1
                            ? service
                            : `${service}, `,
                        )}
                      </p>
                    </div>
                  )}
                  {selectedProject?.stack?.length > 0 && (
                    <div className={s.stack}>
                      <p
                        className={cn(
                          s.title,
                          'p text-muted text-uppercase text-bold',
                        )}
                      >
                        Stack
                      </p>
                      <p className="p-s text-uppercase">
                        {selectedProject?.stack?.map((item, i) =>
                          i === selectedProject.stack.length - 1
                            ? item
                            : `${item}, `,
                        )}
                      </p>
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
    principles: ['FUCK BITCHES', 'GET MONEY', 'RINSE AND REPEAT'],
    phoneNumber: '+1 (424) 222-9967',
    email: 'hello@phantasy.bot',
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
                value: "We're an 18+ NSFW AI Entertainment Studio.",
                marks: [],
                data: {},
              },
            ],
          },
        ],
      },
    },
  }

  const footer = {
    linksCollection: {
      items: [
        { name: 'Twitter', url: 'https://twitter.com' },
        { name: 'LinkedIn', url: 'https://linkedin.com' },
        { name: 'Instagram', url: 'https://instagram.com' },
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
      items: [
        {
          title: 'How do I get started?',
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
                        'Contact us to discuss your project and we will provide a free consultation.',
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
          title: 'What services do you offer?',
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
                        'We offer web design, development, and digital marketing services.',
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
          testimonial:
            'Working with this team was amazing. They delivered beyond our expectations.',
          services: ['Design', 'Development', 'Animation'],
          stack: ['React', 'Next.js', 'GSAP'],
          link: 'https://rally.sh',
          assetsCollection: {
            items: [
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
              },
            ],
          },
        },
        {
          sys: { id: 'project2' },
          name: 'Project Two',
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
          testimonial:
            'The team delivered a fantastic product that exceeded our expectations.',
          services: ['UX/UI', 'Development', 'Strategy'],
          stack: ['React', 'Three.js', 'WebGL'],
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

  return {
    props: {
      phantasy,
      footer,
      contact,
      projects: projectList.listCollection,
      id: 'home',
    },
    revalidate: 30,
  }
}
