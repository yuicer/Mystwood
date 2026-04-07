const path = require('path')
const { loadDeployConfig } = require('./load-deploy-config')

async function main() {
  const cfg = loadDeployConfig()

  let ci
  try {
    ci = require('miniprogram-ci')
  } catch (error) {
    console.error('缺少 miniprogram-ci，请先安装：npm i -D miniprogram-ci')
    process.exit(1)
  }

  const project = new ci.Project({
    appid: cfg.WECHAT_APPID,
    type: 'miniProgram',
    projectPath: path.resolve(process.cwd(), cfg.WECHAT_PROJECT_PATH),
    privateKeyPath: path.resolve(process.cwd(), cfg.WECHAT_PRIVATE_KEY_PATH),
    ignores: ['node_modules/**/*']
  })

  const result = await ci.upload({
    project,
    version: cfg.WECHAT_VERSION || '0.0.1',
    desc: cfg.WECHAT_UPLOAD_DESC || 'ci upload',
    robot: Number(cfg.WECHAT_CI_ROBOT || 1),
    setting: {
      es6: true,
      minifyJS: true,
      minifyWXML: true,
      minifyWXSS: true,
      autoPrefixWXSS: true
    }
  })

  console.log('[deploy-mini] done:', result?.subPackageInfo || 'ok')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
