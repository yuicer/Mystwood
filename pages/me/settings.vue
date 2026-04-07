<template>
  <view style="padding:24rpx">
    <view class="card">
      <view style="font-size:30rpx; font-weight:600">通知设置（MVP 占位）</view>
      <view class="hint" style="margin-top:12rpx">- 类同意请求提醒</view>
      <view class="hint">- 任务即将逾期提醒</view>
      <view class="hint">- 自动扣分结果提醒</view>
    </view>

    <view class="card">
      <view style="font-size:30rpx; font-weight:600">关系解绑</view>
      <view class="hint" style="margin:12rpx 0">解绑后数据不保留，不可恢复。</view>
      <button class="btn-danger" @click="dissolve">解绑并清空数据</button>
    </view>
  </view>
</template>

<script>
import { dissolveSpace } from '@/common/services'

export default {
  methods: {
    dissolve() {
      uni.showModal({
        title: '确认解绑',
        content: '解绑后将清空空间历史，是否继续？',
        success: async ({ confirm }) => {
          if (!confirm) return
          await dissolveSpace()
          uni.showToast({ title: '已解绑', icon: 'success' })
          setTimeout(() => {
            uni.reLaunch({ url: '/pages/index/index' })
          }, 500)
        }
      })
    }
  }
}
</script>
