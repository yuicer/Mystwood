<template>
  <view :style="{ minHeight: '100vh', padding: '24rpx', background: theme.bg }">
    <view class="card" v-if="!state.space">
      <view style="font-size: 36rpx; font-weight: 600">欢迎来到亲密空间</view>
      <view class="hint" style="margin: 12rpx 0 20rpx">先创建你们的双人空间，再邀请 TA 加入。</view>
      <button class="btn-primary" @click="go('/pages/space/create')">立即创建空间</button>
    </view>

    <template v-else>
      <view class="card">
        <view style="font-size: 34rpx; font-weight: 600">{{ state.space.name }}</view>
        <view class="hint" style="margin-top: 8rpx">状态：{{ state.space.status === 'active' ? '已激活' : '待对方同意' }}</view>
        <view class="hint" style="margin-top: 8rpx">亲密主题：{{ theme.name }}</view>
      </view>

      <view class="card" v-if="state.space.status !== 'active'">
        <view class="hint">还差一步，邀请 TA 同意后空间生效。</view>
        <button class="btn-primary" style="margin-top: 12rpx" @click="go('/pages/space/invite')">去邀请</button>
      </view>

      <view class="card" v-else>
        <view style="font-size: 30rpx; font-weight: 600; margin-bottom: 12rpx">快捷入口</view>
        <button @click="go('/pages/category/list')">共同事项类</button>
        <button @click="go('/pages/task/create')" style="margin-top: 10rpx">创建任务</button>
        <button @click="go('/pages/memory/list')" style="margin-top: 10rpx">回忆归档</button>
        <button @click="go('/pages/me/settings')" style="margin-top: 10rpx">设置</button>
      </view>

      <view class="card" v-if="state.space.status === 'active'">
        <view style="font-size: 30rpx; font-weight: 600; margin-bottom: 12rpx">待完成任务</view>
        <view v-if="todoTasks.length === 0" class="hint">暂无任务，去创建一个吧。</view>
        <view v-for="task in todoTasks" :key="task.id" style="border-top:1px solid #eef2ff; padding: 14rpx 0">
          <view>{{ task.title }}</view>
          <view class="hint">截止：{{ fmt(task.deadline) }}</view>
          <button size="mini" @click="finish(task.id)">标记完成</button>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import { getThemeByScore } from '@/common/config/theme'
import { completeTask, getState } from '@/common/services'

export default {
  data() {
    return {
      state: {
        space: null,
        tasks: [],
        score: 50
      }
    }
  },
  computed: {
    theme() {
      return getThemeByScore(this.state.score)
    },
    todoTasks() {
      return (this.state.tasks || []).filter(t => t.status === 'todo').slice(0, 5)
    }
  },
  async onShow() {
    this.state = await getState()
  },
  methods: {
    go(path) {
      uni.navigateTo({ url: path })
    },
    fmt(ts) {
      if (!ts) return '未设置'
      return new Date(ts).toLocaleString()
    },
    async finish(id) {
      await completeTask(id)
      this.state = await getState()
      uni.showToast({ title: '已完成', icon: 'success' })
    }
  }
}
</script>
