# Skills 技能库

Skills 承载 Flocks 中可复用的经验资产，包括规范、策略、手册、方法论、检查清单和任务模板。如果说工具定义可执行动作，Workflow 定义稳定流程，Agent 定义角色和职责，那么 Skill 定义的是 Agent 在特定场景下应遵循的方法。

Skill 不是脚本、工具或 Agent，而是加载到 Agent 运行时中的方法论资产。它通常以 `SKILL.md` 为主体，并可附带脚本、参考文件或模板。当 Agent 处理某类任务时，可以加载对应 Skill，使推理过程、检查顺序和输出格式更加稳定。

## 1. 功能定位

### 1.1 Skill 解决什么问题

Skill 回答的是"**这类任务应该按什么方法判断和执行**"。它适合沉淀经验、规范和方法，而不是固化每一步动作。

一个典型 Skill 可以包含：

- **适用场景**：说明什么时候应该加载这个 Skill。
- **方法论**：定义检查顺序、判断标准、推理框架和注意事项。
- **输出格式**：约定报告结构、风险等级、证据列表和处置建议。
- **依赖声明**：说明需要哪些工具、MCP、脚本或外部环境。
- **辅助文件**：包括参考资料、模板、示例数据或只读脚本。

### 1.2 Skill 与其他模块的关系

| 模块 | 关系 |
| --- | --- |
| [对话管理](/md/modules/sessions) | 用户可以在会话中让 Rex 加载、创建、审计或调整 Skill。 |
| [Agent 智能体](/md/modules/agents) | Agent 是 Skill 的主要加载者；Skill 会影响 Agent 的推理和动作选择。 |
| [Workflow 工作流](/md/modules/workflow) | Workflow 固化流程，Skill 提供方法论；Workflow 的 Agent 节点也可以加载 Skill。 |
| [工具清单](/md/modules/tools) | Skill 可以声明依赖的工具或 MCP。 |
| [Workspace](/md/modules/workspace) | Skill 支持用户级和项目级存储，项目级 Skill 随 Workspace 管理。 |

### 1.3 平台内置 Skill

Flocks 自身也用 Skill 承载平台建设能力。典型内置 Skill 包括 `tool-builder`、`workflow-builder`、`agent-builder`、`find-skills` 等，它们说明 Skill 不只是业务方法论，也可以用于指导 Rex 生成工具、工作流和 Agent。

## 2. 适用场景

### 2.1 适合使用 Skill 的情况

- **希望沉淀判断方法**：例如告警研判、恶意样本分析、漏洞影响评估、主机排查清单。
- **希望统一输出格式**：让不同 Agent 都按同一套报告结构输出。
- **希望复用团队经验**：把专家经验、规范、处置手册转化为可加载资产。
- **任务路径有弹性**：不适合写死成 Workflow，但需要稳定的检查顺序和判断标准。
- **多个 Agent 都会用到同一套方法**：例如多个安全 Agent 都需要加载同一个 IOC 研判方法。

### 2.2 不适合使用 Skill 的情况

- 如果要稳定执行一串动作，优先做 [Workflow](/md/modules/workflow)。
- 如果要固定一类任务的专业执行角色，优先做 [Agent](/md/modules/agents)。
- 如果只是一次性临时问题，直接在会话里交给 Rex 处理即可。

简单判断原则：

- 下次应该怎么判断，做 Skill。
- 下次自动跑同一串步骤，做 Workflow。
- 下次固定交给某个角色处理，做 Agent。

## 3. 创建和安装 Skill 的方式

### 3.1 方式一：页面按钮安装

在 **Skills 技能库** 页面点击 **安装技能** 按钮，输入 Skill 来源后即可安装。当前页面支持的来源形式包括：

```text
clawhub:github
github:owner/repo
https://raw.githubusercontent.com/...
/local/path/to/skill
```

安装完成后，页面会刷新 Skill 列表。如果 Skill 声明了依赖但当前环境未满足，页面会提示缺少依赖，并可继续执行"安装依赖"操作。

### 3.2 方式二：命令行安装

也可以通过 Flocks CLI 安装 Skill：

