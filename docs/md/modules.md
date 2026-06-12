# 功能模块

各模块共同构成平台化安全运营能力：对话管理承载主交互入口，任务中心负责调度与持续运行，Workspace 管理项目边界和产物，Agent 定义执行角色，Skills 沉淀可复用经验，Workflow 定义稳定流程，设备管理连接安全设备和数据源，工具清单定义可执行动作，插件广场负责本地插件发现和安装，模型清单管理底层模型资源，通道管理负责外部消息触达，账号、审计和 Flocks Pro 提供企业级治理能力。

WebUI 主导航里，这些模块分组呈现：

- **AI 工作台**：[对话管理](/md/modules/sessions) · [任务中心](/md/modules/tasks) · [Workspace](/md/modules/workspace)
- **Agent 工作室**：[Agent 智能体](/md/modules/agents) · [Skills 技能库](/md/modules/skills) · [Workflow 工作流](/md/modules/workflow) · [设备管理](/md/modules/devices) · [工具清单](/md/modules/tools) · [插件广场](/md/modules/flocks-hub) · [模型清单](/md/llm_models) · [通道管理](/md/modules/channels)
- **系统中心**：[账号管理](/md/modules/accounts) · [审计日志](/md/modules/audit-logs) · [Flocks Pro](/md/modules/flocks-pro) · [Flocks CLI](/md/modules/cli) · [Flocks / 斜杠命令](/md/modules/slash-commands)

## 1. 能力选择原则

Skill、Agent / Subagent 与 Workflow 都用于承载具体任务能力，核心差异在于**流程固化程度、执行灵活性和主 Agent 参与方式**。

- **Workflow 工作流**
  - 定位：将任务步骤、工具调用和判断逻辑固化为稳定流程，既可以封装成可审计、可复现的自动化剧本，也可以作为对外提供稳定调用入口的流程服务。
  - 特点：既支持接收结构化 JSON 数据并发布成 API，也支持接收 syslog、Kafka 等流式输入并发布成流式任务；流程固定，执行结果稳定，适合标准化运行和持续运营。
  - 适用场景：高频、重复、规则明确、对一致性要求高的任务，以及需要对外提供标准化服务接口或持续处理实时数据流的场景，如告警研判、资产核查、IOC 批量查询、报告生成、安全设备日志处理、告警流消费和资产变更事件处理。
- **Agent / Subagent 智能体**
  - 定位：在预设 System Prompt 和固定工具集内，自主理解目标、规划路径并完成任务。
  - 特点：比 Workflow 更灵活，但仍受角色设定、上下文窗口和工具边界约束。
  - 适用场景：目标明确，但执行路径需要根据上下文动态调整的分析、检索、排障和处置任务。
- **Skill 技能**
  - 定位：由主 Agent 按需加载的能力包，用于提供方法论、操作规范、领域上下文和可复用经验。
  - 特点：灵活性最高，主 Agent 可以同时加载多个 Skill，组合完成跨领域、复杂或长链路任务。
  - 适用场景：需要主 Agent 统一编排、需要多种能力协同，或希望将经验持续沉淀并复用的任务。

选型时应优先依据任务性质判断。**要求稳定、可控、可重复的任务，优先使用 Workflow；要求智能判断、上下文适配和动态决策的任务，优先使用 Agent / Subagent 或 Skill；要求跨领域组合、长期演进和主 Agent 统一调度的任务，优先建设 Skill**。

组合设计应保持克制。一般不建议为了单一任务同时混合 Workflow、Agent / Subagent 和 Skill；除非任务本身确实存在清晰的分层边界和编排收益，否则过早组合多种机制容易增加理解、调试和维护成本，形成不必要的过度设计。

## 2. 核心模块

### 2.1 [对话管理](/md/modules/sessions)

