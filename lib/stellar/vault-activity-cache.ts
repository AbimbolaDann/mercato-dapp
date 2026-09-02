import type { VaultActivityEntry } from './vault-activity'

export type VaultActivityPageData = {
  entries: VaultActivityEntry[]
  nextCursor: string | null
  hasMore: boolean
}

type CacheEntry = {
  data: VaultActivityPageData
  timestamp: number
  ttlMs: number
}

const store = new Map<string, CacheEntry>()
const index = new Map<string, Set<string>>()
const DEFAULT_TTL = 25_000

function buildCacheKey(account: string, vault: string, cursor: string | null, limit: number): string {
  return `${account}:${vault}:${cursor ?? 'first'}:${limit}`
}

function buildIndexKey(account: string, vault: string): string {
  return `${account}:${vault}`
}

export function getCachedVaultActivityPage(
  account: string,
  vault: string,
  cursor: string | null,
  limit: number,
): VaultActivityPageData | null {
  const key = buildCacheKey(account, vault, cursor, limit)
  const entry = store.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > entry.ttlMs) {
    store.delete(key)
    index.get(buildIndexKey(account, vault))?.delete(key)
    return null
  }
  return entry.data
}

export function setCachedVaultActivityPage(
  account: string,
  vault: string,
  cursor: string | null,
  limit: number,
  data: VaultActivityPageData,
  ttlMs: number = DEFAULT_TTL,
): void {
  const key = buildCacheKey(account, vault, cursor, limit)
  store.set(key, { data, timestamp: Date.now(), ttlMs })

  const idxKey = buildIndexKey(account, vault)
  let keys = index.get(idxKey)
  if (!keys) {
    keys = new Set()
    index.set(idxKey, keys)
  }
  keys.add(key)
}

export function invalidateVaultActivityCache(account: string, vault: string): void {
  const idxKey = buildIndexKey(account, vault)
  const keys = index.get(idxKey)
  if (!keys) return
  for (const key of keys) {
    store.delete(key)
  }
  index.delete(idxKey)
}
