# Mystwood - 亲密空间（微信小程序 + 微信云函数）

这是一个基于 `uni-app`（仅微信小程序目标）的 MVP 原型，核心能力全部通过 `wx.cloud.callFunction` 对接微信云函数。

## 当前架构

- 小程序页面：`pages/*`
- 服务层：`common/services/index.js`
- 微信云函数适配：`common/services/adapters/wxCloudAdapter.js`
- 运行配置：`common/config/runtime.js`
- 云函数代码：`cloudfunctions/*`

> 项目已切换为微信小程序优先架构：移除了本地 API 联调路径，开发和部署统一围绕微信开发者工具与云函数。

## 环境变量

```bash
VITE_SERVICE_PROVIDER=wx-cloud
VITE_WECHAT_CLOUD_ENV=your-cloud-env-id
```

## 开发命令

```bash
npm run dev:mp-weixin
npm run build:mp-weixin
npm run deploy:cloud
npm run deploy:mini
npm run deploy:all
```

## 微信云函数部署

1. 在微信开发者工具中开启云开发并选择环境。
2. 对 `cloudfunctions/*` 执行“上传并部署：云端安装依赖”。
3. 配置 `VITE_WECHAT_CLOUD_ENV`。
4. 在微信开发者工具中调试与运行小程序。

## 命令行部署配置

部署配置文件：`config/deploy.env`（由 `config/deploy.env.example` 复制）

关键字段：

- `WECHAT_APPID`
- `WECHAT_PRIVATE_KEY_PATH`
- `WECHAT_CI_ROBOT`
- `WECHAT_VERSION`
- `WECHAT_UPLOAD_DESC`
- `WECHAT_CLOUD_ENV`
- `WECHAT_CLOUD_FUNCTIONS_ROOT`
- `WECHAT_CLOUD_FUNCTION_NAMES`
