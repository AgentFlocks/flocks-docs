# 3. 部署与配置

本节按部署、安装、配置和网络策略拆成以下部分，可按需求直接进入：  

- [3.1 远程部署](/md/communication-remote-deploy)
- [3.2 离线安装](/md/communication-network-install)
- [3.3 通道配置](/md/communication-channels)
- [3.4 模型配置](/md/communication-models)
- [3.5 文件与配置](#35-文件与配置)
- [3.6 网络访问清单](#36-网络访问清单)

如果你同时需要先看整体再逐条阅读，也建议先按上面顺序依次打开。

## 3.5 文件与配置

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

## 3.6 网络访问清单

在受限网络中部署 Flocks 时，不建议一次性放开全部公网访问，而应按**本机访问**、**安装/升级**和**运行期按功能放行**三类最小化配置。

1. 本机或内网访问 Flocks
   - 客户端访问 Flocks WebUI：`5173/tcp`
   - 浏览器或脚本直连后端 API 时访问：`8000/tcp`
   - 如果前面有反向代理，则按实际代理地址放行 `80/443`
2. 在线安装或升级阶段需要访问的出站 Host

国内环境默认使用 `install_zh` 链路：

| 用途 | Host |
| --- | --- |
| 源码与安装脚本 | `gitee.com` |
| Python 包索引 | `mirrors.aliyun.com` |
| npm 包索引 | `registry.npmmirror.com` |
| 浏览器依赖下载 | `cdn.npmmirror.com` |
| uv 安装脚本 | `astral.org.cn` |
| uv 备用源 | `uv.agentsmirror.com` |
| uv 官方回退源 | `astral.sh` |

国外环境默认使用 `install` 链路：

| 用途 | Host |
| --- | --- |
| 源码仓库与压缩包 | `github.com` |
| 一键安装脚本与 nvm 安装脚本 | `raw.githubusercontent.com` |
| Python 包索引 | `pypi.org` |
| npm 包索引 | `registry.npmjs.org` |
| uv 安装脚本 | `astral.sh` |
| Node.js 手动下载页 | `nodejs.org` |

Docker 在线拉镜像时，还需要放行 `ghcr.io`，或你们实际使用的 GHCR 镜像域名。如果你们通过环境变量覆写了 npm、PyPI、uv、nvm 或镜像地址，则应以实际覆写后的 Host 为准，而不是以上默认值。

3. 运行期最小必需外联
   - 放行你在 Flocks 中实际配置的大模型 `Base URL` 对应 Host
   - 如果只做离线 Docker 导入镜像部署，且模型、情报、通道都走内网或本地服务，则 Flocks 本体运行本身不强依赖公网
4. ThreatBook 相关能力
   - 大模型与引导场景可能涉及：`llm.threatbook.cn`、`llm.threatbook.io`
   - 引导页、服务接入与 MCP 相关访问可能涉及：`x.threatbook.com`、`threatbook.io`、`mcp.threatbook.cn`
5. IM 通道按需放行
   - 飞书：`open.feishu.cn`
   - 飞书国际版：`open.larksuite.com`
   - 钉钉：`api.dingtalk.com`
   - 企业微信：`openws.work.weixin.qq.com`
   - 企业微信 `wecom_mcp` 场景：还需要额外放行企业微信运行时动态返回的 MCP URL 对应 Host
   - 微信：`ilinkai.weixin.qq.com`、`novac2c.cdn.weixin.qq.com`
   - Telegram：`api.telegram.org`

如果要给网络团队一份最小白名单，可以按下面理解：

- 仅本地使用：放行 WebUI / API 访问端口，加上模型服务 Host 即可。
- 需要在线安装：在最小集合上，再增加安装与升级阶段的依赖站点。
- 需要情报或 IM 集成：再按 ThreatBook、飞书、钉钉、企微、微信、Telegram 等启用项逐项加白，而不是全部放开。
