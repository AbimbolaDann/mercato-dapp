import { test, expect, beforeEach, afterEach } from 'bun:test'

import {
  setCachedVaultActivityPage,
  getCachedVaultActivityPage,
  invalidateVaultActivityCache,
} from '@/lib/stellar/vault-activity-cache'

beforeEach(() => {
  invalidateVaultActivityCache('GA-a', 'CA-a')
  invalidateVaultActivityCache('GA-b', 'CA-b')
})

afterEach(() => {
  invalidateVaultActivityCache('GA-a', 'CA-a')
  invalidateVaultActivityCache('GA-b', 'CA-b')
})

test('invalidateVaultActivityCache removes entries for that account+vault pair', () => {
  setCachedVaultActivityPage('GA-a', 'CA-a', null, 10, {
    entries: [],
    nextCursor: null,
    hasMore: false,
  })

  expect(getCachedVaultActivityPage('GA-a', 'CA-a', null, 10)).not.toBeNull()

  invalidateVaultActivityCache('GA-a', 'CA-a')

  expect(getCachedVaultActivityPage('GA-a', 'CA-a', null, 10)).toBeNull()
})

test('invalidateVaultActivityCache clears all cursor variants for the same account+vault', () => {
  setCachedVaultActivityPage('GA-a', 'CA-a', null, 10, {
    entries: [],
    nextCursor: 'p1',
    hasMore: true,
  })
  setCachedVaultActivityPage('GA-a', 'CA-a', 'p1', 10, {
    entries: [],
    nextCursor: 'p2',
    hasMore: true,
  })

  invalidateVaultActivityCache('GA-a', 'CA-a')

  expect(getCachedVaultActivityPage('GA-a', 'CA-a', null, 10)).toBeNull()
  expect(getCachedVaultActivityPage('GA-a', 'CA-a', 'p1', 10)).toBeNull()
})

test('invalidateVaultActivityCache does not affect other account+vault pairs', () => {
  setCachedVaultActivityPage('GA-a', 'CA-a', null, 10, {
    entries: [],
    nextCursor: null,
    hasMore: false,
  })
  setCachedVaultActivityPage('GA-b', 'CA-b', null, 10, {
    entries: [],
    nextCursor: null,
    hasMore: false,
  })

  invalidateVaultActivityCache('GA-a', 'CA-a')

  expect(getCachedVaultActivityPage('GA-a', 'CA-a', null, 10)).toBeNull()
  expect(getCachedVaultActivityPage('GA-b', 'CA-b', null, 10)).not.toBeNull()
})

test('invalidateVaultActivityCache is idempotent when no cache exists', () => {
  expect(() => invalidateVaultActivityCache('GA-nonexistent', 'CA-nonexistent')).not.toThrow()
})

test('invalidateVaultActivityCache also clears different limit variants', () => {
  setCachedVaultActivityPage('GA-a', 'CA-a', null, 5, {
    entries: [],
    nextCursor: null,
    hasMore: false,
  })
  setCachedVaultActivityPage('GA-a', 'CA-a', null, 20, {
    entries: [],
    nextCursor: null,
    hasMore: false,
  })

  invalidateVaultActivityCache('GA-a', 'CA-a')

  expect(getCachedVaultActivityPage('GA-a', 'CA-a', null, 5)).toBeNull()
  expect(getCachedVaultActivityPage('GA-a', 'CA-a', null, 20)).toBeNull()
})
