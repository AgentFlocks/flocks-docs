# 审计日志

审计日志是 Flocks Pro 功能，用于记录和查询系统关键操作。它帮助管理员追踪谁在什么时间做了什么操作、影响了什么资源、结果是否成功。

## 1. 功能定位

审计日志回答的是"**平台内的重要操作如何追溯**"。在 Pro 版中，账号管理、License 操作、登录登出、会话创建删除、工具调用、模型调用和部分 HTTP / Session 生命周期事件会写入审计记录。

审计日志适合：

- 安全审计。
- 管理员操作追踪。
- 问题排查。
- 合规留痕。
- 账号和授权变更复盘。

## 2. 权限与版本

审计日志仅 Flocks Pro 支持，并且通常只有管理员可以查看。

如果当前环境不是 Pro，或 Pro 功能未启用，页面会提示当前版本不支持审计日志。

## 3. 页面能力

审计日志页面支持：

- 查看审计事件列表。
- 按事件类型筛选。
- 按操作者用户名筛选。
- 按操作者 ID 或用户 ID 筛选。
- 按资源类型筛选。
- 按结果筛选，例如成功或失败。
- 按开始时间和结束时间筛选。
- 分页查看。
- 展开查看 payload / metadata 详情。
- 下载 Excel。

表格字段通常包括：

| 字段 | 说明 |
| --- | --- |
| 时间 | 事件发生时间。 |
| 事件 | `event_type`，例如 `account.user.create` 或 `license.activate`。 |
| 操作者 | 用户名、用户 ID 或 actor 信息。 |
| 资源 | 被操作的资源类型和资源 ID。 |
| Session | 关联的 `session_id`，适合追溯某次会话、IM 会话或子 Agent 执行。 |
| Provider / Model | 模型调用事件中记录模型 Provider 和模型 ID。 |
| Tokens / 成本 | 模型调用事件中记录 token 用量和预估成本。 |
| 结果 | 成功或失败。 |
| 详情 | payload 或 metadata。 |

## 4. 常见事件

### 4.1 账号登录事件

账号登录、退出和失败登录会写入审计：

| 事件类型 | 说明 | 典型资源 |
| --- | --- | --- |
| `account.login` | 用户登录成功。 | 登录 Session。 |
| `account.login_failed` | 用户登录失败，payload 中通常包含用户名、失败原因和来源 IP。 | 登录尝试。 |
| `account.logout` | 用户退出登录。 | 登录 Session。 |

这些事件适合排查账号异常登录、密码错误重试、某个账号何时开始操作平台等问题。

### 4.2 账号管理事件

账号管理相关事件包括：

| 事件类型 | 说明 | 典型 payload |
| --- | --- | --- |
| `account.user.create` | 管理员创建用户。 | `target_user_id`、`target_role`。 |
| `account.user.update_role` | 管理员修改用户角色。 | `target_user_id`、`new_role`。 |
| `account.user.delete` | 管理员删除用户。 | `target_user_id`。 |
| `account.user.reset_password` | 管理员重置用户密码。 | `target_user_id`、`force_reset`。 |

需要注意：管理员不能删除当前登录的管理员账号；这类被拒绝的操作通常以接口错误返回，不一定会形成成功审计记录。

### 4.3 License 事件

Flocks Pro 授权相关事件包括：

| 事件类型 | 说明 | 典型 payload |
| --- | --- | --- |
| `license.activate` | 激活 License。 | `license_id`、`status`。 |
| `license.refresh` | 刷新或同步 License。 | `license_id`、`active_patch_serial`。 |
| `license.deactivate` | 取消本地 License 激活。 | 通常为空或包含授权状态。 |
| `license.import_revocation` | 导入吊销列表。 | 导入数量 `count`。 |

这些事件适合排查 Pro 授权何时激活、是否刷新成功、是否导入了吊销信息。

### 4.4 会话事件

会话相关事件来自 Flocks 核心审计桥接：

| 事件类型 | 说明 | 典型 payload |
| --- | --- | --- |
| `session_action` | 会话动作事件，会被映射为 `session.<action>` 类别和动作。 | `project_id`。 |
| `session.create` | 通过生命周期 hook 记录的会话创建类事件。 | Session ID。 |
| `session.delete` | 通过生命周期 hook 记录的会话删除类事件。 | Session ID。 |
| 其他 `session.*` | 其他以 `session.` 开头的生命周期事件。 | Session ID 或事件属性。 |

在会话创建和删除的接口路径中，Flocks 会发出 `session_action`，其中 `action` 可能是 `create` 或 `delete`。Pro 审计桥接会把它归类到 `session`，资源类型为 `session`，资源 ID 通常是 `session_id`。

### 4.5 工具调用事件

工具调用由 Pro 生命周期 hook 记录：

| 事件类型 | 说明 | 典型字段 |
| --- | --- | --- |
| `tool_call.execute` | 某个工具执行完成。 | `resource_type=tool`、`resource_id=工具名`、`session_id`、执行结果。 |

为避免审计日志泄露敏感数据，工具调用审计不会保存完整工具输入和输出。payload 中通常只包含 Agent、工具调用 ID、结果标题等摘要信息。

这类事件适合回答：

- 某个 Session 里调用过哪些工具。
- 某个工具是否频繁失败。
- 某个 Agent 是否触发了高风险工具。

### 4.6 模型调用事件

模型调用由 Pro 生命周期 hook 记录：

