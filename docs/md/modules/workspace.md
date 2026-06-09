# Workspace

Workspace 是 Flocks 的**项目级组织边界和文件工作区**。它承载一个团队、一个项目或一次客户交付中涉及的文件、知识材料、运行产物、测试数据和部分项目级能力，让 Rex、Agent、Workflow、任务中心和用户都围绕同一个上下文工作。

对用户来说，Workspace 不只是一个目录，而是"**Flocks 这次工作到底在哪里发生**"：上传的样例数据、Agent 生成的报告、Workflow 的测试结果、长期任务的历史产物，通常都会在这里沉淀。

## 1. 功能定位

### 1.1 Workspace 解决什么问题

Workspace 主要解决四类问题：

- **文件入口**：用户可以上传告警、日志、PDF、表格、配置文件、剧本文件等，让 Rex 在会话、Agent 或 Workflow 中引用。
- **产物归档**：Agent、Workflow 和任务中心生成的报告、中间数据、JSON、Markdown、截图等统一落盘。
- **项目隔离**：不同项目、客户、演示环境可以使用不同 Workspace，避免资料和产物混在一起。
- **经验沉淀**：知识材料和记忆文件让 Rex 在后续会话中继续理解项目背景。

简单理解：会话负责交互，Agent / Workflow 负责执行，任务中心负责持续运行，Workspace 负责把输入、输出和项目上下文留下来。

### 1.2 Workspace 与其他模块的关系

| 模块 | 关系 |
| --- | --- |
| [对话管理](/md/modules/sessions) | 会话附件会上传到 Workspace，Rex 生成的报告也通常写入 Workspace。 |
| [任务中心](/md/modules/tasks) | 任务执行的输入快照、中间数据和最终报告通常按日期或任务归档到 Workspace。 |
| [Agent 智能体](/md/modules/agents) | Agent 可以读取当前 Workspace 中的样例数据、知识材料和历史产物。 |
| [Workflow 工作流](/md/modules/workflow) | Workflow 的测试数据、节点输出和正式运行结果通常落到 Workspace。 |
| [Skills 技能库](/md/modules/skills) | Skill 可以指导 Rex 如何使用 Workspace 中的资料、模板和历史结果。 |
| [工具清单](/md/modules/tools) | 工具执行时可以读取或写入 Workspace，具体受工具权限和沙箱配置控制。 |

## 2. 适用场景

### 2.1 适合使用 Workspace 的情况

- **上传样例数据**：把告警 JSON、syslog 样例、漏洞扫描报告、资产清单交给 Rex 分析。
- **保留运行产物**：保存巡检报告、研判结果、数据抓取结果、Workflow 测试数据。
- **多项目并行**：每个项目或客户一套文件和产物，后续复盘时不混淆。
- **PoC 和交付**：把演示数据、生成的 Agent / Workflow、运行报告放在同一工作区，便于打包交付。
- **长期任务归档**：定时任务每天生成的报告和结构化结果按日期沉淀。
- **多账号协作**：Pro 环境中，每个用户有自己的私有 Workspace 目录，团队能力则可以共享。

### 2.2 不需要特别关注 Workspace 的情况

纯个人使用、一次性问答、没有附件和产物沉淀的简单任务，通常不需要手动管理 Workspace。Flocks 会使用默认 Workspace，Rex 会在需要时自动写入 `outputs/`。

但只要涉及客户资料、批量数据、长期任务或需要留档的报告，就建议有意识地规划 Workspace。

## 3. Workspace 的来源和目录约定

### 3.1 默认 Workspace

默认 Workspace 位于：

```text
~/.flocks/workspace
```

Flocks 启动后会自动创建常用子目录，例如 `outputs/` 和 `knowledge/`。如果没有特殊要求，直接使用默认 Workspace 即可。

### 3.2 用环境变量指定 Workspace

可以通过 `FLOCKS_WORKSPACE_DIR` 覆盖默认位置：

```bash
export FLOCKS_WORKSPACE_DIR=/data/flocks-workspace
```

