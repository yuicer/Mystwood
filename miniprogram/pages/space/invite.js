"use strict";

const api = require("../../utils/api.js");

Page({
  data: {
    space: null
  },

  async onShow() {
    try {
      const state = await api.getState();
      this.setData({ space: state.space });
    } catch (error) {
      wx.showToast({ title: error.message || "加载失败", icon: "none" });
    }
  },

  copy() {
    wx.setClipboardData({ data: this.data.space.inviteToken });
  },

  async simulateAccept() {
    try {
      await api.acceptInvite();
      wx.showToast({ title: "对方已同意", icon: "success" });
      setTimeout(() => wx.redirectTo({ url: "/pages/index/index" }), 400);
    } catch (error) {
      wx.showToast({ title: error.message || "操作失败", icon: "none" });
    }
  },

  goCreate() {
    wx.redirectTo({ url: "/pages/space/create" });
  }
});
