const env = typeof import.meta !== 'undefined' ? import.meta.env || {} : {}

export const RUNTIME_CONFIG = {
  provider: 'wx-cloud',
  wechatCloudEnv: env.VITE_WECHAT_CLOUD_ENV || '',
  cloudSpace: 'aliyun'
}

export function isWxCloudProvider() {
  return true
}