这种方式适合把 Workspace 放到外部磁盘、NAS、容器挂载目录或专门的数据分区。

### 3.3 典型目录结构

一个典型 Workspace 大致如下：

```text
<workspace-root>/
├── outputs/          # Agent、Workflow、任务中心生成的产物
├── knowledge/        # 用户整理的知识材料、模板、项目资料
├── shared/           # Pro 或团队场景下的共享区域
│   ├── outputs/
│   └── knowledge/
└── users/            # Pro 多账号场景下的用户私有区域
    └── <username>/
        └── outputs/
```

实际目录会根据版本、部署方式和是否启用 Pro 多账号能力有所不同。

### 3.4 用户级、项目级和共享能力

Flocks 的 Agent、Skills、Workflow、Tools 等能力通常支持用户级和项目级安装。项目级能力放在当前项目或 Workspace 下，只在当前项目中可见；用户级能力放在用户目录下，可被当前用户复用。

Pro 多账号环境中，每个用户有自己的私有对话历史和私有 Workspace 目录；Agent、Skills、Tools、设备、任务、Workflow、模型、通道等平台能力默认仍是共享能力，便于团队统一维护。

## 4. WebUI 操作流程

### 4.1 进入 Workspace 页面

侧栏进入 **AI 工作台 → Workspace**。页面说明是"文件上传、Agent 产物和记忆浏览"，通常包含两个标签：

- **文件管理**：浏览、上传、编辑、下载和删除 Workspace 文件。
- **记忆文件**：只读查看 Rex 等 Agent 自动写入的记忆文件。

### 4.2 文件管理

文件管理页支持常见文件操作：

- 查看目录树和文件列表。
- 返回上级目录、刷新当前目录。
- 新建目录。
- 拖放上传或点击上传文件。
- 读取文本文件内容。
- 编辑并保存文本文件。
- 下载单个文件。
- 删除文件或目录。
- 移动文件。
- 选择多个文件打包下载为 zip。

二进制文件可以下载，但通常不能直接预览；文本文件可以在页面中读取和编辑。

### 4.3 上传文件给 Rex 使用

在会话中上传附件，或在 Workspace 页面上传文件后，可以直接告诉 Rex：

```text
读取 Workspace 里的 alerts/sample-ndr-alert.json，帮我分析这些告警。
```

也可以在创建 Workflow 时提供样例数据：

```text
用 Workspace 里的 samples/syslog-example.txt 作为样例，帮我创建一个 syslog 解析 Workflow。
```

上传样例数据对 Workflow 特别重要。Rex 可以在生成工作流后立刻用样例数据做单节点测试和全流程集成测试。

### 4.4 查看运行产物

Agent、Workflow 和任务中心执行后，常见产物包括：

- 原始输入快照。
- 中间 JSON 数据。
- Markdown 研判报告。
- 巡检清单。
- Workflow 节点测试结果。
- 定时任务每次运行的报告。
- 通道外发前的摘要或完整内容。

这些内容通常写入 `outputs/`，并按日期、任务名、Workflow 名称或执行 ID 归档。

### 4.5 查看记忆文件

记忆文件由 Rex 等 Agent 自动写入，用于记录项目背景、重要事实、历史处置经验和长期上下文。Workspace 页面提供只读视图，方便用户知道系统记住了什么。

如果发现记忆内容不准确，可以在会话中明确告诉 Rex 修正记忆，而不是直接把记忆文件当普通产物随意修改。

## 5. 目录和文件治理

### 5.1 outputs 的语义

`outputs/` 不是日志目录，而是可再次使用的执行产物集合。它适合存放：

- 告警研判结果。
- 资产巡检报告。
- Workflow 测试数据。
- 批量查询结果。
- 任务中心定时产出。
- 可交付给用户或客户的报告。

日志用于排障，产物用于复用、审计和交付。定位任务执行问题时，先看 `outputs/` 往往能更快知道流程跑到了哪一步。

### 5.2 knowledge 的语义

