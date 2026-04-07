<template>
  <view style="padding:24rpx">
    <view class="card">
      <view style="font-size:30rpx;font-weight:600">创建任务</view>
      <picker :range="activeCategories" range-key="name" @change="onCategoryPick" style="margin-top:12rpx">
        <view style="border:1px solid #e5e7eb;padding:14rpx;border-radius:12rpx">
          {{ currentCategory ? currentCategory.name : '选择一个已生效的类' }}
        </view>
      </picker>
      <input v-model="form.title" placeholder="任务标题" style="margin-top:10rpx;border:1px solid #e5e7eb;padding:14rpx;border-radius:12rpx" />
      <input v-model="form.locationName" placeholder="地点（可选，默认可定位）" style="margin-top:10rpx;border:1px solid #e5e7eb;padding:14rpx;border-radius:12rpx" />
      <input v-model="form.imageUrl" placeholder="图片地址（可选）" style="margin-top:10rpx;border:1px solid #e5e7eb;padding:14rpx;border-radius:12rpx" />
      <picker mode="date" @change="onDatePick" style="margin-top:10rpx">
        <view style="border:1px solid #e5e7eb;padding:14rpx;border-radius:12rpx">截止日期：{{ form.date || '请选择' }}</view>
      </picker>
      <button class="btn-primary" style="margin-top:12rpx" @click="create">创建任务</button>
      <button style="margin-top:10rpx" @click="toMemory">查看回忆归档</button>
    </view>
  </view>
</template>

<script>
import { createTask, getState } from '@/common/services'

export default {
  data() {
    return {
      activeCategories: [],
      currentCategory: null,
      form: {
        title: '',
        locationName: '',
        imageUrl: '',
        date: ''
      }
    }
  },
  async onShow() {
    const state = await getState()
    this.activeCategories = state.categories.filter(c => c.status === 'active')
    if (!this.currentCategory && this.activeCategories.length) {
      this.currentCategory = this.activeCategories[0]
    }
  },
  methods: {
    onCategoryPick(e) {
      const idx = Number(e.detail.value)
      this.currentCategory = this.activeCategories[idx]
    },
    onDatePick(e) {
      this.form.date = e.detail.value
    },
    async create() {
      if (!this.currentCategory) {
        uni.showToast({ title: '请先创建并激活类', icon: 'none' })
        return
      }
      if (!this.form.title.trim()) {
        uni.showToast({ title: '请填写任务标题', icon: 'none' })
        return
      }
      await createTask({
        categoryId: this.currentCategory.id,
        categoryName: this.currentCategory.name,
        title: this.form.title.trim(),
        locationName: this.form.locationName.trim(),
        imageUrl: this.form.imageUrl.trim(),
        deadline: this.form.date ? new Date(`${this.form.date} 23:59:59`).getTime() : null
      })
      this.form = { title: '', locationName: '', imageUrl: '', date: '' }
      uni.showToast({ title: '创建成功', icon: 'success' })
    },
    toMemory() {
      uni.navigateTo({ url: '/pages/memory/list' })
    }
  }
}
</script>
