# 3.2 离线安装

离线环境里，当前默认支持的方式只有：**Docker 镜像部署**。目前不支持通过源码包或 Windows 安装包执行完整离线安装。

## 3.2.1 离线安装流程（Docker）

离线安装建议按以下步骤执行：

1. 在有网机器上先准备镜像并导出：

```bash
docker pull ghcr.io/agentflocks/flocks:latest
docker save ghcr.io/agentflocks/flocks:latest -o flocks-offline.tar
```

2. 将 `flocks-offline.tar` 拷贝到离线主机。

3. 在离线主机加载镜像：

```bash
docker load -i flocks-offline.tar
```

4. 启动服务（默认映射 WebUI 与 API）：

```bash
docker run -d \
  --name flocks \
  -e TZ=Asia/Shanghai \
  -p 8000:8000 \
  -p 5173:5173 \
  --shm-size 4gb \
  -v "${HOME}/.flocks:/home/flocks/.flocks" \
  ghcr.io/agentflocks/flocks:latest
```

启动后本机访问 `http://127.0.0.1:5173`，或按实际网络策略将端口映射给业务网络。

## 3.2.2 相关文档

离线安装完成后，常用问题建议优先查：

- [运维与排障](/md/operations)：服务状态、日志、任务与异常恢复
- [场景补充：浏览器自动化适配性](/md/scenarios/browser-automation)：镜像/自动化接入细节

如果你还未离线安装而是首次网络部署，可先参考 [安装与快速开始（完整安装与首次配置）](/md/quick-start)。 
