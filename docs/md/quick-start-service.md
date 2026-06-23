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

- WebUI：`http://127.0.0.1:5173`
- 后端 API：`http://127.0.0.1:8000`

如果需要远程访问，可显式指定监听地址：

```bash
flocks start --server-host <ip> --webui-host <ip>
```

如果你只是本机使用，直接打开 `http://127.0.0.1:5173` 即可。如果你部署在云主机、虚拟机或局域网机器上，还需要显式修改监听地址和端口暴露策略。

## 启动检查顺序

建议按下面的顺序做启动检查：

1. 执行 `flocks status`，确认服务已正常启动
2. 执行 `flocks logs`，确认没有持续报错
3. 浏览器打开 `http://127.0.0.1:5173`
4. 确认页面已加载，而不是空白页或持续报错页
5. 继续完成首次账号初始化和默认模型配置

## 远程机器部署

如果你在远程机器上部署：

- 默认监听地址通常仍是 `127.0.0.1`
- WebUI 和 API 的对外访问路径要单独确认
- 更推荐优先只对外开放 WebUI，而不是直接裸露 API

服务启动正常后，继续阅读 [首次配置](/md/quick-start-first-config)。
