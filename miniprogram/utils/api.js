"use strict";

function callFunction(name, data) {
  return new Promise((resolve, reject) => {
    if (!wx.cloud) {
      reject(new Error("wx.cloud 未初始化，请先在小程序端初始化云环境"));
      return;
    }

    wx.cloud.callFunction({
      name,
      data: data || {},
      success(res) {
        const payload = res && res.result;
        if (payload && payload.code && payload.code !== 0) {
          reject(new Error(payload.message || "微信云函数调用失败"));
          return;
        }
        resolve(payload && Object.prototype.hasOwnProperty.call(payload, "data") ? payload.data : payload);
      },
      fail: reject
    });
  });
}

module.exports = {
  getState() {
    return callFunction("space-service", { action: "getState" });
  },
  createSpace(name) {
    return callFunction("space-service", { action: "createSpace", name });
  },
  acceptInvite() {
    return callFunction("space-service", { action: "acceptInvite" });
  },
  dissolveSpace() {
    return callFunction("space-service", { action: "dissolveSpace" });
  },
  createCategory(payload) {
    return callFunction("category-service", { action: "createCategory", payload });
  },
  approveCategory(id, approved) {
    return callFunction("category-service", { action: "approveCategory", id, approved });
  },
  createTask(payload) {
    return callFunction("task-service", { action: "createTask", payload });
  },
  completeTask(id) {
    return callFunction("task-service", { action: "completeTask", id });
  }
};
