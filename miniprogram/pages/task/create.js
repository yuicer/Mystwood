"use strict";

const api = require("../../utils/api.js");

Page({
  data: {
    activeCategories: [],
    currentCategory: null,
    form: {
      title: "",
      locationName: "",
      imageUrl: "",
      date: ""
    }
  },

  async onShow() {
    try {
      const state = await api.getState();
      const activeCategories = (state.categories || []).filter((category) => category.status === "active");
      this.setData({
        activeCategories,
        currentCategory: this.data.currentCategory || activeCategories[0] || null
      });
    } catch (error) {
      wx.showToast({ title: error.message || "加载失败", icon: "none" });
    }
  },

  onCategoryPick(event) {
    this.setData({ currentCategory: this.data.activeCategories[Number(event.detail.value)] });
  },

  onTitleInput(event) {
    this.setData({ "form.title": event.detail.value });
  },

  onLocationInput(event) {
    this.setData({ "form.locationName": event.detail.value });
  },

  onImageInput(event) {
    this.setData({ "form.imageUrl": event.detail.value });
  },

  onDatePick(event) {
    this.setData({ "form.date": event.detail.value });
  },

  async create() {
    const { currentCategory, form } = this.data;
    if (!currentCategory) {
      wx.showToast({ title: "请先创建并激活类", icon: "none" });
      return;
    }
    if (!form.title.trim()) {
      wx.showToast({ title: "请填写任务标题", icon: "none" });
      return;
    }

    try {
      await api.createTask({
        categoryId: currentCategory._id,
        categoryName: currentCategory.name,
        title: form.title.trim(),
        locationName: form.locationName.trim(),
        imageUrl: form.imageUrl.trim(),
        deadline: form.date ? new Date(`${form.date} 23:59:59`).getTime() : null
      });
      this.setData({ form: { title: "", locationName: "", imageUrl: "", date: "" } });
      wx.showToast({ title: "创建成功", icon: "success" });
    } catch (error) {
      wx.showToast({ title: error.message || "创建失败", icon: "none" });
    }
  },

  toMemory() {
    wx.navigateTo({ url: "/pages/memory/list" });
  }
});
