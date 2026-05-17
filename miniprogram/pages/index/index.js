"use strict";

const api = require("../../utils/api.js");

Page({
  data: {
    state: {
      space: null,
      tasks: []
    },
    todoTasks: []
  },

  async onShow() {
    await this.loadState();
  },

  async loadState() {
    try {
      const state = await api.getState();
      const todoTasks = (state.tasks || [])
        .filter((task) => task.status === "todo")
        .slice(0, 5)
        .map((task) => ({
          ...task,
          deadlineText: task.deadline ? new Date(task.deadline).toLocaleString() : "未设置"
        }));

      this.setData({
        state,
        todoTasks
      });
    } catch (error) {
      wx.showToast({ title: error.message || "加载失败", icon: "none" });
    }
  },

  go(event) {
    wx.navigateTo({ url: event.currentTarget.dataset.url });
  },

  async finish(event) {
    try {
      await api.completeTask(event.currentTarget.dataset.id);
      await this.loadState();
      wx.showToast({ title: "已完成", icon: "success" });
    } catch (error) {
      wx.showToast({ title: error.message || "操作失败", icon: "none" });
    }
  }
});
