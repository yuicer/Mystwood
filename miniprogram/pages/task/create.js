"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      activeCategories: [],
      currentCategory: null,
      form: {
        title: "",
        locationName: "",
        imageUrl: "",
        date: ""
      }
    };
  },
  async onShow() {
    const state = await common_vendor.getState();
    this.activeCategories = state.categories.filter((c) => c.status === "active");
    if (!this.currentCategory && this.activeCategories.length) {
      this.currentCategory = this.activeCategories[0];
    }
  },
  methods: {
    onCategoryPick(e) {
      const idx = Number(e.detail.value);
      this.currentCategory = this.activeCategories[idx];
    },
    onDatePick(e) {
      this.form.date = e.detail.value;
    },
    async create() {
      if (!this.currentCategory) {
        common_vendor.index.showToast({ title: "请先创建并激活类", icon: "none" });
        return;
      }
      if (!this.form.title.trim()) {
        common_vendor.index.showToast({ title: "请填写任务标题", icon: "none" });
        return;
      }
      await common_vendor.createTask({
        categoryId: this.currentCategory.id,
        categoryName: this.currentCategory.name,
        title: this.form.title.trim(),
        locationName: this.form.locationName.trim(),
        imageUrl: this.form.imageUrl.trim(),
        deadline: this.form.date ? (/* @__PURE__ */ new Date(`${this.form.date} 23:59:59`)).getTime() : null
      });
      this.form = { title: "", locationName: "", imageUrl: "", date: "" };
      common_vendor.index.showToast({ title: "创建成功", icon: "success" });
    },
    toMemory() {
      common_vendor.index.navigateTo({ url: "/pages/memory/list" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.currentCategory ? $data.currentCategory.name : "选择一个已生效的类"),
    b: $data.activeCategories,
    c: common_vendor.o((...args) => $options.onCategoryPick && $options.onCategoryPick(...args), "87"),
    d: $data.form.title,
    e: common_vendor.o(($event) => $data.form.title = $event.detail.value, "f6"),
    f: $data.form.locationName,
    g: common_vendor.o(($event) => $data.form.locationName = $event.detail.value, "71"),
    h: $data.form.imageUrl,
    i: common_vendor.o(($event) => $data.form.imageUrl = $event.detail.value, "20"),
    j: common_vendor.t($data.form.date || "请选择"),
    k: common_vendor.o((...args) => $options.onDatePick && $options.onDatePick(...args), "32"),
    l: common_vendor.o((...args) => $options.create && $options.create(...args), "0a"),
    m: common_vendor.o((...args) => $options.toMemory && $options.toMemory(...args), "7d")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
