'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { readErrorMessage } from '@/lib/defindex/vault-cache'
import type { VaultMonitorPayload } from '@/lib/defindex/vault-monitor'

const DEFAULT_POLL_MS = 30_000

type UseAdminVaultMonitorOptions = {
  /** Override contract id (e.g. newly deployed vault not yet in env). */
  vaultOverride?: string | null
  pollMs?: number
  enabled?: boolean
}

export function useAdminVaultMonitor(options: UseAdminVaultMonitorOptions = {}) {
  const { vaultOverride = null, pollMs = DEFAULT_POLL_MS, enabled = true } = options
  const [data, setData] = useState<VaultMonitorPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)
  const abortControllerRef = useRef<AbortController | null>(null)
  const isFetchingRef = useRef(false)

  const fetchMonitor = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!enabled) return
      const silent = opts?.silent ?? false

      // A silent (background poll) tick that lands while a previous request
      // is still in flight is dropped rather than queued, so slow responses
      // can't overlap and race each other into state.
      if (silent && isFetchingRef.current) return

      // A manual refresh always takes priority: cancel any stale in-flight
      // request so it can't clobber the fresh one's result when it lands.
      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller
      isFetchingRef.current = true

      if (!silent) setIsRefreshing(true)

      try {
        const params = new URLSearchParams()
        const override = vaultOverride?.trim()
        if (override) params.set('vault', override)
        const qs = params.toString() ? `?${params.toString()}` : ''

        const response = await fetch(`/api/defindex/admin/monitor${qs}`, {
          credentials: 'include',
          signal: controller.signal,
        })

        if (!response.ok) {
          const message = await readErrorMessage(response)
          if (mountedRef.current) {
            setError(message)
            setData(null)
          }
          return
        }

        const payload = (await response.json()) as VaultMonitorPayload
        if (mountedRef.current) {
          setData(payload)
          setError(null)
        }
      } catch (e) {
        if (controller.signal.aborted) return
        if (mountedRef.current) {
          setError(e instanceof Error ? e.message : 'Failed to load vault monitor')
          setData(null)
        }
      } finally {
        // Only the still-current request is allowed to clear the in-flight
        // markers/loading state — a stale, aborted request's `finally` must
        // not stomp on whatever request superseded it.
        const isCurrent = abortControllerRef.current === controller
        if (isCurrent) {
          abortControllerRef.current = null
          isFetchingRef.current = false
          if (mountedRef.current) {
            setIsLoading(false)
            setIsRefreshing(false)
          }
        }
      }
    },
    [enabled, vaultOverride],
  )

  // Initial fetch whenever the request identity (vault/enabled) changes.
  useEffect(() => {
    mountedRef.current = true
    setIsLoading(true)
    void fetchMonitor()

    return () => {
      mountedRef.current = false
      abortControllerRef.current?.abort()
    }
  }, [fetchMonitor])

  // Background polling, paused while the tab is hidden and refreshed on
  // return to visibility instead of firing while nobody can see it.
  useEffect(() => {
    if (!enabled || pollMs <= 0) return

    let intervalId: number | null = null

    const stopInterval = () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId)
        intervalId = null
      }
    }

    const startInterval = () => {
      if (intervalId !== null) return
      intervalId = window.setInterval(() => {
        void fetchMonitor({ silent: true })
      }, pollMs)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stopInterval()
        return
      }
      void fetchMonitor({ silent: true })
      stopInterval()
      startInterval()
    }

    if (document.visibilityState === 'visible') {
      startInterval()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      stopInterval()
    }
  }, [enabled, fetchMonitor, pollMs])

  return {
    data,
    error,
    isLoading,
    isRefreshing,
    refresh: () => fetchMonitor(),
  }
}
