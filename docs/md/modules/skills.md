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
- **依赖声明**：可以在正文中说明需要哪些工具、MCP、脚本或外部环境；当前结构化可用性检查只识别命令和环境变量等依赖。
- **辅助文件**：包括参考资料、模板、示例数据或只读脚本。

### 1.2 Skill 与其他模块的关系

| 模块 | 关系 |
| --- | --- |
| [对话管理](/md/modules/sessions) | 用户可以在会话中让 Rex 加载、创建、审计或调整 Skill。 |
| [Agent 智能体](/md/modules/agents) | Agent 是 Skill 的主要加载者；Skill 会影响 Agent 的推理和动作选择。 |
| [Workflow 工作流](/md/modules/workflow) | Workflow 固化流程，Skill 提供方法论。Workflow 本身没有独立的 Skill 配置字段；执行任务的 Agent 可以按自身配置或委派参数加载 Skill。 |
| [工具清单](/md/modules/tools) | Skill 正文可以说明工具或 MCP 需求；当前自动可用性检查只识别命令、环境变量和安装元数据。 |
| [Workspace](/md/modules/workspace) | Skill 可以指导 Agent 使用 Workspace 中的资料和产物；Skill 文件本身存放在用户目录或当前项目目录，不由 Workspace 模块管理。 |

### 1.3 平台内置 Skill

