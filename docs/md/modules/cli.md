# Flocks CLI

这一页汇总 Flocks 终端 CLI 命令，适合服务启停、日志查看、任务管理、MCP 管理、Skill 安装、账号维护、会话导入导出等本机运维场景。

会话输入框中的 `/` 命令已经独立整理到 [Flocks / 斜杠命令](/md/modules/slash-commands)。

## 1. 使用入口

### 1.1 终端 CLI

Flocks 的命令行入口是：

```bash
flocks <command>
```

常用查看方式：

```bash
flocks --help
flocks <command> --help
flocks <command> <subcommand> --help
```

CLI 适合服务启停、日志查看、任务管理、MCP 管理、Skill 安装、账号维护、会话导入导出等本机运维场景。

## 2. 顶层 CLI 命令

### 2.1 命令组总览

| 命令组 | 作用 |
| --- | --- |
| `flocks start/stop/restart/status/logs` | 服务启停、状态和日志。 |
| `flocks tui` | 启动终端里的 TUI 会话界面。 |
| `flocks browser` | 调用内置浏览器运行时。 |
| `flocks session ...` | 会话列表、详情、删除、归档和恢复。 |
| `flocks task ...` | 任务中心、队列、定时任务和任务重跑。 |
| `flocks mcp ...` | MCP Server 和 MCP 工具管理。 |
| `flocks skills ...` | Skill 查询、安装、卸载和依赖安装。 |
| `flocks admin ...` | 本地账号、安全 Token、历史会话和 Workspace 维护。 |
| `flocks export` | 导出会话 JSON。 |
| `flocks import` | 导入会话 JSON 或分享链接。 |
| `flocks stats` | 使用量、成本和历史记录回填。 |
| `flocks update` | 更新 Flocks。 |

### 2.2 服务与交互命令

| 命令 | 作用 | 常用示例 |
| --- | --- | --- |
| `flocks start` | 以守护进程方式启动后端和 WebUI。 | `flocks start --no-browser` |
| `flocks stop` | 停止后端和 WebUI。 | `flocks stop` |
| `flocks restart` | 重启后端和 WebUI。 | `flocks restart --server-port 8000` |
| `flocks status` | 查看后端和 WebUI 状态。 | `flocks status` |
| `flocks logs` | 查看后端和 WebUI 日志。 | `flocks logs --backend -n 100` |
| `flocks tui` | 启动 TUI 对话界面。 | `flocks tui --directory .` |
| `flocks browser` | 透传到内置浏览器运行时。 | `flocks browser --help` |
| `flocks update` | 执行版本更新。 | `flocks update` |
| `flocks serve` | 直接启动 Flocks API Server，隐藏命令，主要用于开发和调试。 | `flocks serve --host 127.0.0.1 --port 8000` |

常见选项：

- `flocks start/restart --no-browser`：启动后不自动打开浏览器。
- `flocks start/restart --skip-webui-build`：跳过 WebUI 构建。
- `flocks start/restart --server-host <host> --server-port <port>`：指定后端地址。
- `flocks start/restart --webui-host <host> --webui-port <port>`：指定 WebUI 地址。
- `flocks logs --backend`：只看后端日志。
- `flocks logs --webui`：只看 WebUI 日志。
- `flocks logs --follow/--no-follow`：是否持续跟随日志。
- `flocks tui --session <sessionID>`：继续指定会话。
- `flocks tui --auto-approve/--no-auto-approve`：控制 TUI 中工具调用是否自动批准。

`flocks run` 是 TUI / Node CLI 源码中的会话入口，不是当前 Python `flocks` 主 CLI 注册的稳定命令。通过 Python 包或 npm wrapper 使用时，应以 `flocks --help` 输出为准，通常使用 `flocks tui` 进入终端会话。

## 3. 会话 CLI

| 命令 | 作用 |
| --- | --- |
| `flocks session list` | 列出会话。 |
| `flocks session show <sessionID>` | 查看会话详情。 |
| `flocks session delete <sessionID>` | 删除会话，默认需要确认。 |
| `flocks session archive <sessionID>` | 归档会话。 |
| `flocks session restore <sessionID>` | 恢复已归档会话。 |

常用示例：

```bash
flocks session list -n 20
flocks session list --format json
flocks session list --project ""
flocks session show <sessionID>
flocks session delete <sessionID> --force
```

其中 `--project ""` 表示筛选当前项目的会话。

## 4. 任务中心 CLI

| 命令 | 作用 |
| --- | --- |
| `flocks task` | 默认显示任务中心概览。 |
| `flocks task dashboard` | 显示任务中心概览。 |
| `flocks task list` | 列出任务执行或调度。 |
| `flocks task show <taskID>` | 查看任务详情。 |
| `flocks task create <title>` | 创建任务。 |
| `flocks task queue` | 查看或控制任务队列。 |
| `flocks task scheduled` | 列出定时任务。 |
| `flocks task cancel <taskID>` | 取消任务。 |
| `flocks task retry <taskID>` | 重试失败任务。 |
| `flocks task rerun <taskID>` | 重新运行任务。 |

常用示例：

```bash
flocks task list --status running
flocks task list --type scheduled --format json
flocks task create "每日巡检" --type scheduled --cron "0 8 * * *" --prompt "执行设备巡检并发送摘要"
flocks task create "告警研判" --mode workflow --workflow ndr-alert-triage --prompt "处理这批告警"
flocks task queue --pause
flocks task queue --resume
```

任务创建常见参数：

