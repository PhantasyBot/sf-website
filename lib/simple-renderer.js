import { Link } from '@studio-freight/compono'
import cn from 'clsx'
import React from 'react'
import s from './styles/renderer.module.scss'

const renderContent = (content) => {
  if (!content) return null

  return content.map((item, index) => {
    if (item.nodeType === 'text') {
      return <React.Fragment key={index}>{item.value}</React.Fragment>
    }

    if (item.nodeType === 'paragraph') {
      return (
        <p key={index} className={cn('p', s.row)}>
          {item.content && renderContent(item.content)}
        </p>
      )
    }

    if (item.nodeType === 'heading-1') {
      return (
        <h2
          key={index}
          className={cn('p text-uppercase text-muted text-bold', s.row)}
        >
          {item.content && renderContent(item.content)}
        </h2>
      )
    }

    if (item.nodeType === 'unordered-list') {
      return (
        <ul key={index} className={cn('p', s.row)}>
          {item.content && renderContent(item.content)}
        </ul>
      )
    }

    if (item.nodeType === 'list-item') {
      return (
        <li key={index} className={cn('p', s.item)}>
          {item.content && renderContent(item.content)}
        </li>
      )
    }

    if (item.nodeType === 'hyperlink') {
      return (
        <Link
          key={index}
          href={item.data?.uri}
          className={cn(s.link, 'decorate')}
        >
          {item.content && renderContent(item.content)}
        </Link>
      )
    }

    return null
  })
}

export const renderer = ({ json }) => {
  if (!json || !json.content) return null
  return renderContent(json.content)
}
