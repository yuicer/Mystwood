const { db } = require('./store')

function settleTasks() {
  const now = Date.now()
  db.tasks = db.tasks.map(task => {
    if (task.status === 'todo' && task.deadline && now > task.deadline) {
      return { ...task, status: 'overdue' }
    }
    return task
  })
}

function getMemories() {
  return db.tasks
    .filter(task => task.status === 'completed' || task.status === 'overdue')
    .sort((a, b) => b.createdAt - a.createdAt)
}

function getScore() {
  const total = db.tasks.length
  const completed = db.tasks.filter(task => task.status === 'completed').length
  const overdue = db.tasks.filter(task => task.status === 'overdue').length
  const base = 50 + completed * 5 - overdue * 6 + Math.min(total, 20)
  return Math.max(0, Math.min(100, base))
}

function getState() {
  settleTasks()
  return {
    space: db.space,
    categories: db.categories,
    tasks: db.tasks,
    memories: getMemories(),
    score: getScore()
  }
}

module.exports = {
  getState
}