对话管理是 Flocks 的主交互入口，也是多数任务的起点。用户在这里用自然语言向主 Agent `Rex` 描述目标，Rex 会结合当前会话上下文、Workspace 项目语境、可用工具、Workflow、Skills 和专家 Agent，决定下一步应该直接回答、调用工具、委派子 Agent，还是生成新的可复用能力。

> 典型用法：新建会话让 Rex 研判一条告警 · 在同一会话中继续追问和补充线索 · 将一次成功处置沉淀为 Agent / Workflow / Skill

---

### 2.2 [任务中心](/md/modules/tasks)

长期运行和调度能力。把一次性动作延伸成"持续运营动作"：周期巡检、批量告警清洗、日报周报生成、固定告警自动处置。支持基于 Agent 和基于 Workflow 两种执行模式。

> 典型用法：每小时拉 TDP 告警逐条研判 · 每日追踪工单进展 · 重点资产变化通知

---

### 2.3 [Workspace](/md/modules/workspace)

项目级组织边界。承载插件、工作流、技能、配置、任务产出和项目上下文。工作流生成的测试数据、Agent 巡检报告和结构化 JSON 通常会进入 Workspace 的 `outputs/` 目录。

> 典型用法：按客户 / 按项目隔离能力 · 产出物归档 · 跨会话引用同一批产物

---

### 2.4 [Agent 智能体](/md/modules/agents)

主 Agent `Rex` 是统一入口，负责理解目标、拆解任务、调度能力；专家 Agent 面向具体问题域，如情报分析、主机巡检、漏洞分析、Web 取数等。支持"**一句话创建子 Agent**"，Rex 会自己选合适的工具集、写 Prompt、做 ReAct 循环。

> 典型用法：创建 `Security Inspection` 子 Agent 巡检 TDP / OneSec · 固化成熟调查套路为数字员工

---

### 2.5 [Skills 技能库](/md/modules/skills)

承载经验、规范、方法论和任务模板。可以理解为"平台中可被加载和复用的经验层"。支持从 GitHub、URL、本地路径和 clawhub 安装技能；也支持一句话创建新 Skill。

> 典型用法：恶意 Skill 安全审计 · 告警研判方法论 · API 工具生成器 / 工作流生成器

---

### 2.6 [Workflow 工作流](/md/modules/workflow)

把动作组织成稳定剧本。Flocks 的 Workflow 支持通过自然语言生成，并在生成后执行自动校验、单节点测试和集成测试，适合沉淀标准化安全运营流程。

> 典型用法：NDR 告警研判工作流 · 钓鱼邮件处置剧本 · 固定类型告警标准处置

---

### 2.7 [设备管理](/md/modules/devices)

设备管理对应 WebUI 中的"数据源与设备"页面，用于统一管理安全设备和数据源接入能力，并为每个实例维护 API、web2cli、设备 Skill 三个维度。

> 典型用法：接入 NDR / 防火墙 / HIDS / SIEM · 维护设备 API 能力 · 把 Web 控制台动作沉淀为 web2cli · 绑定设备巡检 Workflow

---

### 2.8 [工具清单](/md/modules/tools)

平台可直接调用的执行能力包括内置工具、API 工具、本地工具和 MCP 服务。MCP 已整合进工具清单页，不再是独立一级菜单。用户提供 API 文档或 MCP 地址后，Rex 可以辅助生成工具并执行验证调试。

> 典型用法：快速接入 VT / ThreatBook / GreyNoise · 企业内部 API 统一包装 · 外部 MCP 服务接入

---

### 2.9 [插件广场](/md/modules/flocks-hub)

插件广场是 Flocks 的本地插件广场，用于发现、筛选、预览、安装和卸载随版本发布到本地的 Skill、Agent、Tool、Workflow 插件。它不是云上的插件市场；安装后的插件会进入对应模块，并刷新运行时能力。

> 典型用法：安装告警研判 Skill · 安装专家 Agent · 查看 Tool 插件权限和风险 · 把 bundled Workflow 安装到本机

