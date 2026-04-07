const { URL } = require('url')
const { json, parseBody } = require('./http')
const { getState } = require('./state')
const { db, resetStore } = require('./store')

async function routeRequest(req, res, baseUrl) {
  if (req.method === 'OPTIONS') return json(res, 204, {})

  const url = new URL(req.url, baseUrl)
  const path = url.pathname

  if (req.method === 'GET' && path === '/health') {
    return json(res, 200, { ok: true, mode: 'local-backend' })
  }

  if (req.method === 'GET' && path === '/api/state') {
    return json(res, 200, { code: 0, data: getState() })
  }

  if (req.method === 'POST' && path === '/api/spaces') {
    const body = await parseBody(req)
    db.space = {
      id: `s_${Date.now()}`,
      name: body.name || '我们的小宇宙',
      status: 'pending',
      inviteToken: Math.random().toString(36).slice(2, 10)
    }
    return json(res, 200, { code: 0, data: db.space })
  }

  if (req.method === 'POST' && path === '/api/spaces/accept') {
    if (db.space) db.space.status = 'active'
    return json(res, 200, { code: 0, data: db.space })
  }

  if (req.method === 'POST' && path === '/api/categories') {
    const body = await parseBody(req)
    const category = {
      id: `c_${Date.now()}`,
      name: body.name || '运动',
      rule: body.rule || '完成+10，逾期-5',
      status: 'pending',
      createdAt: Date.now()
    }
    db.categories.unshift(category)
    return json(res, 200, { code: 0, data: category })
  }

  if (req.method === 'POST' && path === '/api/categories/approve') {
    const body = await parseBody(req)
    db.categories = db.categories.map(category =>
      category.id === body.id ? { ...category, status: body.approved ? 'active' : 'rejected' } : category
    )
    return json(res, 200, { code: 0, data: true })
  }

  if (req.method === 'POST' && path === '/api/tasks') {
    const body = await parseBody(req)
    const task = {
      id: `t_${Date.now()}`,
      title: body.title || '新任务',
      categoryId: body.categoryId,
      categoryName: body.categoryName,
      deadline: body.deadline || null,
      status: 'todo',
      createdAt: Date.now()
    }
    db.tasks.unshift(task)
    return json(res, 200, { code: 0, data: task })
  }

  if (req.method === 'POST' && path === '/api/tasks/complete') {
    const body = await parseBody(req)
    db.tasks = db.tasks.map(task =>
      task.id === body.id ? { ...task, status: 'completed', completedAt: Date.now() } : task
    )
    return json(res, 200, { code: 0, data: true })
  }

  if (req.method === 'POST' && path === '/api/reset') {
    resetStore()
    return json(res, 200, { code: 0, data: true })
  }

  return json(res, 404, { code: 404, message: 'Not Found' })
}

module.exports = {
  routeRequest
}
