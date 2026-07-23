<!--
 * @Author: John Yin 10972267+john-yin2333@user.noreply.gitee.com
 * @Date: 2026-06-08 18:02:25
 * @LastEditors: John Yin 10972267+john-yin2333@user.noreply.gitee.com
 * @LastEditTime: 2026-06-11 16:04:16
 * @FilePath: /flocks_docs/docs/md/communication-remote-deploy.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# 3.1 远程部署

Flocks 默认按本机部署，执行 `flocks start` 后默认监听：

- Flocks 统一服务：`127.0.0.1:5173`
- WebUI：`http://127.0.0.1:5173`
- API：同一地址下的 `/api` 路径

WebUI 与 API 共用同一个服务地址和端口。浏览器请求使用同源 `/api` 路径，因此不需要再单独开放后端端口。

## 3.1.1 推荐方式（先保证可用）

绑定指定内网 IP：

```bash
flocks start --host <部署机内网IP>
```

如果需要监听所有网络接口：

```bash
flocks start --host 0.0.0.0
```

使用 `0.0.0.0` 时，务必配合防火墙、安全组、反向代理和 TLS 限制访问范围。外部服务调用 API 时，也应通过同一入口的 `/api` 路径访问，并携带 API Token；不要为普通部署额外开放旧的 `8000` 端口。

## 3.1.2 快速检查

1. 先确认服务启动成功：`flocks status`
2. 外部浏览器打开 `http://<部署机IP>:5173`
3. 登录后确认会话、任务、模型测试都能正常返回（不是只看页面是否显示）

```bash
curl http://127.0.0.1:5173/api/health
```

## 3.1.3 Docker 远程访问

如果你用 Docker 部署，只需映射统一服务端口：

```bash
docker run -d \
  --name flocks \
  -e TZ=Asia/Shanghai \
  -p 5173:5173 \
  --shm-size 4gb \
  -v "${HOME}/.flocks:/home/flocks/.flocks" \
  ghcr.io/agentflocks/flocks:latest
```

镜像中的 Flocks 服务监听 `5173`，WebUI 与 API 共用该端口。多数“容器启动了但看不到页面”的问题，往往是 `5173` 没有映射、映射错了，或者宿主机防火墙/安全组没有放行。

## 3.1.4 常见问题和解决方法

服务监听地址、访问地址或端口开放策略没有按远程场景配置。可以按下面几类现象排查：

| 问题现象 | 常见原因 | 解决方法 |
| --- | --- | --- |
| 外部机器打不开 WebUI | 服务仍监听 `127.0.0.1`，只允许服务器本机访问 | 使用 `flocks start --host <部署机内网IP>` 或 `flocks start --host 0.0.0.0` 启动，并确认云安全组、防火墙已开放 `5173` |
| 页面能打开，但新建会话、调用模型失败 | 同源 `/api` 请求失败，或账号、模型配置不完整 | 检查浏览器中的 `/api` 请求和 `flocks logs`，再确认账号初始化、API Token 与模型配置 |
| 外部脚本调用 API 返回 `401` | 非浏览器客户端没有携带 API Token | 使用 `Authorization: Bearer <token>` 或 `X-Flocks-API-Token: <token>` 请求头 |
| Docker 容器启动成功，但外部仍访问失败 | `5173` 未正确映射，或宿主机安全组未放行 | 检查 `-p 5173:5173`，同时确认宿主机防火墙和云安全组规则 |

安全建议：只暴露统一服务入口，并通过反向代理、TLS、鉴权、防火墙或安全组限制访问范围。浏览器和 API 客户端都通过该入口访问，不要额外暴露旧的后端端口。

完成修改后，不要只确认页面能打开，还要继续验证新建会话、模型测试和任务执行是否能正常返回。
