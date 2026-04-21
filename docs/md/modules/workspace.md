# Workspace

Workspace 是 Flocks 的**项目级组织边界**。它承载一个团队 / 一个项目 / 一个客户交付中涉及的所有平台资产——插件、工作流、Agent、Skill、任务、配置和运行产物——并把它们组织在一个可复用、可隔离、可沉淀的目录结构下。

## 功能定位

对企业落地来说，Workspace 解决三类问题：

- **资产归属** — 这份 Skill 是哪个项目的？这份报告属于哪个客户？
- **能力隔离** — 客户 A 的 Workflow 不应该出现在客户 B 的环境里
- **经验沉淀** — 单次对话里的产出能不能跨会话复用？答案是"落到 Workspace 里就能"

和其他模块的关系：

| 模块 | 关系 |
| --- | --- |
| [Agent](/md/modules/agents) / [Skills](/md/modules/skills) / [Workflow](/md/modules/workflow) | 这三者都有"**用户级**"和"**项目级**"两层目录，项目级目录就在 Workspace 里 |
| [任务中心](/md/modules/tasks) | 周期任务的运行产物（中间数据、最终报告）通常落到 Workspace `artifacts/` 下 |
| [工具清单](/md/modules/tools) | 项目级工具定义也归 Workspace 管，可以做到"**这个工具只在这个项目可见**" |

## 目录约定

一个典型 Workspace 目录大致是：

```text
<workspace-root>/
├── agents/          # 项目级专家 Agent（可选；用户级 Agent 存在 ~/.flocks/）
├── skills/          # 项目级 Skill
├── workflows/       # 项目级 Workflow 定义（.md + .json）
├── tools/           # 项目级工具
├── artifacts/       # 执行产物：报告、中间数据、测试数据
│   ├── 3-28/        # 按日期 / 任务 ID 归档
│   └── ...
├── memory/          # 项目级记忆（MEMORY.md、daily memory 等）
└── config/          # 项目级配置覆盖
```

其中 `artifacts/` 是**使用频率最高的目录**。工作流生成的测试数据、Agent 巡检报告、告警研判 JSON、定时任务每次输出都会在这里按日期或任务归档。

## 适用场景

- **多客户交付** — 每个客户一个 Workspace，Agent 和 Skill 互不污染
- **多项目并行** — 同一团队处理多个调查项目，每个项目独立归档
- **演示与 PoC** — 用独立 Workspace 跑 demo，用完可以整体打包归档
- **定时任务产出归档** — 长期运行的任务，产物按日期目录整齐堆放

不需要 Workspace 的情况：纯个人使用 + 单一场景。用户级目录（`~/.flocks/`）就够了，不必单独建项目。

## 操作步骤（WebUI）

### 步骤 1：理解当前工作空间

打开 WebUI 后，侧栏 **AI 工作台 → Workspace** 会显示当前激活的工作空间。

如果你是首次使用，初始可能只有一个默认 Workspace。后续需要按项目 / 客户分隔时再显式新建。

### 步骤 2：创建一个新 Workspace

在 Workspace 页面新建项目。关键信息：

- **名称**（项目代号或客户代号）
- **目录位置**（默认在 `~/.flocks` 下，也可以指定外部挂载目录）
- **模型 / 通道** 是否跟随用户级默认，还是项目级覆盖

### 步骤 3：切换 Workspace

切换到新 Workspace 后：

- Agent 列表 / Workflow 列表 / Skill 列表会被该项目目录过滤
- 新生成的产物会落到该项目的 `artifacts/`
- 会话中 Rex 创建的 Skill / Agent / Workflow 会自动存到项目级目录

### 步骤 4：查看产物

运行完一轮工作流或定时任务后，查看产物最快的方式：

- **终端查看**：进入 Workspace 根目录 `ls artifacts/` 直接看
- **WebUI 查看**：Workspace 页面的产物面板（按日期 / 任务归类）
- **Docker 场景**：确认 Workspace 挂载到宿主机目录后，从宿主机直接看

### 步骤 5：归档 / 迁移

Workspace 是目录级的，可以整体复制、打包、迁移到另一台机器。这对"**做完 PoC 后整体交付给客户**"是非常实用的能力。

## 核心概念

### 用户级 vs 项目级

Flocks 几乎所有可扩展能力（Agent / Skill / Workflow / 工具）都存在两层目录：

- **用户级**（通常在 `~/.flocks/` 下）— 对当前用户的所有 Workspace 可见
- **项目级**（Workspace 内部）— 只对当前 Workspace 可见

重名时通常遵循"**项目级覆盖用户级**"的优先级，但建议避免同名。

### artifacts 的语义

`artifacts/` 不是日志，而是"**能被再次使用的执行产物**"——测试数据、原始告警、JSON 报告、报表等。正因此：

- 告警研判里抓下来的原始告警 → 放 `artifacts/3-28/alerts.json`，定时任务和后续会话能复用
- 工作流集成测试的测试数据 → 保留在 `artifacts/` 下，regression 时直接取用
- 主机巡检报告 → 按日期归档，历史对比时不用重跑

### Workspace 与记忆系统

Workspace 也是**项目级记忆**的承载位置。`memory/` 下的 `MEMORY.md`、`daily memory` 这类文件在会话启动阶段被自动加载，让 Rex 在项目语境里理解组织规则、资产背景和历史处置经验。

### Workspace 与模型 / 通道

默认情况下 Workspace 跟随用户级模型 / 通道配置；如果你希望"**这个项目用私有化模型、那个项目用商用模型**"，可以在 Workspace 里做项目级覆盖。参见 [模型与接入](/md/integrations)。

## 常见问题

### Docker 部署下如何看 Workspace 产物？

必须把 Workspace 目录挂载到宿主机，否则容器内产物不可见。参见 [远程部署](/md/quick-start#安装方式选择) 和 FAQ："Docker 容器里生成了文件但没有映射到宿主机"。

### 对话里提示"报告已保存"但我找不到？

按以下三点排查：

1. 文件是否落在了**当前 Workspace** 而不是你以为的目录
2. 当前 shell 目录和 Flocks 实际运行目录是不是一致
3. Docker 场景下挂载是否正确

参见 [运维与排障 · 结果和产物通常在哪里](/md/operations#结果和产物通常在哪里)。

### 可以把已有 Workspace 打包迁移吗？

可以。Workspace 本质是目录，可以 `tar` 或 `rsync` 整体迁移。注意保留 `memory/` 和 `config/` 以复现原有行为。

### 项目级 Agent / Skill 能被其他项目复用吗？

默认不能。如果希望跨项目复用，可以：

- 把稳定通用的 Skill / Agent 升到**用户级**（`~/.flocks/`）
- 或者打包发布到 clawhub 或团队内部库，在其他项目里安装

### 卸载 Flocks 会丢失 Workspace 吗？

不会，只要没删除 Workspace 所在目录。常见卸载步骤：删除源码目录 + `~/.flocks`。具体参见 FAQ："如何卸载 flocks"。

## 相关模块

- [Agent](/md/modules/agents) / [Workflow](/md/modules/workflow) / [Skills](/md/modules/skills) / [工具](/md/modules/tools) — 都支持项目级定义
- [任务中心](/md/modules/tasks) — 产物落到 Workspace `artifacts/`
- [运维与排障](/md/operations) — 产物查找、Docker 挂载、日志定位
- [模型与接入](/md/integrations) — Workspace 可做项目级模型覆盖
