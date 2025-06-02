import { Image, Link } from '@studio-freight/compono'
import { useMediaQuery } from '@studio-freight/hamo'
import cn from 'clsx'
import { Separator } from 'components/separator'
import dynamic from 'next/dynamic'
import s from './footer.module.scss'

const XIcon = dynamic(() => import('icons/x.svg'), { ssr: false })
const DiscordIcon = dynamic(() => import('icons/discord.svg'), { ssr: false })
const InstagramIcon = dynamic(() => import('icons/pixel-instagram.svg'), {
  ssr: false,
})

export function Footer({ className, style, links, selectedProject }) {
  const isMobile = useMediaQuery('(max-width: 800px)')

  // Determine the Lite Paper text and download link
  const litePaperText = selectedProject?.name
    ? `${selectedProject.name} Lite Paper ↗`
    : 'Capabilities Deck ↗'
  const litePaperLink = selectedProject?.name
    ? `https://phantasy.bot/downloads/${selectedProject.name
        .toLowerCase()
        .replace(/\s+/g, '-')}-lite-paper.pdf`
    : 'https://phantasy.bot/Phantasy-Capabilities.pdf'

  return (
    <footer className={s.container}>
      <Separator
        hideLeftIcon={true}
        rightContent={<span>✰✰✰</span>}
        className="layout-block"
      />
      <div className={cn(s.footer, 'layout-grid', className)} style={style}>
        <a
          href={litePaperLink}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(s.column, 'p-s')}
          onClick={() => {
            /* va.track(`Opened ${litePaperText}`) */
          }}
          style={{ color: 'var(--primary-accent)' }}
        >
          {litePaperText}
        </a>
        {isMobile === false && (
          <>
            <ul className={s.column}>
              {links.map((link, i) => (
                <li key={i}>
                  <Link className="p-s decorate" href={link.url}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {isMobile === true && (
          <>
            <ul className={s.column}>
              <li className="p-s text-muted">
                &copy; {new Date().getFullYear()} Phantasy LLC
              </li>
            </ul>
            <ul className={s.column}>
              {links.map((link, i) => (
                <li key={i}>
                  <Link className="p-s decorate" href={link.url}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Social Media Icons */}
        <ul className={cn(s.column, s.socialMedia)}>
          <li>
            <Link
              className={s.socialIcon}
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join our Discord"
            >
              <DiscordIcon />
            </Link>
          </li>
          <li>
            <Link
              className={s.socialIcon}
              href="https://x.com/phantasydotbot"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on X"
            >
              <XIcon />
            </Link>
          </li>
          <li>
            <Link
              className={s.socialIcon}
              href="https://instagram.com/phantasydotbot"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
            >
              <InstagramIcon />
            </Link>
          </li>
        </ul>

        {isMobile === false && (
          <ul className={s.column}>
            <li className="p-s text-muted">
              &copy; {new Date().getFullYear()} Phantasy LLC
            </li>
          </ul>
        )}
      </div>

      {isMobile === true && (
        <section className={s['footer-image']}>
          <Image
            src="/mobile-temp-images/footer.png"
            alt="Phantasy"
            fill
            className={s.image}
          />
        </section>
      )}
    </footer>
  )
}
