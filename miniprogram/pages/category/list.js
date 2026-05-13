"use strict";

const api = require("../../utils/api.js");

Page({
  data: {
    categories: [],
    form: {
      name: "",
      rule: ""
    }
  },

  async onShow() {
    await this.loadCategories();
  },

  async loadCategories() {
    try {
      const state = await api.getState();
      this.setData({
        categories: (state.categories || []).map((item) => ({
          ...item,
          statusText: item.status === "active" ? "已生效" : item.status === "rejected" ? "已拒绝" : "待同意"
        }))
      });
    } catch (error) {
      wx.showToast({ title: error.message || "加载失败", icon: "none" });
    }
  },

  onNameInput(event) {
    this.setData({ "form.name": event.detail.value });
  },

  onRuleInput(event) {
    this.setData({ "form.rule": event.detail.value });
  },

  async submit() {
    const name = this.data.form.name.trim();
    const rule = this.data.form.rule.trim() || "完成+10，逾期-5";
    if (!name) {
      wx.showToast({ title: "请填写类名称", icon: "none" });
      return;
    }

    try {
      await api.createCategory({ name, rule });
      this.setData({ form: { name: "", rule: "" } });
      await this.loadCategories();
      wx.showToast({ title: "已发起", icon: "success" });
    } catch (error) {
      wx.showToast({ title: error.message || "创建失败", icon: "none" });
    }
  },

  async approve(event) {
    try {
      const approved = event.currentTarget.dataset.approved === true || event.currentTarget.dataset.approved === "true";
      await api.approveCategory(event.currentTarget.dataset.id, approved);
      await this.loadCategories();
    } catch (error) {
      wx.showToast({ title: error.message || "操作失败", icon: "none" });
    }
  }
});
