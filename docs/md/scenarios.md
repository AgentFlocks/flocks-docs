# 场景实践

本页按安全运营中的常见工作流整理 Flocks 的典型落地场景。每个场景都围绕输入、处理链路、产出和持续运营方式展开，便于在实际项目中选择合适的能力组合。

- 演示视频：[查看](https://mp.weixin.qq.com/s/Y3TZH-4JxS1hiVtJk9RLzw?version=5.0.7.99844&platform=mac)
- 发布会直播回放：[查看](https://weixin.qq.com/sph/AfahBdDcYd)

## 按问题找场景

| 我想解决什么问题 | 推荐场景 |
| --- | --- |
| 告警很多，不知道先处理哪条 | 告警研判、告警降噪 |
| 想把告警处理变成持续运营 | 告警研判、任务中心 |
| 我要接入内网安全设备并做巡检 | 设备接入与巡检、设备管理 |
| 需要查 IOC / 域名 / IP 画像 | 威胁情报与 IOC 研判、内网 IP 资产画像 |
| 发现主机可疑行为，需要取证 | 主机巡检 / 应急取证 |
| 我想测绘/核查资产和暴露面 | 互联网资产测绘 |
| 想把一次操作长期跑 | 工作流、任务中心 |

## 核心场景

### [告警降噪](/md/scenarios/alert-noise-reduction)

对 TDP / NDR / XDR 等设备产生的大量告警进行过滤、聚合和初步分级。该场景通常需要部署在云主机或内网虚拟机上，确保设备 Syslog 或 API 数据链路能够稳定到达 Flocks。

子场景：[实时 NDR 降噪工作流](/md/scenarios/stream-ndr-alert-denoise)

> 典型输出：重复告警合并 · 高优先级告警摘要 · 通道通知

---

### [告警研判](/md/scenarios/alert-triage)

从 TDP / NDR / XDR 等设备抓取告警，委派专职分析 Agent 逐条研判，输出结构化 JSON 并通过通道通知，随后可固化为周期性任务。这是 Flocks 最容易落地并形成持续价值的场景之一。

子场景：[批量NDR研判工作流](/md/scenarios/batch-scheduled-ndr-triage)

> 典型输出：结构化研判结果 · JSON 报告 · 企微 / 钉钉通知

---

### [主机巡检 / 应急取证](/md/scenarios/host-forensics)

主机巡检 Agent 先执行基线检查，再根据异常进入深度调查。命令白名单、黑名单和人工逐条确认机制用于控制高危操作风险，最终产出包含时间线和证据链的调查报告。

> 典型输出：基线报告 · 入侵时间线 · IoC / 矿池地址 / 持久化手段

---

### [设备接入与巡检](/md/scenarios/device-inspection)

先通过 [设备管理](/md/modules/devices) 接入 TDP / NDR / HIDS / EDR / 防火墙等安全设备，再由设备巡检 subagent 周期性读取健康状态、规则库、日志和性能指标，汇总成巡检报告并在异常时通知。

> 典型输出：接入设备清单 · 巡检健康度表 · 异常摘要 · 通道通知

---

### [威胁情报与 IOC 研判](/md/scenarios/threat-intel)

提供 IP、域名或哈希后，Rex 可并行查询 ThreatBook、VT、GreyNoise 等情报源，结合企业上下文进行交叉比对，输出带证据的研判结论。该流程可扩展为批量研判和持续跟踪任务。

> 典型输出：IOC 研判结论 · 批量 IOC 表格 · 重点 IOC 持续跟踪

---

### [互联网资产测绘](/md/scenarios/asset-discovery)

提供域名或企业名后，平台可进行多源测绘、归类聚合、CMDB 关联和风险打标。结合资产 diff 定时任务，可在新增或变化资产出现时自动通知，是攻击面管理（ASM）的基础能力。

> 典型输出：资产清单 · 分类视图 · 风险 Top N · 资产变化 diff

---

## 共同的产品逻辑

这些场景虽然面向不同问题域，但在 Flocks 中遵循同一套范式：

1. **Rex 理解任务** → 拆步骤、选能力
2. **调度专家 Agent / 工具 / Workflow** → 执行动作
3. **落盘中间数据 + 结构化产出** → 形成可复核、可复用的结果
4. **通道通知 + 定时任务** → 从一次性处理升级为常态化运营
5. **把经验沉淀为 Skill** → 让相似任务具备可复用方法

场景实践本质上是同一套能力骨架在不同问题域中的应用，这也是 Flocks 被定位为 AI-Native SecOps 平台，而不是单一 AI 功能的原因。

---

相关：[项目概览](/md/overview) · [快速开始](/md/quick-start-install) · [功能模块](/md/modules) · [部署与配置](/md/communication) · [任务中心](/md/modules#任务中心)
