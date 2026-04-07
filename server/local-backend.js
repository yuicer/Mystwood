const http = require('http')
const { routeRequest } = require('./local-backend/router')

const PORT = Number(process.env.PORT || 9000)
const HOST = process.env.HOST || '127.0.0.1'

const server = http.createServer(async (req, res) => {
  return routeRequest(req, res, `http://${HOST}:${PORT}`)
})

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[local-backend] port ${PORT} is already in use`)
  } else {
    console.error('[local-backend] failed to start:', err)
  }
  process.exit(1)
})

server.listen(PORT, HOST, () => {
  console.log(`[local-backend] listening on http://${HOST}:${PORT}`)
})
