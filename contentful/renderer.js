import { renderer as simpleRenderer } from '../lib/simple-renderer'

// This is a compatibility layer that forwards to our simplified renderer
export const renderer = (data) => {
  if (!data) return null
  return simpleRenderer(data)
}
