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
      { text: '指南', link: '/md/overview', activeMatch: '/md/overview' },
      { text: '快速开始', link: '/md/quick-start', activeMatch: '/md/quick-start' },
      {
        text: '主模块',
        items: [
          { text: '主模块总览', link: '/md/modules' },
          { text: '模型与接入', link: '/md/integrations' },
          { text: '通信配置', link: '/md/communication' },
        ],
      },
      { text: '场景案例', link: '/md/scenarios' },
      {
        text: '运维',
        items: [
          { text: '运维与排障', link: '/md/operations' },
          { text: '安全与规范', link: '/md/security' },
          { text: '附录', link: '/md/appendix' },
        ],
      },
    ],

    sidebar: {
      '/md/': [
        {
          text: '概览',
          collapsed: false,
          items: [
            { text: '项目介绍', link: '/md/overview#项目介绍' },
            { text: '核心能力', link: '/md/overview#核心能力' },
            { text: '架构与组成', link: '/md/overview#架构与组成' },
            { text: '白皮书与公开资料', link: '/md/overview#白皮书与公开资料' },
          ],
        },
        {
          text: 'Quick Start',
          collapsed: false,
          items: [
            { text: '安装与快速开始', link: '/md/quick-start#安装与快速开始' },
            { text: '服务启动与访问', link: '/md/quick-start#服务启动与访问' },
            { text: '首次配置', link: '/md/quick-start#首次配置' },
          ],
        },
        {
          text: '通信配置',
          collapsed: true,
          items: [
            { text: '远程部署', link: '/md/communication#远程部署' },
            { text: '网络与离线安装', link: '/md/communication#网络与离线安装' },
            { text: 'WebUI / API 访问关系', link: '/md/communication#webui-api-访问关系' },
            { text: '通道配置', link: '/md/communication#通道配置' },
            { text: '钉钉通道配置', link: '/md/channels/dingtalk' },
            { text: '飞书通道配置', link: '/md/channels/feishu' },
            { text: '企业微信通道配置', link: '/md/channels/wecom' },
          ],
        },
        {
          text: '主模块',
          collapsed: true,
          items: [
            { text: '主模块总览', link: '/md/modules' },
            { text: 'Agent 智能体', link: '/md/modules/agents' },
            { text: 'Workflow 工作流', link: '/md/modules/workflow' },
            { text: '任务中心', link: '/md/modules/tasks' },
            { text: 'Workspace', link: '/md/modules/workspace' },
            { text: '工具清单 / MCP', link: '/md/modules/tools' },
            { text: 'Skills 技能库', link: '/md/modules/skills' },
            { text: '模型清单', link: '/md/integrations#模型配置' },
          ],
        },
        {
          text: '模型与接入',
          collapsed: true,
          items: [
            { text: '模型配置', link: '/md/integrations#模型配置' },
            { text: '本地与第三方模型接入', link: '/md/integrations#本地与第三方模型接入' },
            { text: '模型报错排查', link: '/md/integrations#模型报错排查' },
            { text: 'Provider 与 API Services 配置', link: '/md/integrations#provider-与-api-services-配置' },
          ],
        },
        {
          text: '场景案例',
          collapsed: true,
          items: [
            { text: '场景总览', link: '/md/scenarios' },
            { text: '告警研判', link: '/md/scenarios/alert-triage' },
            { text: '主机巡检 / 应急取证', link: '/md/scenarios/host-forensics' },
            { text: '内网安全产品接入', link: '/md/scenarios/network-integration' },
            { text: '浏览器自动化与网页登录', link: '/md/scenarios/browser-automation' },
            { text: '威胁情报与 IOC 研判', link: '/md/scenarios/threat-intel' },
            { text: '互联网资产测绘', link: '/md/scenarios/asset-discovery' },
            { text: '跨设备深度调查', link: '/md/scenarios/cross-device-investigation' },
            { text: '网安设备巡检', link: '/md/scenarios/device-inspection' },
            { text: '内网 IP 资产画像', link: '/md/scenarios/ip-profiling' },
            { text: '漏洞资产排查', link: '/md/scenarios/vuln-asset-matching' },
            { text: '漏洞验证复现', link: '/md/scenarios/vuln-verification' },
          ],
        },
        {
          text: '运维与排障',
          collapsed: true,
          items: [
            { text: '日志与结果查看', link: '/md/operations#日志与结果查看' },
            { text: '安装排查', link: '/md/operations#安装排查' },
            { text: '升级方式', link: '/md/operations#升级方式' },
            { text: '升级异常处理', link: '/md/operations#升级异常处理' },
          ],
        },
        {
          text: '安全与规范',
          collapsed: true,
          items: [
            { text: '公网暴露注意事项', link: '/md/security#公网暴露注意事项' },
            { text: '数据与脱敏说明', link: '/md/security#数据与脱敏说明' },
            { text: '反馈渠道', link: '/md/security#反馈渠道' },
          ],
        },
        {
          text: '附录',
          collapsed: true,
          items: [
            { text: 'CLI 参考', link: '/md/appendix#cli-参考' },
            { text: '配置项索引', link: '/md/appendix#配置项索引' },
            { text: 'API 参考', link: '/md/appendix#api-参考' },
            { text: '术语表', link: '/md/appendix#术语表' },
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
