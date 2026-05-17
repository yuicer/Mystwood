"use strict";

const api = require("../../utils/api.js");

Page({
  data: {
    space: null,
    invite: null,
    inviteToken: ""
  },

  onLoad(options) {
    const rawInviteToken = options && (options.inviteToken || options.token || options.scene);
    const inviteToken = rawInviteToken ? decodeURIComponent(rawInviteToken) : "";
    this.setData({ inviteToken });

    if (wx.showShareMenu) {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage"]
      });
    }
  },

  async onShow() {
    try {
      if (this.data.inviteToken) {
        const invite = await api.getInvite(this.data.inviteToken);
        this.setData({ space: null, invite });
        return;
      }

      const state = await api.getState();
      if (state.space) {
        this.setData({ space: state.space, invite: null });
        return;
      }

      this.setData({ space: null, invite: null });
    } catch (error) {
      wx.showToast({ title: error.message || "加载失败", icon: "none" });
    }
  },

  copy() {
    if (!this.data.space || !this.data.space.inviteToken) {
      wx.showToast({ title: "暂无邀请码", icon: "none" });
      return;
    }
    wx.setClipboardData({ data: this.data.space.inviteToken });
  },

  async acceptInvite() {
    try {
      await api.acceptInvite(this.data.inviteToken);
      wx.showToast({ title: "已加入", icon: "success" });
      setTimeout(() => wx.redirectTo({ url: "/pages/index/index" }), 400);
    } catch (error) {
      wx.showToast({ title: error.message || "操作失败", icon: "none" });
    }
  },

  onShareAppMessage() {
    const space = this.data.space || {};
    const inviteToken = space.inviteToken || this.data.inviteToken;
    return {
      title: `${space.name || "亲密空间"} 邀请你加入`,
      path: `/pages/space/invite?inviteToken=${encodeURIComponent(inviteToken)}`
    };
  },

  goCreate() {
    wx.redirectTo({ url: "/pages/space/create" });
  }
});
