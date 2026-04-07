const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const { score = 50 } = event
  if (score < 40) return { code: 0, data: { name: '霓虹冷调', bg: 'linear-gradient(135deg,#121a3d,#1f2a67,#26358a)' } }
  if (score < 80) return { code: 0, data: { name: '跃迁暖调', bg: 'linear-gradient(135deg,#1b2e64,#3e54c7,#9b51ff)' } }
  return { code: 0, data: { name: '共振高能', bg: 'linear-gradient(135deg,#141a43,#255de7,#00d3ff)' } }
}
