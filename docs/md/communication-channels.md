# 3.3 通道配置

通道配置负责把 Flocks 的能力延伸到 IM 或外部触点。当前 WebUI 的通道页已经支持飞书、企业微信、微信、Telegram 和钉钉等通道，并且允许分别查看启用状态和配置字段。

![通道配置页面](../img/communication-channels-overview.png)

配置 IM 通道后，Flocks 可以覆盖下面这些典型使用场景：

- 把研判结果主动发到企业微信群、微信会话、钉钉群或其他消息触点
- 让机器人在特定群或会话中接收消息
- 把定时任务的结果直接推送给值班人员或运营团队

## 3.3.1 五大平台配置入口

不同 IM 平台的开发者后台流程差异较大，Flocks 将主流平台的接入指南拆成独立页面，按需查阅即可：

- [钉钉通道配置](/md/channels/dingtalk)：企业内部应用 + 机器人 + 群内验证
- [飞书通道配置](/md/channels/feishu)：飞书开放平台自建应用 + 权限 + App ID / App Secret
- [企业微信通道配置](/md/channels/wecom)：企业微信管理后台 + 智能机器人 + Bot ID / Secret
- [Telegram 通道配置](/md/channels/telegram)：BotFather 创建 Bot + Bot Token + Polling / Webhook
- [微信通道配置](/md/channels/weixin)：微信 iLink Bot 扫码登录 + Token / Account ID

每个子页面都给出了从平台侧创建机器人到 Flocks 连接的完整步骤。多群投递与 `session ID` 的使用细节，放在 [企业微信通道配置](/md/channels/wecom#多群消息与-session-id) 和 [Telegram 通道配置](/md/channels/telegram#结果推送与-session-id) 中说明；微信通道则通过 WebUI 内置的二维码登录直接获取 `Token` 与 `Account ID`。

## 3.3.2 使用方式

配置好 IM 通道后，可以通过两种方式使用 Flocks。

### 从 IM 中直接发消息

在企业微信、飞书、钉钉、Telegram 或微信等 IM 中向 Flocks 机器人发送消息后，Flocks 会在当前 IM 会话中回答。

常见用法：

- 将机器人添加到不同群聊中，让不同团队在各自群里使用 Flocks
- 1 对 1 单聊时，用户直接向机器人发送消息即可触发 Flocks 回答
- 群聊中，需要 `@` 机器人后再发送消息，才能触发 Flocks 对话；没有 `@` 机器人的群消息不会传输到 Flocks

### 将 Flocks 结果发送到 IM 会话

如果希望在 Flocks 页面会话或计划任务中，把结果发送到某个 IM 对话，需要先获取这个 IM 对话对应的 `session id`。

获取方式：

1. 在目标 IM 对话中询问机器人：`你的 session id 是什么？`
2. 机器人会返回类似下面的字符串：

```text
ses_26fa83663ffef06IFToLN3X7em
```

拿到 `session id` 后，可以在 Flocks 页面上的任意会话中，或在计划任务的指令中写明发送目标，例如：

```text
将分析结果发送到这个 session id：ses_26fa83663ffef06IFToLN3X7em
```

Flocks 执行完成后，会把结果输出到对应的 IM 对话中。这个方式适合定时巡检、周期性报告、告警研判结果推送和值班通知等场景。