```bash
flocks skills install clawhub:github
flocks skills install github:owner/repo
flocks skills install https://raw.githubusercontent.com/...
flocks skills install /local/path/to/skill
```

如果一个仓库里包含多个 Skill，可以用 `--skill` 指定子目录：

```bash
flocks skills install github:owner/repo --skill find-skills
```

默认安装到用户级目录。需要安装到当前项目时，可以指定 scope：

```bash
flocks skills install github:owner/repo --scope project
```

安装后可以查看状态并安装依赖：

```bash
flocks skills status
flocks skills install-deps <skill-name>
```

常用命令汇总：

| 命令 | 用途 |
| --- | --- |
| `flocks skills list` | 查看已安装 Skill。 |
| `flocks skills status` | 查看 Skill 状态和依赖情况。 |
| `flocks skills find <query>` | 搜索可安装或已知 Skill。 |
| `flocks skills install <source>` | 从 clawhub、GitHub、URL 或本地路径安装 Skill。 |
| `flocks skills remove <name>` | 删除指定 Skill。 |
| `flocks skills install-deps <skill-name>` | 安装 Skill 声明的依赖。 |

如果通过 npm wrapper 使用，也应使用复数命令组。npm wrapper 会透传到 Python `flocks` CLI，不会把单数 `skill` 自动改写为 `skills`：

```bash
npx @flocks-ai/flocks skills install clawhub:github
npx @flocks-ai/flocks skills install github:owner/repo
```

在 Flocks Python CLI 中，正式命令组是复数 `flocks skills ...`。

### 3.3 方式三：通过 Rex 从外部来源安装

可以从 clawhub、URL、GitHub 或团队内部仓库安装 Skill，例如在会话中对 Rex 说：

```text
从 clawhub 安装 <skill-name>
```

或：

```text
从 <URL> 安装这个 Skill，并检查依赖是否满足。
```

外部 Skill 安装前建议先做安全审计，尤其要检查 Prompt 注入、隐藏脚本、网络外发、硬编码凭据和功能描述欺骗。

### 3.4 方式四：从本地目录安装

把 Skill 目录整体放到 Flocks 的 Skill 目录下即可安装。注意应复制包含 `SKILL.md` 的完整 Skill 文件夹，而不是只复制 `SKILL.md` 单文件，也不是复制其上级父目录。

### 3.5 方式五：让 Rex 创建 Skill

可以直接在会话中让 Rex 创建：

```text
帮我创建一个「检测恶意 Skill」的 Skill。

目标：扫描从 clawhub 等外部来源下载的 Skill，判断是否存在安全风险。

检查方向：
- 异常字符 / Prompt 注入
- 可执行命令 / Bash 命令执行
- 网络连接 / 数据外发
- 功能描述与实际行为不一致
- Base64 或其他混淆
- 硬编码 IP / 密码 / C2 地址
- 引导 Agent 忽略安全护栏

输出：风险等级（Critical / High / Medium / Safe）+ 证据列表 + 处置建议
```

### 3.6 方式六：从一次成功任务中沉淀 Skill

当 Rex 或某个 Agent 已经跑通了一次任务，并且其中的判断方法值得复用，可以继续说：

```text
基于刚才的研判过程，帮我沉淀一个可复用的 Skill。
重点保留判断标准、检查顺序、证据要求、风险分级和输出格式。
```

这种方式适合把个人经验或一次成功处置转化为团队可复用的方法论资产。

## 4. WebUI 操作流程

### 4.1 进入 Skills 页面

在侧栏进入 **Agent 工作室 → Skills 技能库**。页面通常会显示：

- 当前 Workspace / 用户级已安装的 Skill。
- Skill 来源，例如内置、clawhub、GitHub、URL、本地目录。
- 状态，例如可用、未加载、依赖未满足。
- `SKILL.md` 内容和依赖信息。
- 安装、删除、刷新、审计或查看详情入口。

### 4.2 Rex 生成 Skill

通过自然语言创建 Skill 时，Rex 通常会：

1. 参考已有 Skill 的目录结构和 `SKILL.md` 格式。
2. 创建新的 Skill 目录。
3. 生成 `SKILL.md`。
4. 根据需要生成辅助脚本、模板或参考文件。
5. 检查依赖工具和使用边界。
6. 在 Skills 列表中呈现新 Skill。

