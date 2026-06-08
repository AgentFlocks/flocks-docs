<!--
 * @Author: John Yin 10972267+john-yin2333@user.noreply.gitee.com
 * @Date: 2026-06-09 00:13:22
 * @LastEditors: John Yin 10972267+john-yin2333@user.noreply.gitee.com
 * @LastEditTime: 2026-06-09 00:25:47
 * @FilePath: /flocks-test/Users/yinzhongchao/Documents/flocks_docs/docs/md/channels/weixin.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# 微信通道配置

本文介绍如何在 Flocks WebUI 中通过 iLink Bot 二维码登录，完成微信通道的连接与验证。

## 操作步骤

### 1. 打开微信通道配置页

进入 Flocks WebUI 的「通道配置 → 微信」。

### 2. 通过二维码登录

在「账号凭证」区域点击 **扫码登录微信**：

- 页面会生成一个二维码。
- 使用微信扫描二维码。
- 手机端确认登录后，Flocks 会自动回填以下字段：
  - `Token`
  - `Account ID`
  - `baseUrl`（若账号被路由到区域节点，也会自动回填）

如果二维码过期，点击「刷新二维码」重新获取即可。

### 3. 保存并启用通道

扫码成功后，WebUI 会自动保存凭证并启用微信通道。通常不需要手工复制粘贴 `Token` / `Account ID`。

如果你是手动填写配置，请至少保证以下字段存在：

- `Token`：iLink Bot Token
- `Account ID`：iLink Bot Account ID，通常形如 `xxx@im.bot`

### 4. 配置消息策略

按需调整以下配置项：

- **默认 Agent**：未显式指定时使用哪个 Agent
- **私信策略**：
  - `开放`：所有私信均可触发
  - `白名单`：仅允许指定 `user_id`
  - `关闭`：不处理私信
- **群聊策略**：
  - `全部`：处理所有群消息
  - `白名单`：仅处理指定群 / 房间 ID
  - `关闭`：不处理群消息

当策略设为白名单时，需要补充：

- `允许的用户 ID`
- `允许的群 ID`

### 5. 验证连接

保存后可通过以下方式验证：

1. 在微信中向机器人发送一条私信消息。
2. 或在已允许的群聊中发送一条可触发消息。
3. 如果 Flocks 正常回复，说明微信通道已连接成功。

## 补充说明

- 如需在 Flocks 页面、任务中心或 Workflow 中主动向微信发送消息，需要先建立会话绑定并指定目标 `session_id`。
- 若扫码成功但消息无法收发，优先检查 `Token`、`Account ID` 和 `baseUrl` 是否已正确保存。
- 高级配置中的 `sendChunkDelay` 用于控制长消息分段发送间隔；`dataDir` 用于保存状态文件和媒体缓存。

---

相关：[通道配置总览](/md/communication-channels) · [企业微信通道配置](/md/channels/wecom) · [飞书通道配置](/md/channels/feishu) · [钉钉通道配置](/md/channels/dingtalk)
