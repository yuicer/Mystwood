"use strict";

const api = require("../../utils/api.js");

Page({
  data: {
    form: {
      title: "",
      locationName: "",
      imageUrl: "",
      date: ""
    }
  },

  async onShow() {
    try {
      await api.getState();
    } catch (error) {
      wx.showToast({ title: error.message || "加载失败", icon: "none" });
    }
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
    const { form } = this.data;
    if (!form.title.trim()) {
      wx.showToast({ title: "请填写任务标题", icon: "none" });
      return;
    }

    try {
      await api.createTask({
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
