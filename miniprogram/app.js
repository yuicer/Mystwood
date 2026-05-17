'use strict';

const config = require('./config.js');

App({
  globalData: {},

  onLaunch() {
    if (!wx.cloud) {
      console.warn('[runtime] wx.cloud is unavailable in current environment');
      return;
    }

    const cloudInitOptions = {
      traceUser: true,
      env: config.cloudEnvId,
    };

    wx.cloud.init(cloudInitOptions);

    console.log('海边沙滩启动');
  },
});
