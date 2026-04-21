---
layout: home

hero:
  name: Flocks 文档
  text: AI Native 安全运营平台
  tagline: 把零散的安全工作串成可复用、可持续运营的执行闭环
  actions:
    - theme: brand
      text: 快速开始
      link: /md/quick-start
    - theme: alt
      text: 项目介绍
      link: /md/overview
    - theme: alt
      text: 场景案例
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
  - icon: 🧰
    title: 工具、MCP 与外部系统接入
    details: 统一工具体系，内置工具、API 工具、Python 工具、MCP 一体化；把 ThreatBook、VT、FOFA、内部平台统一纳入上下文。
    link: /md/modules/tools
    linkText: 工具与 MCP
  - icon: 🔁
    title: 工作流与任务中心
    details: 工作流把零散动作组织为可创建、可校验、可测试的稳定剧本；任务中心支持周期执行、批量处理与持续运营。
    link: /md/modules/workflow
    linkText: 工作流能力
  - icon: 📚
    title: 技能与经验沉淀
    details: Skills 承载规范、策略、方法论和任务模板，个人经验可以逐步转化为团队能力。
    link: /md/modules/skills
    linkText: Skills 技能库
  - icon: 🔌
    title: 多模型多入口
    details: 同时支持本地 / 第三方模型接入，模型是平台级资源；WebUI / CLI / TUI / 消息通道共享同一套后端。
    link: /md/integrations
    linkText: 模型与接入
  - icon: 🛡️
    title: 安全运营场景落地
    details: 告警研判、主机巡检、内网安全产品接入、浏览器自动化等典型场景，均有可复用的最佳实践。
    link: /md/scenarios
    linkText: 查看场景案例
---

<div style="max-width: 960px; margin: 48px auto 0; padding: 0 24px;">

## 适合谁看这份文档

- 需要对告警进行多源关联和初步研判的 **安全运营团队**
- 希望把调查步骤沉淀为工作流 / 技能 / 专家 Agent 的 **平台化运营团队**
- 需要接入多个安全设备、API、网页控制台或内网系统的 **集成与落地团队**
- 想把"分析一次问题"升级为"持续运行的能力"的 **架构与治理团队**

## 文档怎么读

1. 先读 [项目介绍](/md/overview) 了解 Flocks 的定位与核心能力
2. 按 [快速开始](/md/quick-start) 在本机或 Docker 启动一个最小可用环境
3. 根据实际需求选择 [通信配置](/md/communication)、[模型与接入](/md/integrations) 进行接入
4. 结合 [主模块](/md/modules) 与 [场景案例](/md/scenarios) 把能力真正用起来
5. 遇到问题时翻阅 [运维与排障](/md/operations)、[安全与规范](/md/security) 和 [附录](/md/appendix)

</div>
