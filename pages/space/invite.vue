<template>
  <view style="padding:24rpx">
    <view class="card" v-if="space">
      <view style="font-size:30rpx;font-weight:600">{{ space.name }}</view>
      <view class="hint" style="margin:12rpx 0">分享这个邀请码给 TA：{{ space.inviteToken }}</view>
      <button @click="copy">复制邀请码</button>
      <button class="btn-primary" style="margin-top:10rpx" @click="simulateAccept">模拟对方同意</button>
    </view>
    <view class="card" v-else>
      <view class="hint">你还没有空间，先创建一个吧。</view>
      <button class="btn-primary" style="margin-top:10rpx" @click="goCreate">去创建</button>
    </view>
  </view>
</template>

<script>
import { acceptInvite, getState } from '@/common/services'

export default {
  data() {
    return { space: null }
  },
  async onShow() {
    this.space = (await getState()).space
  },
  methods: {
    copy() {
      uni.setClipboardData({ data: this.space.inviteToken })
    },
    async simulateAccept() {
      await acceptInvite()
      uni.showToast({ title: '对方已同意', icon: 'success' })
      setTimeout(() => uni.redirectTo({ url: '/pages/index/index' }), 400)
    },
    goCreate() {
      uni.redirectTo({ url: '/pages/space/create' })
    }
  }
}
</script>
