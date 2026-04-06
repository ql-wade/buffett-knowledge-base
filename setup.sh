#!/bin/bash
# ============================================================
# 巴菲特知识库 - Quartz 一键部署脚本
# ============================================================
#
# 使用方法:
#   1. 将 buffett-kb-staging 目录复制到 ~/Desktop/
#   2. 打开终端，运行: cd ~/Desktop/buffett-kb-staging && bash setup.sh
#
# ============================================================

set -e

echo "============================================"
echo "  巴菲特致股东信知识库 · Quartz 部署"
echo "============================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js: $(node --version)"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 未检测到 npm"
    exit 1
fi
echo "✅ npm: $(npm --version)"

echo ""
echo "--- 步骤 1/4: 初始化 Quartz ---"
# 如果 quartz 目录为空，克隆 Quartz
if [ ! -f "quartz/cli.js" ] && [ ! -f "quartz/cli.mjs" ]; then
    echo "  正在克隆 Quartz 框架..."
    # 备份我们的内容
    cp -r content /tmp/buffett-content-backup
    cp quartz.config.ts /tmp/buffett-quartz-config.ts
    cp package.json /tmp/buffett-package.json

    # 初始化 Quartz（使用 npx）
    npm init @jackyzha0/quartz .

    # 恢复内容
    cp -r /tmp/buffett-content-backup/* content/
    cp /tmp/buffett-quartz-config.ts quartz.config.ts
    cp /tmp/buffett-package.json package.json
fi

echo ""
echo "--- 步骤 2/4: 安装依赖 ---"
npm ci

echo ""
echo "--- 步骤 3/4: 构建站点 ---"
npx quartz build

echo ""
echo "--- 步骤 4/4: 启动本地预览 ---"
echo "  🌐 访问 http://localhost:8080"
echo ""
echo "============================================"
echo "  ✅ 部署完成！"
echo "============================================"
echo ""
echo "📋 后续步骤:"
echo "  1. 本地预览确认无误后，推送到 GitHub:"
echo "     git init && git add . && git commit -m 'init: 巴菲特知识库'"
echo "     git remote add origin <your-repo-url>"
echo "     git push -u origin main"
echo ""
echo "  2. 部署到 Vercel:"
echo "     - 登录 https://vercel.com"
echo "     - Import Git Repository"
echo "     - 自动检测 vercel.json"
echo "     - Deploy"
echo ""
echo "  3. 中国大陆加速 (可选):"
echo "     - 绑定自定义域名"
echo "     - 使用 Cloudflare DNS"
echo ""
