# 2.1 安装与快速开始

Flocks 支持多种安装方式。第一次使用建议优先选择命令行安装；如果你需要查看或修改源码，可以选择源码安装；Windows x64 用户也可以使用 EXE 安装包；服务器或标准化环境更适合 Docker。

## 系统要求

- Ubuntu ≥20.04 / Debian ≥10
- RHEL/CentOS 系 ≥8，Rocky 9以上
- 最低配置建议为 2 核 4G，推荐优先在本机安装使用。

| 方式 | 适合场景 | 说明 |
| --- | --- | --- |
| 命令行安装 | 推荐给大多数用户 | 最快完成安装，适合 macOS / Linux / Windows |
| 源码安装 | 需要查看或修改源码 | 更适合开发、完整交互和后续排障 |
| Windows EXE 安装包 | Windows x64 用户 | 通过安装向导完成图形化安装 |
| Docker 安装 | 容器化部署或环境隔离 | 开箱即用，但 `agent-browser` headed 模式暂不可用 |

## 推荐路径 1：命令行安装

如果你希望最快完成安装，优先选择命令行安装。脚本会在当前目录下创建 `./flocks` 并完成安装。

中国大陆环境默认推荐使用 Gitee 上的 `install_zh` 一键安装脚本。

macOS / Linux

```bash
curl -fsSL https://gitee.com/flocks/flocks/raw/main/install_zh.sh | bash
```

Windows PowerShell（Administrator）

```powershell
powershell -c "irm https://gitee.com/flocks/flocks/raw/main/install_zh.ps1 | iex"
```

安装完成后，进入项目目录并启动服务：

```bash
cd flocks
flocks start
```

## 推荐路径 2：源码安装

如果你希望先查看源码，再自己执行安装脚本，可以采用源码安装：

```bash
git clone https://gitee.com/flocks/flocks.git flocks
cd flocks
sh ./scripts/install_zh.sh
```

Windows PowerShell（Administrator）

```powershell
powershell -ep Bypass -File .\scripts\install_zh.ps1
```

源码安装完成后，可以直接启动服务：

```bash
flocks start
```

## 推荐路径 3：Windows EXE 安装包

如果你使用 Windows x64，可以从 [GitHub Releases](https://github.com/AgentFlocks/flocks/releases) 下载 `FlocksSetup-<tag>.exe` 安装包，并按安装向导完成安装。

安装完成后，可以通过开始菜单或桌面快捷方式启动 Flocks；也可以打开一个新的终端执行：

```powershell
flocks start
```

如果你选择在终端启动，建议安装完成后新开 PowerShell 或命令行窗口，确保新的 `PATH` 等环境变量已经生效。

<a id="quick-start-recommend-path-4-docker"></a>

## 推荐路径 4：Docker 安装

> Docker 版本暂时不支持 `agent-browser` headed 模式。

如果你更在意环境隔离或快速部署，可以直接拉取镜像：

```bash
docker pull ghcr.io/agentflocks/flocks:latest
docker run -d \
  --name flocks \
  -e TZ=Asia/Shanghai \
  -p 5173:5173 \
  --shm-size 4gb \
  -v "${HOME}/.flocks:/home/flocks/.flocks" \
  ghcr.io/agentflocks/flocks:latest
```

Windows PowerShell

```powershell
docker run -d `
  --name flocks `
  -e TZ=Asia/Shanghai `
  -p 5173:5173 `
  --shm-size 4gb `
  -v "${env:USERPROFILE}\.flocks:/home/flocks/.flocks" `
  ghcr.io/agentflocks/flocks:latest
```

Docker 国内镜像地址：

- 1ms GHCR：`docker pull ghcr.1ms.run/agentflocks/flocks:latest`
- dockerproxy GHCR：`docker pull ghcr.dockerproxy.net/agentflocks/flocks:latest`
- gh-proxy prefix：`docker pull docker.gh-proxy.com/ghcr.io/agentflocks/flocks:latest`
- milu GHCR：`docker pull ghcr.milu.moe/agentflocks/flocks:latest`
- NJU GHCR：`docker pull ghcr.nju.edu.cn/agentflocks/flocks:latest`

需要注意的是，Docker 更适合服务化使用，不适合依赖本机交互式浏览器登录的场景。如果你的任务高度依赖网页登录和人工交互，命令行安装或源码安装更合适。镜像中的 `EXPOSE` 仅用于声明容器端口，实际仍需要 `-p 5173:5173` 才能从宿主机浏览器访问服务。WebUI 与 API 共用该端口，API 请求使用同源 `/api` 路径。

## 安装前的最低依赖

不论采用哪条路径，建议先确认下面这些依赖：

- `uv`
- `Node.js 22+`（`npm` 随 Node.js 一起安装）
- `agent-browser`
- `bun`（可选，用于 TUI 安装）

安装脚本会在可行时尽量自动补齐这些依赖；如果安装过程中自动安装 `npm` 失败，请手动安装 `Node.js 22+` 与 `npm`。如果你在中国大陆环境使用，建议提前为 `uv` 配置国内镜像源，这会明显提升安装成功率和依赖下载速度。

安装完成后，继续阅读 [服务启动与访问](/md/quick-start-service)。
