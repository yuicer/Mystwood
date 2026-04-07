const KEY = 'mystwood_store_v2'

const defaultState = {
  me: { id: 'u1', nickname: '我' },
  partner: { id: 'u2', nickname: 'TA' },
  space: null,
  categories: [],
  tasks: [],
  memories: [],
  score: 50
}

function read() {
  const raw = uni.getStorageSync(KEY)
  return raw || { ...defaultState }
}

function write(state) {
  uni.setStorageSync(KEY, state)
}

function recomputeScore(state) {
  const total = state.tasks.length
  const completed = state.tasks.filter(t => t.status === 'completed').length
  const overdue = state.tasks.filter(t => t.status === 'overdue').length
  const base = 50 + completed * 5 - overdue * 6 + Math.min(total, 20)
  state.score = Math.max(0, Math.min(100, base))
}

function settleTasks(state) {
  const now = Date.now()
  let changed = false
  state.tasks = state.tasks.map(task => {
    if (task.status === 'todo' && task.deadline && now > task.deadline) {
      changed = true
      return { ...task, status: 'overdue', settled: true }
    }
    return task
  })
  if (changed) {
    state.memories = state.tasks
      .filter(t => t.status === 'completed' || t.status === 'overdue')
      .sort((a, b) => b.createdAt - a.createdAt)
  }
}

async function getState() {
  const state = read()
  settleTasks(state)
  recomputeScore(state)
  write(state)
  return state
}

async function createSpace(name) {
  const state = await getState()
  state.space = {
    id: `s_${Date.now()}`,
    name,
    status: 'pending',
    inviteToken: Math.random().toString(36).slice(2, 10)
  }
  write(state)
  return state.space
}

async function acceptInvite() {
  const state = await getState()
  if (state.space) state.space.status = 'active'
  write(state)
}

async function createCategory(payload) {
  const state = await getState()
  const category = {
    id: `c_${Date.now()}`,
    status: 'pending',
    ...payload,
    createdAt: Date.now()
  }
  state.categories.unshift(category)
  write(state)
}

async function approveCategory(id, approved) {
  const state = await getState()
  state.categories = state.categories.map(c => {
    if (c.id !== id) return c
    return { ...c, status: approved ? 'active' : 'rejected' }
  })
  write(state)
}

async function createTask(payload) {
  const state = await getState()
  const task = {
    id: `t_${Date.now()}`,
    status: 'todo',
    createdAt: Date.now(),
    ...payload
  }
  state.tasks.unshift(task)
  write(state)
}

async function completeTask(id) {
  const state = await getState()
  state.tasks = state.tasks.map(t => (t.id === id ? { ...t, status: 'completed', completedAt: Date.now() } : t))
  state.memories = state.tasks
    .filter(t => t.status === 'completed' || t.status === 'overdue')
    .sort((a, b) => b.createdAt - a.createdAt)
  write(state)
}

async function dissolveSpace() {
  uni.removeStorageSync(KEY)
}

export default {
  getState,
  createSpace,
  acceptInvite,
  createCategory,
  approveCategory,
  createTask,
  completeTask,
  dissolveSpace
}
