export const RUNTIME_CONFIG = {
  provider: 'mock', // mock | local-api | wx-cloud
  cloudSpace: 'aliyun'
}

export function isWxCloudProvider() {
  return RUNTIME_CONFIG.provider === 'wx-cloud'
}

export function isLocalApiProvider() {
  return RUNTIME_CONFIG.provider === 'local-api'
}