Skill 的 `SKILL.md` 通常需要写得比较完整，因此生成耗时可能比创建简单 Agent 更长。

### 4.3 加载和使用 Skill

在会话中可以明确要求 Rex 或某个 Agent 加载 Skill：

```text
用 Skill Security Audit 对 NakedIn 和 SystemOptimizer 这两个 Skill 做审计。
```

Skill 被加载后，Agent 会按照 `SKILL.md` 中的方法论、检查顺序和输出格式推进任务。

### 4.4 通过 Rex-junior 动态执行 Skill

Rex 也可以把某个 Skill 委派给 `Rex-junior` Agent，在一个独立子 Agent 空间中执行。此时 Skill 会作为 `Rex-junior` 的 System Prompt 使用，相当于动态创建一个临时专家角色。

这种模式适合临时需要某个方法论，但还没有必要创建长期专家 Agent 的任务。如果某个 Skill 经常通过 `Rex-junior` 执行，且边界和工具集逐渐稳定，可以进一步沉淀为正式 Agent。

### 4.5 会话中的 /skills 命令

在 WebUI 会话、TUI 或 CLI 会话中，可以直接使用 `/skills` 查看当前可用 Skill。

| 命令 | 作用 |
| --- | --- |
| `/skills` 或 `/skills list` | 列出当前可用 Skill 名称和描述。 |
| `/skills refresh` | 重新扫描并刷新 Skill 列表。 |

例如：

```text
/skills
/skills refresh
```

如果 Agent 没有按预期加载某个 Skill，先用 `/skills` 确认这个 Skill 是否已被系统识别，再检查 `SKILL.md` 的名称、描述和适用场景是否清楚。

### 4.6 TUI 中查看和安装 Skill

TUI 支持在会话中查看 Skill 列表，并提供 Skill 安装弹窗。常见用法包括：

- 在输入框使用 `/skills` 查看可用 Skill。
- 打开 Skill 弹窗查看 Skill 描述、路径和依赖状态。
- 通过安装弹窗从 `clawhub:`、`github:`、URL 或本地路径安装 Skill。
- 安装后如提示缺少依赖，再执行 `install-deps`。

TUI 的 Skill 弹窗适合日常浏览和选择；批量安装、依赖检查和自动化场景更适合使用 CLI。

## 5. Skill 的文件结构与安装

### 5.1 存储位置

Skill 支持用户级和项目级两类存储：

| 类型 | 存储位置 | 说明 |
| --- | --- | --- |
| 项目级 Skill | 当前项目或 Workspace 下的 `.flocks/plugins/skills/` | 只在当前项目 / Workspace 中可见。 |
| 用户级 Skill | 用户目录下的 `~/.flocks/plugins/skills/` | 当前用户的多个 Workspace 可复用。 |

项目级、用户级和内置 Skill 可以同时存在。重名时通常项目级优先于用户级，用户级优先于内置；但实践中建议避免重名，减少排查成本。

### 5.2 目录结构

每个 Skill 都是一个独立文件夹：

```text
skills/
└── skill-security-audit/
    ├── SKILL.md
    ├── references/
    ├── templates/
    └── scripts/
```

其中：

- `SKILL.md` 是主体文件，定义 Skill 的目标、适用场景、方法论、依赖和输出格式。
- `references/` 可以存放参考资料、标准、样例和说明文档。
- `templates/` 可以存放输出模板、报告模板或 Prompt 模板。
- `scripts/` 可以存放辅助脚本，但应明确用途和安全边界。

### 5.3 安装新的 Skill

把新的 Skill 文件夹放到 `.flocks/plugins/skills/` 或 `~/.flocks/plugins/skills/` 下，即可完成安装。系统会识别其中的 `SKILL.md`，并在 Skills 列表或运行时加载。

安装外部 Skill 时，不要只看描述是否有用，也要检查完整目录里的脚本、模板和参考文件。

### 5.4 SKILL.md 元信息与依赖

`SKILL.md` 可以在文件开头声明元信息，用于页面展示、运行时识别和依赖检查。实践中建议至少写清楚名称、描述、适用场景和依赖。

Skill 名称建议使用小写 kebab-case，例如：

