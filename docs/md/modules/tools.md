# 工具清单

工具清单是 Flocks 的执行能力管理页面。它集中管理平台可调用的内置工具、API 工具、本地工具，以及通过 MCP（Model Context Protocol）接入的外部服务。在最新版 WebUI 中，MCP 已整合进工具清单页，不再作为独立一级菜单存在。

工具回答的是"Agent 和 Workflow 能执行什么动作"。Agent 可以把工具作为自己的可调用能力，Workflow 可以把工具作为节点使用；Rex 也可以根据 API 文档、接口说明或 MCP 服务信息，用自然语言辅助完成工具接入、验证和调试。

## 1. 功能定位

### 1.1 工具清单解决什么问题

工具清单把分散的执行能力统一注册、展示、配置和测试。它主要解决四类问题：

- **能力可见**：查看当前环境中已经有哪些工具、来自哪里、是否启用、能做什么。
- **能力接入**：接入 API 服务、MCP Server、本地 Python 工具或平台内置工具。
- **凭证配置**：为需要认证的工具配置 API Key、Token、Header 或其他密钥。
- **能力验证**：在页面上测试连接、查看工具参数、执行测试调用，确认工具可被 Agent 和 Workflow 使用。

### 1.2 工具与其他模块的关系

| 模块 | 关系 |
| --- | --- |
| [Agent 智能体](/md/modules/agents) | Agent 可以配置工具白名单，决定它能调用哪些工具。 |
| [Workflow 工作流](/md/modules/workflow) | Workflow 的工具节点可以调用 API、MCP、本地工具或内置工具。 |
| [Skills 技能库](/md/modules/skills) | Skill 可以说明某类工具的正确使用方法、输入要求和判断逻辑。 |
| [模型清单](/md/llm_models) | 工具调用通常依赖模型的工具调用能力和参数生成稳定性。 |
| [Workspace](/md/modules/workspace) | 项目级工具、生成代码和运行产物通常随 Workspace 管理。 |

## 2. 页面结构

工具清单页面按 Tab 组织，常见入口包括：

| Tab | 用途 |
| --- | --- |
| **全量工具** | 查看所有已注册工具，按分类、来源、状态进行搜索和筛选。 |
| **MCP 服务** | 管理 MCP Server，查看 MCP 提供的工具和资源。 |
| **API 集成** | 管理 API 服务工具，配置凭证并测试连通性。 |
| **本地工具** | 查看本地 Python 工具，例如放在 `~/.flocks/plugins/tools/python/` 下的工具。 |

工具列表中通常会显示工具名称、描述、来源、状态和操作入口。点击工具可以查看参数 schema、安全属性、是否需要执行确认，并进行测试调用。

## 3. 工具类型

### 3.1 内置工具

内置工具由 Flocks 自带，常用于文件读写、终端命令、代码搜索、浏览器操作、系统信息读取等基础动作。它们是 Rex、Agent 和 Workflow 执行任务的基础能力。

其中 `channel_message` 是典型的通道类系统工具。它接收目标 `session_id` 和消息内容，根据该 Session 的 IM 绑定关系自动找到企业微信、飞书或钉钉对话，再发送消息。用户在会话中说"给 sessionid：`sessionID`，发送：`内容`"时，Rex 通常会使用这个工具完成固定 IM 对话推送。

部分内置工具不支持在工具页面直接测试，应在 Session 会话中通过真实任务触发测试。

### 3.2 API 工具

API 工具用于接入安全设备、威胁情报源、内部业务系统或外部 SaaS。典型例子包括 ThreatBook、VirusTotal、GreyNoise、漏洞平台、告警平台、资产平台等。

API 工具可以手动添加，也可以让 Rex 根据 API 文档自动生成。生成后的工具会出现在 API 集成 Tab 中，并可以配置凭证、测试连通性和查看可用工具列表。

### 3.3 MCP 服务

MCP 服务用于接入已经提供 MCP 能力的外部系统。MCP Server 可以暴露工具，也可以暴露资源。Flocks 会把 MCP 工具纳入统一工具体系，使其可以被 Agent 和 Workflow 直接调用。

MCP 适合以下场景：

- 外部系统已经提供 MCP Server。
- 希望用标准协议接入多个工具或资源。
- 不想为每个接口单独写 API 工具。
- 工具能力可能随 MCP Server 动态变化。

