"use strict";

const api = require("../../utils/api.js");

Page({
  dissolve() {
    wx.showModal({
      title: "确认解绑",
      content: "解绑后将清空空间历史，是否继续？",
      success: async ({ confirm }) => {
        if (!confirm) return;

        try {
          await api.dissolveSpace();
          wx.showToast({ title: "已解绑", icon: "success" });
          setTimeout(() => {
            wx.reLaunch({ url: "/pages/index/index" });
          }, 500);
        } catch (error) {
          wx.showToast({ title: error.message || "解绑失败", icon: "none" });
        }
      }
    });
  }
});