```text
skill-security-audit
ndr-alert-triage
```

如果 Skill 依赖外部工具或运行环境，应显式声明。Flocks 的依赖安装流程可以处理多类依赖，例如：

| 依赖类型 | 适合 |
| --- | --- |
| `brew` | macOS 系统包或命令行工具。 |
| `npm` | Node.js 生态命令或包。 |
| `uv` | Python 项目环境和包管理。 |
| `pip` | Python 包。 |
| `go` | Go 语言工具。 |

依赖声明越清楚，页面和 CLI 越容易提示"缺少什么"以及"如何安装"。对于生产环境使用的 Skill，建议在安装后执行一次依赖检查和真实任务验证。

## 6. 运行、验证与调整

### 6.1 验证 Skill 是否符合预期

建议用 1 到 2 个真实任务验证 Skill，重点观察：

- Agent 是否能正确识别何时加载该 Skill。
- `SKILL.md` 的适用场景是否写得清楚。
- 检查顺序和判断标准是否稳定。
- 输出结构是否符合团队要求。
- 依赖工具或脚本是否可用且安全。

### 6.2 查看产出

Skill 本身不直接产出结果，产出由加载它的 Agent、Rex 或 `Rex-junior` 生成。常见产出包括：

- 会话里的结构化结论。
- Markdown 报告。
- 证据列表和风险分级。
- Workspace `outputs/` 下的文件。

### 6.3 调整 Skill

如果 Skill 执行效果不理想，可以在 Rex 会话中明确说明要优化哪个 Skill 和哪个功能点。

例如：

```text
帮我优化 skill-security-audit。
当前对 Prompt 注入的判断太宽泛，请增加证据引用、风险等级边界和误报排除条件。
```

Rex 可以基于反馈调整 `SKILL.md`、输出模板、参考文件或辅助脚本。调整后建议用真实样例重新验证。

## 7. 核心概念

### 7.1 SKILL.md 是什么

`SKILL.md` 是一份面向 Agent 运行时的方法文档。它通常包含：

- 目标和适用场景。
- 不适用场景。
- 判断标准。
- 检查清单和步骤顺序。
- 输出格式约定。
- 依赖工具或 MCP。
- 安全边界和注意事项。

Agent 在加载 Skill 后，会把这份文档作为方法论指导，影响自己的推理和动作选择。

### 7.2 Skill vs Agent vs Workflow

| 维度 | Skill | Agent | Workflow |
| --- | --- | --- | --- |
| 是什么 | 方法论 / 规范 / 任务模板 | 角色 + 工具 + Prompt + 执行模式 | 可执行流程 / 节点图 |
| 能独立执行吗 | 不能，需要被 Agent 加载 | 能，可以有自己的循环 | 能，平台按图运行 |
| 最擅长 | 软性判断、检查清单、经验固化 | 一类任务的深度处理 | 步骤稳定、批量处理、定时运行 |
| 生成方式 | 自然语言创建或从经验沉淀 | 自然语言创建或从任务沉淀 | 自然语言创建或从流程沉淀 |

### 7.3 Skill 加载与优先级

- 多个目录可以同时放 Skill，包括项目级、用户级和内置目录。
- 重名时通常项目级优先于用户级，用户级优先于内置。
- Skill 的依赖工具、MCP 或脚本需要先满足，否则运行时可能提示依赖未满足。
- 任务描述越明确，Agent 越容易加载正确 Skill。

### 7.4 Skill 的安装风险

从外部来源下载的 Skill 可能带来安全风险。典型风险模式包括：

- **Prompt 注入**：要求 Agent 忽略系统指令或覆盖安全规则。
- **硬编码 C2 外传**：脚本中包含可疑外联地址或数据外发逻辑。
- **功能描述欺骗**：描述是正常工具，实际执行危险命令。
- **隐藏脚本执行**：读取系统文件、修改配置、下载二进制。
- **Base64 混淆**：通过混淆隐藏真实行为。
- **社会学引导**：用话术诱导 Agent 绕过限制。

建议对外部 Skill 进行人工审阅，或先用专门的审计 Skill 进行预检查，再决定是否安装到生产环境。

### 7.5 Skill 的能力边界

