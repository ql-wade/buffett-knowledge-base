# 巴菲特致股东信 · 知识库 (Quartz 静态站点)

> 沃伦·巴菲特1956-2025年致股东信完整知识库，基于 Quartz 静态站点生成器发布

## 📊 知识库统计

| 类别 | 数量 |
|------|------|
| 中文翻译信件 | 81篇 |
| 英文原文 | 30年 |
| 投资概念词条 | 35个 |
| 公司词条 | 61家 |
| 人物词条 | 7位 |
| 深度拆解 | 6篇 |
| 交叉链接 | 2,672+ |
| 总文件数 | 221个 |

## 🚀 快速部署

### 方式一：本地预览

```bash
# 1. 克隆本项目
git clone <your-repo-url> buffett-kb
cd buffett-kb

# 2. 安装依赖
npm ci

# 3. 本地预览
npx quartz build --serve
# 访问 http://localhost:8080
```

### 方式二：Vercel 部署（推荐）

1. 将本项目推送到 GitHub
2. 登录 [Vercel](https://vercel.com)
3. 导入 GitHub 仓库
4. Vercel 自动检测 `vercel.json` 配置
5. 部署完成，获得访问地址

### 方式三：GitHub Pages 部署

1. 推送到 GitHub
2. 在仓库 Settings → Pages 中选择 GitHub Actions
3. 项目已包含 `.github/workflows/deploy.yml`
4. 推送到 `main` 分支自动部署

## 🌐 中国大陆访问优化

### 方案 A：Vercel + 自定义域名 + Cloudflare
1. 在 Cloudflare 添加自定义域名
2. 配置 DNS 指向 Vercel
3. 启用 Cloudflare CDN 加速

### 方案 B：Zeabur（香港节点）
1. 注册 [Zeabur](https://zeabur.com)
2. 部署为静态站点
3. 选择香港节点

### 方案 C：Netlify
1. 登录 [Netlify](https://netlify.com)
2. 导入 GitHub 仓库
3. 构建命令: `npx quartz build`
4. 输出目录: `public`

## 📁 目录结构

```
content/
├── index.md                    # 首页
├── 索引.md                     # 完整索引
├── 信件/
│   ├── 伯克希尔信/ (60 files)   # 1965-2024
│   ├── 合伙人信/ (17 files)    # 1956-1964
│   └── 特别信件/ (4 files)     # 2014/2025
├── 概念词条/ (35 files)         # 核心投资概念
├── 公司词条/ (61 files)         # 投资案例公司
├── 英文信件原文/ (31 files)     # 1977-2006
├── 深度拆解/ (6 files)          # 关键年份深度分析
├── 人物/                        # 关键人物
├── 核心概念词条.md              # 精选10概念
├── 重要公司词条.md              # 精选10公司
├── 合伙人信时期汇总.md          # 合伙人时期分析
└── 数据分析与图表.md            # 可视化数据
```

## 🔧 已完成的链接修复

- ✅ 144 个转义管道符 `\\|` → `|`
- ✅ 52 个章节链接路径更新
- ✅ 17 个外部 vault 链接清理
- ✅ 7 个重命名文件引用修复
- ✅ 英文索引双向链接（英文原文 ↔ 中文翻译）

## 📝 配置说明

- `quartz.config.ts` - Quartz 主配置
- `vercel.json` - Vercel 部署配置
- `.github/workflows/deploy.yml` - GitHub Actions 自动部署

## License

MIT
