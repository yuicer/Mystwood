const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { action, payload, id, approved } = event
  try {
    switch (action) {
      case 'createCategory': {
        const row = {
          ...payload,
          status: 'pending',
          createdAt: Date.now()
        }
        const res = await db.collection('categories').add({ data: row })
        return { code: 0, data: { _id: res._id, ...row } }
      }
      case 'approveCategory': {
        await db.collection('categories').doc(id).update({ data: { status: approved ? 'active' : 'rejected' } })
        return { code: 0, data: true }
      }
      default:
        return { code: 400, message: `unknown action: ${action}` }
    }
  } catch (error) {
    return { code: 500, message: error.message }
  }
}
