"use strict";

App({
  globalData: {},

  onLaunch() {
    if (!wx.cloud) {
      console.warn("[runtime] wx.cloud is unavailable in current environment");
      return;
    }

    wx.cloud.init({
      traceUser: true
    });

    console.log("亲密空间启动");
  }
});