`knowledge/` 适合放用户主动整理的项目知识，例如：

- 客户网络背景。
- 资产分组说明。
- 告警研判规范。
- 通知模板。
- 报告模板。
- 处置流程文档。

Rex 和 Agent 可以读取这些资料，作为执行任务时的项目上下文。

### 5.3 文件命名建议

长期使用时，建议采用稳定命名：

```text
outputs/
├── 2026-06-10/
│   ├── ndr-alert-triage.json
│   └── ndr-alert-triage.md
└── device-inspection/
    ├── 2026-06-10.md
    └── 2026-06-11.md
```

推荐包含日期、任务名、数据类型或执行对象。这样后续让 Rex 汇总、对比或追溯时更容易定位。

### 5.4 Docker 部署和挂载

Docker 部署时，必须把 Workspace 目录挂载到宿主机目录，否则容器内生成的产物不方便在宿主机查看和备份。

如果对话里提示"报告已保存"但宿主机找不到，优先检查：

1. Workspace 是否正确挂载。
2. Flocks 实际运行时使用的 `FLOCKS_WORKSPACE_DIR` 是什么。
3. 文件是否保存到了当前用户的私有 Workspace。
4. 是否保存到了 `outputs/<日期>/` 子目录。

### 5.5 权限和沙箱

部分工具或 Agent 会在沙箱中运行。沙箱对 Workspace 的访问可能是只读、读写或不可访问，具体取决于工具和系统配置。

如果任务需要生成文件，但结果没有落盘，需要检查：

- 工具是否有写 Workspace 的权限。
- 运行环境是否能访问对应目录。
- Docker 挂载是否允许写入。
- 当前用户是否有目录权限。

## 6. Pro 多账号场景

### 6.1 用户私有 Workspace

在 Pro 多账号环境中，每个用户有自己的私有对话历史和私有 Workspace 目录。普通用户只能看到和管理自己的文件与会话产物。

这适合把个人分析过程、上传文件和报告草稿隔离开，避免不同用户互相看到私有工作内容。

### 6.2 团队共享能力

Pro 多账号隔离的是用户私有数据，不是所有平台能力。Agent、Skills、Tools、设备、任务、Workflow、模型和通道等通常仍是团队共享能力。

因此常见协作方式是：

- 用户在自己的 Workspace 中上传样例数据和验证结果。
- 验证成熟后，把 Agent / Skill / Workflow 发布为团队共享能力。
- 任务中心使用共享能力长期运行，产物按配置写入对应 Workspace 或共享区域。

### 6.3 历史 Workspace 迁移

从单账号升级到多账号后，可以使用管理员 CLI 把历史单用户 Workspace 迁移到多账号布局：

```bash
flocks admin migrate-workspace-to-user --admin-user-id <user_id> --dry-run
flocks admin migrate-workspace-to-user --admin-user-id <user_id>
```

建议先执行 `--dry-run` 预览迁移结果，再正式迁移。

## 7. 运行、验证与调整

### 7.1 执行任务前确认当前 Workspace

执行重要任务前，建议先确认当前 Workspace，尤其是多项目、多客户或 Docker 部署环境。可以在会话中问 Rex：

```text
当前 Workspace 路径是什么？这次任务的产物会保存到哪里？
```

### 7.2 产物验收

任务、Agent 或 Workflow 执行完成后，建议检查：

- `outputs/` 下是否生成了预期文件。
- 文件名是否能反映日期、任务和内容。
- JSON 结果是否结构化且可被后续 Workflow 读取。
- Markdown 报告是否适合直接发送或归档。
- 通道消息是否只是摘要，完整报告是否保存在 Workspace。

### 7.3 找不到文件时的排查顺序

按下列顺序排查：

1. 在 Workspace 页面刷新当前目录。
2. 查看 `outputs/` 和当天日期目录。
3. 问 Rex "刚才生成的文件保存在哪里？"。
4. 确认当前运行用户和当前 Workspace。
5. Docker 场景下检查挂载目录。
6. 查看任务中心执行详情中的 `workspaceDirectory` 或产物说明。

