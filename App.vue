<template>
  <view />
</template>

<script>
import { isWxCloudProvider } from '@/common/config/runtime'

const env = typeof import.meta !== 'undefined' ? import.meta.env || {} : {}

export default {
  onLaunch() {
    // #ifdef MP-WEIXIN
    if (isWxCloudProvider()) {
      if (!wx?.cloud) {
        console.warn('[runtime] wx.cloud is unavailable in current environment')
      } else {
        const cloudEnv = env.VITE_WECHAT_CLOUD_ENV
        wx.cloud.init({
          env: cloudEnv || undefined,
          traceUser: true
        })
      }
    }
    // #endif

    console.log('亲密空间启动')
  }
}
</script>

<style lang="scss">
page {
  background: radial-gradient(circle at 20% 20%, #1b2455 0%, #0a0f1f 46%, #05070f 100%);
  color: #ecf3ff;
}

.card {
  background: linear-gradient(135deg, rgba(45, 64, 140, 0.55), rgba(19, 28, 67, 0.72));
  border: 1px solid rgba(123, 208, 255, 0.28);
  border-radius: 18rpx;
  padding: 24rpx;
  box-shadow: 0 10rpx 30rpx rgba(5, 11, 32, 0.45), inset 0 0 0 1rpx rgba(145, 255, 241, 0.12);
  margin-bottom: 20rpx;
  backdrop-filter: blur(8rpx);
}

button {
  border-radius: 12rpx;
  font-weight: 600;
  border: 1px solid rgba(146, 255, 236, 0.22);
  background: linear-gradient(135deg, rgba(89, 105, 191, 0.52), rgba(38, 51, 112, 0.65));
  color: #eff8ff;
}

.btn-primary {
  background: linear-gradient(135deg, #00d4ff, #4f7bff 45%, #8d4bff);
  color: #f7feff;
  border: none;
  box-shadow: 0 0 0 1px rgba(138, 243, 255, 0.25), 0 8rpx 24rpx rgba(37, 71, 255, 0.45);
}

.btn-danger {
  background: linear-gradient(135deg, #ff5a88, #ff3f62);
  color: #fff;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(255, 63, 98, 0.45);
}

.hint {
  color: #a7b7dd;
  font-size: 24rpx;
}
</style>
