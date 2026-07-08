# 对话管理

对话管理是 Flocks 的主交互入口。用户在这里和主 Agent `Rex` 对话，用自然语言提出目标、补充上下文、查看执行过程，并把一次成功任务沉淀为 Agent、Skill、Workflow 或任务中心里的长期任务。

## 1. 功能定位

### 1.1 对话管理解决什么问题

对话管理回答的是"**这件事从哪里开始、人和 Rex 如何协作推进**"。它不是普通聊天窗口，而是 Flocks 的任务会话空间。

一次会话可以承载：

- 任务目标、补充线索和用户反馈。
- Rex 的任务拆解、工具调用、子 Agent 委派和结果汇总。
- 运行过程中的文件、报告、JSON 结果和中间证据。
- 后续把任务沉淀为 Agent、Skill、Workflow 或定时任务的上下文。

产品中不同位置触发的 Rex 对话，都会统一汇聚到对话管理页展示。例如在 Agent 页面创建或调整 Agent 时打开的 Rex 对话、在 Workflow 页面生成或调试工作流时打开的 Rex 对话，都会作为会话记录进入对话管理。这样用户可以在一个入口回看所有任务上下文，而不必记住当时是从哪个功能页发起的。

### 1.2 与其他模块的关系

| 模块 | 关系 |
| --- | --- |
| [Agent 智能体](/md/modules/agents) | 会话默认由 Rex 承接，也可以直接选择特定子 Agent 对话。 |
| [Skills 技能库](/md/modules/skills) | Rex 可以在会话中加载 Skill，或把成功经验沉淀为 Skill。 |
| [Workflow 工作流](/md/modules/workflow) | 可以在会话中创建、运行、修改和测试 Workflow；Workflow 页面中的 Rex 对话也会进入对话管理。 |
| [工具清单](/md/modules/tools) | Rex 会根据任务需要调用工具，也可以通过会话生成新工具。 |
| [Workspace](/md/modules/workspace) | 会话产物通常写入当前 Workspace 的 `outputs/`。 |

## 2. 适用场景

对话管理适合所有从自然语言开始的任务，例如：

- 研判一条告警或一批告警。
- 查询 IOC、补充威胁情报、生成报告。
- 登录设备控制台做巡检或取数。
- 接入 API、MCP、IM 通道或安全设备。
- 创建 Agent、Skill、Workflow。
- 从 **告警运营** 入口启用 SOC 工作区场景套件。
- 把一次跑通的流程转为任务中心里的周期任务。

如果任务还不确定、需要边问边做，优先从会话开始；如果流程已经稳定，再沉淀到 Workflow 或任务中心。

## 3. 使用方式

### 3.1 新建会话并提出目标

进入 **AI 工作台 → 对话管理**，直接描述目标：

```text
帮我分析这批 NDR 告警，输出高危告警列表、证据和处置建议。
```

描述越清楚，Rex 越容易选择正确的工具、Skill、Workflow 或子 Agent。建议说明输入数据、目标系统、期望输出、时间范围和约束条件。

### 3.2 通过告警运营入口启动 SOC 工作区

新会话首页提供 **告警运营** 快捷入口。点击后，如果 SOC 工作区场景套件尚未安装，页面会提示是否现在安装；确认后，Flocks 会安装 SOC 工作区 UI、SOC 工作区操作工具、告警降噪工作流和告警研判工作流，并进入 Rex 辅助配置流程。

安装完成后，Rex 会继续引导配置 `stream_alert_denoise` 和 `stream_alert_triage`，让告警运营能力从安装进入可用状态。完整流程见 [SOC 工作区场景套件](/md/scenarios/soc-workspace-suite)。

### 3.3 默认由 Rex 执行

当前 Session 对话默认选择主 Agent `Rex`。Rex 会判断任务应该自己处理，还是委派给某个专家 Agent，或运行某个 Workflow。

通常不必显式指定 Agent 名称。直接说任务即可：

```text
运行一下设备巡检。
```

如果希望稳定选择某个 Agent，可以明确说：

```text
用 Security Inspection Agent 完成这次设备巡检。
```

### 3.4 直接选择子 Agent 对话

如果希望使用某个特定子 Agent，有三种常见方式：

| 方式 | 效果 |
| --- | --- |
| **用自然语言告诉 Rex** | 例如"用 Security Inspection Agent 完成这次设备巡检"。Rex 会理解你的指定，并委派该子 Agent 执行。 |
| **在输入中 @ 某个子 Agent** | 例如 `@security-inspection 分析这批巡检数据`。适合明确点名某个子 Agent 参与任务。 |
| **在页面上选择对话 Agent** | 直接把当前会话切到某个 Agent，由该 Agent 承接后续对话。 |

这几种方式都可以让任务稳定交给具体子 Agent 执行。差异在于：自然语言指定时，Rex 仍作为主入口进行理解和委派；`@子Agent` 或页面选择 Agent 时，意图更直接，更适合调试和固定执行角色。

直接使用特定子 Agent 适合：

- 调试某个 Agent 的 Prompt。
- 验证 Agent 是否能独立完成任务。
- 希望绕过 Rex 自动匹配，固定使用某个专家角色。

### 3.5 在会话中沉淀能力

当一次任务跑通后，可以继续对 Rex 说：

```text
基于刚才的执行过程，帮我创建一个可复用的 Agent。
```

也可以沉淀为 Skill 或 Workflow：