- `--type queued|scheduled|stream`：任务类型。
- `--priority urgent|high|normal|low`：优先级。
- `--mode agent|workflow`：执行模式。
- `--agent <name>`：Agent 模式使用的 Agent。
- `--workflow <id>`：Workflow 模式使用的 Workflow。
- `--skill <name>`：注入 Skill，可重复使用。
- `--cron "<expr>"`：定时任务的 Cron 表达式。
- `--prompt "<text>"`：任务执行提示词。

## 5. MCP CLI

| 命令 | 作用 |
| --- | --- |
| `flocks mcp list` | 列出 MCP Server 和状态。 |
| `flocks mcp add` | 添加 MCP Server，未给参数时进入交互模式。 |
| `flocks mcp auth [name]` | 为 OAuth MCP Server 执行认证流程。 |
| `flocks mcp logout [name]` | 删除 MCP OAuth 凭证。 |
| `flocks mcp debug <name>` | 调试 MCP OAuth 状态。 |
| `flocks mcp connect <name>` | 连接 MCP Server。 |
| `flocks mcp disconnect <name>` | 断开 MCP Server。 |
| `flocks mcp tools [server]` | 列出 MCP 工具。 |
| `flocks mcp refresh [server]` | 刷新 MCP 工具。 |

常用示例：

```bash
flocks mcp list
flocks mcp list --format json
flocks mcp add --name github --type remote --url https://example.com/mcp
flocks mcp add --name local-tools --type local --command "uvx my-mcp-server"
flocks mcp tools
flocks mcp refresh github
```

## 6. Skills CLI

| 命令 | 作用 |
| --- | --- |
| `flocks skills list` | 列出已发现的 Skill。 |
| `flocks skills status` | 检查 Skill 依赖状态。 |
| `flocks skills find <query>` | 搜索可安装 Skill。 |
| `flocks skills install <source>` | 安装 Skill。 |
| `flocks skills remove <name>` | 卸载用户安装的 Skill。 |
| `flocks skills install-deps <name>` | 安装 Skill 声明的依赖。 |

常用示例：

```bash
flocks skills list --status
flocks skills list --json
flocks skills find "threat intel"
flocks skills install clawhub:github
flocks skills install github:owner/repo --skill skill-name
flocks skills install https://example.com/SKILL.md
flocks skills install /local/path/to/skill
flocks skills remove skill-name --yes
flocks skills install-deps skill-name
```

Skill 安装支持 `global` 和 `project` 作用域：

```bash
flocks skills install github:owner/repo/skills/foo --scope project
```

## 7. 账号与安全 CLI

| 命令 | 作用 |
| --- | --- |
| `flocks admin list-users` | 列出本地账号。 |
| `flocks admin generate-one-time-password --username admin` | 为管理员生成一次性临时密码。 |
| `flocks admin generate-api-token` | 生成并保存 API Token。 |
| `flocks admin set-api-token --token <token>` | 写入指定 API Token。 |
| `flocks admin reassign-orphan-sessions --username admin` | 将无归属历史会话归属到指定管理员。 |
| `flocks admin migrate-workspace-to-user --admin-user-id <user_id>` | 迁移历史单用户 Workspace 到多账号布局。 |

常用示例：

```bash
flocks admin list-users
flocks admin generate-one-time-password --username admin
flocks admin generate-api-token
flocks admin reassign-orphan-sessions --username admin --dry-run
flocks admin migrate-workspace-to-user --admin-user-id <user_id> --dry-run
```

## 8. 导入、导出与统计 CLI

### 8.1 导出会话

```bash
flocks export <sessionID>
flocks export <sessionID> -o session.json
flocks export <sessionID> --no-pretty
```

如果不传 `sessionID`，CLI 会列出最近会话并提示选择。

### 8.2 导入会话

```bash
flocks import session.json
flocks import session.json --project <projectID>
flocks import https://opncd.ai/share/<slug>
flocks import https://flocks.ai/share/<slug>
```

导入支持本地 JSON 文件，也支持 Flocks 分享链接。

### 8.3 使用统计

```bash
flocks stats
flocks stats --days 7
flocks stats --tools 0
flocks stats --models 10
flocks stats --project ""
flocks stats backfill --days 30
```

`flocks stats` 用于查看 Token、模型、工具和成本统计；`backfill` 用于从历史消息元数据回填使用记录。

## 9. 源码中可见但当前主入口未注册的命令

源码中还存在 `agent`、`debug`、`debug snapshot`、`acp` 等 Typer 命令定义，但当前 `flocks` 主 CLI 注册表未把这些命令挂到主入口。实际可用性请以 `flocks --help` 输出为准。

这些命令涉及：

- `agent list/show/permissions`：查看 Agent 和权限。
- `debug info/config`：查看调试信息和配置。
- `debug snapshot track/patch/diff/restore/cleanup`：调试 Snapshot。
- `acp`：Agent Client Protocol 相关能力。

相关功能在 WebUI、TUI 或内部调试链路中可能已有对应入口；普通用户日常使用时建议优先使用本页前面列出的稳定 CLI。会话内快捷操作请参考 [Flocks / 斜杠命令](/md/modules/slash-commands)。

## 10. 相关模块

- [Flocks / 斜杠命令](/md/modules/slash-commands)：WebUI、TUI、IM 和 CLI 会话里的 `/` 命令。
- [任务中心](/md/modules/tasks)：任务 CLI 与任务页面能力对应。
- [工具清单](/md/modules/tools)：`/tools`、`/mcp` 和 MCP CLI 对应页面。
- [Skills 技能库](/md/modules/skills)：Skills CLI 与 Skill 页面能力对应。
- [账号管理](/md/modules/accounts)：管理员密码恢复和账号 CLI。
