# Flocks 文档站（VitePress）

基于 [VitePress](https://vitepress.dev/) 搭建的 Flocks 中文文档站。

## 目录结构

```
flocks_docs/
├── src/                       # 本目录：VitePress 项目根（仅放代码）
│   ├── package.json
│   └── .vitepress/
│       ├── config.mts         # 站点配置（nav / sidebar / theme）
│       └── theme/             # 主题（默认主题即可）
├── docs/                      # 文档源（正文保持原位）
│   ├── index.md               # 首页（Hero + Features）
│   ├── md/*.md                # 正文（VitePress 直接读取）
│   └── img/                   # 图片
└── ...
```

VitePress 通过 `srcDir: '../docs'` 把 `docs/` 当作文档根，零迁移复用现有正文。

## 本地开发

前置：Node.js >= 18。

```bash
cd src
npm install
npm run dev        # 默认 http://localhost:5173
```

## 构建与预览

```bash
npm run build      # 产物在 src/.vitepress/dist
npm run preview    # 预览已构建的静态站点
```

## 新增文档

1. 在 `../docs/md/` 下新建或编辑 md 文件
2. 在 `.vitepress/config.mts` 的 `sidebar` 中增加对应条目
3. 图片放到 `../docs/img/`，在正文中用 `../img/xxx.png` 引用
