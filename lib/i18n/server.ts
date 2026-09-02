import { cookies } from 'next/headers'
import { defaultLocale, isLocale, localeCookieName, type Locale } from './config'
import { getDictionary, type Messages } from './dictionaries'

export async function getServerLocale(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(localeCookieName)?.value
  return isLocale(value) ? value : defaultLocale
}

function lookup(messages: Messages, key: string): string | undefined {
  const value = key.split('.').reduce<unknown>((node, part) => {
    if (node == null || typeof node !== 'object') return undefined
    return (node as Record<string, unknown>)[part]
  }, messages as unknown)

  return typeof value === 'string' ? value : undefined
}

/** Server-side translate + `{placeholder}` interpolation (same rules as client `t`). */
export function tr(
  messages: Messages,
  key: string,
  replacements?: Record<string, string | number>,
): string {
  let text = lookup(messages, key) ?? lookup(getDictionary(defaultLocale), key) ?? key
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      text = text.replaceAll(`{${k}}`, String(v))
    }
  }
  return text
}

export function formatMoneyServer(locale: Locale, value: number): string {
  return new Intl.NumberFormat(locale === 'es' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export async function getServerDictionary() {
  const locale = await getServerLocale()
  return getDictionary(locale)
}

/** DB deal `status` → localized label (`dealStatus.*`). */
export function dealStatusLabel(messages: Messages, status: string): string {
  const key = `dealStatus.${status}`
  const label = tr(messages, key)
  if (label === key) return status.replace(/_/g, ' ')
  return label
}
