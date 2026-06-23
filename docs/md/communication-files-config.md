# 3.5 文件与配置

以下按两类目录理解即可：

- 一类是**用户目录** `~/.flocks/`，负责保存用户信息、运行配置、插件和业务产物，更新源码或升级程序时通常不会覆盖这里；
- 另一类是**源码目录** `flocks/`，负责保存程序代码、前端、脚本和测试。Windows 可将 `~` 理解为 `%USERPROFILE%`。

**用户目录 `~/.flocks/`**

| 目录 | 功能作用 |
| --- | --- |
| `~/.flocks/config/` | 配置目录，保存 `flocks.json`、`.secret.json` 等运行配置与敏感凭证。 |
| `~/.flocks/data/` | 运行数据目录，保存数据库、会话记录、记忆、媒体缓存、Workflow 服务数据、沙箱状态等系统数据。 |
| `~/.flocks/logs/` | 日志目录，保存服务端、任务、工具调用、通道和排障相关日志。 |
| `~/.flocks/workspace/` | 用户业务工作区，保存上传文件、输出结果、知识资料、通道状态等用户可管理产物。 |
| `~/.flocks/plugins/` | 用户级插件目录，保存安装到当前用户环境的 Agent、Skill、Workflow、Tool、Task、MCP 和自定义页面等能力。 |
| `~/.flocks/flockshub/` | 本地插件广场目录，保存 bundled 插件索引、分类信息和待安装插件内容。 |
| `~/.flocks/browser/` | 浏览器自动化运行目录，保存浏览器控制、临时状态和相关运行文件。 |
| `~/.flocks/version/` | 版本与升级备份目录，保存当前版本标记、升级过程备份和回滚相关文件。 |
| `~/.flocks/flockspro/` | Flocks Pro 数据目录，保存 Pro 授权、License 等企业版相关本地文件。 |
| `~/.flocks/run/` | 运行状态目录，保存启动、组件安装标记和进程运行期间需要记录的状态文件。 |
| `~/.flocks/audit/` | 审计目录，保存本机敏感操作的审计记录，例如 SSH 命令审计日志。 |
| `~/.flocks/workflow/` | 旧版 Workflow 兼容目录，历史工作流可能仍会被扫描；新工作流优先使用 `~/.flocks/plugins/`。 |
| `~/.flocks/mcp/` | 旧版 MCP 依赖目录，历史本地 MCP 安装可能使用；新配置优先进入 `~/.flocks/plugins/` 与 `~/.flocks/config/`。 |

**源码目录 `flocks/`**

| 目录 | 功能作用 |
| --- | --- |
| `flocks/flocks/` | Python 主程序目录，包含服务端、Agent、Workflow、Tool、Workspace、通道、配置等核心实现。 |
| `flocks/webui/` | WebUI 前端目录，包含页面、组件、静态资源和前端构建配置。 |
| `flocks/tui/` | TUI 终端界面目录。 |
| `flocks/scripts/` | 安装、启动、构建、辅助处理等脚本目录。 |
| `flocks/tests/` | 测试目录，包含单元测试、集成测试和模块级测试。 |
| `flocks/assets/` | 项目文档或展示用静态资源目录。 |
| `flocks/docker/` | Docker 相关文件目录。 |
| `flocks/packaging/` | 打包与发布目录，例如 Windows 安装包相关文件。 |
| `flocks/.flocks/` | 仓库内置示例与默认插件目录，提供示例配置、bundled 插件和开发期默认内容，不等同于用户家目录下的 `~/.flocks/`。 |
| `flocks/README.md` / `flocks/README_zh.md` | 项目安装、启动与使用说明入口。 |
