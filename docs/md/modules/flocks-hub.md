# 插件广场

插件广场是 Flocks 的本地插件广场，用于浏览、筛选、预览、安装和卸载随 Flocks 版本发布到本地的插件能力。它不是云上的插件市场；广场中的插件来自 Flocks 本地 bundled 目录或本地配置的插件广场目录，安装后进入本机插件目录并立即在平台中使用。

插件广场把 Skill、Agent、Tool、Workflow 放到同一个入口里管理，让用户可以从一个页面发现可用能力，并安装到本机插件目录后立即在平台中使用。

## 1. 功能定位

### 1.1 插件广场解决什么问题

插件广场回答的是"**本地有哪些可安装能力，以及如何安全地安装到本机**"。它主要解决四类问题：

- **能力发现**：集中展示随 Flocks 版本发布到本地的 Skill、Agent、Tool、Workflow 插件。
- **能力筛选**：按插件类型、使用场景、Tag、状态、信任等级和风险等级筛选。
- **安装管理**：对插件执行安装、更新、卸载和刷新。
- **安装前预览**：查看插件 Manifest、文件树、依赖、权限、风险和版本信息。

它和 [Skills](/md/modules/skills)、[Agent](/md/modules/agents)、[工具清单](/md/modules/tools)、[Workflow](/md/modules/workflow) 的关系是：插件广场负责发现和安装，安装后的能力会进入各自模块，由对应模块负责配置、运行和调试。

### 1.2 与其他模块的关系

| 模块 | 关系 |
| --- | --- |
| [Skills 技能库](/md/modules/skills) | 插件广场安装 Skill 后，Skill 会进入技能库并可被 Rex 加载。 |
| [Agent 智能体](/md/modules/agents) | 插件广场安装 Agent 后，Agent 会进入 Agent 列表并可被 Rex 委派或被用户直接选择。 |
| [工具清单](/md/modules/tools) | 插件广场安装 Tool 后，工具清单会刷新并加载对应 API / Python / MCP 工具。 |
| [Workflow 工作流](/md/modules/workflow) | 插件广场安装 Workflow 后，工作流页面可以发现并运行对应工作流。 |
| [Workspace](/md/modules/workspace) | 项目级插件通常安装到当前项目或 Workspace 的 `.flocks/plugins/` 下。 |

## 2. 插件类型

### 2.1 Skill 插件

Skill 插件用于沉淀方法论、操作规范和领域知识。安装后通常出现在 Skills 页面，并可由 Rex 在会话中按需加载。

典型用途：

- 告警研判方法。
- API 工具生成规范。
- 漏洞排查流程。
- 设备巡检经验。

### 2.2 Agent 插件

Agent 插件用于安装专家角色。安装后通常出现在 Agent 页面，可以作为子 Agent 被 Rex 委派，也可以由用户直接选择对话。

典型用途：

- 情报分析 Agent。
- 漏洞研判 Agent。
- 设备巡检 Agent。
- 数据查询 Agent。

### 2.3 Tool 插件

Tool 插件用于安装可执行工具。工具插件可能是 API 工具、本地 Python 工具、MCP 工具或生成工具。安装后会刷新工具运行时，让 Rex、Agent 和 Workflow 可以调用。

Tool 插件尤其需要关注权限和风险信息，例如是否需要网络访问、Shell 权限、文件系统读写权限，以及是否依赖外部凭证。

### 2.4 Workflow 插件

Workflow 插件用于安装可运行工作流。安装后可在 Workflow 页面查看、测试、运行或进一步修改。

典型用途：

- NDR 告警研判工作流。
- 周期资产核查工作流。
- 固定漏洞排查流程。
- 数据拉取和报告生成流程。

## 3. 页面结构

### 3.1 顶部操作区

插件广场页面顶部提供：

- **搜索框**：搜索插件名称、描述、Tag 和使用场景。
- **目录视图 / 表格视图切换**：按插件目录树浏览，或按表格列表浏览。
- **刷新**：重新读取当前本地 catalog 和安装状态。

### 3.2 筛选区

筛选区支持：

- **类型**：Skill、Agent、Tool、Workflow。
- **使用场景**：按插件声明的 use case 筛选。
- **Tag**：按标签筛选。
- **状态**：可安装、已安装、可更新、不兼容等。

当筛选条件较多时，可以展开更多筛选；也可以一键清空筛选条件。

### 3.3 插件列表

表格视图会展示：

- 插件类型。
- 插件名称和描述。
- Tag。
- 当前状态。
- 安装、更新或卸载操作。

