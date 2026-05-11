"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  methods: {
    dissolve() {
      common_vendor.index.showModal({
        title: "确认解绑",
        content: "解绑后将清空空间历史，是否继续？",
        success: async ({ confirm }) => {
          if (!confirm)
            return;
          await common_vendor.dissolveSpace();
          common_vendor.index.showToast({ title: "已解绑", icon: "success" });
          setTimeout(() => {
            common_vendor.index.reLaunch({ url: "/pages/index/index" });
          }, 500);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.dissolve && $options.dissolve(...args), "30")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
