const BASE_URL = 'http://127.0.0.1:9000'

function request(url, data = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      success: ({ data: resp }) => {
        if (resp?.code && resp.code !== 0) {
          reject(new Error(resp.message || '本地接口请求失败'))
          return
        }
        resolve(resp?.data ?? resp)
      },
      fail: reject
    })
  })
}

function getThemeByScore(score) {
  if (score < 40) return { name: '霓虹冷调', bg: 'linear-gradient(135deg,#121a3d,#1f2a67,#26358a)' }
  if (score < 80) return { name: '跃迁暖调', bg: 'linear-gradient(135deg,#1b2e64,#3e54c7,#9b51ff)' }
  return { name: '共振高能', bg: 'linear-gradient(135deg,#141a43,#255de7,#00d3ff)' }
}

export default {
  getState: () => request('/api/state'),
  createSpace: name => request('/api/spaces', { name }, 'POST'),
  acceptInvite: () => request('/api/spaces/accept', {}, 'POST'),
  createCategory: payload => request('/api/categories', payload, 'POST'),
  approveCategory: (id, approved) => request('/api/categories/approve', { id, approved }, 'POST'),
  createTask: payload => request('/api/tasks', payload, 'POST'),
  completeTask: id => request('/api/tasks/complete', { id }, 'POST'),
  dissolveSpace: () => request('/api/reset', {}, 'POST'),
  getThemeByScore
}
