# Quick Start

本页是 Flocks 文档中**唯一的完整安装手册**。目标是帮第一次接触 Flocks 的用户以最短路径完成三件事：安装、启动、首次配置。  
如果你需要查找安装路径、启动、配置、排障入口，先从本页起步，再按场景转到其他文档。

## 安装与快速开始

Flocks 支持多种安装方式。第一次使用建议优先选择命令行安装；如果你需要查看或修改源码，可以选择源码安装；Windows x64 用户也可以使用 EXE 安装包；服务器或标准化环境更适合 Docker。

#### 系统要求
- Ubuntu ≥20.04 / Debian ≥10
- RHEL/CentOS 系 ≥8，Rocky 9以上
- 最低配置建议为 2 核 4G，推荐优先在本机安装使用。

| 方式 | 适合场景 | 说明 |
| --- | --- | --- |
| 命令行安装 | 推荐给大多数用户 | 最快完成安装，适合 macOS / Linux / Windows |
| 源码安装 | 需要查看或修改源码 | 更适合开发、完整交互和后续排障 |
| Windows EXE 安装包 | Windows x64 用户 | 通过安装向导完成图形化安装 |
| Docker 安装 | 容器化部署或环境隔离 | 开箱即用，但 `agent-browser` headed 模式暂不可用 |

### 推荐路径 1：命令行安装

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

### 推荐路径 2：源码安装

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

### 推荐路径 3：Windows EXE 安装包

如果你使用 Windows x64，可以从 [GitHub Releases](https://github.com/AgentFlocks/flocks/releases) 下载 `FlocksSetup-<tag>.exe` 安装包，并按安装向导完成安装。

安装完成后，可以通过开始菜单或桌面快捷方式启动 Flocks；也可以打开一个新的终端执行：

```powershell
flocks start
```

如果你选择在终端启动，建议安装完成后新开 PowerShell 或命令行窗口，确保新的 `PATH` 等环境变量已经生效。

### 推荐路径 4：Docker 安装

> Docker 版本暂时不支持 `agent-browser` headed 模式。

如果你更在意环境隔离或快速部署，可以直接拉取镜像：

```bash
docker pull ghcr.io/agentflocks/flocks:latest
docker run -d \
  --name flocks \
  -e TZ=Asia/Shanghai \
  -p 8000:8000 \
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
  -p 8000:8000 `
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

需要注意的是，Docker 更适合服务化使用，不适合依赖本机交互式浏览器登录的场景。如果你的任务高度依赖网页登录和人工交互，命令行安装或源码安装更合适。镜像中的 `EXPOSE` 仅用于声明容器端口，实际仍需要 `-p 8000:8000 -p 5173:5173` 才能从宿主机浏览器访问服务。

### 安装前的最低依赖

不论采用哪条路径，建议先确认下面这些依赖：

- `uv`
- `Node.js 22+`（`npm` 随 Node.js 一起安装）
- `agent-browser`
- `bun`（可选，用于 TUI 安装）

安装脚本会在可行时尽量自动补齐这些依赖；如果安装过程中自动安装 `npm` 失败，请手动安装 `Node.js 22+` 与 `npm`。如果你在中国大陆环境使用，建议提前为 `uv` 配置国内镜像源，这会明显提升安装成功率和依赖下载速度。

## 服务启动与访问

安装完成并不代表服务已经在运行。标准做法是：

```bash
flocks start
flocks status
flocks logs
flocks restart
flocks stop
```

其中：

- `flocks start`：启动后端和 WebUI，首次启动通常会先构建 WebUI
- `flocks status`：查看当前服务状态
- `flocks logs`：查看启动和运行日志
- `flocks restart`：显式全量重启
- `flocks stop`：停止服务
- `flocks --help`：查看完整 CLI 用法

默认访问地址为：

- WebUI：`http://127.0.0.1:5173`
- 后端 API：`http://127.0.0.1:8000`

如果需要远程访问，可显式指定监听地址：

```bash
flocks start --server-host <ip> --webui-host <ip>
```

如果你只是本机使用，直接打开 `http://127.0.0.1:5173` 即可。如果你部署在云主机、虚拟机或局域网机器上，还需要显式修改监听地址和端口暴露策略。

建议按下面的顺序做启动检查：

1. 执行 `flocks status`，确认服务已正常启动
2. 执行 `flocks logs`，确认没有持续报错
3. 浏览器打开 `http://127.0.0.1:5173`
4. 确认页面已加载，而不是空白页或持续报错页
5. 继续完成首次账号初始化和默认模型配置

如果你在远程机器上部署：

- 默认监听地址通常仍是 `127.0.0.1`
- WebUI 和 API 的对外访问路径要单独确认
- 更推荐优先只对外开放 WebUI，而不是直接裸露 API

## 首次配置

![首次配置引导](../img/fresh_man_guide.png)

首次进入 WebUI 后，先完成账号初始化，再进行新手引导和模型配置：

1. 首次打开 WebUI 时，先完成 `bootstrap-admin`，创建本机唯一的 `admin` 账号
2. 进入模型管理，选择官方支持的模型供应商，或选择 `OpenAI Compatible` 接入兼容 OpenAI API 的服务
3. 填写 Base URL、API Key 和模型名称
4. 点击“测试连接”并确认调用链路可用
5. 设置默认模型后，再继续新手引导任务；也可以在模型管理界面补充更多模型

![模型管理页面](../img/quick-start-models.png)

上图是模型管理页面。这里既能看到模型供应商、模型列表，也能执行“测试连接”“设置默认模型”等关键动作。对第一次使用 Flocks 的用户来说，这一页通常比直接进入对话更重要。

完成账号初始化后，再按下面的步骤配置模型。

### 第一步：添加模型供应商

如果你使用官方支持的模型服务，直接选择对应供应商即可；如果你使用自建网关、本地模型服务或兼容 OpenAI API 的第三方服务，通常优先选择 `OpenAI Compatible` 这类兼容模式。

### 第二步：添加具体模型

你通常需要填写：

- Base URL 或 API 地址
- API Key
- 模型名称

### 第三步：测试连接

很多“模型明明已经保存，但系统还是不能用”的问题，都出在这里。保存配置只代表信息被写入了系统，不代表调用链路真的可用；测试连接则可以提前暴露地址错误、认证失败和接口不兼容等问题。

### 第四步：设置默认模型

这是首次配置最容易漏掉的一步。你可以把它理解为：

- 已添加模型：只是“系统知道这个模型存在”
- 默认模型：表示“系统接下来优先用它执行任务”

如果没有设置默认模型，首页仍可能提示配置未完成，Agent 也可能表现异常。

### 首次配置完成检查清单

- `bootstrap-admin` 已完成，`admin` 账号可正常登录
- 至少有一个供应商已配置成功
- 至少有一个模型已保存
- 模型测试已经通过
- 默认模型已经设置
- 首页引导状态已恢复正常

如果以上都没问题，你就可以继续阅读功能模块文档，进入对话管理、工作流、智能体和工具接入等功能。