Flocks 自身也用 Skill 承载平台建设能力。当前代码仓库中的典型内置 Skill 包括 `tool-builder`、`workflow-builder`、`agent-builder`、`skill-builder`、`browser-use` 和 `webui-page-builder` 等。部分系统 Skill 带有 `category: system` 或 `ui_hidden: true`，不会出现在普通 Skills 管理列表中。

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
safeskill://...
skills-sh:owner/repo/skill-name
https://raw.githubusercontent.com/...
/local/path/to/skill
```

WebUI 当前不提供 scope 选择，页面安装和页面创建都默认写入用户级目录 `~/.flocks/plugins/skills/`。其中本地路径指的是运行 Flocks 服务的机器上的路径，不是远程浏览器所在电脑的路径。

安装完成后，页面会刷新 Skill 列表。如果 Skill 声明了依赖但当前环境未满足，页面会提示缺少依赖，并可继续执行“安装依赖”操作。

### 3.2 方式二：命令行安装

也可以通过 Flocks CLI 安装 Skill：

```bash
flocks skills install clawhub:github
flocks skills install skills-sh:owner/repo/skill-name
flocks skills install safeskill://...
flocks skills install github:owner/repo
flocks skills install https://raw.githubusercontent.com/...
flocks skills install /local/path/to/skill
```

如果一个仓库里包含多个 Skill，可以用 `--skill` 指定子目录：

```bash
flocks skills install github:owner/repo --skill skill-name
```

默认安装到用户级目录。需要安装到当前项目目录时，可以指定 scope：

```bash
flocks skills install github:owner/repo --scope project
```

项目级安装位置是执行命令时当前项目下的 `.flocks/plugins/skills/`，与 Workspace 业务文件目录无关。

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
| `flocks skills remove <name>` | 删除用户级目录中的 Skill；不能删除项目级或内置 Skill。 |
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

CLI 和 WebUI 都可以把包含 `SKILL.md` 的本地目录或 `SKILL.md` 文件作为安装来源：

```bash
flocks skills install /path/to/my-skill
```

当前本地路径安装器只读取并保存 `SKILL.md`，不会复制同目录中的 `scripts/`、`references/`、`templates/` 等辅助文件。如果 Skill 依赖这些文件，应手动复制完整目录到目标位置，或使用能够下载完整目录的 GitHub/打包来源。

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

- 当前请求上下文中发现的项目级、用户级、内置及兼容来源 Skill。
- Skill 的发现来源标签，例如 `project`、`user`、`flocks`、`claude`。
- 启用/禁用状态和依赖是否满足。
- `SKILL.md` 内容和依赖信息。
- 搜索、来源筛选、启停、刷新、安装、创建、查看详情和安装依赖入口。

用户级 Skill 可以通过 API/WebUI 修改和删除；项目级 Skill 在 WebUI 中只读，应直接在项目目录中通过版本控制维护。

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

### 4.4 通过分类委派动态执行 Skill

Rex 可以通过 `delegate_task(category=..., load_skills=[...])` 把任务交给分类执行器。分类委派当前使用 `Rex-junior`，并把所选 Skill 的完整内容追加到该子任务的提示中；它不会替换 `Rex-junior` 自身的 System Prompt，也不能通过 `subagent_type="rex-junior"` 直接指定。

这种模式适合让独立子任务遵循某个方法论。如果某个 Skill 经常通过分类委派执行，且边界和工具集逐渐稳定，可以进一步沉淀为正式 Agent。

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
- 在安装弹窗中选择 `global` 或 `project` scope。
- 安装后如提示缺少依赖，再执行 `install-deps`。

TUI 的 Skill 弹窗适合日常浏览和选择；批量安装、依赖检查和自动化场景更适合使用 CLI。

## 5. Skill 的文件结构与安装

### 5.1 存储位置

Flocks 会从多个兼容位置发现 Skill。常用的可安装位置是：

| 类型 | 存储位置 | 说明 |
| --- | --- | --- |
| 项目级 Skill | 当前项目下的 `.flocks/plugins/skills/<name>/SKILL.md` | 跟随项目文件和版本控制；在该项目请求上下文中发现，WebUI/API 按只读资源处理。 |
| 用户级 Skill | `~/.flocks/plugins/skills/<name>/SKILL.md` | 当前操作系统用户可复用；WebUI 创建、修改和删除的对象位于这里。 |
| Flocks 内置 Skill | Flocks 安装目录中的 `.flocks/plugins/skills/` 或兼容的 `.flocks/skill[s]/` | 随产品代码提供，不应通过 Skills 页面直接修改。 |
| Claude 兼容 Skill | 全局或项目 `.claude/skills/` | 作为兼容发现来源，优先级最低。 |

项目目录指 `Instance.get_directory()` 对应的当前请求目录。发现时还会从该目录向上扫描到当前 worktree 根目录，因此它不是 WebUI 中的 Workspace 业务文件目录。

多个来源可以同时存在。代码按“后扫描覆盖先扫描”处理同名 Skill，简化后的优先级为：

```text
用户级 > 当前项目级 > Flocks 内置/随源码提供 > Claude 兼容目录
```

因此用户级 Skill 会覆盖同名项目级 Skill，这与旧文档中的顺序相反。实践中仍建议避免重名。

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

`SKILL.md` 必须以 YAML frontmatter 开头，并提供合法的 `name` 和 `description`，否则发现器会忽略该 Skill。`name` 必须匹配 `[a-z0-9]+(-[a-z0-9]+)*`，`description` 长度必须为 1 到 1024 个字符。

最小示例：

```yaml
---
name: ndr-alert-triage
description: 按固定证据链对 NDR 告警进行研判并输出结论。
---
```

Skill 名称使用小写 kebab-case，例如：

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
| `download` | 按声明的 URL 下载二进制或归档。 |

依赖元信息从 `metadata.flocks` 读取，并兼容 `metadata.openclaw`。运行条件支持 `requires.bins`、`requires.any_bins` 和 `requires.env`；安装声明使用 `install` 列表。依赖声明越清楚，页面和 CLI 越容易提示“缺少什么”以及“如何安装”。对于生产环境使用的 Skill，建议在安装后执行一次依赖检查和真实任务验证。

## 6. 运行、验证与调整

### 6.1 验证 Skill 是否符合预期

建议用 1 到 2 个真实任务验证 Skill，重点观察：

- Agent 是否能正确识别何时加载该 Skill。
- `SKILL.md` 的适用场景是否写得清楚。
- 检查顺序和判断标准是否稳定。
- 输出结构是否符合团队要求。
- 依赖工具或脚本是否可用且安全。

### 6.2 查看产出

Skill 本身不直接产出结果，产出由加载它的 Agent、Rex 或分类委派子任务生成。常见产出包括：

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

- 多个目录可以同时放 Skill，包括 Claude 兼容目录、内置目录、项目级目录和用户级目录。
- 重名时用户级优先于项目级，项目级优先于较低优先级的内置和 Claude 兼容来源。
- 被禁用的 Skill 仍会出现在管理列表中，但不会出现在 Agent 可用 Skill 摘要中，也不能通过 `skill_load` 或委派参数加载。
- 当 `metadata.flocks.requires` 声明的命令或环境变量不满足时，Skill 会被标记为不可用并提示缺少依赖。工具和 MCP 需求如果只写在正文中，需要在使用前自行确认，系统不会据此自动判定可用性。
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

如果 Skill 依赖脚本、模板或参考资料，应完整保留整个 Skill 文件夹。通过 GitHub 或压缩包安装时可以带入这些辅助文件；当前本地路径安装只写入 `SKILL.md`，需要自行复制其余文件。

### 9.3 想把一次成功操作沉淀回 Skill，应该怎么组织？

建议整理清楚：下次遇到类似任务应该从哪里开始、哪些信号决定风险等级、需要收集什么证据、输出物应该是什么结构。

### 9.4 为什么下载回来的 Skill 有安全风险？

社区或外部来源中的 Skill 可能包含 Prompt 注入、隐藏脚本、数据外发或功能描述欺骗。安装前应先审计完整目录，而不是只看名称和简介。

### 9.5 Skill 里可以包含可执行脚本吗？

可以，但脚本也是主要风险来源之一。公开分享的 Skill 建议尽量避免自带脚本；内部 Skill 应限制脚本能力范围，并明确只读或白名单约束。

### 9.6 Skill 和 Agent Prompt 怎么区分？

- **Agent Prompt**：定义某个角色的长期职责、能力边界和执行方式。
- **Skill**：定义某类任务的方法论，可以被多个 Agent 加载，也可以通过分类委派参数注入独立子任务。

## 10. 相关模块

- [对话管理](/md/modules/sessions)：通过 Rex 创建、加载、审计和调整 Skill。
- [Agent 智能体](/md/modules/agents)：Skill 的主要加载者。
- [Workflow 工作流](/md/modules/workflow)：和 Skill 分别承担"流程"和"方法"两种角色。
- [工具清单](/md/modules/tools)：Skill 正文可以记录工具需求，结构化依赖检查则聚焦命令和环境变量。
- [Workspace](/md/modules/workspace)：Skill 文件可以按用户级或当前项目级存储，但不由 Workspace 管理。
- [场景实践 · 威胁情报与 IOC 研判](/md/scenarios/threat-intel)：把 IOC 研判方法沉淀为 Skill。
- [场景实践 · 告警研判](/md/scenarios/alert-triage)：把告警研判方法论沉淀为 Skill。

操作演示视频将在发布物料稳定后补充到本页。
