"use strict";

const api = require("../../utils/api.js");

Page({
  data: {
    memories: []
  },

  async onShow() {
    try {
      const state = await api.getState();
      this.setData({
        memories: (state.memories || []).map((item) => ({
          ...item,
          statusText: item.status === "completed" ? "已完成" : "逾期扣分",
          timeText: item.completedAt || item.deadline || item.createdAt ? new Date(item.completedAt || item.deadline || item.createdAt).toLocaleString() : ""
        }))
      });
    } catch (error) {
      wx.showToast({ title: error.message || "加载失败", icon: "none" });
    }
  },
});
