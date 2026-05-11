"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return { memories: [] };
  },
  async onShow() {
    this.memories = (await common_vendor.getState()).memories;
  },
  methods: {
    status(s) {
      return s === "completed" ? "已完成" : "逾期扣分";
    },
    fmt(ts) {
      return new Date(ts).toLocaleString();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.memories.length === 0
  }, $data.memories.length === 0 ? {} : {}, {
    b: common_vendor.f($data.memories, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.t(item.categoryName),
        c: common_vendor.t($options.status(item.status)),
        d: common_vendor.t($options.fmt(item.completedAt || item.deadline || item.createdAt)),
        e: item.id
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
