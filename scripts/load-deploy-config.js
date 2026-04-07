const fs = require('fs')
const path = require('path')

function parseEnv(content) {
  const result = {}
  const lines = content.split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx <= 0) continue
    const key = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    result[key] = value
  }
  return result
}

function loadDeployConfig() {
  const candidates = [
    path.resolve(process.cwd(), 'config/deploy.env'),
    path.resolve(process.cwd(), 'config/deploy.env.example')
  ]

  for (const file of candidates) {
    if (fs.existsSync(file)) {
      const parsed = parseEnv(fs.readFileSync(file, 'utf8'))
      return { file, ...parsed }
    }
  }

  throw new Error('未找到 deploy 配置文件，请创建 config/deploy.env')
}

module.exports = {
  loadDeployConfig
}