### 3.4 本地工具

本地工具通常是 Python 脚本或团队内部封装的处理逻辑，适合私有协议解析、内部日志处理、环境特定的数据转换等场景。

本地 Python 工具可以放在：

```text
~/.flocks/plugins/tools/python/
```

放入后刷新工具清单，即可在本地工具 Tab 中查看。部分本地工具会标记"需确认"，表示执行前需要用户确认，适合有副作用或风险较高的动作。

## 4. 接入 API 工具

### 4.1 通过页面表单添加

在工具清单中点击 **添加 API**，可以通过表单填写：

- **API 服务名称**：例如 `threatbook`、`openweather`、`github`。
- **Base URL**：API 服务根地址。
- **API Key**：可选；也可以先创建服务，稍后再配置凭证。
- **功能描述**：说明这个 API 提供什么能力，Rex 会据此生成或补全工具代码。

如果不确定如何填写，可以切换到"对话接入"模式，让 Rex 根据服务名称、接口文档和需求描述辅助完成。

### 4.2 通过自然语言添加

在会话里可以直接对 Rex 说：

```text
帮我接入 VT 的 API 服务。
Key 放在 ~/vt_key.txt。
文档地址是：https://...
```

如果没有现成文档，也可以让 Rex 先搜索：

```text
帮我 web 搜索 VT 的 API 文档，然后接入 VT API 工具。
Key 放在 ~/vt_key.txt。
```

Rex 通常会完成：

1. 阅读 API 文档或接口说明。
2. 理解鉴权方式、请求参数和返回结构。
3. 生成 API 工具代码。
4. 注册工具到工具清单。
5. 配置或引用凭证。
6. 执行真实请求验证。
7. 根据失败信息自动调试。

### 4.3 API 工具的凭证配置

需要认证的 API 工具会显示"需密钥"或类似状态。点击 **配置密钥** 后，可以填写 API Key、Secret、用户名、密码或服务需要的其他字段。

凭证会存储在：

```text
~/.flocks/config/.secret.json
```

配置文件中可以通过 `{secret:ID}` 引用密钥，避免把敏感值直接写进工具配置或 MCP 配置里。

### 4.4 API 工具的测试

配置凭证后，应点击 **测试连通** 或进入工具详情执行测试。测试时重点关注：

- API Key 是否有效。
- Base URL 是否正确。
- 参数 schema 是否符合接口要求。
- 返回字段是否能被 Agent 或 Workflow 正确消费。
- 错误信息是否被工具清晰返回。

测试通过只代表基础连通性可用。真实任务中还可能受到上下文长度、批量大小、接口限速和返回格式变化影响。

## 5. 接入 MCP 服务

### 5.1 连接方式

添加 MCP 服务时，可以选择两类连接方式：

| 连接方式 | 适合场景 |
| --- | --- |
| **Stdio 本地进程** | 本地启动一个 MCP Server，例如 `npx`、`uvx`、`python` 命令。 |
| **远程服务（SSE / HTTP）** | MCP Server 已经以远程地址提供服务。 |

Stdio 模式需要填写启动命令和命令参数。命令参数通常一行一个，例如：

```text
npx
@modelcontextprotocol/server-github
--token
{secret:github_token}
```

远程服务模式需要填写服务地址，例如：

```text
http://localhost:3000/sse
```

传输协议可以选择自动探测，也可以指定仅 SSE 或仅 Streamable HTTP。

### 5.2 认证方式

MCP 服务支持多种认证方式：

| 认证方式 | 说明 |
| --- | --- |
| **无认证** | 本地或可信网络内的服务。 |
| **Bearer Token** | 常见 Token 鉴权方式。 |
| **自定义请求头** | 服务要求特定 Header 时使用。 |
| **Query 参数** | 服务要求通过 URL 参数传递认证信息时使用。 |

Token、Header 值或 Query 值都可以直接填写，也可以使用 `{secret:secret_id}` 引用已保存密钥。额外请求头需要填写合法 JSON 对象。

### 5.3 MCP 服务管理

MCP 服务添加后，可以在 MCP 服务 Tab 中进行：