| 事件类型 | 说明 | 典型字段 |
| --- | --- | --- |
| `llm_api_call.after` | 一次模型调用结束后的审计事件。 | `provider`、`model`、`tokens`、`estimated_cost`、`session_id`。 |

payload 中通常包含 Agent、执行 step、耗时、finish reason、工具调用数量等摘要。它不会保存完整 Prompt 或模型输出。

这类事件适合统计模型使用情况、排查某个模型是否频繁失败、估算 Token 用量和成本。

### 4.7 HTTP 请求事件

Flocks 核心审计桥接会把部分 HTTP 请求事件写入 Pro 审计：

| 事件类型 | 说明 | 典型字段 |
| --- | --- | --- |
| `http_request` | 被核心审计捕获的 HTTP 请求。 | method、path、status、duration_ms。 |

HTTP 状态码大于等于 400 时，审计结果会标记为失败。资源类型通常是 `http`，资源 ID 通常是请求路径。

### 4.8 被抑制的事件

Pro 审计 sink 会抑制 `api_call.request`，默认不写入审计列表。这样可以避免大量底层 API 请求噪声影响管理员查看关键操作。

## 5. 审计字段和存储

### 5.1 审计事件字段

审计事件统一包含这些核心字段：

| 字段 | 说明 |
| --- | --- |
| `event_type` | 事件类型，例如 `account.login`、`tool_call.execute`。 |
| `category` / `action` | 事件类别和动作，通常由 `event_type` 拆分。 |
| `status` / `result` | 状态和结果。`result` 通常是 `success` 或 `failed`。 |
| `user_id` / `user_name` | 事件关联用户。 |
| `actor_id` / `actor_name` | 实际操作者。 |
| `resource_type` / `resource_id` | 被操作资源类型和资源 ID。 |
| `session_id` | 关联 Session。 |
| `ip` / `trace_id` | 来源 IP 和链路追踪 ID。 |
| `provider` / `model` | 模型调用关联的 Provider 和模型。 |
| `tokens` / `estimated_cost` | 模型调用 token 用量和预估成本。 |
| `payload` / `metadata` | 事件摘要详情。 |
| `created_at` | 事件写入时间。 |

### 5.2 存储和外发

Pro 审计默认写入本地 SQLite 的 `audit_events_v1` 表。系统会为时间、操作者、事件类型、用户 ID 和资源类型建立索引，便于按条件查询。

如果配置了 `FLOCKSPRO_AUDIT_WEBHOOK`，审计事件也会异步发送到 webhook，便于对接外部 SIEM、日志平台或合规系统。Webhook 失败不会阻塞平台主流程。

## 6. 使用方法

### 6.1 查询事件

进入 **系统中心 → 审计日志**，选择筛选条件后点击查询。常见排查方式：

- 按用户名查某个管理员近期操作。
- 按事件类型查账号变更或授权变更。
- 按资源类型查 `user`、`license`、`session`、`tool` 或 `http`。
- 按 Session ID 追踪某次会话的工具和模型调用。
- 按时间范围查某次异常前后的操作。
- 按结果查失败事件。

### 6.2 导出日志

点击下载 Excel 可导出当前查询结果。导出适合交付审计、问题复盘或合规留档。

### 6.3 查看详情

展开某一行可以查看 payload 或 metadata。这里通常包含目标用户、License ID、资源 ID、变更后的角色、工具调用摘要、模型调用摘要等细节。

## 7. 常见问题

### 7.1 为什么看不到审计日志入口？

可能原因：

- 当前不是 Pro 版。
- Pro 功能未启用。
- 当前用户不是管理员。

普通用户看不到审计日志导航；普通用户在账号管理页也只能看到自己的账号。

### 7.2 审计日志保存在哪里？

Pro 审计服务默认使用本地 SQLite sink 存储审计事件，并提供查询接口。具体部署中也可以通过 webhook 扩展到外部审计系统。

### 7.3 审计日志会保存 Prompt、工具输入输出或敏感内容吗？

审计日志偏向操作摘要，不是完整业务回放。工具调用和模型调用事件默认不会保存完整工具输入、完整工具输出、完整 Prompt 或完整模型输出，避免把敏感数据写入审计表。

如果需要保存完整业务结果，应让 Agent 或 Workflow 把报告写入 [Workspace](/md/modules/workspace)，并按项目权限管理。

### 7.4 审计日志能代替业务报告吗？

不能。审计日志记录系统操作，不等同于告警研判报告、巡检报告或 Workflow 运行报告。业务产物仍应写入 [Workspace](/md/modules/workspace)。

### 7.5 为什么列表里看不到所有 API 请求？

审计日志关注关键操作和安全事件。底层 `api_call.request` 默认被抑制，不进入审计列表，以减少噪声。需要 HTTP 入口层面的追踪时，应结合服务访问日志、后端日志和审计日志一起看。

## 8. 相关模块

- [账号管理](/md/modules/accounts)：账号操作会写入审计。
- [Flocks Pro](/md/modules/flocks-pro)：License 操作会写入审计。
- [Workspace](/md/modules/workspace)：业务产物和报告存放位置。
- [任务中心](/md/modules/tasks)：排查长期任务时，可结合任务执行记录、Workspace 产物和审计日志。
- [工具清单](/md/modules/tools)：工具调用会记录摘要审计事件。
- [模型清单](/md/llm_models)：模型调用事件会记录 Provider、模型、Token 和预估成本。
