# Flocks / 斜杠命令

Flocks 的 `/` 斜杠命令用于在会话输入框中快速查看能力、切换上下文、刷新工具或触发常用操作。它主要出现在 WebUI、TUI、CLI 会话和部分 IM 通道中。

终端里的 `flocks <command>` 命令请参考 [Flocks CLI](/md/modules/cli)。两者的区别是：CLI 面向本机运维和脚本化操作；`/` 命令面向当前会话，用来辅助 Rex、Agent 和用户快速完成对话内操作。

## 1. 使用入口

### 1.1 WebUI 会话

在 WebUI 的对话输入框中，可以直接输入 `/` 命令，例如：

```text
/help
/tools
/skills
/mcp status
/new
```

WebUI 适合查看当前会话可用工具、Skill、Agent、Workflow，也适合通过 `/new` 清理当前对话历史并重新开始。

### 1.2 TUI 和 CLI 会话

通过下面命令进入终端会话后，也可以使用 `/` 命令：

```bash
flocks tui
flocks run
```

TUI 和 CLI 会话适合在本机终端里和 Rex 交互，同时快速查看工具、任务、Skill 和 MCP 状态。

### 1.3 IM 通道

部分 IM 通道支持 `/` 命令，例如企业微信、飞书、钉钉等。IM 通道中常用：

```text
/status
/model
/new
```

IM 通道不是所有 WebUI 命令都适合直接执行。遇到不支持的命令时，系统会提示该命令不能在当前渠道以 slash 形式执行。

## 2. 使用原则

### 2.1 先用 `/help`

不同入口、不同 Workspace、不同 MCP 配置下，可用命令可能不同。最准确的列表永远以当前会话里输入 `/help` 的结果为准。

### 2.2 `/` 命令只影响当前会话

多数 `/` 命令用于查看或调整当前会话上下文。例如 `/new` 会让当前会话重新开始，`/tools` 会查看当前环境可用工具，`/model` 会查看或切换当前 IM 会话模型。

如果要做服务启停、账号维护、任务脚本化管理等本机运维动作，应使用 [Flocks CLI](/md/modules/cli)。

### 2.3 自定义命令会动态出现

Flocks 还会发现项目或用户自定义命令，以及 MCP Prompts 暴露的命令。因此同一个用户在不同 Workspace 中输入 `/help`，看到的命令可能不同。

## 3. 通用命令

| 命令 | 作用 | 入口 |
| --- | --- | --- |
| `/help` | 查看当前入口支持的全部 `/` 命令。 | WebUI / TUI / IM / ACP / CLI |
| `/tools` | 查看当前可用工具。 | WebUI / TUI / ACP / CLI |
| `/skills` | 查看当前可用 Skill。 | WebUI / TUI / ACP / CLI |
| `/agents` | 查看当前可委派或可选择的 Agent。 | WebUI / TUI / ACP / CLI |
| `/workflows` | 查看当前可用 Workflow。 | WebUI / TUI / ACP / CLI |
| `/mcp` | 查看 MCP Server 和 MCP 工具。 | WebUI / TUI / ACP / CLI |
| `/init` | 分析当前项目并创建或更新项目级 Agent 指引。 | WebUI / TUI / ACP / CLI |
| `/compact` | 总结并压缩当前会话上下文。 | WebUI / TUI / ACP |
| `/clear` | 清空当前界面输出，不等于删除真实会话数据。 | WebUI / TUI / ACP / CLI |
| `/bug <描述>` | 整理问题反馈。 | WebUI / TUI / ACP / CLI |
| `/plan <任务>` | 让 Plan Agent 为任务创建计划。 | WebUI / TUI / ACP / CLI |
| `/ask <问题>` | 只提问、不做修改。 | WebUI / TUI / ACP / CLI |
| `/tasks` | 查看任务中心概览。 | WebUI / TUI / ACP / CLI |
| `/queue` | 查看任务队列状态。 | WebUI / TUI / ACP / CLI |
| `/new` | 开始全新会话，部分入口也支持 `/reset` 作为别名。 | 以当前入口 `/help` 为准 |

## 4. 工具相关命令

