# 2.2 服务启动与访问

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

## 默认访问地址

默认访问地址为：

- Flocks 服务（WebUI 与 API）：`http://127.0.0.1:5173`
- API 使用同源 `/api` 路径，例如健康检查为 `http://127.0.0.1:5173/api/health`

如果需要远程访问，可显式指定统一服务的监听地址：

```bash
flocks start --host <ip>
```

如果你只是本机使用，直接打开 `http://127.0.0.1:5173` 即可。如果你部署在云主机、虚拟机或局域网机器上，还需要显式修改监听地址，并只开放统一服务端口。

## 启动检查顺序

建议按下面的顺序做启动检查：

1. 执行 `flocks status`，确认服务已正常启动
2. 执行 `flocks logs`，确认没有持续报错
3. 浏览器打开 `http://127.0.0.1:5173`
4. 确认页面已加载，而不是空白页或持续报错页
5. 继续完成首次账号初始化和默认模型配置

## 远程机器部署

如果你在远程机器上部署：

- 默认监听地址仍是 `127.0.0.1`
- 使用 `flocks start --host 0.0.0.0` 可监听所有网络接口；更推荐绑定指定内网 IP
- WebUI 与 API 共用同一个地址和端口，API 请求使用同源 `/api` 路径
- 对公网部署时，应通过反向代理、TLS、防火墙或安全组限制访问范围

服务启动正常后，继续阅读 [首次配置](/md/quick-start-first-config)。