目录视图会按 `flockshub` 文件树展示插件位置，适合理解插件实际来自哪个目录和 Manifest 路径。

### 3.4 插件详情

点击插件后，可以查看详情。详情页通常包含：

- **概览**：插件 ID、名称、描述、类型、分类、标签、信任等级、风险等级。
- **流程图**：Workflow 插件可展示 `workflow.json` 的可视化流程。
- **文件**：查看插件文件树和可预览文件内容。
- **依赖**：查看需要的 Skill、Tool、Python 包或外部依赖。
- **权限**：查看工具权限、网络权限、Shell 权限、文件系统访问范围。
- **版本**：查看版本号、安装版本、来源和 Manifest 信息。

## 4. 插件状态

### 4.1 状态含义

| 状态 | 说明 |
| --- | --- |
| `available` | 可安装，当前本机尚未安装。 |
| `installed` | 已安装，当前版本与插件广场中的版本一致。 |
| `updateAvailable` | 已安装，但插件广场中存在更新版本。 |
| `localOnly` | 本地存在插件，但插件广场 catalog 中没有对应条目。 |
| `broken` | 插件清单、目录或安装状态异常。 |
| `incompatible` | 与当前 Flocks 版本、系统或依赖不兼容。 |

### 4.2 信任等级和风险等级

插件 Manifest 中包含信任等级和风险等级：

- **信任等级**：`official`、`verified`、`community`、`experimental`、`deprecated`。
- **风险等级**：`low`、`medium`、`high`。

安装前建议重点查看 Tool 插件和高风险插件的权限说明。如果插件需要网络、Shell 或文件系统读写权限，应确认插件来源可信、用途明确，并尽量先在测试环境验证。

## 5. 安装、更新和卸载

### 5.1 安装插件

操作步骤：

1. 进入 **Agent 工作室 → 插件广场**。
2. 搜索或筛选目标插件。
3. 点击插件查看 Manifest、文件、依赖、权限和风险。
4. 确认无误后点击 **安装**。
5. 安装完成后，进入对应模块验证插件是否出现。

安装后，Flocks 会刷新对应运行时：

- Skill：刷新 Skill 缓存，并让 Agent 缓存失效。
- Agent：刷新 Agent 缓存。
- Tool：刷新工具注册表、插件工具和 API 服务描述。
- Workflow：尝试重新扫描工作流。

### 5.2 更新插件

当插件状态为 `updateAvailable` 时，可以点击 **更新**。更新逻辑等同于重新安装新版本，会覆盖旧安装目录并刷新运行时。

更新前建议查看版本说明、权限变化和依赖变化。关键生产环境中，建议先在测试环境验证。

### 5.3 卸载插件

已安装插件可以点击 **卸载**。卸载后，Flocks 会移除安装目录、删除插件广场安装记录，并刷新对应运行时。

需要注意：

- 项目内置插件不允许通过插件广场直接删除。
- 只有用户可管理的插件广场插件安装可以卸载。
- Tool 插件卸载时，如果包含 API 服务描述，系统会清理不再被其他插件使用的 API service 配置。

## 6. 文件结构和安装位置

### 6.1 插件广场 Catalog 来源

插件广场默认读取本地 bundled 目录。系统会按以下顺序查找：

1. `FLOCKS_HUB_ROOT` 环境变量指定的目录。
2. 当前项目目录下的 `.flocks/flockshub/`。
3. 当前工作目录或父目录下的 `.flocks/flockshub/`。
4. Flocks 包内或包相邻位置的 `.flocks/flockshub/`。

当前 catalog 是文件系统 backed，点击刷新会重新读取目录并返回当前插件数量。

### 6.2 插件广场目录结构

典型插件广场目录结构如下：

```text
.flocks/flockshub/
├── index.json
├── taxonomy.json
└── plugins/
    ├── skills/
    ├── agents/
    ├── tools/
    └── workflows/
```

每个插件通常包含一个 `manifest.json`，声明插件类型、名称、版本、分类、标签、使用场景、依赖、权限、风险、入口文件和校验信息。

### 6.3 安装位置

插件广场安装支持用户级和项目级目录。当前页面默认安装到用户级插件目录：

| 插件类型 | 用户级安装目录 |
| --- | --- |
| Skill | `~/.flocks/plugins/skills/<plugin_id>/` |
| Agent | `~/.flocks/plugins/agents/<plugin_id>/` |
| Workflow | `~/.flocks/plugins/workflows/<plugin_id>/` |
| Tool | `~/.flocks/plugins/tools/<plugin_id>/` 或 `~/.flocks/plugins/tools/<group>/<plugin_id>/` |

