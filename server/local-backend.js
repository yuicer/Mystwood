const http = require('http')
const { URL } = require('url')

const PORT = process.env.PORT || 9000

const db = {
  space: null,
  categories: [],
  tasks: []
}

function json(res, code, data) {
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  })
  res.end(JSON.stringify(data))
}

function parseBody(req) {
  return new Promise(resolve => {
    let body = ''
    req.on('data', chunk => (body += chunk))
    req.on('end', () => {
      if (!body) return resolve({})
      try {
        resolve(JSON.parse(body))
      } catch {
        resolve({})
      }
    })
  })
}

function getState() {
  const now = Date.now()
  db.tasks = db.tasks.map(task => {
    if (task.status === 'todo' && task.deadline && now > task.deadline) {
      return { ...task, status: 'overdue' }
    }
    return task
  })
  const memories = db.tasks
    .filter(t => t.status === 'completed' || t.status === 'overdue')
    .sort((a, b) => b.createdAt - a.createdAt)
  return {
    space: db.space,
    categories: db.categories,
    tasks: db.tasks,
    memories
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 204, {})

  const url = new URL(req.url, `http://localhost:${PORT}`)
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
    const row = {
      id: `c_${Date.now()}`,
      name: body.name || '运动',
      rule: body.rule || '完成+10，逾期-5',
      status: 'pending',
      createdAt: Date.now()
    }
    db.categories.unshift(row)
    return json(res, 200, { code: 0, data: row })
  }

  if (req.method === 'POST' && path === '/api/categories/approve') {
    const body = await parseBody(req)
    db.categories = db.categories.map(c => (c.id === body.id ? { ...c, status: body.approved ? 'active' : 'rejected' } : c))
    return json(res, 200, { code: 0, data: true })
  }

  if (req.method === 'POST' && path === '/api/tasks') {
    const body = await parseBody(req)
    const row = {
      id: `t_${Date.now()}`,
      title: body.title || '新任务',
      categoryId: body.categoryId,
      categoryName: body.categoryName,
      deadline: body.deadline || null,
      status: 'todo',
      createdAt: Date.now()
    }
    db.tasks.unshift(row)
    return json(res, 200, { code: 0, data: row })
  }

  if (req.method === 'POST' && path === '/api/tasks/complete') {
    const body = await parseBody(req)
    db.tasks = db.tasks.map(t => (t.id === body.id ? { ...t, status: 'completed', completedAt: Date.now() } : t))
    return json(res, 200, { code: 0, data: true })
  }

  if (req.method === 'POST' && path === '/api/reset') {
    db.space = null
    db.categories = []
    db.tasks = []
    return json(res, 200, { code: 0, data: true })
  }

  return json(res, 404, { code: 404, message: 'Not Found' })
})

server.listen(PORT, () => {
  console.log(`[local-backend] listening on http://localhost:${PORT}`)
})
