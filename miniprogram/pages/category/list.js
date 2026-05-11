"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      categories: [],
      form: {
        name: "",
        rule: ""
      }
    };
  },
  async onShow() {
    this.categories = (await common_vendor.getState()).categories;
  },
  methods: {
    statusText(status) {
      return status === "active" ? "已生效" : status === "rejected" ? "已拒绝" : "待同意";
    },
    async submit() {
      if (!this.form.name.trim()) {
        common_vendor.index.showToast({ title: "请填写类名称", icon: "none" });
        return;
      }
      await common_vendor.createCategory({ name: this.form.name.trim(), rule: this.form.rule.trim() || "完成+10，逾期-5" });
      this.form = { name: "", rule: "" };
      this.categories = (await common_vendor.getState()).categories;
      common_vendor.index.showToast({ title: "已发起", icon: "success" });
    },
    async approve(id, yes) {
      await common_vendor.approveCategory(id, yes);
      this.categories = (await common_vendor.getState()).categories;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.form.name,
    b: common_vendor.o(($event) => $data.form.name = $event.detail.value, "59"),
    c: $data.form.rule,
    d: common_vendor.o(($event) => $data.form.rule = $event.detail.value, "c5"),
    e: common_vendor.o((...args) => $options.submit && $options.submit(...args), "79"),
    f: $data.categories.length === 0
  }, $data.categories.length === 0 ? {} : {}, {
    g: common_vendor.f($data.categories, (item, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.rule),
        c: common_vendor.t($options.statusText(item.status)),
        d: item.status === "pending"
      }, item.status === "pending" ? {
        e: common_vendor.o(($event) => $options.approve(item.id, true), item.id),
        f: common_vendor.o(($event) => $options.approve(item.id, false), item.id)
      } : {}, {
        g: item.id
      });
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
