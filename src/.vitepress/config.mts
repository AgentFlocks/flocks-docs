import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/flocks-docs/',
  srcDir: '../docs',
  outDir: './.vitepress/dist',
  cacheDir: './.vitepress/cache',

  lang: 'zh-CN',
  title: 'Flocks 文档',
  titleTemplate: ':title | Flocks 文档',
  description: 'Flocks 中文文档 —— AI Native 安全运营平台',
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,
  srcExclude: ['flocks_docs.md'],


  head: [
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { name: 'keywords', content: 'Flocks, AI Native, 安全运营, Agent, 工作流, MCP' }],
  ],

  themeConfig: {
    siteTitle: 'Flocks 文档',

    nav: [
      { text: '认识 Flocks', link: '/md/overview', activeMatch: '/md/overview' },
      { text: '快速开始', link: '/md/quick-start-install', activeMatch: '/md/quick-start' },
      { text: '部署与配置', link: '/md/communication', activeMatch: '/md/communication' },
      { text: '功能模块', link: '/md/modules', activeMatch: '/md/modules' },
      { text: '场景实践', link: '/md/scenarios', activeMatch: '/md/scenarios' },
      { text: '运维与排障', link: '/md/operations', activeMatch: '/md/operations' },
      { text: '安全与治理', link: '/md/security', activeMatch: '/md/security' },
    ],

    sidebar: {
      '/md/': [
        { text: '1. 认识 Flocks', link: '/md/overview' },
        {
          text: '2. 快速开始',
          collapsed: true,
          items: [
            { text: '2.1 安装与快速开始', link: '/md/quick-start-install' },
            { text: '2.2 服务启动与访问', link: '/md/quick-start-service' },
            { text: '2.3 首次配置', link: '/md/quick-start-first-config' },
          ],
        },
        {
          text: '3. 部署与配置',
          collapsed: true,
          items: [
            { text: '3.1 远程部署', link: '/md/communication-remote-deploy' },
            { text: '3.2 离线安装', link: '/md/communication-network-install' },
            {
              text: '3.3 通道配置',
              link: '/md/communication-channels',
              collapsed: true,
              items: [
                { text: '3.3.1 钉钉配置', link: '/md/channels/dingtalk' },
                { text: '3.3.2 飞书配置', link: '/md/channels/feishu' },
                { text: '3.3.3 企业微信配置', link: '/md/channels/wecom' },
                { text: '3.3.4 微信配置', link: '/md/channels/weixin' },
              ],
            },
            {
              text: '3.4 模型配置',
              link: '/md/communication-models',
            },
            { text: '3.5 文件与配置', link: '/md/communication-files-config' },
            { text: '3.6 网络访问清单', link: '/md/communication-network-access' },
            { text: '3.7 Flocks 安全管控', link: '/md/communication-security-controls' },
          ],
        },
        {
          text: '4. 功能模块',
          collapsed: true,
          items: [
            { text: '4.1 功能模块总览', link: '/md/modules' },
            { text: '4.2 对话管理', link: '/md/modules/sessions' },
            { text: '4.3 任务中心', link: '/md/modules/tasks' },
            { text: '4.4 Workspace', link: '/md/modules/workspace' },
            { text: '4.5 Agent 智能体', link: '/md/modules/agents' },
            { text: '4.6 Skills 技能库', link: '/md/modules/skills' },
            { text: '4.7 Workflow 工作流', link: '/md/modules/workflow' },
            {
              text: '4.8 设备管理',
              link: '/md/modules/devices',
              collapsed: true,
              items: [
                { text: '4.8.1 自定义设备接入', link: '/md/modules/devices/custom-device-integration' },
                { text: '4.8.2 TDP 接入', link: '/md/modules/devices/tdp-integration' },
                { text: '4.8.3 OneSEC 接入', link: '/md/modules/devices/onesec-integration' },
                { text: '4.8.4 NGTIP 接入', link: '/md/modules/devices/ngtip-integration' },
                { text: '4.8.5 天眼接入', link: '/md/modules/devices/skyeye-integration' },
                { text: '4.8.6 深信服 SIP 接入', link: '/md/modules/devices/sangfor-sip-integration' },
              ],
            },
            { text: '4.9 工具清单', link: '/md/modules/tools' },
            { text: '4.10 插件广场', link: '/md/modules/flocks-hub' },
            { text: '4.11 模型清单', link: '/md/llm_models' },
            { text: '4.12 通道管理', link: '/md/modules/channels' },
            { text: '4.13 账号管理', link: '/md/modules/accounts' },
            { text: '4.14 审计日志', link: '/md/modules/audit-logs' },
            { text: '4.15 Flocks Pro', link: '/md/modules/flocks-pro' },
            { text: '4.16 Flocks CLI', link: '/md/modules/cli' },
            { text: '4.17 Flocks / 斜杠命令', link: '/md/modules/slash-commands' },
          ],
        },
        {
          text: '5. 场景实践',
          collapsed: true,
          items: [
            { text: '5.1 场景总览', link: '/md/scenarios' },
            { text: '5.2 告警研判', link: '/md/scenarios/alert-triage' },
            { text: '5.3 告警降噪', link: '/md/scenarios/alert-noise-reduction' },
            { text: '5.4 主机巡检 / 应急取证', link: '/md/scenarios/host-forensics' },
            { text: '5.5 内网安全产品接入', link: '/md/scenarios/network-integration' },
            { text: '5.6 浏览器自动化与网页登录', link: '/md/scenarios/browser-automation' },
            { text: '5.7 威胁情报与 IOC 研判', link: '/md/scenarios/threat-intel' },
            { text: '5.8 互联网资产测绘', link: '/md/scenarios/asset-discovery' },
            { text: '5.9 跨设备深度调查', link: '/md/scenarios/cross-device-investigation' },
            { text: '5.10 网安设备巡检', link: '/md/scenarios/device-inspection' },
            { text: '5.11 内网 IP 资产画像', link: '/md/scenarios/ip-profiling' },
            { text: '5.12 漏洞资产排查', link: '/md/scenarios/vuln-asset-matching' },
            { text: '5.13 漏洞验证复现', link: '/md/scenarios/vuln-verification' },
          ],
        },
        {
          text: '6. 运维与排障',
          collapsed: true,
          items: [
            { text: '6.1 日志与结果查看', link: '/md/operations#日志与结果查看' },
            { text: '6.2 安装排查', link: '/md/operations#安装排查' },
            { text: '6.3 升级方式', link: '/md/operations#升级方式' },
            { text: '6.4 升级异常处理', link: '/md/operations#升级异常处理' },
          ],
        },
        {
          text: '7. 安全与治理',
          collapsed: true,
          items: [
            { text: '7.1 公网暴露注意事项', link: '/md/security#公网暴露注意事项' },
            { text: '7.2 数据与脱敏说明', link: '/md/security#数据与脱敏说明' },
            { text: '7.3 反馈渠道', link: '/md/security#反馈渠道' },
          ],
        },
        {
          text: '8. 附录',
          collapsed: true,
          items: [
            { text: '8.1 完整使用手册（单页）', link: '/md/user-manual' },
            { text: '8.2 相关视频', link: '/md/appendix#相关视频' },
            { text: '8.3 Flocks 白皮书', link: '/md/appendix#flocks-白皮书' },
            { text: '8.4 Flocks 快速安装指南', link: '/md/appendix#flocks-快速安装指南' },
            { text: '8.5 CLI 参考', link: '/md/appendix#cli-参考' },
            { text: '8.6 配置项索引', link: '/md/appendix#配置项索引' },
            { text: '8.7 API 参考', link: '/md/appendix#api-参考' },
            { text: '8.8 术语表', link: '/md/appendix#术语表' },
          ],
        },
      ],
    },

    outline: {
      level: [2, 3],
      label: '本页目录',
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无匹配结果',
                resetButtonTitle: '清除搜索条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
        },
      },
    },

    socialLinks: [
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
        },
        link: 'https://github.com/AgentFlocks/flocks',
        ariaLabel: 'Flocks GitHub 开源项目',
      },
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Gitee</title><path fill="currentColor" d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296Z"/></svg>',
        },
        link: 'https://gitee.com/flocks/flocks',
        ariaLabel: 'Flocks Gitee 镜像',
      },
    ],

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    externalLinkIcon: true,

    lastUpdatedText: '最后更新于',

    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © Flocks',
    },
  },

  markdown: {
    lineNumbers: false,
    image: {
      lazyLoading: true,
    },
  },
})
