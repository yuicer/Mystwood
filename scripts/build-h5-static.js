const fs = require('fs')
const path = require('path')
const { loadDeployConfig } = require('./load-deploy-config')

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name)
    const d = path.join(dest, entry.name)
    if (entry.isDirectory()) copyDir(s, d)
    else fs.copyFileSync(s, d)
  }
}

function rmrf(target) {
  if (!fs.existsSync(target)) return
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const p = path.join(target, entry.name)
    if (entry.isDirectory()) rmrf(p)
    else fs.unlinkSync(p)
  }
  fs.rmdirSync(target)
}

function main() {
  const root = process.cwd()
  const src = path.resolve(root, 'preview-app')
  const out = path.resolve(root, 'dist/h5')

  if (!fs.existsSync(src)) throw new Error('preview-app 目录不存在，无法执行静态 H5 打包')

  rmrf(out)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  copyDir(src, out)

  let domain = process.env.DEPLOY_DOMAIN || ''
  try {
    const cfg = loadDeployConfig()
    domain = domain || cfg.WEBSITE_DOMAIN || ''
  } catch (_) {
    // ignore
  }
  if (domain) {
    fs.writeFileSync(path.join(out, 'CNAME'), `${domain}\n`)
    console.log(`[build-h5-static] wrote CNAME => ${domain}`)
  }

  console.log(`[build-h5-static] done => ${out}`)
}

main()
