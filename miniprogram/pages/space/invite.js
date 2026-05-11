"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return { space: null };
  },
  async onShow() {
    this.space = (await common_vendor.getState()).space;
  },
  methods: {
    copy() {
      common_vendor.index.setClipboardData({ data: this.space.inviteToken });
    },
    async simulateAccept() {
      await common_vendor.acceptInvite();
      common_vendor.index.showToast({ title: "对方已同意", icon: "success" });
      setTimeout(() => common_vendor.index.redirectTo({ url: "/pages/index/index" }), 400);
    },
    goCreate() {
      common_vendor.index.redirectTo({ url: "/pages/space/create" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.space
  }, $data.space ? {
    b: common_vendor.t($data.space.name),
    c: common_vendor.t($data.space.inviteToken),
    d: common_vendor.o((...args) => $options.copy && $options.copy(...args), "41"),
    e: common_vendor.o((...args) => $options.simulateAccept && $options.simulateAccept(...args), "5d")
  } : {
    f: common_vendor.o((...args) => $options.goCreate && $options.goCreate(...args), "53")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
