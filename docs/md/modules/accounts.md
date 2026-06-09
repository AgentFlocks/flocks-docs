# 账号管理

账号管理用于管理 Flocks WebUI 的本地登录账号。开源 OSS 版只有一个本地 `admin` 账号；Flocks Pro 版支持多账号、角色管理、配额控制和账号操作审计。

## 1. 版本差异

| 版本 | 账号能力 |
| --- | --- |
| **Flocks OSS** | 本地单账号体系。首次启动后通过 bootstrap-admin 创建唯一 `admin` 账号，后续可登录、退出和修改密码。 |
| **Flocks Pro** | 多账号体系。管理员可以创建 admin/member 用户、修改角色、重置密码、删除用户，并受 License 授权额度限制。每个用户拥有独立的对话历史和私有 Workspace 目录。 |

## 2. OSS 版账号管理

### 2.1 初始化管理员

首次启用本地账号体系后，WebUI 会进入初始化流程，要求创建 `admin` 账号。初始化完成后，所有 HTTP 路径默认要求鉴权，静态资源、登录页、初始化页和通道 webhook 等少数路径除外。

### 2.2 登录与改密

OSS 版账号能力包括：

- 登录。
- 退出登录。
- 修改当前账号密码。
- 使用一次性密码或临时密码后强制重置密码。

OSS 版没有多成员管理，也没有角色分配页面。

### 2.3 重置管理员密码

如果忘记 OSS 版本地管理员密码，可以在 Flocks 所在机器上使用 CLI 生成一次性管理员密码：

```bash
flocks admin generate-one-time-password --username admin
```

也可以使用短参数：

```bash
flocks admin generate-one-time-password -u admin
```

命令会输出一个临时密码。该密码默认用于管理员账号，具有时效性，并要求首次登录后立即修改密码。它适合本机运维恢复，不建议通过聊天、工单或截图长期传播。

如果不确定管理员用户名，可以先查看本地账号列表：

```bash
flocks admin list-users
```

## 3. Pro 版账号管理

### 3.1 多账号与角色

Flocks Pro 支持两类角色：

| 角色 | 说明 |
| --- | --- |
| `admin` | 管理员，可以管理用户、授权、审计等系统级能力。 |
| `member` | 普通成员，用于日常使用平台能力。 |

管理员可以查看用户列表，字段包括用户 ID、用户名、角色、状态、是否必须重置密码、创建时间、更新时间和最近登录时间。

普通用户进入账号管理页时，只能看到自己的账号信息，不能查看、创建、修改或删除其他账号。普通用户也看不到审计日志导航。

### 3.2 数据隔离与共享范围

Flocks Pro 的多账号能力主要隔离用户自己的工作上下文：

| 类型 | 说明 |
| --- | --- |
| 对话历史 | 每个用户拥有自己的会话列表和对话历史。 |
| Workspace 私有目录 | 每个用户拥有自己的私有 Workspace 目录，用于存放个人任务产物、报告和文件。 |
| 共享能力 | Agent、Skills、Tools、设备、任务、Workflow、模型、通道等平台能力默认是共享的。 |

也就是说，多账号不是把整个系统复制成多个独立租户，而是在同一套平台能力上，为不同用户隔离个人会话和个人文件空间。团队共用的 Agent、Skill、工具、设备和任务仍然可以统一维护。

### 3.3 创建用户

创建用户时需要填写用户名和角色。系统会生成临时密码，并要求新用户首次登录后重置密码。

创建用户会受到 License 配额限制，例如管理员数量上限和成员数量上限。默认配额可由 Pro 授权或环境变量控制。

### 3.4 修改角色

管理员可以把用户角色改为 `admin` 或 `member`。系统会保护至少保留一个管理员账号，避免把最后一个管理员降级或删除。

### 3.5 重置密码

管理员可以为用户重置密码。重置时可以生成临时密码，并设置 `must_reset_password`，要求用户下次登录后修改密码。

如果管理员账号忘记密码，可以在服务器命令行使用一次性密码命令恢复：

```bash
flocks admin generate-one-time-password --username admin
```

### 3.6 删除用户

管理员可以删除其他用户，但不能删除当前登录的管理员账号，也不能删除最后一个管理员。

Pro 版的创建用户、修改角色、删除用户、重置用户密码主要通过 WebUI 账号管理页面完成，并受 Pro License 配额和管理员权限控制。

## 4. CLI 管理命令

Flocks 提供 `flocks admin` 命令用于本机账号、安全和历史数据维护。常用命令如下：

