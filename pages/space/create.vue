<template>
  <view style="padding:24rpx">
    <view class="card">
      <view style="font-size:32rpx; font-weight:600">创建你们的空间</view>
      <input v-model="name" placeholder="例如：我们的小宇宙" style="margin:18rpx 0;border:1px solid #e5e7eb;padding:16rpx;border-radius:12rpx" />
      <button class="btn-primary" @click="submit">创建并去邀请</button>
    </view>
  </view>
</template>

<script>
import { createSpace } from '@/common/services'

export default {
  data() {
    return { name: '' }
  },
  methods: {
    async submit() {
      if (!this.name.trim()) {
        uni.showToast({ title: '请填写空间名称', icon: 'none' })
        return
      }
      await createSpace(this.name.trim())
      uni.redirectTo({ url: '/pages/space/invite' })
    }
  }
}
</script>