- **测试连接**：验证 MCP Server 是否可达。
- **刷新工具列表**：重新读取 MCP Server 暴露的工具。
- **查看资源**：查看 MCP Server 暴露的 Resources。
- **断开 / 连接 / 重新连接**：管理服务生命周期。
- **配置密钥**：为需要凭证的服务补充必要认证信息。
- **查看详情**：查看服务地址、协议版本、连接时间、工具数量和资源数量。

服务状态可能包括已连接、错误、未连接、需密钥、已就绪、推荐等。出现错误时，优先检查启动命令、服务地址、传输协议和认证配置。

### 5.4 MCP 工具与资源

MCP Server 可能同时提供 Tools 和 Resources：

- **Tools**：可执行动作，例如查询、写入、调用外部系统。
- **Resources**：可读取的上下文或数据源，例如文档、配置、数据库 schema。

Agent 和 Workflow 主要调用 MCP Tools；Resources 通常用于补充上下文。工具详情页会标明该工具来自哪个 MCP Server，并显示参数、描述和测试入口。

## 6. 使用本地工具

### 6.1 本地工具目录

本地 Python 工具默认放在：

```text
~/.flocks/plugins/tools/python/
```

适合存放团队内部脚本，例如日志解析、内部系统查询、数据清洗、格式转换、离线文件处理等。

### 6.2 本地工具使用建议

本地工具应尽量做到：

- 输入输出结构清晰。
- 参数名称可读，便于 Agent 生成参数。
- 错误信息明确，便于 Rex 调试。
- 对有副作用的动作标记确认。
- 不把敏感凭据硬编码在脚本里。

如果本地工具经常被多个 Agent 使用，建议再写一个 Skill，说明这个工具适合什么场景、参数如何填写、结果如何解释。

## 7. 工具详情与测试

### 7.1 查看工具详情

点击工具后，可以查看：

- 工具描述。
- 当前状态。
- 来源和供应商。
- 是否启用。
- 是否执行需确认。
- 参数名称、类型、是否必填和描述。
- MCP Server 或 API 服务信息。

这些信息会影响 Rex 是否敢调用该工具，也会影响模型生成参数的准确性。

### 7.2 执行测试调用

工具详情页通常支持填写 JSON 参数执行测试。测试前应确认：

1. JSON 语法合法。
2. 必填参数都已提供。
3. 参数类型符合 schema。
4. 凭证已配置并通过连通性测试。
5. 工具适合在页面中直接测试。

如果测试失败，优先看错误信息属于哪一类：参数错误、认证错误、网络错误、服务端错误，还是工具实现错误。

### 7.3 工具状态与启用

工具可能处于已启用、已禁用、未配置、异常、检测中等状态。对于 API 服务和 MCP 服务，页面通常还会显示连接状态或凭证状态。

禁用的工具不会被 Agent 或 Workflow 正常调用。对于关键工具，建议在修改凭证、服务地址或工具代码后重新测试一次。

## 8. 会话中的 /tools 与 /mcp 命令

除了进入工具清单页面，也可以在 WebUI 会话、TUI 或 CLI 会话中使用 slash 命令快速查看工具。

### 8.1 /tools 命令

`/tools` 用于查看和管理当前运行时可见的工具。常用形式包括：

| 命令 | 作用 |
| --- | --- |
| `/tools` 或 `/tools list` | 按分类列出当前可用工具。 |
| `/tools refresh` | 刷新动态工具，再返回当前工具摘要。 |
| `/tools info <name>` | 查看某个工具的分类、描述、是否启用、是否需要确认、参数 schema。 |
| `/tools create <requirement>` | 调用 `tool-builder` Skill，根据自然语言需求创建工具。 |

例如：

```text
/tools
/tools info bash
/tools create 接入一个查询 IOC 信誉的 API 工具
```

`/tools` 是最轻量的排查入口。发现 Agent 没有调用预期工具时，可以先用它确认工具是否已经注册、是否启用、参数是否清楚。

### 8.2 /mcp 命令

`/mcp` 用于查看 MCP 服务和 MCP 工具。常用形式包括：

| 命令 | 作用 |
| --- | --- |
| `/mcp` 或 `/mcp list` | 查看 MCP Server 列表和连接状态。 |
| `/mcp status` | 查看每个 MCP Server 的状态、工具数、资源数和错误信息。 |
| `/mcp tools` | 列出所有 MCP Server 暴露的工具。 |
| `/mcp refresh <server>` | 刷新指定 MCP Server 的工具列表。 |

例如：

