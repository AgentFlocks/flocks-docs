# Telegram 通道配置

本文介绍如何在 Telegram 中创建 Bot，并在 Flocks 中完成 Telegram 通道的连接与验证。

## 适用场景

- 希望通过 Telegram 私聊或群聊触发 Rex。
- 希望将任务中心、Workflow 或会话结果推送到 Telegram。
- 部署环境可以访问 Telegram Bot API，或已经准备好可用代理。

## 前置准备

- 已安装并登录 Telegram 客户端。
- 当前网络可以访问 `api.telegram.org`，或已准备 `HTTP` / `HTTPS` / `SOCKS5` 代理。
- 如果计划使用 Webhook 模式，需要准备公网可访问的 `HTTPS` 地址。

## 操作步骤

### 1. 通过 BotFather 创建 Bot

Telegram Bot 需要通过官方的 [@BotFather](https://t.me/BotFather) 创建并获取 `Bot Token`。

1. 在 Telegram 中搜索 **@BotFather**，或打开 [https://t.me/BotFather](https://t.me/BotFather)。
2. 向 BotFather 发送 `/newbot`。
3. 按提示填写机器人展示名称，例如 `Flocks Assistant`。
4. 填写机器人用户名。用户名必须全局唯一，并以 `bot` 结尾，例如 `flocks_assistant_bot`。
5. BotFather 会返回一段 `Bot Token`，格式通常类似：

```text
123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
```

请妥善保存 `Bot Token`。任何拿到该 Token 的人都可以控制这个 Bot；如果 Token 泄露，应立即在 BotFather 中使用 `/revoke` 重新生成。

### 2. 可选：配置 Bot 信息

为了让团队成员更容易识别机器人，可以继续在 BotFather 中配置：


| 命令                | 用途                |
| ----------------- | ----------------- |
| `/setdescription` | 设置用户首次打开机器人时看到的说明 |
| `/setabouttext`   | 设置机器人资料页中的简短介绍    |
| `/setuserpic`     | 上传机器人头像           |
| `/setcommands`    | 设置聊天框中的 `/` 命令菜单  |
| `/setprivacy`     | 设置群聊隐私模式          |


如果要设置命令菜单，可先使用下面这组基础命令：

```text
help - 查看帮助信息
new - 开始新的会话
status - 查看当前会话状态
```

### 3. 在 Flocks 中配置 Telegram 通道

1. 进入 Flocks WebUI 的「通道配置 → Telegram」。
2. 在账号凭证区域填写 BotFather 返回的 `Bot Token`。
3. 按需填写或调整以下配置项：

  | 配置项      | 说明                              |
  | -------- | ------------------------------- |
  | 默认 Agent | Telegram 消息默认交给哪个 Agent 处理      |
  | 允许的用户    | 仅允许指定 Telegram 用户触发机器人；建议生产环境启用 |
  | 允许的群聊    | 仅允许指定 Telegram 群聊或频道触发机器人       |
  | 群聊触发方式   | 可配置为仅在 @ 机器人、回复机器人或命令触发时响应      |
  | 流式输出     | 控制 Telegram 回复是否按流式方式逐步发送       |

4. 点击 **启用**，然后点击 **保存**。
5. 等待通道状态变为运行中后，在 Telegram 中向 Bot 发送一条私信测试消息。

如果 Flocks 能正常回复，说明 Telegram 通道已经连接成功。

### 4. 获取 Telegram 用户 ID 或群 ID

生产环境建议配置用户或群白名单，避免任何人都能通过 Bot 触发 Flocks。

获取用户 ID 的常见方式：

- 向 [@userinfobot](https://t.me/userinfobot) 发送任意消息，查看返回的数字 ID。
- 或向 [@get_id_bot](https://t.me/get_id_bot) 发送消息，查看返回结果。

获取群聊 ID 的常见方式：

1. 将 Bot 添加到目标群聊。
2. 在群里发送一条测试消息，并在 Flocks 日志或通道状态中查看收到的 Telegram `chat_id`。
3. Telegram 群聊 ID 通常是负数，超级群通常形如 `-1001234567890`。

## 群聊配置注意事项

Telegram Bot 默认开启隐私模式。隐私模式开启时，Bot 在群聊中通常只能收到：

- 以 `/` 开头的命令。
- 对机器人消息的直接回复。
- 服务消息，例如成员加入、成员退出、置顶消息。
- 机器人作为管理员所在频道中的消息。

如果希望 Flocks 在群聊中接收普通消息，可以选择以下任一方式：

1. 在 BotFather 中执行 `/mybots`，选择目标 Bot，进入 **Bot Settings → Group Privacy**，关闭隐私模式。
2. 将 Bot 提升为群管理员。

修改隐私模式后，建议将 Bot 从群聊中移除再重新添加。Telegram 会在 Bot 入群时缓存隐私模式状态，旧成员关系可能不会立即生效。

为了避免群聊中所有普通消息都触发 Rex，建议同时在 Flocks 中配置为仅在 `@` 机器人、回复机器人或命令消息时响应。

## Webhook 模式

Telegram 通道通常可以使用 Polling 模式运行。Polling 由 Flocks 主动向 Telegram 拉取更新，不需要公网回调地址，适合本地部署或长期运行的服务器。

如果部署在云平台并希望由 Telegram 主动推送消息，可以使用 Webhook 模式。此时需要：

- 一个公网可访问的 `HTTPS` Webhook URL。
- 一个用于校验 Telegram 回调请求的 Webhook Secret。
- 确保外部请求能够到达 Flocks Webhook 监听端口。

在 Flocks WebUI 的 Telegram 通道中填写 Webhook URL 和 Webhook Secret 后保存并重启通道。若不填写 Webhook URL，通道通常会按 Polling 模式运行。

## 代理配置

如果部署环境无法直连 Telegram Bot API，可以为 Telegram 通道配置代理。常见代理格式如下：

```text
socks5://127.0.0.1:1080
http://127.0.0.1:7890
https://127.0.0.1:7890
```

代理地址应优先填写在 Telegram 通道的专用代理配置中。若通道未配置专用代理，部署环境也可以通过系统级 `HTTPS_PROXY`、`HTTP_PROXY` 或 `ALL_PROXY` 变量统一指定出口代理。

## 结果推送与 session ID

如需在 Flocks 页面、任务中心或 Workflow 中主动向 Telegram 发送结果，建议先建立会话绑定并获取目标 `session ID`。

获取方式：

1. 在目标 Telegram 私聊或群聊中询问 Rex：`你的 sessionid 是什么？`
2. 或发送 `/status`，查看当前绑定的 Session、Agent、模型和 Telegram 对话信息。
3. 在 WebUI、另一个会话、任务中心或 Workflow 中使用这个 `session ID`：

```text
给 sessionid：<sessionID>，发送：今日巡检完成，发现 2 条高危告警。
```

Flocks 会根据 `session ID` 自动找到绑定的 Telegram 对话并发送消息。如果目标 Telegram 对话执行过 `/new`，会重新绑定新的 Session，后续推送应使用新的 `session ID`。

## 常见问题

### 私聊可用，但群聊没有响应

优先检查：

- Bot 是否已经加入目标群聊。
- 群聊消息是否 `@` 了机器人，或是否回复了机器人消息。
- BotFather 中的隐私模式是否阻止了普通群消息。
- Bot 是否需要移除后重新加入群聊，才能应用新的隐私模式。
- Flocks 中的允许用户、允许群聊或群聊触发方式是否限制了当前消息。

### 通道无法连接 Telegram

优先检查：

- `Bot Token` 是否填写正确。
- 部署环境是否可以访问 `api.telegram.org`。
- 代理地址格式是否正确，代理服务是否可用。
- 如果使用 Webhook，公网 `HTTPS` URL、Webhook Secret 和端口转发是否正确。

### 多个 Bot 或多个群聊如何区分

每个 Telegram Bot 应使用独立的 `Bot Token`。如果需要把结果稳定推送到某个 Telegram 私聊或群聊，建议使用 Flocks 返回的 `session ID`，而不是只在任务描述里写“发送到 Telegram”。

## 参考资料

- [Telegram BotFather](https://t.me/BotFather)
- [Telegram Bot API](https://core.telegram.org/bots/api)

---

相关：[通道配置总览](/md/communication-channels) · [钉钉通道配置](/md/channels/dingtalk) · [飞书通道配置](/md/channels/feishu) · [企业微信通道配置](/md/channels/wecom) · [微信通道配置](/md/channels/weixin) · [WhatsApp 通道配置](/md/channels/whatsapp)
