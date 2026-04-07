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

> 默认 provider 为 `mock`，用于离线开发和演示。

## 切换数据源

在 `common/config/runtime.js` 中配置：

- `provider: 'mock'`：本地 `uni.setStorageSync` 模拟
- `provider: 'local-api'`：走本地 Node API（http://127.0.0.1:9000）
- `provider: 'wx-cloud'`：走微信原生云函数 `wx.cloud.callFunction`

## 开发命令

```bash
npm run dev:h5
npm run dev:mp-weixin
npm run build:h5
npm run build:mp-weixin
```

## 本地一键同时启动前后端

现在支持一条命令同时拉起：

```bash
npm run dev:all
```

默认启动内容：

- 前端开发：`npm run dev:h5`（uni-app H5 dev）
- 本地后端：`npm run dev:backend`（http://localhost:9000）

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

## 微信云函数部署说明

`cloudfunctions/*` 目录为微信云函数代码，请在微信开发者工具中：

1. 开启云开发并选择环境。
2. 对每个函数目录执行“上传并部署：云端安装依赖”。
3. 在小程序端初始化 `wx.cloud.init({ env: '你的环境ID' })`。
4. 将运行 provider 切到 `wx-cloud`。

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
