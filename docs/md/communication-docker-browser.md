# 3.8 Docker 浏览器配置

在 macOS 或 Windows 上使用 Docker 部署 Flocks 时，可以让容器中的 Flocks 连接宿主机上的 Google Chrome。Chrome 负责提供 CDP（Chrome DevTools Protocol）服务，Flocks 通过该服务控制浏览器。

## 3.8.1 macOS 宿主机启动 Chrome

在 macOS 宿主机执行：

```bash
open -na "Google Chrome" --args \
  --remote-debugging-port=19122 \
  --remote-debugging-address=0.0.0.0 \
  --user-data-dir="$HOME/.flocks/browser/chrome-debug"
```

该命令会使用独立的用户数据目录启动 Chrome，避免与日常使用的 Chrome 实例冲突。

执行以下命令验证 CDP 服务：

```bash
curl http://127.0.0.1:19122/json/version
```

如果返回的 JSON 中包含 `webSocketDebuggerUrl`，表示 Chrome 已启动成功。

## 3.8.2 Windows 宿主机启动 Chrome

在 Windows PowerShell 中执行：

```powershell
$chrome = "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
Start-Process -FilePath $chrome -ArgumentList @(
  "--remote-debugging-port=19122",
  "--remote-debugging-address=0.0.0.0",
  "--user-data-dir=$env:USERPROFILE\.flocks\browser\chrome-debug"
)
```

如果 Chrome 未安装在默认路径，请将 `$chrome` 修改为实际的 `chrome.exe` 路径。该命令同样使用独立的用户数据目录，不会复用日常 Chrome 实例的配置。

执行以下命令验证 CDP 服务：

```powershell
curl.exe http://127.0.0.1:19122/json/version
```

如果返回的 JSON 中包含 `webSocketDebuggerUrl`，表示 Chrome 已启动成功。Windows 防火墙还需要允许 Docker Desktop 的虚拟网络访问宿主机 `19122` 端口。

## 3.8.3 启动 Flocks 容器

启动容器时映射 Flocks 的 WebUI 和后端 API 端口：

macOS：

```bash
docker run -d \
  --name flocks \
  -e TZ=Asia/Shanghai \
  -e BU_CDP_URL="http://192.168.65.254:19122" \
  -p 8000:8000 \
  -p 5173:5173 \
  --shm-size 4gb \
  -v "${HOME}/.flocks:/home/flocks/.flocks" \
  ghcr.io/agentflocks/flocks:latest
```

Windows PowerShell：

```powershell
docker run -d `
  --name flocks `
  -e TZ=Asia/Shanghai `
  -e BU_CDP_URL="http://host.docker.internal:19122" `
  -p 8000:8000 `
  -p 5173:5173 `
  --shm-size 4gb `
  -v "${env:USERPROFILE}\.flocks:/home/flocks/.flocks" `
  ghcr.io/agentflocks/flocks:latest
```

`BU_CDP_URL` 会随容器启动注入，使 Flocks 可以直接连接宿主机的 Chrome。Chrome 运行在宿主机上，容器主动连接宿主机的 `19122` 端口，因此不需要使用 `-p 19122:19122` 将该端口发布到宿主机。

## 3.8.4 在 Flocks 中配置浏览器

进入 Flocks 容器：

```bash
docker exec -it flocks bash
```

首次配置时，在容器中执行：

不要通过 `FLOCKS_ROOT=/tmp/.flocks` 重定向整个 Flocks 数据目录。这样会同时影响 config、plugins、memory 和 console 登录态，容器重建后这些数据都会丢失。推荐只将 `~/.flocks/browser` 链接到临时目录，其他数据仍保留在持久化挂载的 `~/.flocks` 中。

macOS Docker Desktop：

```bash
mv ~/.flocks/browser /tmp/flocks-browser
ln -s /tmp/flocks-browser ~/.flocks/browser
export BU_CDP_URL="http://192.168.65.254:19122"
flocks browser --setup
```

其中 `192.168.65.254` 是当前 macOS Docker Desktop 环境中容器访问宿主机所使用的地址。如果 Docker Desktop 的网络配置发生变化，需要将其替换为容器实际可访问的宿主机地址。

Windows Docker Desktop：

```bash
mv ~/.flocks/browser /tmp/flocks-browser
ln -s /tmp/flocks-browser ~/.flocks/browser
export BU_CDP_URL="http://host.docker.internal:19122"
flocks browser --setup
```

`host.docker.internal` 是 Docker Desktop 提供的宿主机域名，用于从 Windows 容器访问宿主机服务。

symlink 会保存在持久化的 `~/.flocks` 目录中，只把浏览器运行目录重定向到 `/tmp/flocks-browser`，不会改变其他 Flocks 数据的位置。完成配置后，Flocks 会通过 `BU_CDP_URL` 连接宿主机上的 Chrome。

如果删除并重新创建了容器，symlink 仍保存在持久化目录中，但临时目录会被清空。进入新容器后执行以下命令恢复浏览器运行目录：

```bash
mkdir -p /tmp/flocks-browser
flocks browser --setup
```

请勿将 `19122` 端口暴露到不受信任的网络，避免其他设备通过 CDP 控制浏览器。
