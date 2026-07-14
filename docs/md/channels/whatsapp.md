# WhatsApp 通道配置

本文介绍如何在 Flocks WebUI 中通过 WhatsApp Linked Devices 扫码配对，完成 WhatsApp 通道的连接、权限控制与验证。

## 适用场景

- 希望通过 WhatsApp 私聊触发 Rex 或指定 Agent。
- 希望在 WhatsApp 群聊中接收问题，并把分析结果回复到原会话。
- 希望把任务中心、Workflow 或会话结果推送到固定 WhatsApp 联系人或群组。
- 不具备 Meta Business 账号或公网 Webhook 条件，希望先用 WhatsApp Web 配对方式快速接入。

## 前置准备

- Flocks 所在服务器已安装 `Node.js 18+` 和 `npm`。WhatsApp 通道使用本地 Baileys bridge 进程连接 WhatsApp Web。
- 手机端已安装并登录 WhatsApp，用于扫描 Linked Devices 二维码。
- 部署环境可以访问 WhatsApp Web 相关 HTTPS / WebSocket 服务。
- 建议准备一个专用 WhatsApp 号码作为机器人账号，不建议直接使用个人常用号码。

> WhatsApp 通道使用 WhatsApp Web 协议配对，不是 Meta 官方 WhatsApp Business Cloud API。因此无需 Meta 开发者账号，也无需配置公网回调地址；但 WhatsApp Web 协议更新或账号风控策略变化，可能导致连接中断或需要重新配对。

## 操作步骤

### 1. 打开 WhatsApp 通道配置页

进入 Flocks WebUI 的「通道配置 → WhatsApp」。

首次配置时，「账号连接」区域会显示 **扫码连接 WhatsApp**。如果已经配对过，会显示已配对状态，并提供 **重新扫码 / 更换账号**。

### 2. 选择运行模式

WhatsApp 通道支持两种模式：


| 模式               | 说明                                      | 推荐场景              |
| ---------------- | --------------------------------------- | ----------------- |
| Bot 模式（独立账号）     | 使用一个专门的 WhatsApp 账号作为机器人账号，其他用户向该账号发消息。 | 团队使用、多人私聊、群聊、生产环境 |
| Self-chat（仅本人自聊） | 使用自己的 WhatsApp 账号，只处理本人发给自己的消息。         | 个人测试、单用户验证        |


生产环境建议使用 **Bot 模式（独立账号）**。这样可以降低误操作和账号权限混用风险，也更容易管理白名单、群聊和消息投递目标。

### 3. 扫码配对

1. 点击 **扫码连接 WhatsApp**。
2. WebUI 会启动本地 WhatsApp bridge，并弹出二维码。
3. 打开手机 WhatsApp。
4. 进入 **Settings → Linked Devices**。
5. 点击 **Link a Device**，扫描 WebUI 中的二维码。
6. WebUI 显示连接完成后，Flocks 会保存会话凭据并启用或重启通道。

二维码过期、扫码失败或需要更换账号时，点击 **重新扫码 / 更换账号** 再次配对即可。

### 4. 配置私信策略

私信策略用于控制哪些 WhatsApp 用户可以触发 Agent。


| 策略            | 说明                                  |
| ------------- | ----------------------------------- |
| 开放（所有人均可）     | 任意给该 WhatsApp 账号发私信的用户都可以触发 Flocks。 |
| 白名单（仅允许名单内用户） | 只有 `允许的用户` 列表中的号码或 JID 可以触发 Flocks。 |
| 关闭（不接受私信）     | 不处理 WhatsApp 私聊消息。                  |


生产环境建议使用白名单。`允许的用户` 支持以下格式：

```text
15551234567
15551234567@s.whatsapp.net
123456789@lid
```

填写手机号时建议包含国家或地区码，不需要空格；Flocks 会在运行时归一化为 WhatsApp JID。

### 5. 配置群聊策略

群聊策略用于控制 WhatsApp 群消息是否可以触发 Agent。


| 策略           | 说明                               |
| ------------ | -------------------------------- |
| 开放（所有群均可）    | 机器人所在的所有 WhatsApp 群都可以触发 Flocks。 |
| 白名单（仅允许名单内群） | 只有 `允许的群 JID` 列表中的群可以触发 Flocks。  |
| 关闭（不处理群聊）    | 不处理 WhatsApp 群聊消息。               |


群 JID 通常以 `@g.us` 结尾，例如：

```text
120363000000000000@g.us
```

群聊触发方式建议保持为 **仅 @ 或回复机器人时触发**。只有在非常明确需要处理群内所有消息时，才改为 **所有消息都触发**，否则容易造成大量无关消息触发 Agent。

### 6. 调整高级设置

默认配置通常可以直接使用。只有在端口冲突、长消息体验或网络较慢时，才需要调整高级设置。