```text
/mcp status
/mcp tools
/mcp refresh github
```

如果工具来自 MCP Server，通常先用 `/mcp status` 确认服务在线，再用 `/mcp tools` 或 `/tools info <name>` 查看具体工具。

### 8.3 其他常用 / 命令

除了 `/tools` 和 `/mcp`，会话中还可以使用其他 slash 命令快速查看能力或触发特定工作流：

| 命令 | 作用 |
| --- | --- |
| `/help` | 查看当前可用 slash 命令。 |
| `/new` | 清理当前对话历史，重新开始一轮新对话。也可能支持 `/reset` 别名。 |
| `/skills` | 查看当前可用 Skill。 |
| `/agents` | 查看当前可委派 Agent。 |
| `/workflows` | 查看当前可用 Workflow。 |
| `/tasks` | 查看任务中心概览。 |
| `/queue` | 查看任务队列状态。 |
| `/compact` | 压缩和总结当前会话上下文。 |
| `/clear` | 清空当前 UI 输出，不删除真实会话数据。 |
| `/plan <task>` | 让 Plan Agent 为任务创建计划。 |
| `/ask <question>` | 以只问答方式提问，适合不希望改动环境时使用。 |
| `/init` | 分析当前项目并创建或更新项目级 Agent 指引。 |
| `/bug <description>` | 提交或整理问题反馈。 |

通道场景还支持一些会话控制命令，例如 `/model`、`/status`、`/new` 或 `/reset`。不同入口的可见命令可能略有差异，最准确的方式是在当前会话里输入 `/help` 查看。

## 9. CLI 与 TUI 管理入口

### 9.1 CLI 中管理 MCP 工具

当前 CLI 里工具管理主要通过 MCP 命令和页面完成。常用 MCP 命令包括：

| 命令 | 作用 |
| --- | --- |
| `flocks mcp list` | 查看已配置 MCP Server 及状态。 |
| `flocks mcp add` | 交互式添加 MCP Server。 |
| `flocks mcp add --name <name> --type remote --url <url>` | 添加远程 MCP Server。 |
| `flocks mcp add --name <name> --type local --command "<cmd>"` | 添加本地 stdio MCP Server。 |
| `flocks mcp auth <name>` | 对支持 OAuth 的远程 MCP Server 进行认证。 |
| `flocks mcp logout <name>` | 清除指定 MCP Server 的认证。 |
| `flocks mcp connect <name>` | 连接指定 MCP Server。 |
| `flocks mcp disconnect <name>` | 断开指定 MCP Server。 |
| `flocks mcp tools [server]` | 查看全部或指定 Server 暴露的 MCP 工具。 |
| `flocks mcp refresh [server]` | 刷新全部或指定 Server 的 MCP 工具。 |
| `flocks mcp debug <name>` | 调试 MCP Server 配置和连接。 |

工具清单里的 API 工具和本地 Python 工具，通常通过 WebUI 页面、Rex 的 `/tools create`、本地目录或项目插件目录管理；MCP 工具则更适合用 `flocks mcp` 命令维护。

### 9.2 TUI 中查看和切换工具上下文

TUI 会同步当前 Agent、MCP Server 和可用工具状态。常见操作包括：

- 在输入框使用 `/tools`、`/mcp` 查看工具和 MCP 状态。
- 使用 MCP 弹窗查看和连接 MCP Server。
- 在侧边栏查看 MCP Server 连接数和错误状态。
- 通过 `flocks debug agent <agent> --tool <tool> --params '<json>'` 调试某个 Agent 是否能执行指定工具。

示例：

```bash
flocks debug agent rex --tool bash --params '{"cmd":"pwd"}'
```

如果要验证"某个 Agent 是否有权调用某个工具"，TUI 的 debug agent 命令比直接在会话里试错更直接。

## 10. Agent 和 Workflow 如何使用工具

### 10.1 Agent 的工具白名单

工具本身注册在平台级，但 Agent 可以配置自己的工具白名单。这样可以让每个 Agent 只看到与职责相关的工具，降低误调用概率。

例如：

- 情报分析 Agent 只配置 IOC 查询、情报源 API、报告写入工具。
- 设备巡检 Agent 只配置浏览器、设备 API、文件写入工具。
- 漏洞研判 Agent 只配置漏洞库、资产查询、影响评估工具。

### 10.2 Workflow 的工具节点

