# 附录

- 演示视频：[查看](https://mp.weixin.qq.com/s/Y3TZH-4JxS1hiVtJk9RLzw?version=5.0.7.99844&platform=mac)
- 发布会直播回放：[查看](https://weixin.qq.com/sph/AfahBdDcYd)

## Flocks 白皮书

- 在线预览：下方嵌入的即为完整 PDF
- 直接下载：[Flocks 白皮书.pdf](/flocks-docs/downloads/flocks-whitepaper.pdf)

## Flocks 快速安装指南

- 在线预览：下方嵌入的即为完整 PDF
- 直接下载：[Flocks 快速安装指南 v2.0.pdf](/flocks-docs/downloads/flocks-install-guide.pdf)

> 如浏览器无法内嵌预览 PDF（例如部分移动端或企业环境），请点击上方"直接下载"链接查看。

## CLI 参考

执行 `flocks --help` 可以看到当前 CLI 的主命令。对日常使用最关键的是下面这些：


| 命令                                | 作用             | 常见场景                |
| --------------------------------- | -------------- | ------------------- |
| `flocks start`                    | 启动后端和 WebUI    | 首次启动、日常运行           |
| `flocks stop`                     | 停止后端和 WebUI    | 升级前、排障前、重启前         |
| `flocks restart`                  | 重启服务           | 修改配置后重启、显式全量重启      |
| `flocks status`                   | 查看当前运行状态       | 判断服务是否真正启动          |
| `flocks logs`                     | 查看后端和 WebUI 日志 | 排查启动、模型、工具和页面问题     |
| `flocks update`                   | 升级到最新版本        | 页面升级或手动升级之外的 CLI 入口 |
| `flocks task`                     | 管理任务中心相关能力     | 队列任务、定时任务           |
| `flocks session`                  | 管理会话           | 导出、排查或批量处理会话        |
| `flocks mcp`                      | 管理 MCP 服务      | MCP 接入、状态检查         |
| `flocks skills`                   | 管理 Skills      | 技能安装、启用和查看          |
| `flocks export` / `flocks import` | 导出或导入会话数据      | 迁移和备份               |
| `flocks stats`                    | 查看使用统计         | 快速确认运行数据            |


最常见的组合命令通常是：

```bash
flocks start
flocks status
flocks logs
```

如果需要升级或恢复环境，常见组合则是：

```bash
flocks stop
flocks restart
```

## 配置项索引

`flocks.json` 或示例配置里的几个高频配置域，可以先按职责来理解，而不是逐个字段死记。


| 配置域              | 作用               | 你通常在什么时候改它                     |
| ---------------- | ---------------- | ------------------------------ |
| `provider`       | 定义模型供应商、适配器和模型集合 | 接入 OpenAI Compatible、本地模型、自建网关 |
| `api_services`   | 定义外部安全服务是否启用     | 接 TDP、ThreatBook、Qingteng 等平台  |
| `mcp`            | 定义 MCP 服务接入      | 用 MCP 扩展外部上下文或工具能力             |
| `channels`       | 定义消息通道           | 接飞书、企微、钉钉、Telegram             |
| `sandbox`        | 定义执行隔离方式         | 团队化运行、需要更强边界控制时                |
| `server`         | 定义服务层行为          | 调整 CORS 或服务访问相关配置              |
| `allowReadPaths` | 定义允许读取的路径        | 需要显式授权额外读路径时                   |
| `updater`        | 定义升级源和升级策略       | 调整 GitHub / Gitee 更新来源时        |


如果你是第一次配置 Flocks，优先掌握 `provider`、`channels` 和 `api_services` 就足够；其余配置更适合在扩展接入或团队部署阶段再深入。

## API 参考

首版文档暂时不手写一份低价值的接口清单，而是建议你从以下两个方向理解 Flocks API：

1. 从 WebUI 的实际页面行为反推常用接口
2. 从后端路由或 OpenAPI 输出查看完整定义

对普通使用者来说，真正高频的 API 通常集中在：

- 会话管理
- 模型管理
- 工具与 MCP
- Workflow 执行
- 任务中心
- 通道状态与配置

如果后续要补完整 API 文档，更推荐基于实际后端路由或 OpenAPI 自动生成，而不是手工维护一份容易过期的表格。

## 术语表

### Rex

Flocks 默认的主 Agent，通常承担总控、分析和调度职责。

### Agent

可独立接收目标并执行任务的智能体。它可以直接完成工作，也可以再委派子 Agent。

### Workflow

把一组分析步骤、节点关系和输入输出约束组织成可复用流程的运行单元。它既可以手工维护，也可以通过自然语言描述生成。

### Skill

为 Agent 提供专门领域知识、固定流程或接入规范的能力包。

### MCP

Model Context Protocol。用于把外部上下文服务或工具能力以统一协议接入 Flocks。

### Workspace

Flocks 运行时用于保存输入、输出、中间产物和报告的工作区。

### Provider

模型供应商或模型适配入口。它描述模型从哪里来、通过什么接口访问。

### Task

由系统排队、执行和记录状态的任务单元，可表现为即时任务、定时任务或 API 服务任务。

### Channel

把消息发送到飞书、企业微信、钉钉、Telegram 等外部触点的通道能力。

### Sandbox

用于限制执行环境、权限范围和资源边界的运行隔离机制。