| 配置项       | 默认值 / 说明                                                             |
| --------- | -------------------------------------------------------------------- |
| 会话目录      | 默认 `~/.flocks/workspace/channels/whatsapp/session`，保存 WhatsApp 登录凭据。 |
| Bridge 端口 | 默认 `3100`，本地 bridge 仅监听 `127.0.0.1`。如端口冲突可修改。                        |
| 回复前缀      | 发送到 WhatsApp 前追加的文本前缀，可留空。                                           |
| 文本合并等待    | 连续多条文本消息在触发 Agent 前的合并等待时间，避免一段话被拆成多次调用。                             |
| 分块发送间隔    | 长回复拆分为多条 WhatsApp 消息时，每段之间的发送间隔。                                     |
| 发送超时      | bridge 调用 WhatsApp `sendMessage` 的单次超时时间。                            |
| 媒体缓存目录    | 入站媒体下载到本地的目录，留空使用默认工作区目录。                                            |


## 验证连接

保存并启用通道后，可以按下面方式验证：

1. 用允许名单内的 WhatsApp 用户向机器人账号发送一条私信。
2. 如果启用了群聊，在允许的群里 `@` 机器人或回复机器人消息。
3. 在 WhatsApp 中发送 `/status`，查看当前绑定的 Session、Agent、模型和通道信息。
4. 如果 Flocks 正常回复，说明 WhatsApp 通道已经连接成功。

## 结果推送与 session ID

如需在 Flocks 页面、任务中心或 Workflow 中主动向 WhatsApp 发送结果，建议先建立会话绑定并获取目标 `session ID`。

获取方式：

1. 在目标 WhatsApp 私聊或群聊中询问 Rex：`你的 sessionid 是什么？`
2. 或发送 `/status`，查看当前绑定的 Session、Agent、模型和 WhatsApp 对话信息。
3. 在 WebUI、另一个会话、任务中心或 Workflow 中使用这个 `session ID`：

```text
给 sessionid：<sessionID>，发送：今日巡检完成，发现 2 条高危告警。
```

Flocks 会根据 `session ID` 自动找到绑定的 WhatsApp 对话并发送消息。如果目标 WhatsApp 对话执行过 `/new`，会重新绑定新的 Session，后续推送应使用新的 `session ID`。

## 会话凭据与安全注意事项

WhatsApp 配对完成后，会话凭据保存在 `会话目录` 下。默认路径为：

```text
~/.flocks/workspace/channels/whatsapp/session
```

请按敏感凭据保护这个目录：

- 不要把会话目录提交到 Git、复制给他人或放入公开备份。
- 建议限制目录权限，例如只允许 Flocks 运行用户读取。
- 如果怀疑凭据泄露，在手机 WhatsApp 的 **Linked Devices** 中移除对应设备，然后在 Flocks 中重新扫码。
- 生产环境建议使用专用号码，避免个人聊天、联系人和业务机器人混用。
- 不要进行批量营销、垃圾消息或未经对方主动联系的外呼式自动消息。

## 常见问题

### 提示未安装 Node.js 或 npm

WhatsApp bridge 依赖本机 `node` 和 `npm`。请先安装 `Node.js 18+`，并确认 Flocks 服务进程能找到它们：

```bash
node --version
npm --version
```

如果终端里能找到 `node`，但以系统服务方式启动的 Flocks 找不到，通常是服务进程的 `PATH` 和当前 shell 不一致。请调整服务环境变量后重启 Flocks。

### 二维码一直加载或弹出超时

优先检查：

- 部署环境是否可以访问 WhatsApp Web 相关 HTTPS / WebSocket 服务。
- 是否可以正常执行 `npm ci` 或 `npm install` 安装 bridge 依赖。
- 企业代理、防火墙或 DNS 是否阻断 WebSocket。
- `~/.flocks/workspace/channels/whatsapp/bridge.log` 中是否有 TLS、网络、登录或配对错误。

Flocks 会在 WhatsApp bridge 的 Node 子进程中使用 Node 内置 CA，以减少部分系统 CA 链异常导致的 TLS 连接失败。如果企业环境必须使用自签 CA 或代理 CA，应同时检查 Node 进程的证书与代理配置。

### 扫码成功后消息没有响应

优先检查：

- 通道是否已启用并处于运行中状态。
- 私信策略是否为白名单，但当前用户不在 `允许的用户` 中。
- 群聊策略是否关闭，或当前群不在 `允许的群 JID` 中。
- 群聊触发方式是否要求 `@` 或回复机器人。
- 当前账号是否仍在手机 WhatsApp 的 **Linked Devices** 列表中。

### 需要重新配对或更换账号

在 WhatsApp 通道配置页点击 **重新扫码 / 更换账号**。新二维码配对成功后，Flocks 会保存新的会话凭据并重启通道。

如果手机端已经手动移除了 Linked Device，或 WhatsApp 更新后旧会话失效，也需要重新扫码。

### Bridge 端口冲突

默认 bridge 端口是 `3100`，且仅监听 `127.0.0.1`。如果同一台机器上运行多个 Flocks 实例，或端口被其他程序占用，请在高级设置中修改 `Bridge 端口`，然后保存并重启通道。

---

相关：[通道配置总览](/md/communication-channels) · [钉钉通道配置](/md/channels/dingtalk) · [飞书通道配置](/md/channels/feishu) · [企业微信通道配置](/md/channels/wecom) · [Telegram 通道配置](/md/channels/telegram) · [微信通道配置](/md/channels/weixin)