| 命令 | 作用 | 常见场景 |
| --- | --- | --- |
| `flocks admin list-users` | 列出本地账号的用户名、角色、状态和最近登录时间。 | 忘记用户名、排查账号状态。 |
| `flocks admin generate-one-time-password --username admin` | 为指定管理员生成一次性临时密码，首次登录后必须改密。 | 忘记管理员密码、管理员账号恢复。 |
| `flocks admin generate-api-token` | 生成并保存本机 API Token。 | CLI、TUI 或非浏览器客户端需要访问本机 Flocks Server。 |
| `flocks admin set-api-token --token <token>` | 写入指定 API Token 到本机密钥存储。 | 多端部署、迁移或统一服务端 Token。 |
| `flocks admin reassign-orphan-sessions --username admin` | 把没有 `owner_user_id` 的历史会话归属到指定管理员。 | 从单用户升级到多账号后整理历史会话可见性。 |
| `flocks admin reassign-orphan-sessions --username admin --dry-run` | 只预览孤儿会话数量，不写入变更。 | 正式归属整理前检查影响范围。 |
| `flocks admin migrate-workspace-to-user --admin-user-id <user_id>` | 将历史单用户 Workspace 迁移到 `users/shared` 双区布局。 | 升级到多账号或 Pro Workspace 隔离前迁移历史目录。 |
| `flocks admin migrate-workspace-to-user --admin-user-id <user_id> --dry-run` | 只预览 Workspace 迁移结果。 | 迁移前检查将移动的 outputs、knowledge 等目录。 |

### 4.1 管理员密码恢复

最常用的账号恢复命令是：

```bash
flocks admin generate-one-time-password --username admin
```

执行后复制终端输出的临时密码，在 WebUI 登录 `admin`，按提示设置新密码。临时密码只适合应急恢复；恢复完成后，建议检查是否仍有异常登录、过期共享链接或暴露的终端记录。

### 4.2 本地账号盘点

查看本地账号：

```bash
flocks admin list-users
```

输出中会包含 `Username`、`Role`、`Status` 和 `Last login`。OSS 版通常只有 `admin`；Pro 版启用多账号后会显示更多用户。

### 4.3 API Token 管理

本地 TUI、CLI 或其他非浏览器客户端需要调用 Flocks Server 时，可以生成 API Token：

```bash
flocks admin generate-api-token
```

如果需要写入一个已有 Token：

```bash
flocks admin set-api-token --token <token>
```

Token 会写入本机 secret store，供本机服务或客户端读取。请把它当作登录凭证管理，不要提交到代码仓库。

### 4.4 历史会话归属整理

早期 CLI、后台任务或 IM 通道创建的会话可能没有 `owner_user_id`。升级到多账号后，这些会话可能需要归属给管理员：

```bash
flocks admin reassign-orphan-sessions --username admin --dry-run
```

确认数量后正式执行：

```bash
flocks admin reassign-orphan-sessions --username admin
```

该命令要求目标用户是管理员。建议先使用 `--dry-run`，确认影响范围后再写入。

### 4.5 历史 Workspace 迁移

从早期单用户 Workspace 升级到多账号布局时，可以先预览迁移：

```bash
flocks admin migrate-workspace-to-user --admin-user-id <user_id> --dry-run
```

确认后执行：

```bash
flocks admin migrate-workspace-to-user --admin-user-id <user_id>
```

该命令会把历史单用户目录迁移到多账号使用的 `users/shared` 双区布局，便于后续按账号做 Workspace 隔离。

## 5. 审计联动

Flocks Pro 中的账号操作会写入审计日志，例如：

- 创建用户。
- 修改角色。
- 删除用户。
- 重置密码。

这些事件会在 [审计日志](/md/modules/audit-logs) 中按账号、事件类型、时间范围等条件查询。

审计日志属于管理员能力。普通用户不会看到审计日志导航，也不能通过账号管理页查看其他用户的账号操作记录。

## 6. 常见问题

### 6.1 OSS 版能创建多个账号吗？

不能。OSS 版只有一个本地 `admin` 账号。多账号能力属于 Flocks Pro。

### 6.2 为什么创建用户失败？

常见原因包括：

- 当前不是管理员。
- Pro 功能未启用或 License 无效。
- 管理员或成员数量达到授权上限。
- 用户名不合法或已存在。

### 6.3 为什么某些历史会话看不到？

如果历史 session 没有 auth 上下文，可能没有 `owner_user_id`。OSS 版 bootstrap admin 通常仍可看到；Pro 版新增 member 账号可能看不到这些孤儿会话，需要管理员做归属整理。

可以先预览影响范围：

```bash
flocks admin reassign-orphan-sessions --username admin --dry-run
```

确认后再执行归属整理：

```bash
flocks admin reassign-orphan-sessions --username admin
```

### 6.4 管理员能删除自己吗？

不能。管理员账号不能自删除，系统也会保护最后一个管理员账号，避免所有管理员都被删除或降级后无法继续管理系统。

### 6.5 管理员忘记密码怎么办？

在 Flocks 所在机器上执行：

```bash
flocks admin generate-one-time-password --username admin
```

然后使用终端输出的一次性密码登录 WebUI，并按提示设置新密码。

## 7. 相关模块

- [Flocks Pro](/md/modules/flocks-pro)：启用 Pro 授权和升级管理。
- [审计日志](/md/modules/audit-logs)：查看账号操作记录。
- [对话管理](/md/modules/sessions)：账号会影响可见会话范围。
