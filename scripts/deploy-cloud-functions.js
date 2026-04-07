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

  const names = (cfg.WECHAT_CLOUD_FUNCTION_NAMES || '')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean)

  if (!names.length) {
    throw new Error('WECHAT_CLOUD_FUNCTION_NAMES 不能为空')
  }

  const cloudRoot = path.resolve(process.cwd(), cfg.WECHAT_CLOUD_FUNCTIONS_ROOT)

  for (const functionName of names) {
    console.log(`[deploy-cloud] deploying ${functionName} ...`)

    if (ci.cloud?.uploadFunction) {
      await ci.cloud.uploadFunction({
        project,
        env: cfg.WECHAT_CLOUD_ENV,
        functionRoot: cloudRoot,
        functionName
      })
    } else if (ci.cloud?.uploadCloudFunction) {
      await ci.cloud.uploadCloudFunction({
        project,
        env: cfg.WECHAT_CLOUD_ENV,
        functionRoot: cloudRoot,
        functionName
      })
    } else {
      throw new Error('当前 miniprogram-ci 版本不支持云函数上传接口')
    }
  }

  console.log('[deploy-cloud] done')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