### 4.1 `/tools` 子命令

| 命令 | 作用 |
| --- | --- |
| `/tools` 或 `/tools list` | 按类别列出当前可用工具。 |
| `/tools refresh` | 刷新动态工具。 |
| `/tools info <name>` | 查看工具详情、参数、是否需要确认。 |
| `/tools create <需求>` | 使用 tool-builder Skill 根据需求创建工具。 |

### 4.2 `/mcp` 子命令

| 命令 | 作用 |
| --- | --- |
| `/mcp` 或 `/mcp list` | 列出 MCP Server。 |
| `/mcp status` | 查看 MCP Server 状态、工具数、资源数和错误信息。 |
| `/mcp tools` | 列出 MCP 工具。 |
| `/mcp refresh <server>` | 刷新指定 MCP Server 的工具。 |

## 5. Skill 和 Agent 相关命令

### 5.1 `/skills` 子命令

| 命令 | 作用 |
| --- | --- |
| `/skills` 或 `/skills list` | 列出当前可用 Skill。 |
| `/skills refresh` | 刷新 Skill 清单。 |

### 5.2 Agent 和 Workflow 查询

| 命令 | 作用 |
| --- | --- |
| `/agents` | 查看当前可委派或可选择的 Agent。 |
| `/workflows` | 查看当前可用 Workflow。 |

如果希望稳定选择某个 Agent，可以在任务描述中明确说明“用某某 Agent 完成这个任务”，也可以在支持的入口中直接选择或 `@` 某个子 Agent。

## 6. 任务相关命令

| 命令 | 作用 |
| --- | --- |
| `/tasks` | 查看任务中心概览。 |
| `/queue` | 查看任务队列状态。 |

任务的创建、取消、重跑、定时配置等批量操作，更适合使用 [Flocks CLI](/md/modules/cli#_4-任务中心-cli) 或任务中心页面完成。

## 7. IM 通道命令

| 命令 | 作用 |
| --- | --- |
| `/status` | 查看当前 IM 对话绑定的 Session、Agent、模型和 IM 对话信息。 |
| `/model` | 查看当前模型。 |
| `/model provider/model` | 切换当前 IM 会话使用的模型。 |
| `/new` | 为当前 IM 对话开始全新会话，并重新绑定新的 Session。 |
| `/reset` | `/new` 的别名。 |

IM 通道中，每个 IM 对话通常对应一个 Flocks Session。可以在对话里问“你的 sessionid 是什么”，拿到 `sessionID` 后，就能从其他 WebUI 会话、任务中心或 Workflow 中给这个固定 IM 会话发送消息。

示例：

```text
给 sessionid：abc123，发送：巡检完成，报告已经生成。
```

这种方式适合多群、多通道和定时任务场景。相比在不同入口之间手工追踪外部平台会话标识，直接使用 Flocks 的 `sessionID` 更容易跨 WebUI、任务中心、Workflow 和 IM 会话传递。

## 8. 自定义 / 命令

Flocks 支持项目或用户自定义命令，也可能把 MCP Prompts 暴露为 `/` 命令。自定义命令是否出现，取决于当前 Workspace、项目配置、用户插件和 MCP Server。

使用建议：

- 想知道当前会话支持什么，先输入 `/help`。
- 想看工具、Skill、Agent、Workflow，优先用 `/tools`、`/skills`、`/agents`、`/workflows`。
- 想在 IM 里固定推送结果，先用 `/status` 或问“你的 sessionid 是什么”拿到 `sessionID`。
- 想做本机运维、批量操作或脚本化处理，优先使用 [Flocks CLI](/md/modules/cli)。

## 9. 相关模块

- [对话管理](/md/modules/sessions)：WebUI 会话和 `/` 命令的主要使用入口。
- [工具清单](/md/modules/tools)：`/tools` 和 `/mcp` 对应的工具管理页面。
- [Skills 技能库](/md/modules/skills)：`/skills` 对应的 Skill 管理页面。
- [任务中心](/md/modules/tasks)：`/tasks` 和 `/queue` 对应的任务页面。
- [Flocks CLI](/md/modules/cli)：终端 CLI 命令汇总。