Tool 插件如果来自 `api/`、`python/`、`mcp/`、`generated/` 分组，会保留分组目录，避免 API 工具描述和 Python 工具加载路径丢失。

### 6.4 安装记录

插件广场会维护本地安装记录：

```text
~/.flocks/data/hub/installed.json
```

记录中包含插件 ID、类型、版本、来源、安装时间、启用状态、安装 scope、安装路径等信息。插件广场页面会结合 catalog 和安装记录判断插件状态。

## 7. 安全和兼容性

### 7.1 安装前检查

安装前建议查看：

- 插件来源和信任等级。
- 风险等级和风险原因。
- 依赖的 Skill、Tool、Python 包和外部组件。
- 是否需要网络访问。
- 是否需要 Shell 权限。
- 文件系统访问范围。
- 插件文件内容是否符合预期。

### 7.2 包安全校验

插件广场安装过程中会校验插件包，跳过或禁止常见无关目录，例如 `__pycache__`、`.git`、`.svn`、`.DS_Store`。安装时也会排除这些目录，避免把开发缓存或版本控制目录复制到用户插件目录。

### 7.3 不兼容和异常插件

如果插件状态显示为 `incompatible`，说明它可能不适合当前 Flocks 版本、操作系统或依赖环境。如果状态显示为 `broken`，说明 Manifest、目录或安装记录可能异常。

排查时可以：

1. 刷新插件广场 catalog。
2. 查看插件详情中的 `brokenReason` 或 Manifest。
3. 检查安装目录是否存在。
4. 检查 `~/.flocks/data/hub/installed.json` 中的安装记录。
5. 必要时卸载后重新安装。

## 8. 真实案例：安装告警研判 Skill

### 8.1 查找插件

进入插件广场，在搜索框输入：

```text
告警研判
```

或按类型筛选 `Skill`，找到相关技能插件。

### 8.2 安装前查看

点击插件，查看：

- Manifest 中的名称、版本和描述。
- 使用场景和标签。
- 文件列表中的 `SKILL.md`。
- 依赖和权限信息。
- 风险等级。

### 8.3 安装和验证

点击 **安装** 后，进入 [Skills 技能库](/md/modules/skills)，确认该 Skill 已出现。然后在会话中让 Rex 执行一次相关任务，例如：

```text
基于告警研判 Skill，帮我分析这条 NDR 告警。
```

如果 Rex 能正确加载方法论并产出结果，说明插件广场安装已经生效。

## 9. 常见问题

### 9.1 插件广场和 Skills 页面有什么区别？

插件广场是插件发现和安装入口；Skills 页面是已安装 Skill 的管理和使用入口。通过插件广场安装 Skill 后，再到 Skills 页面查看、测试、编辑或卸载对应能力。

### 9.2 为什么安装后没有立刻看到插件？

先点击对应模块的刷新按钮，或刷新浏览器页面。如果仍看不到，检查安装目录、插件广场安装记录和插件 Manifest。Tool 插件还需要确认工具清单是否完成刷新。

### 9.3 插件广场支持哪些插件来源？

当前主要支持随 Flocks 版本发布到本地的 bundled 插件目录，以及本地配置的插件广场目录。Manifest 中的 source 结构也预留了 `github` 和 `cloud` 类型，用于后续扩展或外部来源描述；当前页面描述的是本地插件广场，不是云上插件市场。

### 9.4 能不能把自己的插件放进插件广场？

可以把插件目录整理到 `.flocks/flockshub/plugins/<type>/<plugin_id>/`，并提供 `manifest.json`。然后刷新插件广场，系统会重新读取本地 catalog。

### 9.5 插件广场安装和手动复制插件有什么区别？

手动复制插件只完成文件落盘。插件广场安装还会记录安装状态、保留版本信息、刷新运行时，并在卸载 Tool 插件时清理孤立 API service 配置。

## 10. 相关模块

- [Skills 技能库](/md/modules/skills)：插件广场安装 Skill 后的管理入口。
- [Agent 智能体](/md/modules/agents)：插件广场安装 Agent 后的管理入口。
- [工具清单](/md/modules/tools)：插件广场安装 Tool 后的管理入口。
- [Workflow 工作流](/md/modules/workflow)：插件广场安装 Workflow 后的管理入口。
- [Workspace](/md/modules/workspace)：项目级插件和产物的组织边界。
