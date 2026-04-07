<template>
  <view style="padding:24rpx">
    <view class="card">
      <view style="font-size:30rpx; font-weight:600">新建类（需双方同意）</view>
      <input v-model="form.name" placeholder="类名称，如：运动" style="margin-top:14rpx;border:1px solid #e5e7eb;padding:14rpx;border-radius:12rpx" />
      <input v-model="form.rule" placeholder="规则，如：完成双方+10，逾期双方-5" style="margin-top:10rpx;border:1px solid #e5e7eb;padding:14rpx;border-radius:12rpx" />
      <button class="btn-primary" style="margin-top:12rpx" @click="submit">创建并发起同意</button>
    </view>

    <view class="card">
      <view style="font-size:30rpx; font-weight:600; margin-bottom:12rpx">类列表</view>
      <view v-if="categories.length === 0" class="hint">还没有类。</view>
      <view v-for="item in categories" :key="item.id" style="border-top:1px solid #f1f5f9; padding:12rpx 0">
        <view>{{ item.name }}</view>
        <view class="hint">{{ item.rule }}</view>
        <view class="hint">状态：{{ statusText(item.status) }}</view>
        <view v-if="item.status === 'pending'" style="margin-top:8rpx">
          <button size="mini" class="btn-primary" @click="approve(item.id, true)">模拟对方同意</button>
          <button size="mini" class="btn-danger" style="margin-left:8rpx" @click="approve(item.id, false)">拒绝</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { approveCategory, createCategory, getState } from '@/common/services'

export default {
  data() {
    return {
      categories: [],
      form: {
        name: '',
        rule: ''
      }
    }
  },
  async onShow() {
    this.categories = (await getState()).categories
  },
  methods: {
    statusText(status) {
      return status === 'active' ? '已生效' : status === 'rejected' ? '已拒绝' : '待同意'
    },
    async submit() {
      if (!this.form.name.trim()) {
        uni.showToast({ title: '请填写类名称', icon: 'none' })
        return
      }
      await createCategory({ name: this.form.name.trim(), rule: this.form.rule.trim() || '完成+10，逾期-5' })
      this.form = { name: '', rule: '' }
      this.categories = (await getState()).categories
      uni.showToast({ title: '已发起', icon: 'success' })
    },
    async approve(id, yes) {
      await approveCategory(id, yes)
      this.categories = (await getState()).categories
    }
  }
}
</script>
