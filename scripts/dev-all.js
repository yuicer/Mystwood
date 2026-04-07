const { spawn } = require('child_process')

const defaultFrontCmd = 'VITE_SERVICE_PROVIDER=local-api npm run dev:h5'
const frontCmd = process.env.FRONTEND_CMD || defaultFrontCmd
const backCmd = process.env.BACKEND_CMD || 'npm run dev:backend'

function run(command, name) {
  const child = spawn(command, {
    shell: true,
    stdio: 'inherit'
  })

  child.on('exit', code => {
    if (code !== 0) {
      console.error(`[${name}] exited with code ${code}`)
    }
  })

  return child
}

const front = run(frontCmd, 'frontend')
const back = run(backCmd, 'backend')

function cleanup() {
  front.kill('SIGINT')
  back.kill('SIGINT')
  process.exit(0)
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

console.log('[dev-all] frontend + backend started')
