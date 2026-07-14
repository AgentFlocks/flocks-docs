---
layout: home

hero:
  name: Flocks
  text: AI Native 安全运营平台
  tagline: 把零散的安全工作串成可复用、可持续运营的执行闭环
  actions:
    - theme: brand
      text: 快速开始
      link: /md/quick-start-install
    - theme: alt
      text: 项目介绍
      link: /md/overview
    - theme: alt
      text: 场景实践
      link: /md/scenarios
    - theme: alt
      text: GitHub 开源项目
      link: https://github.com/AgentFlocks/flocks

features:
  - icon: 🤖
    title: 多智能体协作
    details: Rex 主 Agent 作为统一入口，拆解目标、协调执行；专家 Agent 深耕情报、主机、漏洞、网页取数等领域。
    link: /md/modules/agents
    linkText: 了解 Agent
  - icon: 🔁
    title: 自动编排工作流
    details: 工作流把零散动作组织为可创建、可校验、可测试的稳定剧本；任务中心支持周期执行、批量处理与持续运营。
    link: /md/modules/workflow
    linkText: 工作流能力
  - icon: 🧰
    title: 工具 MCP 接入
    details: 统一工具体系，内置工具、API 工具、Python 工具、MCP 一体化；把 ThreatBook、VT、FOFA、内部平台统一纳入上下文。
    link: /md/modules/tools
    linkText: 工具与 MCP
  - icon: 📚
    title: 技能与经验沉淀
    details: Skills 承载规范、策略、方法论和任务模板，个人经验可以逐步转化为团队能力。
    link: /md/modules/skills
    linkText: Skills 技能库
  - icon: 🔌
    title: 安全设备接入
    details: 支持安全设备、API、网页控制台和内网系统接入，把外部系统能力统一纳入 Flocks 的执行上下文。
    link: /md/modules/devices
    linkText: 设备接入
  - icon: 🛡️
    title: 安全场景实践
    details: 告警研判、主机巡检、设备接入与巡检等典型场景，均有可复用的最佳实践。
    link: /md/scenarios
    linkText: 查看场景实践
---

<div style="max-width: 960px; margin: 48px auto 0; padding: 0 24px;">

## 适合谁看这份文档

- 需要对告警进行多源关联和初步研判的 **安全运营团队**
- 希望把调查步骤沉淀为工作流 / 技能 / 专家 Agent 的 **平台化运营团队**
- 需要接入多个安全设备、API、网页控制台或内网系统的 **集成与落地团队**
- 想把"分析一次问题"升级为"持续运行的能力"的 **架构与治理团队**

## 按目标阅读

### 我是新用户

1. [认识 Flocks](/md/overview) 看清平台定位
2. [快速开始](/md/quick-start-install) 跑通最小环境
3. [首次配置](/md/quick-start-first-config) 完成账号与模型基础配置
4. 挑一个场景先落地： [告警研判](/md/scenarios/alert-triage) 或 [威胁情报](/md/scenarios/threat-intel)

### 我要接入环境或配置

1. 按部署与接入顺序完成 [部署与配置](/md/communication)
2. 补齐模型与供应商： [模型配置](/md/communication-models) 和 [模型报错排查](/md/llm_models#模型报错排查)
3. 配置消息通道：选择 [钉钉](/md/channels/dingtalk)、[飞书](/md/channels/feishu)、[企微](/md/channels/wecom)、[Telegram](/md/channels/telegram)、[微信](/md/channels/weixin) 配置页
4. 对接内部工具： [工具清单](/md/modules/tools)

### 我要做安全运营场景

1. 先理解能力图谱：[功能模块](/md/modules) 里的 Agent / Workflow / 任务中心
2. 跳到对应场景： [告警研判](/md/scenarios/alert-triage)、[主机巡检](/md/scenarios/host-forensics)、[漏洞验证](/md/scenarios/vuln-verification)
3. 把一次操作固化为任务：使用 [任务中心](/md/modules/tasks) 和 [运维与排障](/md/operations)
4. 遇阻时查对应排障项： [安装排查](/md/operations#安装排查)、[升级异常处理](/md/operations#升级异常处理)

</div>
