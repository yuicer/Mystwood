<template>
  <view style="padding:24rpx">
    <view class="card">
      <view style="font-size:30rpx; font-weight:600; margin-bottom:12rpx">回忆时间线</view>
      <view v-if="memories.length === 0" class="hint">还没有归档内容。</view>
      <view v-for="item in memories" :key="item.id" style="border-top:1px solid #f1f5f9;padding:14rpx 0">
        <view>{{ item.title }}</view>
        <view class="hint">{{ item.categoryName }} · {{ status(item.status) }}</view>
        <view class="hint">{{ fmt(item.completedAt || item.deadline || item.createdAt) }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { getState } from '@/common/services'

export default {
  data() {
    return { memories: [] }
  },
  async onShow() {
    this.memories = (await getState()).memories
  },
  methods: {
    status(s) {
      return s === 'completed' ? '已完成' : '逾期扣分'
    },
    fmt(ts) {
      return new Date(ts).toLocaleString()
    }
  }
}
</script>
