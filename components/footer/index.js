import { Image, Link } from '@studio-freight/compono'
import { useMediaQuery } from '@studio-freight/hamo'
import cn from 'clsx'
import { Separator } from 'components/separator'
import dynamic from 'next/dynamic'
import s from './footer.module.scss'

const XIcon = dynamic(() => import('icons/x.svg'), { ssr: false })
const DiscordIcon = dynamic(() => import('icons/discord.svg'), { ssr: false })

export function Footer({
  className,
  style,
  links,
  studioInfo,
  selectedProject,
}) {
  const isMobile = useMediaQuery('(max-width: 800px)')

  // Determine the Lite Paper text and download link
  const litePaperText = selectedProject?.name
    ? `${selectedProject.name} Lite Paper ↓`
    : 'Capabilities Deck ↓'
  const litePaperLink = selectedProject?.name
    ? `/downloads/${selectedProject.name
        .toLowerCase()
        .replace(/\s+/g, '-')}-lite-paper.pdf`
    : '/StudioFreight-Capabilities.pdf'

  return (
    <footer className={s.container}>
      <Separator className="layout-block" />
      <div className={cn(s.footer, 'layout-grid', className)} style={style}>
        <a
          href={litePaperLink}
          download
          className={cn(s.column, 'p-s')}
          onClick={() => {
            /* va.track(`Downloaded ${litePaperText}`) */
          }}
          style={{ color: 'var(--primary-accent)' }}
        >
          {litePaperText}
        </a>
        {isMobile === false && (
          <>
            <ul className={s.column}>
              {links.slice(0, 2).map((link, i) => (
                <li key={i}>
                  <Link className="p-s decorate" href={link.url}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className={s.column}>
              {links.slice(2, 4).map((link, i) => (
                <li key={i}>
                  <Link className="p-s decorate" href={link.url}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className={s.column}>
              {links.slice(4, 6).map((link, i) => (
                <li key={i}>
                  <Link className="p-s decorate" href={link.url}>
                    {link.text}
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
                &copy; {new Date().getFullYear()}
              </li>
            </ul>
            <ul className={s.column}>
              {links.slice(0, 3).map((link, i) => (
                <li key={i}>
                  <Link className="p-s decorate" href={link.url}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className={s.column}>
              {links.slice(3, 6).map((link, i) => (
                <li key={i}>
                  <Link className="p-s decorate" href={link.url}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <ul className={s.column}>
          <li>
            <Link className="p-s decorate" href={`tel:${studioInfo.phone}`}>
              P: {studioInfo.phone}
            </Link>
          </li>
          <li>
            <Link className="p-s decorate" href={`mailto:${studioInfo.email}`}>
              E: {studioInfo.email}
            </Link>
          </li>
        </ul>

        {/* Social Media Icons */}
        <ul className={cn(s.column, s.socialMedia)}>
          <li>
            <Link
              className={s.socialIcon}
              href="https://x.com/phantasy_bot"
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
              href="https://discord.gg/phantasy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join our Discord"
            >
              <DiscordIcon />
            </Link>
          </li>
        </ul>

        {isMobile === false && (
          <ul className={s.column}>
            <li className="p-s text-muted">
              &copy; {new Date().getFullYear()}
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
