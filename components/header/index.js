import { Link, Marquee } from '@studio-freight/compono'
import { useMediaQuery } from '@studio-freight/hamo'
import cn from 'clsx'
import { ContactFormModal } from 'components/header/contact-form'
import { Separator } from 'components/separator'
import { pad } from 'lib/maths'
import { useStore } from 'lib/store'
import dynamic from 'next/dynamic'
import s from './header.module.scss'

const PhantasyLogo = dynamic(() => import('icons/phantasy-logo.svg'), {
  ssr: false,
})
const PhantasyLogoMobile = dynamic(
  () => import('icons/phantasy-logo-mobile.svg'),
  {
    ssr: false,
  },
)
const Stard = dynamic(() => import('icons/stard.svg'), { ssr: false })

export const Header = ({ principles = [], contact }) => {
  const isMobile = useMediaQuery('(max-width: 800px)')

  // const visible = usePageAppear()
  const [contactIsOpen, setContactIsOpen] = useStore((state) => [
    state.contactIsOpen,
    state.setContactIsOpen,
  ])

  return (
    <header className={cn(s.container, 'layout-block')}>
      <div className={cn(s.top, 'layout-grid')}>
        <div className={s.eggs}>
          <Link
            name="easter egg"
            className={s.egg}
            href="https://github.com/studio-freight/sf-website"
          >
            <Stard />
          </Link>
        </div>
        {isMobile === false && (
          <Marquee className={s.marquee} duration={20}>
            {principles.map((principle, i) => (
              <p key={i} className={cn('p', s.principle)}>
                <span>{pad(i + 1)}</span>
                &nbsp;{principle}
                <Separator className={s.inlineSeperator} />
              </p>
            ))}
          </Marquee>
        )}
        <button
          className={cn('button', 'button-accent-strong', s.cta)}
          onClick={() => {
            setContactIsOpen(!contactIsOpen)
          }}
        >
          FAQ
        </button>
      </div>
      <Separator hideIcons={true} className="layout-block" />
      <div className={cn(s.header, 'layout-grid')}>
        {isMobile === true ? (
          <PhantasyLogoMobile className={s.title} />
        ) : (
          <PhantasyLogo className={s.title} />
        )}
      </div>
      <Separator hideIcons={true} className="layout-block" />

      {isMobile === true && (
        <Marquee className={s.marquee} duration={20}>
          {principles.map((principle, i) => (
            <p key={i} className={cn('p', s.principle)}>
              <span>{pad(i + 1)}</span>
              &nbsp;{principle}
              <Separator className={s.inlineSeperator} />
            </p>
          ))}
        </Marquee>
      )}
      <ContactFormModal data={contact} />
    </header>
  )
}
