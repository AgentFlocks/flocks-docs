# 功能模块

这一页按 WebUI 的实际导航整理 Flocks 的核心功能模块。各模块共同构成平台化安全运营能力：Agent 定义执行角色，Workflow 定义稳定流程，任务中心负责调度与持续运行，Workspace 管理项目边界和产物，Flocks Hub 负责插件分发与安装，工具定义可执行动作，Skills 沉淀可复用经验，模型清单管理底层模型资源。

WebUI 主导航里，这些模块分两组呈现：

- **AI 工作台**：[会话管理](/md/overview#会话管理与主交互面) · [任务中心](/md/modules/tasks) · [Workspace](/md/modules/workspace)
- **Agent 工作室**：[Agent 智能体](/md/modules/agents) · [Workflow 工作流](/md/modules/workflow) · [Flocks Hub 插件广场](/md/modules/hub) · [Skills 技能库](/md/modules/skills) · [工具清单 / MCP](/md/modules/tools) · [模型清单](/md/llm_models) · [通道配置](/md/communication)

## 能力选择原则

Skill、Agent / Subagent 与 Workflow 都用于承载具体任务能力，核心差异在于**流程固化程度、执行灵活性和主 Agent 参与方式**。

- **Workflow 工作流**
  - 定位：将任务步骤、工具调用和判断逻辑固化为稳定流程，最接近可审计、可复现的自动化剧本。
  - 特点：流程固定，执行结果稳定，适合标准化运行和持续运营。
  - 适用场景：高频、重复、规则明确、对一致性要求高的任务。
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

## 核心模块

### [Agent 智能体](/md/modules/agents)

主 Agent `Rex` 是统一入口，负责理解目标、拆解任务、调度能力；专家 Agent 面向具体问题域，如情报分析、主机巡检、漏洞分析、Web 取数等。支持"**一句话创建子 Agent**"，Rex 会自己选合适的工具集、写 Prompt、做 ReAct 循环。

> 典型用法：创建 `Security Inspection` 子 Agent 巡检 TDP / OneSec · 固化成熟调查套路为数字员工

---

### [Workflow 工作流](/md/modules/workflow)

把动作组织成稳定剧本。Flocks 的 Workflow 支持通过自然语言生成，并在生成后执行自动校验、单节点测试和集成测试，适合沉淀标准化安全运营流程。

> 典型用法：NDR 告警研判工作流 · 钓鱼邮件处置剧本 · 固定类型告警标准处置

---

### [任务中心](/md/modules/tasks)

长期运行和调度能力。把一次性动作延伸成"持续运营动作"：周期巡检、批量告警清洗、日报周报生成、固定告警自动处置。支持基于 Agent 和基于 Workflow 两种执行模式。

> 典型用法：每小时拉 TDP 告警逐条研判 · 每日追踪工单进展 · 重点资产变化通知

---

### [Workspace](/md/modules/workspace)

项目级组织边界。承载插件、工作流、技能、配置、任务产出和项目上下文。工作流生成的测试数据、Agent 巡检报告和结构化 JSON 通常会进入 Workspace 的 `outputs/` 目录。

> 典型用法：按客户 / 按项目隔离能力 · 产出物归档 · 跨会话引用同一批产物

---

### [Flocks Hub 插件广场](/md/modules/hub)

Flocks Hub 是平台内置的"插件广场 / 能力分发层"。它把 Skill、Agent、Tool、Device、Workflow 这些可安装能力统一放到一个入口中，支持浏览、筛选、预览详情、安装、更新和卸载。相比直接在文件系统里手动拷贝插件，Hub 更适合做标准化分发、版本管理和本机快速启用。

> 典型用法：安装官方 Skill / Agent 包 · 预览 workflow.json 再决定是否启用 · 统一更新本地插件版本

---

### [工具清单 / MCP](/md/modules/tools)

平台可直接调用的执行能力包括内置工具、API 工具、本地工具和 MCP 服务。MCP 已整合进工具清单页，不再是独立一级菜单。用户提供 API 文档或 MCP 地址后，Rex 可以辅助生成工具并执行验证调试。

> 典型用法：快速接入 VT / ThreatBook / GreyNoise · 企业内部 API 统一包装 · 外部 MCP 服务接入

---

### [Skills 技能库](/md/modules/skills)

承载经验、规范、方法论和任务模板。可以理解为"平台中可被加载和复用的经验层"。支持从 GitHub、URL、本地路径和 clawhub 安装技能；也支持一句话创建新 Skill。

> 典型用法：恶意 Skill 安全审计 · 告警研判方法论 · API 工具生成器 / 工作流生成器

---

### [模型清单](/md/llm_models)

模型资源治理入口：管理 Provider、模型实例、默认模型和模型测试结果。首次配置 Flocks 必须先走通这里——配置顺序参见 [模型配置](/md/llm_models)，接入本地或第三方模型参见 [本地与第三方模型接入](/md/llm_models#本地与第三方模型接入)，模型报错排查参见 [模型报错排查](/md/llm_models#模型报错排查)。

> 典型用法：首次默认模型配置 · 多模型按任务分配 · 本地 / 第三方兼容 OpenAI 接入

## 模块之间如何配合

如果你是第一次理解 Flocks，可以用下面这条主线来记忆模块关系：

1. 在 [模型清单](/md/llm_models) 完成默认模型配置
2. 在 WebUI 的 **会话面板**向 `Rex` 提出目标（参见 [会话管理与主交互面](/md/overview#会话管理与主交互面)）
3. 让 `Rex` 按需调用 [工具](/md/modules/tools)、委派 [Agent](/md/modules/agents) 或生成 [Workflow](/md/modules/workflow)
4. 在 [任务中心](/md/modules/tasks) 把一次性能力变成长期运行能力
5. 在 [Skills](/md/modules/skills) 和 [Workspace](/md/modules/workspace) 中沉淀经验与项目资产

理解这条链路后，可以更清晰地区分各功能入口的职责，并围绕业务场景组合使用平台能力。

---

相关：[项目概览](/md/overview) · [快速开始](/md/quick-start) · [模型配置](/md/llm_models) · [部署与配置](/md/communication) · [场景实践](/md/scenarios) · [运维与排障](/md/operations)
