"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return { name: "" };
  },
  methods: {
    async submit() {
      if (!this.name.trim()) {
        common_vendor.index.showToast({ title: "请填写空间名称", icon: "none" });
        return;
      }
      await common_vendor.createSpace(this.name.trim());
      common_vendor.index.redirectTo({ url: "/pages/space/invite" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.name,
    b: common_vendor.o(($event) => $data.name = $event.detail.value, "ca"),
    c: common_vendor.o((...args) => $options.submit && $options.submit(...args), "5b")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
