# Flocks 文档站

基于 [VitePress](https://vitepress.dev/) 构建的 Flocks 中文文档站，通过 GitHub Actions 自动部署到 GitHub Pages。

## 在线访问

- 文档站：https://agentflocks.github.io/flocks-docs/

## 仓库结构

```
flocks_docs/
├── src/                       # VitePress 项目根（工程代码）
│   ├── package.json
│   ├── package-lock.json
│   └── .vitepress/
│       └── config.mts         # 站点配置（nav / sidebar / theme）
├── docs/                      # 文档源（正文）
│   ├── index.md               # 首页
│   ├── md/                    # 正文 md 文件
│   └── img/                   # 图片
└── .github/
    └── workflows/
        └── deploy.yml         # Pages 自动部署 workflow
```

VitePress 通过 `srcDir: '../docs'` 把 `docs/` 目录当作文档根。

## 本地开发

前置：Node.js >= 18（推荐 20）。

```bash
cd src
npm install
npm run dev        # 默认 http://localhost:5173/flocks-docs/
```

## 本地构建预览

```bash
cd src
npm run build      # 产物在 src/.vitepress/dist
npm run preview
```

## 自动部署

推送到 `main` 分支后自动触发 GitHub Actions：

1. 在 `src/` 子目录安装依赖并构建
2. 将 `src/.vitepress/dist` 部署到 GitHub Pages

流程定义见 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)。

## 新增 / 更新文档

1. 在 `docs/md/` 下编辑或新增 md 文件
2. 如需加入侧栏，在 `src/.vitepress/config.mts` 的 `sidebar` 配置中补充条目
3. 图片放到 `docs/img/`，正文中用 `../img/xxx.png` 引用
4. `git push` 后数分钟线上自动更新
