# 主模块

这一页按 WebUI 的实际导航整理 Flocks 的核心功能模块。可以把它们看成同一套平台的不同工作面：**Agent 决定谁来做、Workflow 决定怎么做、工具决定动作本身、任务中心决定何时持续做、Workspace 决定项目边界、Skills 决定经验如何复用、模型清单决定背后用哪套大脑**。

WebUI 主导航里，这些模块分两组呈现：

- **AI 工作台**：[会话管理](/md/overview#会话管理与主交互面) · [任务中心](/md/modules/tasks) · [Workspace](/md/modules/workspace)
- **Agent 工作室**：[Agent 智能体](/md/modules/agents) · [Workflow 工作流](/md/modules/workflow) · [Skills 技能库](/md/modules/skills) · [工具清单 / MCP](/md/modules/tools) · [模型清单](/md/integrations#模型配置) · [通道配置](/md/communication)

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

## 七个核心模块

### [Agent 智能体](/md/modules/agents)

主 Agent `Rex` 是统一入口，负责理解目标、拆解任务、调度能力；专家 Agent 面向具体问题域，如情报分析、主机巡检、漏洞分析、Web 取数等。支持"**一句话创建子 Agent**"，Rex 会自己选合适的工具集、写 Prompt、做 ReAct 循环。

> 典型用法：创建 `Security Inspection` 子 Agent 巡检 TDP / OneSec · 固化成熟调查套路为数字员工

---

### [Workflow 工作流](/md/modules/workflow)

把动作组织成稳定剧本。区别于 Dify / N8N 的手工拖拽，Flocks 的 Workflow 是**语言生成 + 自动校验 + 单点 / 集成测试**——Rex 搭完架子后还会逐节点跑测试数据，通过后才算完成。

> 典型用法：NDR 告警研判工作流 · 钓鱼邮件处置剧本 · 固定类型告警标准处置

---

### [任务中心](/md/modules/tasks)

长期运行和调度能力。把一次性动作延伸成"持续运营动作"：周期巡检、批量告警清洗、日报周报生成、固定告警自动处置。支持基于 Agent 和基于 Workflow 两种执行模式。

> 典型用法：每小时拉 TDP 告警逐条研判 · 每日追踪工单进展 · 重点资产变化通知

---

### [Workspace](/md/modules/workspace)

项目级组织边界。承载插件、工作流、技能、配置、任务产出和项目上下文——工作流生成的测试数据、Agent 的巡检报告、结构化 JSON 都会进 `artifacts/` 目录下。

> 典型用法：按客户 / 按项目隔离能力 · 产出物归档 · 跨会话引用同一批产物

---

### [工具清单 / MCP](/md/modules/tools)

平台可直接调用的执行能力：内置工具、API 工具、本地工具、MCP 服务。**MCP 已整合进工具清单页**，不再是独立一级菜单。支持一句话接入：给 Rex 一份 API 文档或 MCP 地址，平台自动生成工具 + 验证 + 调试。

> 典型用法：快速接入 VT / ThreatBook / GreyNoise · 企业内部 API 统一包装 · 外部 MCP 服务接入

---

### [Skills 技能库](/md/modules/skills)

承载经验、规范、方法论和任务模板。可以理解为"平台中可被加载和复用的经验层"。支持从 GitHub、URL、本地路径和 clawhub 安装技能；也支持一句话创建新 Skill。

> 典型用法：恶意 Skill 安全审计 · 告警研判方法论 · API 工具生成器 / 工作流生成器

---

### [模型清单](/md/integrations#模型配置)

模型资源治理入口：管理 Provider、模型实例、默认模型和模型测试结果。首次配置 Flocks 必须先走通这里——配置顺序参见 [模型配置](/md/integrations#模型配置)，接入本地或第三方模型参见 [本地与第三方模型接入](/md/integrations#本地与第三方模型接入)，模型报错排查参见 [模型报错排查](/md/integrations#模型报错排查)。

> 典型用法：首次默认模型配置 · 多模型按任务分配 · 本地 / 第三方兼容 OpenAI 接入

## 模块之间如何配合

如果你是第一次理解 Flocks，可以用下面这条主线来记忆模块关系：

1. 在 [模型清单](/md/integrations#模型配置) 完成默认模型配置
2. 在 WebUI 的 **会话面板**向 `Rex` 提出目标（参见 [会话管理与主交互面](/md/overview#会话管理与主交互面)）
3. 让 `Rex` 按需调用 [工具](/md/modules/tools)、委派 [Agent](/md/modules/agents) 或生成 [Workflow](/md/modules/workflow)
4. 在 [任务中心](/md/modules/tasks) 把一次性能力变成长期运行能力
5. 在 [Skills](/md/modules/skills) 和 [Workspace](/md/modules/workspace) 中沉淀经验与项目资产

理解了这条链路，再回头看各个页面，就不会把它们误解成零散的功能入口，而会更容易看清 Flocks 的平台化价值。

---

相关：[项目概览](/md/overview) · [快速开始](/md/quick-start) · [模型与接入](/md/integrations) · [通信配置](/md/communication) · [场景案例](/md/scenarios) · [运维与排障](/md/operations)