```text
把刚才的判断方法整理成 Skill。
```

```text
把刚才的流程创建成 Workflow，并保留测试数据。
```

### 3.6 对话中的 / 命令

在对话输入框中可以使用 `/` 命令快速查看能力、切换会话状态或触发特定操作。不同入口支持的命令可能略有差异，最准确的列表可以在当前会话里输入：

```text
/help
```

常用命令包括：

| 命令 | 作用 |
| --- | --- |
| `/new` | 清理当前对话历史，重新开始一轮新对话。也可能支持 `/reset` 作为别名。 |
| `/help` | 查看当前入口支持的全部 `/` 命令。 |
| `/tools` | 查看当前可用工具。支持 `/tools info <name>`、`/tools refresh`、`/tools create <需求>`。 |
| `/mcp` | 查看 MCP 服务。支持 `/mcp status`、`/mcp tools`、`/mcp refresh <server>`。 |
| `/skills` | 查看当前可用 Skill。支持 `/skills refresh`。 |
| `/agents` | 查看当前可委派的 Agent。 |
| `/workflows` | 查看当前可用 Workflow。 |
| `/tasks` | 查看任务中心概览。 |
| `/queue` | 查看任务队列状态。 |
| `/compact` | 总结并压缩当前会话上下文，适合长对话继续推进。 |
| `/clear` | 清空当前 UI 输出，不等于删除真实会话数据。 |
| `/plan <任务>` | 让 Plan Agent 为任务创建计划。 |
| `/ask <问题>` | 只提问、不做修改，适合咨询或确认方案。 |
| `/init` | 分析当前项目并创建或更新项目级 Agent 指引。 |
| `/bug <描述>` | 整理或提交问题反馈。 |
| `/model <模型>` | 切换或查看当前模型，主要用于通道或会话控制场景。 |
| `/status` | 查看当前会话状态，主要用于通道或会话控制场景。 |

Flocks 还可以从自定义命令目录和 MCP Prompts 发现更多 `/` 命令。因此不同项目、不同 Workspace 或不同 MCP 配置下，`/help` 展示的命令可能会有所不同。

### 3.7 使用 sessionID 向固定会话发送消息

每个对话都有一个唯一的 `sessionID`。Flocks 会把当前 `Session ID` 注入到 Agent 的运行上下文里，所以在任意会话中都可以直接问：

```text
你的 sessionid 是什么？
```

Rex 会返回当前会话的 `sessionID`。在 IM 通道里，也可以使用：

```text
/status
```

查看当前 IM 对话绑定的 Session、Agent、模型和通道目标。

拿到 `sessionID` 后，可以从另一个 Flocks 会话里让 Rex 给这个固定会话发送消息：

```text
给 sessionid：<sessionID>，发送：巡检已完成，高危告警 2 条，报告见 outputs/2026-06-10/report.md。
```

Rex 会调用通道消息能力，根据 `sessionID` 自动查找它绑定的 IM 对话，再把消息发回对应的企业微信、飞书或钉钉会话。用户只需要提供 Flocks 的 `sessionID`，不需要关心 IM 平台内部如何标识群聊或私聊。

这个能力对 IM 对话尤其有用：每个 IM 私聊、群聊或配置了隔离策略的群内子会话，都会在 Flocks 中对应一个会话 Session。只要先在目标 IM 对话里问到 `sessionID`，之后就可以在 WebUI、另一个会话、任务中心或 Workflow 里稳定地把结果推送回这个 IM 对话。

常见用法包括：

- 把巡检、告警研判、日报等任务结果推送到固定值班群。
- 从 WebUI 会话里把处理进展同步到某个 IM 群。
- 在创建定时任务时，把目标 `sessionID` 写入任务描述，保证无人值守运行时仍能找到正确收件人。
- 多个 IM 群同时接入时，避免只说"发到企微"导致目标不明确。

使用时建议注意：

- `sessionID` 是路由标识，发送敏感内容前先确认它属于正确群聊或用户。
- 如果目标 IM 对话执行过 `/new`，会生成并绑定新的 Session，旧 `sessionID` 可能不再是期望目标。
- 如果发送失败，通常需要检查目标 Session 是否确实来自 IM 通道、通道是否在线、机器人是否仍在目标群里。

## 4. 常见问题

### 4.1 会话和 Workspace 是什么关系？

会话负责交互和任务上下文，Workspace 负责项目边界和文件产物。Rex 在会话中生成的报告、测试数据和中间结果，通常会写到当前 Workspace 的 `outputs/`。

### 4.2 会话里能直接运行 Workflow 吗？

可以。直接说：

```text
帮我用 NDR 告警研判工作流跑一下这批告警。
```

Rex 会定位合适的 Workflow，并把输入数据传给它执行。

### 4.3 会话里的结果能变成长期任务吗？

可以。先在会话中跑通一次，再让 Rex 创建任务：

```text
把这套巡检流程配成每天 08:00 执行的任务，结果发到企微值班群。
```

## 5. 相关模块

- [任务中心](/md/modules/tasks)：把会话中跑通的能力变成长期运行任务。
- [Agent 智能体](/md/modules/agents)：会话中可委派或直接选择的执行角色。
- [Workflow 工作流](/md/modules/workflow)：会话中可创建和运行的稳定流程。
- [Skills 技能库](/md/modules/skills)：会话中可加载和沉淀的方法论。
- [Workspace](/md/modules/workspace)：会话产物和项目资产的存放位置。
