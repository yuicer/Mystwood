"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      state: {
        space: null,
        tasks: [],
        score: 50
      }
    };
  },
  computed: {
    theme() {
      return common_vendor.getThemeByScore(this.state.score);
    },
    todoTasks() {
      return (this.state.tasks || []).filter((t) => t.status === "todo").slice(0, 5);
    }
  },
  async onShow() {
    this.state = await common_vendor.getState();
  },
  methods: {
    go(path) {
      common_vendor.index.navigateTo({ url: path });
    },
    fmt(ts) {
      if (!ts)
        return "未设置";
      return new Date(ts).toLocaleString();
    },
    async finish(id) {
      await common_vendor.completeTask(id);
      this.state = await common_vendor.getState();
      common_vendor.index.showToast({ title: "已完成", icon: "success" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.state.space
  }, !$data.state.space ? {
    b: common_vendor.o(($event) => $options.go("/pages/space/create"), "b6")
  } : common_vendor.e({
    c: common_vendor.t($data.state.space.name),
    d: common_vendor.t($data.state.space.status === "active" ? "已激活" : "待对方同意"),
    e: common_vendor.t($options.theme.name),
    f: $data.state.space.status !== "active"
  }, $data.state.space.status !== "active" ? {
    g: common_vendor.o(($event) => $options.go("/pages/space/invite"), "08")
  } : {
    h: common_vendor.o(($event) => $options.go("/pages/category/list"), "bc"),
    i: common_vendor.o(($event) => $options.go("/pages/task/create"), "5b"),
    j: common_vendor.o(($event) => $options.go("/pages/memory/list"), "82"),
    k: common_vendor.o(($event) => $options.go("/pages/me/settings"), "a2")
  }, {
    l: $data.state.space.status === "active"
  }, $data.state.space.status === "active" ? common_vendor.e({
    m: $options.todoTasks.length === 0
  }, $options.todoTasks.length === 0 ? {} : {}, {
    n: common_vendor.f($options.todoTasks, (task, k0, i0) => {
      return {
        a: common_vendor.t(task.title),
        b: common_vendor.t($options.fmt(task.deadline)),
        c: common_vendor.o(($event) => $options.finish(task.id), task.id),
        d: task.id
      };
    })
  }) : {}), {
    o: $options.theme.bg
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
