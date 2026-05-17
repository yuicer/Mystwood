const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const { action, payload = {}, id } = event
  try {
    switch (action) {
      case 'createTask': {
        const title = payload && typeof payload.title === 'string' ? payload.title.trim() : ''
        if (!title) return { code: 400, message: '请填写任务标题' }

        const spaceRes = await db.collection('spaces').where({ members: wxContext.OPENID }).limit(1).get()
        const space = spaceRes.data[0]
        if (!space) return { code: 404, message: '请先创建空间' }

        const row = {
          spaceId: space._id,
          creator: wxContext.OPENID,
          title,
          locationName: payload.locationName || '',
          imageUrl: payload.imageUrl || '',
          deadline: payload.deadline || null,
          status: 'todo',
          createdAt: Date.now()
        }
        const res = await db.collection('tasks').add({ data: row })
        return { code: 0, data: { _id: res._id, ...row } }
      }
      case 'completeTask': {
        await db.collection('tasks').doc(id).update({ data: { status: 'completed', completedAt: Date.now() } })
        return { code: 0, data: true }
      }
      default:
        return { code: 400, message: `unknown action: ${action}` }
    }
  } catch (error) {
    return { code: 500, message: error.message }
  }
}
