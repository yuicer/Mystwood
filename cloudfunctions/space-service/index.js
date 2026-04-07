const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { action, name } = event

  try {
    switch (action) {
      case 'getState': {
        const spaceRes = await db.collection('spaces').where({ members: wxContext.OPENID }).limit(1).get()
        const space = spaceRes.data[0] || null
        if (!space) return { code: 0, data: { space: null, categories: [], tasks: [], memories: [], score: 50 } }

        const categoriesRes = await db.collection('categories').where({ spaceId: space._id }).get()
        const tasksRes = await db.collection('tasks').where({ spaceId: space._id }).get()
        const tasks = tasksRes.data || []
        const memories = tasks.filter(t => t.status === 'completed' || t.status === 'overdue')

        return { code: 0, data: { space, categories: categoriesRes.data || [], tasks, memories, score: space.score || 50 } }
      }
      case 'createSpace': {
        const doc = {
          name: name || '我们的小宇宙',
          status: 'pending',
          members: [wxContext.OPENID],
          inviteToken: Math.random().toString(36).slice(2, 10),
          score: 50,
          createdAt: Date.now()
        }
        const created = await db.collection('spaces').add({ data: doc })
        return { code: 0, data: { _id: created._id, ...doc } }
      }
      case 'acceptInvite': {
        // 简化示例：按 OPENID 找 pending 空间并激活
        const pending = await db.collection('spaces').where({ status: 'pending' }).limit(1).get()
        const row = pending.data[0]
        if (!row) return { code: 404, message: '未找到待同意空间' }

        const members = Array.from(new Set([...(row.members || []), wxContext.OPENID]))
        await db.collection('spaces').doc(row._id).update({ data: { status: 'active', members } })
        return { code: 0, data: true }
      }
      case 'dissolveSpace': {
        const spaceRes = await db.collection('spaces').where({ members: wxContext.OPENID }).limit(1).get()
        const space = spaceRes.data[0]
        if (!space) return { code: 0, data: true }
        await db.collection('spaces').doc(space._id).remove()
        return { code: 0, data: true }
      }
      default:
        return { code: 400, message: `unknown action: ${action}` }
    }
  } catch (error) {
    return { code: 500, message: error.message }
  }
}
