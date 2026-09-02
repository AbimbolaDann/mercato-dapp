type CacheEntry<T> = {
  value: T
  expiresAt: number
}

/**
 * Coalesce identical in-flight requests and cache successful responses briefly.
 * Helps avoid rate limits from React Strict Mode, HMR, and overlapping effects.
 */
export function createDedupedFetcher<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  keyFn: (...args: TArgs) => string,
  ttlMs: number,
) {
  const cache = new Map<string, CacheEntry<TResult>>()
  const inflight = new Map<string, Promise<TResult>>()

  const fetch = async (...args: TArgs): Promise<TResult> => {
    const key = keyFn(...args)
    const now = Date.now()
    const cached = cache.get(key)
    if (cached && cached.expiresAt > now) {
      return cached.value
    }

    const pending = inflight.get(key)
    if (pending) return pending

    const promise = fn(...args)
      .then((value) => {
        cache.set(key, { value, expiresAt: Date.now() + ttlMs })
        inflight.delete(key)
        return value
      })
      .catch((error) => {
        inflight.delete(key)
        throw error
      })

    inflight.set(key, promise)
    return promise
  }

  const invalidate = (...args: TArgs) => {
    cache.delete(keyFn(...args))
  }

  const invalidateAll = () => {
    cache.clear()
  }

  return { fetch, invalidate, invalidateAll }
}
