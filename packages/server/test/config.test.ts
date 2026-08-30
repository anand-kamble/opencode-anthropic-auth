import { describe, expect, test } from 'bun:test'
import { DEFAULT_CLAUDE_MODELS, loadConfig } from '../src/config.ts'

describe('CLAUDE_MODELS', () => {
  test('allows all models by default with the observed catalog as fallback', () => {
    const config = loadConfig({})
    expect(config.modelAllowlist).toBeNull()
    expect(config.fallbackModels).toEqual([...DEFAULT_CLAUDE_MODELS])
    expect(DEFAULT_CLAUDE_MODELS).toEqual([
      'claude-opus-5',
      'claude-sonnet-5',
      'claude-fable-5',
      'claude-opus-4-8',
      'claude-opus-4-7',
      'claude-sonnet-4-6',
      'claude-opus-4-6',
      'claude-opus-4-5-20251101',
      'claude-haiku-4-5-20251001',
      'claude-sonnet-4-5-20250929',
    ])
  })

  test('uses an explicit comma-separated list as restriction and fallback', () => {
    const config = loadConfig({
      CLAUDE_MODELS: ' claude-opus-5, claude-fable-5, ',
    })
    expect(config.modelAllowlist).toEqual(['claude-opus-5', 'claude-fable-5'])
    expect(config.fallbackModels).toEqual(['claude-opus-5', 'claude-fable-5'])
  })
})

describe('CC_EFFORT', () => {
  test('accepts every supported effort level', () => {
    for (const effort of ['low', 'medium', 'high', 'xhigh', 'max'] as const) {
      expect(loadConfig({ CC_EFFORT: effort }).effort).toBe(effort)
    }
  })

  test('rejects unsupported effort levels at startup', () => {
    expect(() => loadConfig({ CC_EFFORT: 'minimal' })).toThrow(
      'CC_EFFORT must be one of: low, medium, high, xhigh, max',
    )
  })
})
