import type { Locale } from '@/lib/i18n/config'
import type { BlogLocaleContent, BlogPost } from './types'

export function getBlogLocaleContent(post: BlogPost, locale: Locale): BlogLocaleContent {
  return locale === 'es' ? post.es : post.en
}

export function blogPostUrl(slug: string): string {
  return `/blog/${slug}`
}
