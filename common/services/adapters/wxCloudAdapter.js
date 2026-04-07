function callFunction(name, data = {}) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    if (!wx?.cloud) {
      reject(new Error('wx.cloud 未初始化，请先在小程序端初始化云环境'))
      return
    }
    wx.cloud.callFunction({
      name,
      data,
      success: res => {
        const payload = res?.result
        if (payload?.code && payload.code !== 0) {
          reject(new Error(payload.message || '微信云函数调用失败'))
          return
        }
        resolve(payload?.data ?? payload)
      },
      fail: reject
    })
    // #endif

    // #ifndef MP-WEIXIN
    reject(new Error('wx-cloud provider 仅支持微信小程序环境'))
    // #endif
  })
}

function getThemeByScore(score) {
  if (score < 40) return { name: '霓虹冷调', bg: 'linear-gradient(135deg,#121a3d,#1f2a67,#26358a)' }
  if (score < 80) return { name: '跃迁暖调', bg: 'linear-gradient(135deg,#1b2e64,#3e54c7,#9b51ff)' }
  return { name: '共振高能', bg: 'linear-gradient(135deg,#141a43,#255de7,#00d3ff)' }
}

export default {
  getState: () => callFunction('space-service', { action: 'getState' }),
  createSpace: name => callFunction('space-service', { action: 'createSpace', name }),
  acceptInvite: () => callFunction('space-service', { action: 'acceptInvite' }),
  createCategory: payload => callFunction('category-service', { action: 'createCategory', payload }),
  approveCategory: (id, approved) => callFunction('category-service', { action: 'approveCategory', id, approved }),
  createTask: payload => callFunction('task-service', { action: 'createTask', payload }),
  completeTask: id => callFunction('task-service', { action: 'completeTask', id }),
  dissolveSpace: () => callFunction('space-service', { action: 'dissolveSpace' }),
  getThemeByScore
}
