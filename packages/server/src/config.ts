import {
  CLAUDE_EFFORT_DESCRIPTION,
  type ClaudeEffort,
  isClaudeEffort,
} from './claude/effort.ts'
import { CC_VERSION } from './claude/wire.ts'
import { DEFAULT_CREDENTIALS_PATH } from './credentials.ts'

export const DEFAULT_CLAUDE_MODELS = [
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
] as const

export type ServerConfig = {
  port: number
  host: string
  /** null → generate a random key and print it once at startup */
  apiKey: string | null
  anthropicBaseUrl: string
  credentialsPath: string
  /** Static list used only when live model discovery is unavailable. */
  fallbackModels: string[]
  /** null means accept every model ID and let Anthropic validate it. */
  modelAllowlist: string[] | null
  ccVersion: string
  effort: ClaudeEffort
}

function parseModelList(value: string | undefined): string[] | null {
  if (value === undefined) return null
  const models = value
    .split(',')
    .map((model) => model.trim())
    .filter(Boolean)
  return models.length ? models : null
}

export function loadConfig(
  env: Record<string, string | undefined> = process.env,
): ServerConfig {
  const modelAllowlist = parseModelList(env.CLAUDE_MODELS)
  const effort = env.CC_EFFORT ?? 'high'
  if (!isClaudeEffort(effort)) {
    throw new Error(`CC_EFFORT must be one of: ${CLAUDE_EFFORT_DESCRIPTION}`)
  }

  return {
    port: Number(env.PORT ?? 8080),
    host: '127.0.0.1',
    apiKey: env.SERVER_API_KEY || null,
    anthropicBaseUrl: (
      env.ANTHROPIC_BASE_URL ?? 'https://api.anthropic.com'
    ).replace(/\/$/, ''),
    credentialsPath: env.CREDENTIALS_PATH ?? DEFAULT_CREDENTIALS_PATH,
    fallbackModels: modelAllowlist ?? [...DEFAULT_CLAUDE_MODELS],
    modelAllowlist,
    ccVersion: env.CC_VERSION ?? CC_VERSION,
    effort,
  }
}