Skill 适合沉淀方法，不适合承载所有执行逻辑。实践中建议：

- 一个 Skill 聚焦一类方法论。
- 适用场景和不适用场景写清楚。
- 输出格式具体，避免只写抽象原则。
- 脚本保持最小化，并优先只读。
- 外部依赖显式声明，避免隐式调用。

## 8. 真实案例：恶意 Skill 审计

### 8.1 案例背景

用户希望创建一个用于检测恶意 Skill 的 Skill，扫描从 clawhub 等外部来源下载的技能包，判断是否存在安全风险。

### 8.2 创建过程

用户在 Rex 会话中描述检测方向，例如异常字符、Prompt 注入、命令执行、网络连接、数据外发、功能描述欺骗、Base64 混淆、硬编码 IP / 密码 / C2 地址等。

Rex 会：

1. 参考现有 Skill 的格式。
2. 创建 `skill-security-audit` 目录。
3. 生成 `SKILL.md`。
4. 设计检查阶段，例如文件收集、静态检测、语义检测和综合评判。
5. 根据需要生成辅助审查脚本。

### 8.3 审计流程

在会话里让 Rex 使用该 Skill 审计目标 Skill：

```text
用 skill-security-audit 审计 NakedIn 和 SystemOptimizer 这两个 Skill。
```

执行过程通常包括：

1. 加载 `skill-security-audit`。
2. 读取目标 Skill 的完整目录。
3. 检查 `SKILL.md`、脚本、模板和参考文件。
4. 输出风险等级、证据列表和处置建议。

### 8.4 结果评价

这个案例说明，Skill 创建可以从一段高层需求开始，再由 Rex 补全检查逻辑、输出结构和执行步骤。正式使用前仍建议人工评审，确认方法论准确、风险分级合理、输出格式满足团队要求。

## 9. 常见问题

### 9.1 已经安装了 Skill，但 Agent 没有按预期调用怎么办？

先把任务目标和希望使用的 Skill 写得更明确。如果仍不触发，检查 `SKILL.md` 中的名称、描述、适用场景和触发条件是否清晰。

### 9.2 安装 Skill 时是否只加载 SKILL.md？

不建议只安装 `SKILL.md` 单文件。实际使用时应完整安装整个 Skill 文件夹，因为脚本、参考文件、模板和依赖声明都可能影响运行效果。

### 9.3 想把一次成功操作沉淀回 Skill，应该怎么组织？

建议整理清楚：下次遇到类似任务应该从哪里开始、哪些信号决定风险等级、需要收集什么证据、输出物应该是什么结构。

### 9.4 为什么下载回来的 Skill 有安全风险？

社区或外部来源中的 Skill 可能包含 Prompt 注入、隐藏脚本、数据外发或功能描述欺骗。安装前应先审计完整目录，而不是只看名称和简介。

### 9.5 Skill 里可以包含可执行脚本吗？

可以，但脚本也是主要风险来源之一。公开分享的 Skill 建议尽量避免自带脚本；内部 Skill 应限制脚本能力范围，并明确只读或白名单约束。

### 9.6 Skill 和 Agent Prompt 怎么区分？

- **Agent Prompt**：定义某个角色的长期职责、能力边界和执行方式。
- **Skill**：定义某类任务的方法论，可以被多个 Agent 加载，也可以通过 `Rex-junior` 动态执行。

## 10. 相关模块

- [对话管理](/md/modules/sessions)：通过 Rex 创建、加载、审计和调整 Skill。
- [Agent 智能体](/md/modules/agents)：Skill 的主要加载者。
- [Workflow 工作流](/md/modules/workflow)：和 Skill 分别承担"流程"和"方法"两种角色。
- [工具清单](/md/modules/tools)：Skill 通常会声明依赖的工具。
- [Workspace](/md/modules/workspace)：Skill 分用户级 / 项目级存储。
- [场景实践 · 威胁情报与 IOC 研判](/md/scenarios/threat-intel)：把 IOC 研判方法沉淀为 Skill。
- [场景实践 · 告警研判](/md/scenarios/alert-triage)：把告警研判方法论沉淀为 Skill。

操作演示视频将在发布物料稳定后补充到本页。
