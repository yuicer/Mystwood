# 亲密空间小程序 MVP 方案

## 1. 目标与边界

- **平台优先级**：先上线微信小程序；当前仓库维护的是微信小程序工程与云函数。
- **关系模型**：一个用户只能拥有/加入 **1 个空间**。
- **解绑策略**：解绑后历史数据不保留（按产品要求，直接清空或不可恢复）。

## 2. 核心业务对象

### 2.1 空间（Space）
- 双人关系容器。
- 创建人发起后，通过邀请链接拉另一人同意。
- 同意后空间激活，之后默认进入该空间。

### 2.2 类（Category）
- 在空间内定义一类共同事项（如运动、学习、早睡）。
- 类必须两人都同意后生效。
- 类中包含规则模板（简版 MVP 先支持固定加减分）。

### 2.3 任务（Task）
- 由单人基于类发起的执行实例。
- 包含任务细节：时间、地点、持续时长、参与人、备注、图片。
- 完成后自动结算积分，归档为回忆。

## 3. 已确认规则（来自本轮讨论）

1. 每个用户只能有一个空间。
2. 解绑后历史不保留。
3. 规则后续支持复杂条件，MVP 先做简单规则。
4. 图片凭证可选；定位默认尝试获取，也可不填。
5. 任务完成不需要另一方确认，但另一方可查看。
6. 扣分为自动扣分。
7. 亲密度是隐藏分，不直接展示数值；通过背景色/背景图变化体现。
8. 需要提醒能力（小程序订阅消息 + App 推送预留）。

## 4. 流程设计（MVP）

### 4.1 首次进入
1. 用户进入首页，无空间。
2. 引导创建空间。
3. 生成邀请链接。
4. 被邀请方确认加入。
5. 双方绑定完成，进入空间主页。

### 4.2 创建类（双人同意）
1. A 创建类草稿（名称、说明、基础规则）。
2. 系统给 B 发送“类同意请求”。
3. B 同意后类生效；拒绝则类作废。

### 4.3 创建与完成任务（单人可发起）
1. A 在某个类下创建任务（时间、地点、是否双人、备注、图片可选）。
2. 按状态推进：待执行 -> 进行中 -> 已完成 / 已逾期。
3. 系统自动结算：
   - 完成：按规则加分。
   - 逾期未完成：按规则自动扣分。

### 4.4 回忆归档
- 已完成任务自动进入“回忆时间线”。
- 可按日期、类筛选。

## 5. 隐藏亲密度引擎（MVP 简版）

- 维护一个内部 `intimacy_score`（不展示数字）。
- 输入因子：
  - 最近 7/30 天任务创建与完成数量。
  - 完成率与逾期率。
  - 连续完成天数。
- 输出表现：
  - 低分：偏冷色背景。
  - 中分：暖色渐变。
  - 高分：高亮背景图（更亲密视觉主题）。

> 具体阈值可在运营配置中调参，例如：
> - `score < 40` 冷色
> - `40~79` 暖色
> - `>= 80` 高亲密主题

## 6. 数据模型（建议）

### `users`
- `id`
- `platform_open_id`
- `nickname`
- `avatar`
- `created_at`

### `spaces`
- `id`
- `owner_user_id`
- `partner_user_id`
- `status`（pending/active/dissolved）
- `intimacy_score`
- `created_at`
- `updated_at`

### `space_invites`
- `id`
- `space_id`
- `inviter_user_id`
- `invitee_user_id`（可空，未定向邀请）
- `token`
- `status`（pending/accepted/rejected/expired）
- `expired_at`

### `categories`
- `id`
- `space_id`
- `name`
- `description`
- `status`（pending/active/rejected）
- `created_by`
- `approved_by`
- `created_at`

### `category_rules`
- `id`
- `category_id`
- `complete_score_delta_user_a`
- `complete_score_delta_user_b`
- `overdue_score_delta_user_a`
- `overdue_score_delta_user_b`
- `auto_overdue_enabled`

### `tasks`
- `id`
- `space_id`
- `category_id`
- `creator_user_id`
- `title`
- `description`
- `start_time`
- `deadline`
- `duration_minutes`
- `location_lat`
- `location_lng`
- `location_name`
- `participants_type`（single/both）
- `status`（todo/doing/completed/overdue/archived）
- `completed_at`

### `task_evidences`
- `id`
- `task_id`
- `image_url`
- `note`

### `score_ledger`
- `id`
- `space_id`
- `task_id`
- `trigger_type`（complete/overdue/manual_adjust）
- `delta_user_a`
- `delta_user_b`
- `created_at`

## 7. 接口草案（MVP）

- `POST /auth/login`
- `POST /spaces`
- `POST /spaces/{id}/invites`
- `POST /invites/{token}/accept`
- `POST /spaces/{id}/dissolve`

- `POST /categories`
- `POST /categories/{id}/approve`
- `POST /categories/{id}/reject`
- `GET /spaces/{id}/categories`

- `POST /tasks`
- `POST /tasks/{id}/complete`
- `GET /spaces/{id}/tasks`
- `GET /spaces/{id}/memories`

- `GET /spaces/{id}/theme`（返回当前 UI 主题态）

## 8. 页面结构

1. `pages/index/index`：空间主页（主题背景 + 今日任务）
2. `pages/space/create`：创建空间
3. `pages/space/invite`：邀请与同意
4. `pages/category/list`：类列表
5. `pages/category/create`：创建类（待同意）
6. `pages/task/create`：创建任务
7. `pages/task/detail`：任务详情/完成
8. `pages/memory/list`：回忆归档
9. `pages/me/settings`：解绑、通知设置

## 9. 通知策略

- 小程序：订阅消息（类同意请求、任务即将逾期、任务自动扣分结果）。
- App 预留：统一走消息中心 + 推送服务抽象层。

## 10. 里程碑

- **M1**：登录 + 空间创建/邀请/同意
- **M2**：类创建与双人同意 + 基础规则
- **M3**：任务创建/完成/自动逾期扣分
- **M4**：回忆归档 + 隐藏亲密度主题映射
- **M5**：通知系统接入 + 体验优化

## 11. 讨论后建议优先实现顺序

1. 先把“空间 + 邀请 + 同意”跑通（否则后面都不能验证）
2. 再做“类双人同意 + 简单规则”
3. 最后做“任务自动结算 + 主题表现 + 提醒”
