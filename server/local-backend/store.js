const db = {
  space: null,
  categories: [],
  tasks: []
}

function resetStore() {
  db.space = null
  db.categories = []
  db.tasks = []
}

module.exports = {
  db,
  resetStore
}
