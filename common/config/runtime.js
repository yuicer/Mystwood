const env = typeof import.meta !== 'undefined' ? import.meta.env || {} : {}
const isDev = Boolean(env.DEV)
const providerFromEnv = env.VITE_SERVICE_PROVIDER
const defaultProvider = isDev ? 'local-api' : 'wx-cloud'
const ALLOWED_PROVIDERS = ['mock', 'local-api', 'wx-cloud']
const resolvedProvider = providerFromEnv || defaultProvider

if (!ALLOWED_PROVIDERS.includes(resolvedProvider)) {
  throw new Error(`Invalid VITE_SERVICE_PROVIDER: ${resolvedProvider}`)
}

export const RUNTIME_CONFIG = {
  provider: resolvedProvider, // mock | local-api | wx-cloud
  cloudSpace: 'aliyun'
}

export function isWxCloudProvider() {
  return RUNTIME_CONFIG.provider === 'wx-cloud'
}

export function isLocalApiProvider() {
  return RUNTIME_CONFIG.provider === 'local-api'
}
