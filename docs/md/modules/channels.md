# 通道管理

通道管理用于配置 IM 与邮件通道，让 Rex、Agent、Workflow 和任务中心可以在飞书、企业微信、钉钉、Telegram、微信、WhatsApp、邮箱等外部入口接收消息、发送结果和推送通知。

## 1. 功能定位

### 1.1 通道管理解决什么问题

通道管理回答的是"**Flocks 如何进入团队日常协作入口**"。配置通道后，用户可以在 IM 群、私聊或邮件线程中触发 Rex，任务中心也可以把周期任务结果推送到指定群、用户或邮箱。

通道能力包括：

- 启用或停用通道。
- 配置应用凭证或机器人凭证。
- 查看连接状态、运行时间、最近消息、重连次数和错误数。
- 配置默认 Agent、触发方式、用户白名单和高级参数。
- 重启连接、刷新状态、保存并生效。

## 2. 支持的通道

常见通道包括：

| 通道 | 典型接入方式 | 说明 |
| --- | --- | --- |
| 飞书 / Lark | WebSocket 或 Webhook | WebSocket 推荐，无需公网；Webhook 需要公网地址。 |
| 企业微信 | WebSocket 长连接 | 企业微信群聊通常需要 @ 机器人触发。 |
| 钉钉 | Stream 长连接 | 需要在钉钉开放平台创建应用并开启 Stream 模式。 |
| Telegram | Polling 或 Webhook | Polling 无需公网；Webhook 需要公网 URL。 |
| 微信 | iLink Bot 长轮询 | 通过扫码登录获取 Token 和 Account ID。 |
| WhatsApp | Linked Devices 扫码配对 | 使用本地 Baileys bridge 连接 WhatsApp Web，无需公网回调。 |
| 邮件网关 | IMAP 轮询 + SMTP 发信 | 使用专用邮箱收取新邮件并按邮件线程回复，无需公网回调。 |

## 3. 配置流程

### 3.1 选择通道

进入 **Agent 工作室 → 通道管理**，从左侧选择要配置的通道。页面会显示该通道是否启用、是否运行、是否已连接，以及可配置字段。

### 3.2 填写凭证

不同通道需要不同凭证：

- 飞书：App ID、App Secret，Webhook 模式可选 Encrypt Key 和 Verification Token。
- 企业微信：Bot ID、Secret，可选 WebSocket 地址。
- 钉钉：Client ID、Client Secret。
- Telegram：Bot Token，Webhook 模式需要 Webhook Secret。
- 微信：iLink Bot Token、Account ID，可通过扫码登录获取。
- WhatsApp：通过 WebUI 扫码配对获取本地会话凭据。
- 邮件网关：邮箱地址、应用专用密码或授权码、IMAP / SMTP 主机和端口。

### 3.3 配置消息行为

通道通常支持：

- 默认 Agent。
- 群聊触发方式。
- 允许的用户或群。
- 私信策略。
- 群聊上下文消息数。
- 是否开启流式输出。

### 3.4 保存并生效

保存配置后，可以启用通道或重启连接。建议观察连接状态是否变为运行中，并在 IM 里发一条测试消息确认 Rex 是否响应。

## 4. 使用场景

### 4.1 在 IM 群里触发 Rex

配置通道后，可以在群里直接提出任务，例如：

```text
@Rex 帮我看一下这条告警是否需要升级。
```

Rex 会结合通道上下文、默认 Agent 和当前配置处理任务。

### 4.2 推送任务中心结果

任务中心可以把周期任务结果发到指定通道，例如：

```text
每天 08:00 执行设备巡检，结果发到企微值班群。
```

### 4.3 推送 Workflow 运行结果

Workflow 可以在最后节点外发摘要、报告链接或高危事件提醒。适合告警研判、日报、资产变化、设备健康异常等场景。

### 4.4 用 sessionID 固定推送到某个 IM 对话

Flocks 会为外部对话建立会话绑定：一个企业微信、飞书、钉钉、Telegram、WhatsApp 私聊、群聊，邮件线程，或按通道配置隔离出来的群内子会话，都会对应一个 Flocks `sessionID`。后续只要指定这个 `sessionID`，系统就能找到绑定的外部对话，把消息推送回固定位置。

获取目标 `sessionID` 的方式很简单：在目标 IM 对话或邮件线程里问 Rex：

```text
你的 sessionid 是什么？
```

也可以在 IM 对话里发送：

```text
/status
```

Rex 会返回当前 Session、Agent、模型和 IM 对话信息。拿到 `sessionID` 后，可以在另一个会话中发送：

```text
给 sessionid：<sessionID>，发送：本次巡检已完成，异常设备 3 台，详情见报告。
```

这种方式适合多群、多通道和定时任务场景。直接使用 Flocks 的 `sessionID`，更容易跨 WebUI、任务中心、Workflow 和 IM 会话传递。

如果要把任务中心或 Workflow 的结果长期推送到某个 IM 群，建议先在该群里获取 `sessionID`，再把它写入任务描述、Workflow 参数或 Rex 创建任务时的目标说明中。

## 5. 常见问题

### 5.1 WebSocket 和 Webhook 怎么选？

能用 WebSocket 时通常优先 WebSocket，因为不需要公网回调地址。Webhook 适合已经具备公网入口、希望由平台主动推送事件的场景。

### 5.2 群聊为什么没有响应？

优先检查：

- 通道是否启用并运行。
- 群聊是否需要 @ 机器人。
- 用户或群是否在白名单里。
- 默认 Agent 是否配置正确。
- 日志中是否出现连接错误或消息去重。

### 5.3 结果太长怎么办？

可以配置消息分块长度、流式输出、发送速率限制等高级参数。对于长报告，建议让 Rex 把完整报告写入 Workspace，只在通道里发送摘要和文件路径。

## 6. 相关模块

- [任务中心](/md/modules/tasks)：周期任务结果推送。
- [Workflow 工作流](/md/modules/workflow)：流程结果外发。
- [Agent 智能体](/md/modules/agents)：通道消息的默认处理角色。
- [Workspace](/md/modules/workspace)：长报告和产物落盘位置。
- [部署与配置 · 通道配置](/md/communication-channels)：通道配置细节和专项页面。
