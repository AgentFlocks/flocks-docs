# Slack 通道配置

本文介绍如何在 Slack 中创建应用，并在 Flocks 中完成 Slack 通道的连接、权限控制与验证。

## 适用场景

- 希望通过 Slack 私聊触发 Rex 或指定 Agent。
- 希望在 Slack 频道中接收问题，并把分析结果回复到原线程或原频道。
- 希望把任务中心、Workflow 或会话结果推送到指定 Slack 频道或用户。
- 部署环境不方便开放公网 Webhook，希望通过 Slack Socket Mode 主动连接 Slack。

## 前置准备

- 已拥有目标 Slack Workspace 的应用创建和安装权限。
- Flocks 所在服务器可以访问 Slack API 与 Socket Mode WebSocket 服务。
- 准备一个专用 Slack App 作为 Flocks 机器人，不建议复用已有业务机器人。
- 生产环境建议提前整理允许访问 Flocks 的 Slack 用户 ID 和频道 ID。

Slack 通道推荐使用 **Socket Mode**。Socket Mode 由 Flocks 主动连接 Slack，不需要把 Flocks 暴露到公网，也不需要配置公网回调地址。

## 操作步骤

### 1. 创建 Slack App

1. 打开 [Slack API Apps](https://api.slack.com/apps)。
2. 点击 **Create New App**。
3. 选择 **From scratch**。
4. 填写 App Name，例如 `Flocks Assistant`。
5. 选择要接入的 Slack Workspace。
6. 点击 **Create App**。

### 2. 开启 Socket Mode

1. 在 Slack App 后台进入 **Settings → Socket Mode**。
2. 开启 **Enable Socket Mode**。
3. 按提示创建 App-Level Token。
4. 给 App-Level Token 添加 `connections:write` scope。
5. 保存返回的 App-Level Token，格式通常类似：

```text
xapp-...
```

这个 Token 用于 Flocks 建立 Socket Mode WebSocket 连接。请按敏感凭据保存，不要提交到 Git 或共享到群聊。

### 3. 配置 Bot Token Scopes

进入 **Features → OAuth & Permissions**，在 **Bot Token Scopes** 中添加 Flocks 所需权限。

常用权限如下：

| Scope | 用途 |
| --- | --- |
| `app_mentions:read` | 接收频道中 `@` 机器人消息 |
| `channels:history` | 读取公开频道消息事件 |
| `channels:read` | 读取公开频道基础信息 |
| `chat:write` | 发送消息 |
| `groups:history` | 读取私有频道消息事件 |
| `groups:read` | 读取私有频道基础信息 |
| `im:history` | 接收私聊消息 |
| `im:read` | 读取私聊基础信息 |
| `im:write` | 打开或写入私聊 |
| `mpim:history` | 接收多人私聊消息 |
| `mpim:read` | 读取多人私聊基础信息 |
| `users:read` | 读取用户基础信息，用于展示和白名单排查 |

如果只计划在公开频道里 `@` 机器人使用，可以先配置较小范围：`app_mentions:read`、`channels:history`、`channels:read`、`chat:write`、`users:read`。如果需要私聊、私有频道或多人私聊，再补充对应 `im:*`、`groups:*`、`mpim:*` 权限。

### 4. 安装应用并获取 Bot Token

1. 在 **OAuth & Permissions** 页面点击 **Install to Workspace**。
2. 按 Slack 提示授权安装。
3. 安装完成后，复制 **Bot User OAuth Token**，格式通常类似：

```text
xoxb-...
```

如果后续新增或删除了 Bot Token Scopes，需要重新点击 **Reinstall to Workspace**，让权限变更真正生效。

### 5. 配置事件订阅

进入 **Features → Event Subscriptions**：

1. 开启 **Enable Events**。
2. 在 **Subscribe to bot events** 中添加需要接收的事件。

常用事件如下：

| 事件 | 用途 |
| --- | --- |
| `app_mention` | 机器人在频道中被 `@` 时触发 |
| `message.im` | 私聊消息 |
| `message.channels` | 公开频道普通消息 |
| `message.groups` | 私有频道普通消息 |
| `message.mpim` | 多人私聊消息 |

生产环境建议优先使用 `app_mention` 和 `message.im`。如果启用 `message.channels` 或 `message.groups`，应在 Flocks 中同时配置频道白名单和触发策略，避免频道内所有普通消息都触发 Agent。

### 6. 开启 Messages Tab

如果希望用户可以直接给机器人发私信，进入 **Features → App Home**：

1. 在 **Show Tabs** 中开启 **Messages Tab**。
2. 按需开启 **Allow users to send Slash commands and messages from the messages tab**。

开启后，用户可以在 Slack 中打开 App 私聊窗口并向 Flocks 发送消息。

### 7. 在 Flocks 中配置 Slack 通道

进入 Flocks WebUI 的「通道配置 → Slack」，填写基础配置。

| 配置项 | 说明 |
| --- | --- |
| Bot Token | Slack 的 `xoxb-...` Bot User OAuth Token。 |
| App Token | Slack 的 `xapp-...` App-Level Token，需要包含 `connections:write`。 |
| 默认 Agent | Slack 消息默认交给哪个 Agent 处理。 |
| 私信策略 | 控制 Slack 私聊是否开放、只允许白名单用户，或关闭私聊。 |
| 允许的用户 | 只允许指定 Slack User ID 触发 Flocks，生产环境建议配置。 |
| 群聊 / 频道策略 | 控制频道消息是否开放、只允许白名单频道，或关闭频道消息。 |
| 允许的频道 | 只允许指定 Slack Channel ID 触发 Flocks。 |
| 群聊触发方式 | 建议配置为仅 `@` 机器人或回复机器人时触发。 |
| 流式输出 | 控制 Slack 回复是否按流式方式逐步发送。 |

填写完成后，点击 **启用**，再点击 **保存**。等待通道状态变为运行中。

### 8. 邀请机器人进入频道

Slack App 安装到 Workspace 后，并不会自动加入所有频道。需要在目标频道中邀请机器人：

```text
/invite @Flocks Assistant
```

或者在频道成员管理中把机器人添加到频道。

对于私有频道，必须先把机器人邀请进频道，Flocks 才能接收事件和发送回复。

## 获取 Slack 用户 ID 和频道 ID

生产环境建议使用 Slack ID 做白名单，不要只依赖显示名称。显示名称可以重复，也可能被用户修改。

获取用户 ID：

1. 在 Slack 中打开目标用户资料。
2. 点击更多操作。
3. 选择 **Copy member ID**。
4. 用户 ID 通常形如：

```text
U012ABCDEF
```

获取频道 ID：

1. 打开目标频道。
2. 点击频道名称进入频道详情。
3. 在更多操作中选择 **Copy channel ID**，或从频道链接中识别 ID。
4. 频道 ID 通常形如：

```text
C012ABCDEF
G012ABCDEF
```

其中 `C` 开头通常是公开频道，`G` 开头通常是私有频道或多人私聊。

## 频道与线程配置注意事项

Slack 频道里消息量通常较大。生产环境不建议让 Flocks 处理频道内所有普通消息，除非这个频道专门用于机器人交互。

推荐配置：

- 频道消息仅在 `@` 机器人、回复机器人或命令触发时响应。
- 只允许指定频道触发 Flocks。
- 只允许指定用户或值班组成员触发高权限 Agent。
- 长报告写入 Workspace 或生成文件，Slack 中只发送摘要、链接或关键结论。

Slack thread 会影响上下文绑定。用户在同一 thread 中继续追问时，Flocks 通常会沿用同一外部会话；如果用户在频道中新开一条消息，可能会建立新的会话绑定。

## 结果推送与 session ID

如需在 Flocks 页面、任务中心或 Workflow 中主动向 Slack 发送结果，建议先建立会话绑定并获取目标 `session ID`。

获取方式：

1. 在目标 Slack 私聊、频道或 thread 中询问 Rex：`你的 sessionid 是什么？`
2. 或发送 `/status`，查看当前绑定的 Session、Agent、模型和 Slack 对话信息。
3. 在 WebUI、另一个会话、任务中心或 Workflow 中使用这个 `session ID`：

```text
给 sessionid：<sessionID>，发送：今日巡检完成，发现 2 条高危告警。
```

Flocks 会根据 `session ID` 自动找到绑定的 Slack 对话并发送消息。如果目标 Slack 对话执行过 `/new`，会重新绑定新的 Session，后续推送应使用新的 `session ID`。

## 安全建议

- 使用专用 Slack App 和专用机器人身份，避免和其他自动化系统共用 Token。
- 生产环境务必配置用户白名单、频道白名单或两者同时配置。
- Bot Token 和 App Token 泄露后应立即在 Slack App 后台重新生成或吊销。
- 不要授予暂时用不到的 OAuth scopes；新增功能时再补权限并重新安装应用。
- 对具备设备操作、工单变更、命令执行能力的 Agent，应结合 Flocks 的工具权限、审批和审计使用。
- 离职、项目结束或 Workspace 权限调整时，及时清理 Slack App 安装、频道邀请和 Flocks 白名单。

## 常见问题

### 通道无法连接 Slack

优先检查：

- `Bot Token` 是否以 `xoxb-` 开头，`App Token` 是否以 `xapp-` 开头。
- App-Level Token 是否包含 `connections:write`。
- Slack App 是否已开启 Socket Mode。
- Flocks 服务器是否可以访问 `slack.com`、`api.slack.com` 和 Slack Socket Mode WebSocket 服务。
- 企业代理、防火墙或 TLS 检查是否阻断 WebSocket。

### 私聊没有响应

优先检查：

- App Home 中是否开启 Messages Tab。
- 是否订阅了 `message.im` 事件。
- Bot Token 是否包含 `im:history`、`im:read`、`im:write` 和 `chat:write`。
- 当前用户是否在 Flocks 的允许用户名单内。
- Slack App 修改权限后是否重新安装到 Workspace。

### 频道里 @ 机器人没有响应

优先检查：

- 机器人是否已经被邀请进目标频道。
- 是否订阅了 `app_mention` 事件。
- Bot Token 是否包含 `app_mentions:read`、`channels:history`、`channels:read` 和 `chat:write`。
- 私有频道是否额外包含 `groups:history` 和 `groups:read`。
- 当前频道是否在 Flocks 的允许频道名单内。

### 配置了普通频道消息但没有收到事件

优先检查：

- 是否订阅了 `message.channels` 或 `message.groups`。
- 是否给公开频道配置了 `channels:history`，给私有频道配置了 `groups:history`。
- Slack App 是否重新安装，让新增事件和权限生效。
- Flocks 的群聊触发方式是否限制为仅 `@` 或回复机器人。

### 多个 Workspace 或多个 Slack App 如何区分

每个 Slack Workspace 建议使用独立的 Slack App，并在 Flocks 中使用对应的 Bot Token 和 App Token。需要稳定推送到某个 Slack 私聊、频道或 thread 时，建议使用 Flocks 返回的 `session ID`，而不是只在任务描述里写“发送到 Slack”。

## 参考资料

- [Slack API Apps](https://api.slack.com/apps)
- [Slack Socket Mode](https://api.slack.com/apis/connections/socket)
- [Slack OAuth scopes](https://api.slack.com/scopes)
- [Hermes Agent Slack 文档](https://hermes-agent.nousresearch.com/docs/zh-Hans/user-guide/messaging/slack)

---

相关：[通道配置总览](/md/communication-channels) · [钉钉通道配置](/md/channels/dingtalk) · [飞书通道配置](/md/channels/feishu) · [企业微信通道配置](/md/channels/wecom) · [Telegram 通道配置](/md/channels/telegram) · [微信通道配置](/md/channels/weixin) · [WhatsApp 通道配置](/md/channels/whatsapp) · [邮件网关配置](/md/channels/email)
