const env = typeof import.meta !== 'undefined' ? import.meta.env || {} : {}
const BASE_URL = env.VITE_LOCAL_API_BASE_URL || 'http://127.0.0.1:9000'

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

export default {
  getState: () => request('/api/state'),
  createSpace: name => request('/api/spaces', { name }, 'POST'),
  acceptInvite: () => request('/api/spaces/accept', {}, 'POST'),
  createCategory: payload => request('/api/categories', payload, 'POST'),
  approveCategory: (id, approved) => request('/api/categories/approve', { id, approved }, 'POST'),
  createTask: payload => request('/api/tasks', payload, 'POST'),
  completeTask: id => request('/api/tasks/complete', { id }, 'POST'),
  dissolveSpace: () => request('/api/reset', {}, 'POST')
}