---

### 2.10 [模型清单](/md/llm_models)

模型资源治理入口：管理 Provider、模型实例、默认模型和模型测试结果。首次配置 Flocks 必须先走通这里——配置顺序参见 [模型配置](/md/communication-models)，接入本地或第三方模型参见 [本地与第三方模型接入](/md/llm_models#本地与第三方模型接入)，模型报错排查参见 [模型报错排查](/md/llm_models#模型报错排查)。

> 典型用法：首次默认模型配置 · 多模型按任务分配 · 本地 / 第三方兼容 OpenAI 接入

---

### 2.11 [通道管理](/md/modules/channels)

通道管理用于配置飞书、企业微信、钉钉、Telegram、微信等 IM 通道，让 Rex 可以在团队协作入口接收消息，任务中心和 Workflow 也可以把结果推送到指定群或用户。

> 典型用法：群里 @Rex 触发研判 · 定时巡检结果发企微 · 告警研判报告推送飞书

---

### 2.12 [账号管理](/md/modules/accounts)

账号管理用于管理 WebUI 本地登录账号。开源 OSS 版只有一个 `admin` 账号；Flocks Pro 版支持多账号、角色管理、配额控制和账号操作审计。

> 典型用法：初始化 admin 账号 · 修改密码 · Pro 版创建 member 用户 · 重置临时密码

---

### 2.13 [审计日志](/md/modules/audit-logs)

审计日志是 Flocks Pro 功能，用于查询账号、授权和关键系统操作记录，支持按事件类型、用户、结果和时间范围筛选，并可导出 Excel。

> 典型用法：追踪谁创建了账号 · 复盘 License 激活操作 · 导出管理员操作记录

---

### 2.14 [Flocks Pro](/md/modules/flocks-pro)

Flocks Pro 是 Pro 升级和授权管理入口，用于云账号登录、提交升级申请、跟踪审批状态、安装 Pro bundle、查看 License 和同步授权信息。启用后可获得多账号、审计日志、授权额度管理等企业级能力。

> 典型用法：申请 30 天试用 · 安装 Pro 组件 · 查看 License 到期时间和授权额度

---

### 2.15 [Flocks CLI](/md/modules/cli)

集中整理 Flocks 终端 CLI 命令。适合快速查询服务启停、日志、任务、MCP、Skill、账号维护、会话导入导出等本机运维命令。

> 典型用法：查询 `flocks task` 用法 · 启动 `flocks tui` / `flocks run` · 找到管理员密码恢复命令

---

### 2.16 [Flocks / 斜杠命令](/md/modules/slash-commands)

集中整理 WebUI、TUI、CLI 会话和 IM 通道中可使用的 `/` 命令。适合在当前会话里查看工具、Skill、Agent、Workflow、MCP、任务队列和 IM 会话状态。

> 典型用法：查看 `/tools info` · 使用 `/new` 重新开始会话 · 用 `/status` 查看 IM 对话绑定的 Session

## 3. 模块之间如何配合

如果你是第一次理解 Flocks，可以用下面这条主线来记忆模块关系：

1. 在 [模型清单](/md/llm_models) 完成默认模型配置
2. 在 WebUI 的 [对话管理](/md/modules/sessions) 向 `Rex` 提出目标
3. 让 `Rex` 按需调用 [工具](/md/modules/tools)、加载 [Skills](/md/modules/skills)、委派 [Agent](/md/modules/agents)、连接 [设备](/md/modules/devices) 或生成 [Workflow](/md/modules/workflow)
4. 在 [任务中心](/md/modules/tasks) 把一次性能力变成长期运行能力
5. 在 [插件广场](/md/modules/flocks-hub) 中安装新的 Skill、Agent、Tool 或 Workflow 插件
6. 用 [通道管理](/md/modules/channels) 把结果发到协作入口
7. 在 [Skills](/md/modules/skills) 和 [Workspace](/md/modules/workspace) 中沉淀经验与项目资产
8. 在 Pro 场景下，用 [账号管理](/md/modules/accounts)、[审计日志](/md/modules/audit-logs) 和 [Flocks Pro](/md/modules/flocks-pro) 管理企业级治理能力

理解这条链路后，可以更清晰地区分各功能入口的职责，并围绕业务场景组合使用平台能力。

### 3.5 文件与配置

以下按两类目录理解即可：

- 一类是**用户目录** `~/.flocks/`，负责保存用户信息运行配置、插件和业务产物，用户目录更新不受影响；
- 另一类是**源码目录** `flocks/`，负责保存程序代码、前端、脚本和测试。Windows 可将 `~` 理解为 `%USERPROFILE%`。

**用户目录 `~/.flocks/`**


| 目录                     | 功能作用                                                                            |
| ---------------------- | ------------------------------------------------------------------------------- |
| `~/.flocks/config/`    | 配置目录，保存 `flocks.json`、`.secret.json` 等运行配置与敏感凭证。                                |
| `~/.flocks/data/`      | 运行数据目录，保存数据库、会话记录、记忆、媒体缓存、Workflow 服务数据、沙箱状态等系统数据。                              |
| `~/.flocks/logs/`      | 日志目录，保存服务端、任务、工具调用、通道和排障相关日志。                                                   |
| `~/.flocks/workspace/` | 用户业务工作区，保存上传文件、输出结果、知识资料、通道状态等用户可管理产物。                                          |
| `~/.flocks/plugins/`   | 用户级插件目录，保存安装到当前用户环境的 Agent、Skill、Workflow、Tool、Task、MCP 和自定义页面等能力。              |
| `~/.flocks/flockshub/` | 本地插件广场目录，保存 bundled 插件索引、分类信息和待安装插件内容。                                          |
| `~/.flocks/browser/`   | 浏览器自动化运行目录，保存浏览器控制、临时状态和相关运行文件。                                                 |
| `~/.flocks/version/`   | 版本与升级备份目录，保存当前版本标记、升级过程备份和回滚相关文件。                                               |
| `~/.flocks/flockspro/` | Flocks Pro 数据目录，保存 Pro 授权、License 等企业版相关本地文件。                                   |
| `~/.flocks/run/`       | 运行状态目录，保存启动、组件安装标记和进程运行期间需要记录的状态文件。                                             |
| `~/.flocks/audit/`     | 审计目录，保存本机敏感操作的审计记录，例如 SSH 命令审计日志。                                               |
| `~/.flocks/workflow/`  | 旧版 Workflow 兼容目录，历史工作流可能仍会被扫描；新工作流优先使用 `~/.flocks/plugins/`。                    |
| `~/.flocks/mcp/`       | 旧版 MCP 依赖目录，历史本地 MCP 安装可能使用；新配置优先进入 `~/.flocks/plugins/` 与 `~/.flocks/config/`。 |


**源码目录 `flocks/`**


| 目录                                         | 功能作用                                                              |
| ------------------------------------------ | ----------------------------------------------------------------- |
| `flocks/flocks/`                           | Python 主程序目录，包含服务端、Agent、Workflow、Tool、Workspace、通道、配置等核心实现。      |
| `flocks/webui/`                            | WebUI 前端目录，包含页面、组件、静态资源和前端构建配置。                                   |
| `flocks/tui/`                              | TUI 终端界面目录。                                                       |
| `flocks/scripts/`                          | 安装、启动、构建、辅助处理等脚本目录。                                               |
| `flocks/tests/`                            | 测试目录，包含单元测试、集成测试和模块级测试。                                           |
| `flocks/assets/`                           | 项目文档或展示用静态资源目录。                                                   |
| `flocks/docker/`                           | Docker 相关文件目录。                                                    |
| `flocks/packaging/`                        | 打包与发布目录，例如 Windows 安装包相关文件。                                       |
| `flocks/.flocks/`                          | 仓库内置示例与默认插件目录，提供示例配置、bundled 插件和开发期默认内容，不等同于用户家目录下的 `~/.flocks/`。 |
| `flocks/README.md` / `flocks/README_zh.md` | 项目安装、启动与使用说明入口。                                                   |


### 3.6 网络访问清单

在受限网络中部署 Flocks 时，不建议一次性放开全部公网访问，而应按**本机访问**、**安装/升级**和**运行期按功能放行**三类最小化配置。

1. 本机或内网访问 Flocks
  - 客户端访问 Flocks WebUI：`5173/tcp`
  - 浏览器或脚本直连后端 API 时访问：`8000/tcp`
  - 如果前面有反向代理，则按实际代理地址放行 `80/443`
2. 在线安装或升级阶段需要访问的出站 Host

国内环境默认使用 `install_zh` 链路：


| 用途         | Host                     |
| ---------- | ------------------------ |
| 源码与安装脚本    | `gitee.com`              |
| Python 包索引 | `mirrors.aliyun.com`     |
| npm 包索引    | `registry.npmmirror.com` |
| 浏览器依赖下载    | `cdn.npmmirror.com`      |
| uv 安装脚本    | `astral.org.cn`          |
| uv 备用源     | `uv.agentsmirror.com`    |
| uv 官方回退源   | `astral.sh`              |


国外环境默认使用 `install` 链路：


| 用途               | Host                        |
| ---------------- | --------------------------- |
| 源码仓库与压缩包         | `github.com`                |
| 一键安装脚本与 nvm 安装脚本 | `raw.githubusercontent.com` |
| Python 包索引       | `pypi.org`                  |
| npm 包索引          | `registry.npmjs.org`        |
| uv 安装脚本          | `astral.sh`                 |
| Node.js 手动下载页    | `nodejs.org`                |


Docker 在线拉镜像时，还需要放行 `ghcr.io`，或你们实际使用的 GHCR 镜像域名。如果你们通过环境变量覆写了 npm、PyPI、uv、nvm 或镜像地址，则应以实际覆写后的 Host 为准，而不是以上默认值。

1. 运行期最小必需外联
  - 放行你在 Flocks 中实际配置的大模型 `Base URL` 对应 Host
  - 如果只做离线 Docker 导入镜像部署，且模型、情报、通道都走内网或本地服务，则 Flocks 本体运行本身不强依赖公网
2. ThreatBook 相关能力
  - 大模型与引导场景可能涉及：`llm.threatbook.cn`、`llm.threatbook.io`
  - 引导页、服务接入与 MCP 相关访问可能涉及：`x.threatbook.com`、`threatbook.io`、`mcp.threatbook.cn`
3. IM 通道按需放行
  - 飞书：`open.feishu.cn`
  - 飞书国际版：`open.larksuite.com`
  - 钉钉：`api.dingtalk.com`
  - 企业微信：`openws.work.weixin.qq.com`
  - 企业微信 `wecom_mcp` 场景：还需要额外放行企业微信运行时动态返回的 MCP URL 对应 Host
  - 微信：`ilinkai.weixin.qq.com`、`novac2c.cdn.weixin.qq.com`
  - Telegram：`api.telegram.org`

- 仅本地使用：放行 WebUI / API 访问端口，加上模型服务 Host 即可。
- 需要在线安装：在最小集合上，再增加安装与升级阶段的依赖站点。
- 需要情报或 IM 集成：再按 ThreatBook、飞书、钉钉、企微、微信、Telegram 等启用项逐项加白，而不是全部放开。

---

相关：[项目概览](/md/overview) · [快速开始](/md/quick-start) · [模型配置](/md/communication-models) · [部署与配置](/md/communication) · [场景实践](/md/scenarios) · [运维与排障](/md/operations)