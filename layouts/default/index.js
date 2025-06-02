import { CustomHead } from '@studio-freight/compono'
import { useDebug } from '@studio-freight/hamo'
import cn from 'clsx'
import { Footer } from 'components/footer'
import { Header } from 'components/header'
import dynamic from 'next/dynamic'
import s from './layout.module.scss'

const Orchestra = dynamic(
  () => import('lib/orchestra').then(({ Orchestra }) => Orchestra),
  { ssr: false },
)

export function Layout({
  seo = {
    title: 'Phantasy',
    description: 'Phantasy is an 18+ NSFW AI Gaming and Entertainment Studio.',
    image: { url: 'https://r2.rally.sh/photos/rally_pfp.png' },
    keywords: ['AI', 'NSFW', 'Entertainment', 'Studio', 'AI Entertainment'],
  },
  children,
  theme = 'dark',
  className,
  principles,
  footerLinks,
  contactData,
  currentTheme,
}) {
  const debug = useDebug()

  return (
    <>
      <CustomHead {...seo} />

      <div
        data-theme={currentTheme}
        className={cn(`theme-${theme}`, s.layout, className)}
      >
        <Header principles={principles} contact={contactData} />
        <main className={s.main}>{children}</main>
        <Footer links={footerLinks} />
      </div>

      {debug && (
        <>
          <Orchestra />
        </>
      )}
    </>
  )
}
