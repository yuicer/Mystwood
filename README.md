# Mystwood - 亲密空间（uni-app + 微信原生云函数架构）

这是一个基于 `uni-app` 的 MVP 原型，支持双人亲密空间核心流程：

- 创建空间并邀请对方同意
- 创建“共同事项类”（需对方同意）
- 单人创建任务并自动逾期扣分
- 完成任务后进入回忆归档
- 通过隐藏亲密度分数映射不同背景主题

## 当前架构

项目已迁移为 **uni-app + 微信原生云函数（wx.cloud）适配层**：

- 前端页面：`pages/*`
- 服务抽象层：`common/services/index.js`
- Mock 适配器：`common/services/adapters/mockAdapter.js`
- 本地 API 适配器：`common/services/adapters/localApiAdapter.js`
- 微信云函数适配器：`common/services/adapters/wxCloudAdapter.js`
- 运行配置：`common/config/runtime.js`
- 微信云函数代码：`cloudfunctions/*`

> 默认规则：开发环境走 `local-api`，生产构建走 `wx-cloud`。也可以用环境变量覆盖。

项目已提供默认环境文件：

- `.env.development`：本地开发默认走 `local-api`
- `.env.production`：生产构建默认走 `wx-cloud`
- `.env.*.local`：适合放个人机器上的覆盖配置，不入库

## 切换数据源

当前支持的 provider：

- `provider: 'mock'`：本地 `uni.setStorageSync` 模拟
- `provider: 'local-api'`：走本地 Node API（http://127.0.0.1:9000）
- `provider: 'wx-cloud'`：走微信原生云函数 `wx.cloud.callFunction`

环境变量：

```bash
VITE_SERVICE_PROVIDER=local-api
VITE_SERVICE_PROVIDER=wx-cloud
VITE_SERVICE_PROVIDER=mock
VITE_LOCAL_API_BASE_URL=http://127.0.0.1:9000
VITE_WECHAT_CLOUD_ENV=your-cloud-env-id
```

默认行为：

- `npm run dev:h5` / `npm run dev:mp-weixin`：默认 `local-api`
- `npm run build:h5` / `npm run build:mp-weixin`：默认 `wx-cloud`
- `npm run dev:all`：会显式以 `local-api` 启动前端，并同时启动本地后端

如果你要显式覆盖，可以这样启动：

```bash
VITE_SERVICE_PROVIDER=mock npm run dev:h5
VITE_SERVICE_PROVIDER=wx-cloud npm run build:mp-weixin
VITE_LOCAL_API_BASE_URL=http://192.168.1.10:9000 npm run dev:mp-weixin
VITE_WECHAT_CLOUD_ENV=prod-xxx npm run dev:mp-weixin
```

适合真机联调的本地覆盖文件示例：

```bash
# .env.development.local
VITE_LOCAL_API_BASE_URL=http://192.168.1.10:9000
```

## 开发命令

```bash
npm run dev:h5
npm run dev:mp-weixin
npm run build:h5
npm run build:mp-weixin
```

当前 H5 开发入口：

- 前端页面：`http://localhost:5173/`
- 本地后端健康检查：`http://localhost:9000/health`

## 开发环境要求

- Node.js：建议 `20.x`
- 最低版本：`>= 18.12.0`

仓库已包含 `.nvmrc`，如使用 `nvm` 可直接执行：

```bash
nvm use
```

## 本地一键同时启动前后端

现在支持一条命令同时拉起：

```bash
npm run dev:all
```

默认启动内容：

- 前端开发：`npm run dev:h5`（uni-app H5 dev）
- 本地后端：`npm run dev:backend`（http://localhost:9000）

说明：

- 项目当前采用根目录结构，`manifest.json`、`pages.json`、`main.js`、`App.vue` 不在 `src/` 下。
- 因此启动脚本已内置 `UNI_INPUT_DIR=.`，不要再改回默认 `uni` 命令，否则 H5 启动时会错误查找 `src/manifest.json`。

后端健康检查：

```bash
curl http://localhost:9000/health
```

可用的本地 API（用于本地联调）：

- `GET /api/state`
- `POST /api/spaces`
- `POST /api/spaces/accept`
- `POST /api/categories`
- `POST /api/categories/approve`
- `POST /api/tasks`
- `POST /api/tasks/complete`
- `POST /api/reset`

如果需要切换联调模式，优先使用 `VITE_SERVICE_PROVIDER`，不要再手改 `common/config/runtime.js`。

本地 backend 已按入口、路由、状态计算拆到 `server/local-backend/*`，后续继续加接口时直接在对应模块扩展即可。

## 微信云函数部署说明

`cloudfunctions/*` 目录为微信云函数代码，请在微信开发者工具中：

1. 开启云开发并选择环境。
2. 对每个函数目录执行“上传并部署：云端安装依赖”。
3. 配置 `VITE_WECHAT_CLOUD_ENV`，应用启动时会自动执行 `wx.cloud.init(...)`。
4. 确保运行 provider 为 `wx-cloud`；生产构建默认就是这个值。

> 正式线上推荐使用 `wx-cloud`，本地联调可用 `local-api`。

## 命令行部署（集中 key/token 配置）

所有部署所需 key/token 统一放在一个文件：

- `config/deploy.env`（请由 `config/deploy.env.example` 复制生成）

新增部署命令：

```bash
npm run deploy:cloud   # 部署微信云函数
npm run deploy:mini    # 上传微信小程序代码
npm run deploy:all     # 先部署云函数，再上传代码
```

关键字段说明（都在同一个 deploy.env 文件里）：

- `WECHAT_APPID`
- `WECHAT_PRIVATE_KEY_PATH`
- `WECHAT_CI_ROBOT`
- `WECHAT_VERSION`
- `WECHAT_UPLOAD_DESC`
- `WECHAT_CLOUD_ENV`
- `WECHAT_CLOUD_FUNCTIONS_ROOT`
- `WECHAT_CLOUD_FUNCTION_NAMES`

## H5 打包与 GitHub Pages 部署

新增命令：

```bash
npm run build:h5:static   # 将 preview-app 打包到 dist/h5
npm run deploy:h5         # 推送 dist/h5 到 origin/gh-pages
```

说明：

- `build:h5:static` 会读取 `config/deploy.env` 中 `WEBSITE_DOMAIN` 字段，若存在则自动写入 `dist/h5/CNAME`。
- `deploy:h5` 依赖仓库已配置 `origin` 远端，并且当前账号有 push 权限。
