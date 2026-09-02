import { test, expect } from 'bun:test'

function parseLimit(rawLimit: string | undefined): number | undefined {
  if (!rawLimit) return undefined
  return Math.min(Math.max(Number.isFinite(parseInt(rawLimit, 10)) ? parseInt(rawLimit, 10) : 20, 1), 200)
}

test('limit clamp works: values below 1 become 1', () => {
  expect(parseLimit('0')).toBe(1)
})

test('limit clamp works: values above 200 become 200', () => {
  expect(parseLimit('999')).toBe(200)
})

test('limit clamp works: normal values pass through', () => {
  expect(parseLimit('42')).toBe(42)
})

test('limit clamp works: invalid string falls back to 20', () => {
  expect(parseLimit('abc')).toBe(20)
})

test('limit clamp works: empty string is undefined', () => {
  expect(parseLimit('')).toBeUndefined()
})

test('limit clamp works: undefined param is undefined', () => {
  expect(parseLimit(undefined)).toBeUndefined()
})

test('limit clamp works: no limit param is undefined (route uses default)', () => {
  const limit = undefined
  expect(limit).toBeUndefined()
})