### 7.4 归档和迁移

Workspace 本质是目录，可以整体复制、打包或同步到另一台机器。适合以下场景：

- PoC 完成后整体交付。
- 项目结束后归档。
- 从测试环境迁移到生产环境。
- 多台机器之间同步样例数据和报告。

迁移前建议清理临时文件和无关产物，保留 `outputs/`、`knowledge/`、必要的项目级插件目录和说明文档。

## 8. 真实案例：告警研判项目 Workspace

### 8.1 准备样例数据

用户先在 Workspace 上传：

```text
knowledge/customer-background.md
knowledge/alert-triage-standard.md
samples/ndr-alerts.json
```

然后在会话中告诉 Rex：

```text
基于 Workspace 里的客户背景、研判规范和 NDR 样例告警，帮我创建一个告警研判 Workflow。
```

### 8.2 生成和测试 Workflow

Rex 读取样例数据，生成 Workflow，并把单节点测试和全流程测试结果写入：

```text
outputs/2026-06-10/ndr-alert-triage-test/
```

用户检查测试报告后，让 Rex 调整节点逻辑或输出格式。

### 8.3 转为长期任务

Workflow 验收后，在任务中心配置每小时运行。每次执行产物按日期归档：

```text
outputs/2026-06-10/ndr-alert-triage-hourly/
outputs/2026-06-11/ndr-alert-triage-hourly/
```

后续要生成周报时，可以直接让 Rex 汇总这些 Workspace 产物，而不需要重新抓取和研判全部历史数据。

## 9. 常见问题

### 9.1 对话里提示"报告已保存"但我找不到？

先在 Workspace 页面刷新 `outputs/`，再检查当天日期目录。如果是 Pro 多账号环境，确认是否保存到了当前用户的私有 Workspace。如果是 Docker 部署，确认宿主机挂载目录是否正确。

### 9.2 Workspace 页面可以编辑所有文件吗？

文本文件通常可以读取和编辑，二进制文件通常只能下载。记忆文件是只读视图，不建议当普通文件直接修改。

### 9.3 可以把已有 Workspace 打包迁移吗？

可以。Workspace 本质是目录，可以用 `tar`、`rsync` 或其他备份工具迁移。迁移后建议启动 Flocks，并在 Workspace 页面确认文件、产物和记忆视图是否正常。

### 9.4 项目级 Agent / Skill / Workflow 能被其他项目复用吗？

默认项目级能力只在当前项目可见。如果希望跨项目复用，可以把稳定能力安装到用户级目录，或整理成团队共享插件，再在其他项目中安装。

### 9.5 删除 Flocks 会丢失 Workspace 吗？

只要没有删除 Workspace 所在目录，Workspace 产物不会因为停止或卸载程序自动丢失。执行清理或卸载前，建议先确认 `FLOCKS_WORKSPACE_DIR` 和 `~/.flocks/workspace` 中是否有需要保留的数据。

### 9.6 任务中心和 Workspace 的关系是什么？

任务中心负责任务调度和执行记录，Workspace 负责保存任务运行过程中的文件产物。排查任务时，任务中心看状态和错误，Workspace 看实际生成了哪些文件。

## 10. 相关模块

- [对话管理](/md/modules/sessions)：会话附件和 Rex 产物通常进入 Workspace。
- [任务中心](/md/modules/tasks)：长期任务产物落到 Workspace `outputs/`。
- [Agent 智能体](/md/modules/agents)：Agent 可以读取 Workspace 资料并生成报告。
- [Workflow 工作流](/md/modules/workflow)：Workflow 测试数据和运行结果由 Workspace 承载。
- [Skills 技能库](/md/modules/skills)：Skill 可以指导 Rex 如何使用 Workspace 资料。
- [工具清单](/md/modules/tools)：工具读写 Workspace 受权限和沙箱配置影响。
- [账号管理](/md/modules/accounts)：Pro 多账号下的用户私有 Workspace 和迁移命令。
