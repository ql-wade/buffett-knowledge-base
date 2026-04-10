#!/bin/bash
# 一键发布：Obsidian → Quartz → GitHub → Vercel
set -e

VAULT="$HOME/Documents/Obsidian Vault/03-Resources/书籍拆解/1-拆解记录"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DST="$SCRIPT_DIR/content"

echo "=== 1. 同步 Obsidian → content/ ==="
for pair in "finance:金融类" "psychology:心理学类" "business:商业类" "philosophy:哲学类" "tech:技术类" "scifi:科幻类" "biography:传记类" "deep-analysis:_深度分析" "history:历史文化类"; do
  eng="${pair%%:*}"
  cn="${pair#*:}"
  rm -rf "$DST/$eng"
  mkdir -p "$DST/$eng"
  if [ -d "$VAULT/$cn" ]; then
    cp -R "$VAULT/$cn/"* "$DST/$eng/" 2>/dev/null || true
  fi
done
echo "  Done."

echo "=== 2. Quartz 构建 ==="
cd "$SCRIPT_DIR"
NODE_OPTIONS="--max-old-space-size=4096" node ./quartz/bootstrap-cli.mjs build
echo "  Done."

# Fix: copy robots.txt and IndexNow key to site root (search engines expect /robots.txt not /static/robots.txt)
cp "$SCRIPT_DIR/public/static/robots.txt" "$SCRIPT_DIR/public/robots.txt" 2>/dev/null || true
cp "$SCRIPT_DIR/public/static/9c7910c49c47eb21f401ee25e3bd326a.txt" "$SCRIPT_DIR/public/9c7910c49c47eb21f401ee25e3bd326a.txt" 2>/dev/null || true
echo "  Copied robots.txt and IndexNow key to site root."

echo "=== 3. Git 推送 ==="
git add -A
if git diff --cached --quiet; then
  echo "  No changes to commit."
else
  CHANGES=$(git diff --cached --name-only | wc -l | tr -d ' ')
  git commit -m "sync: 更新 $CHANGES 个文件

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
  git -c http.proxy=http://127.0.0.1:7897 -c https.proxy=http://127.0.0.1:7897 push origin master
  echo "  Pushed $CHANGES changes."
fi

echo ""
echo "=== 完成 ==="
echo "Vercel 会自动构建部署，约 2-3 分钟后生效。"
echo "https://kb.beatwade.cn"

# IndexNow: notify search engines for instant indexing
echo ""
echo "=== 4. IndexNow 通知 ==="
INDEXNOW_KEY="9c7910c49c47eb21f401ee25e3bd326a"
if command -v curl &> /dev/null; then
  curl -s -X POST "https://api.indexnow.org/indexnow" \
    -H "Content-Type: application/json" \
    -d "{
      \"host\": \"kb.beatwade.cn\",
      \"key\": \"$INDEXNOW_KEY\",
      \"keyLocation\": \"https://kb.beatwade.cn/$INDEXNOW_KEY.txt\",
      \"urlList\": [
        \"https://kb.beatwade.cn/\",
        \"https://kb.beatwade.cn/sitemap.xml\"
      ]
    }" && echo "  IndexNow notified." || echo "  IndexNow failed (non-critical)."
fi
