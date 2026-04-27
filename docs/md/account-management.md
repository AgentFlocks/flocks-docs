# 账号管理

本页整理 Flocks 的账号初始化、浏览器鉴权、API Token 和常见应急管理方式。对于远程部署、自动化脚本、TUI / SDK 调用或反向代理场景，建议先理解这里的鉴权规则，再开放服务访问。

## 鉴权与访问规则

启用本地账号体系后，Flocks 的 HTTP 路径默认都需要鉴权。只有少量用于初始化、静态资源加载和通道回调的路径会放行：

- WebUI 引导页：`/`、`/auth/*`
- 静态资源路径
- IM 平台 webhook 回调：`/api/channel/{channel_id}/webhook`

浏览器用户主要依赖登录后的 `flocks_session` Cookie；非浏览器客户端则应使用 API Token。

## 初次部署：创建管理员

初次部署时，需要先在 WebUI 中完成管理员账号初始化：

1. 打开 WebUI，按页面提示完成 `bootstrap-admin`。
2. 创建唯一的 `admin` 账号。
3. WebUI 会自动写入 `flocks_session` Cookie，浏览器侧无需额外配置 Token。

完成初始化后，后续浏览器访问会通过登录态判断身份。如果登录过期或 Cookie 丢失，需要重新登录。

## 非浏览器客户端与 API Token

TUI、SDK、脚本或远程自动化调用无法依赖浏览器 Cookie，通常需要使用 API Token。

### 本机回环访问

来自本机回环地址的请求会被自动识别为 `local-service` 管理员，适合同机的 TUI、插件子进程和 CLI 调用。适用条件包括：

- 请求来源为 `127.0.0.1`、`::1` 或 `localhost`
- 请求中不携带 `x-forwarded-for` 头

这条规则只适合同机调用。远程访问或经过反向代理的请求不应依赖本机回环放行。

### 远程客户端访问

远程调用必须携带 API Token。Token 存放在 `~/.flocks/config/.secret.json`，secret id 为 `server_api_token`。

在服务端生成或轮换 Token：

```bash
flocks admin generate-api-token
```

该命令会打印 Token，并写入服务端本机的 secret store。

在每台远程客户端上写入同一个 Token，让 SDK / TUI 自动携带：

```bash
flocks admin set-api-token --token <服务端打印的 token>
```

也可以在请求中显式携带任一 Header：

```text
Authorization: Bearer <token>
X-Flocks-API-Token: <token>
```

快速验证：

```bash
curl -H "Authorization: Bearer <token>" https://flocks.example.com/api/health
```

## 反向代理部署注意事项

如果 Flocks 部署在反向代理之后，代理层需要主动透传真实访问来源：

```text
X-Forwarded-For: <client-ip>
X-Forwarded-Proto: https
```

其中：

- `X-Forwarded-For` 用于区分“真本机请求”和“经由反向代理转发的外部请求”。如果缺失，直连本机回环的请求可能被识别为 `admin`。
- `X-Forwarded-Proto: https` 用于让服务端在 HTTPS 反代场景下正确给 Cookie 加 `Secure` 标志。

如果你将 WebUI 暴露到公网，建议优先通过反向代理、HTTPS、防火墙和安全组限制访问范围，不要直接裸露后端 API。

## 忘记密码与应急恢复

如果管理员忘记密码，可以在服务器上执行：

```bash
flocks admin generate-one-time-password
```

该命令会将账号强制置为 `must_reset_password=true`。下次 WebUI 登录会跳转到改密页。

需要注意：处于强制改密状态时，所有非浏览器接口都会返回 `403`。如果有脚本、TUI、SDK 或自动化任务依赖该账号，请先通知相关调用方，再执行应急恢复操作。

## 无主 Session 处理

CLI 子命令、后台任务、IM 通道入站 dispatcher 等没有 auth 上下文的入口，可能创建 `owner_user_id` 为空的 session。bootstrap admin 仍可看到这些 session，但之后新增的 member 账号将看不到。

可以通过下面的命令把无主 session 批量赋给指定管理员：

```bash
flocks admin reassign-orphan-sessions --username admin --dry-run
flocks admin reassign-orphan-sessions --username admin
```

建议先使用 `--dry-run` 预览，再执行实际写入。命令会输出 `scanned`、`orphaned`、`reassigned`、`failed` 四个计数；只要 `failed` 非零就会以 exit code `2` 退出，便于 CI 或脚本捕获“部分写入”的情况。修复底层故障后，可以再次运行该命令。