Workflow 可以通过工具节点调用 API、MCP、本地 Python 或其他工具。工具节点适合承担明确、可重复、输入输出稳定的动作，例如：

- 查询 IOC。
- 拉取资产信息。
- 调用告警平台接口。
- 解析日志。
- 写入文件。
- 发送通知。

如果某个工具调用前后需要复杂判断，可以把判断逻辑放在 Agent 节点或 Skill 中，工具节点只负责稳定动作。

## 11. 真实案例：接入 VT API 工具

### 11.1 用户输入

```text
帮我 web 搜索 VT 的 API 文档，然后帮我接入 VT 的 API 服务。
Key 在文件里。
```

### 11.2 生成过程

Rex 会：

1. 搜索或读取 VT API 文档。
2. 理解接口结构、鉴权方式和查询参数。
3. 生成 API 工具代码。
4. 用用户提供的 Key 发起真实请求。
5. 根据返回结果调整字段解析和错误处理。
6. 验证通过后，把工具加入工具清单。

### 11.3 验收方式

完成后建议做三件事：

1. 在 API 集成 Tab 中确认服务状态正常。
2. 在工具详情里用样例 IOC 执行测试。
3. 在会话或 Workflow 中触发一次真实任务，确认 Agent 能正确消费返回结果。

## 12. 常见问题

### 12.1 接入后自动加载还是要手动启用？

通常会自动出现在工具清单，并可被 Rex 在后续任务中使用。如果没出现，先刷新页面，并确认工具安装在当前 Workspace 还是用户级目录。

### 12.2 MCP 测试里粘贴 JSON 报错，是格式问题还是调用方式不对？

分层排查：

1. 先校验 JSON 语法。
2. 再看参数结构是否符合工具 schema。
3. 再检查 MCP Server 是否已连接。
4. 最后判断这个工具是否适合在页面测试框里直接调用。

### 12.3 为什么测试通过但真实任务调不通？

测试只验证基础连通性。真实任务会叠加更长上下文、更大输出、批量请求、接口限速和工具组合。建议先区分"所有工具都失败"还是"只有某个工具失败"，再定位到模型参数生成、工具实现、凭证或外部服务。

### 12.4 Docker 场景下工具能正常用吗？

取决于工具类型：

- **API 工具**：网络可达、凭证正确即可。
- **MCP Stdio 工具**：需要容器内具备对应命令、依赖和环境变量。
- **浏览器工具**：Docker 下交互式 headed 模式通常不适合，需要按部署方式单独确认。
- **本地文件 / Bash 工具**：需要注意挂载目录和权限。

### 12.5 工具调用成功但结果没自动保存怎么办？

不少工具默认只返回结果，不落盘。需要文件产出时，可以：

- 在任务 Prompt 中明确要求"结果写入文件"。
- 在工具定义中增加输出路径参数。
- 在 Workflow 中增加写文件节点。
- 把最终产物写入 [Workspace](/md/modules/workspace) 的 `outputs/`。

### 12.6 API 工具能不能只给特定 Agent 使用？

可以。工具注册后是平台能力，但每个 [Agent](/md/modules/agents) 可以配置自己的工具白名单。这样能避免 Agent 误用不相关工具。

### 12.7 MCP 服务连接失败怎么办？

优先检查：

- Stdio 启动命令是否能在当前环境执行。
- 命令参数是否一行一个、顺序正确。
- 远程服务地址是否可访问。
- 传输协议是否选对。
- Token、Header、Query 参数是否有效。
- `{secret:ID}` 是否已经在凭证文件中配置。

## 13. 相关模块

- [Agent 智能体](/md/modules/agents)：工具的主要调用者。
- [Workflow 工作流](/md/modules/workflow)：工具节点的执行来源。
- [Skills 技能库](/md/modules/skills)：沉淀工具使用方法和判断规范。
- [模型配置](/md/communication-models)：工具调用依赖模型生成稳定参数。
- [Workspace](/md/modules/workspace)：管理项目级工具、产物和上下文。
- [场景实践 · 内网安全产品接入](/md/scenarios/network-integration)：多种工具接入方式的优先级。
- [场景实践 · 浏览器自动化](/md/scenarios/browser-automation)：从浏览器突破到 API 工具固化的路径。

操作演示视频将在发布物料稳定后补充到本页。
