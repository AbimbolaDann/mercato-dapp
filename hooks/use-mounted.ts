'use client'

import { useEffect, useState } from 'react'

/** True after the first client paint — use to skip SSR for Radix IDs / browser-only UI. */
export function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}
