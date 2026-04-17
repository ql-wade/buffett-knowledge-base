#!/bin/bash
# 一键发布：Obsidian → Quartz → GitHub → Vercel
set -e

VAULT="$HOME/Documents/KB-Vault"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DST="$SCRIPT_DIR/content"

echo "=== 1. 同步 Obsidian → content/ ==="
for pair in "finance:金融类" "psychology:心理学类" "business:商业类" "philosophy:哲学类" "tech:技术类" "scifi:科幻类" "biography:传记类" "deep-analysis:_深度分析" "history:历史文化类" "medicine:medicine"; do
  eng="${pair%%:*}"
  cn="${pair#*:}"
  rm -rf "$DST/$eng"
  mkdir -p "$DST/$eng"
  if [ -d "$VAULT/$cn" ]; then
    cp -R "$VAULT/$cn/"* "$DST/$eng/" 2>/dev/null || true
  fi
done
echo "  Done."

echo "=== 1.5. 清理未解析 Wikilink ==="
# Strip broken wikilinks: [[concept]] → concept, [[concept|alias]] → alias
python3 - "$DST" << 'PYEOF'
import os, re, sys
d = sys.argv[1]
names = set()
paths = set()
for r, _, fs in os.walk(d):
    for f in fs:
        if f.endswith('.md'):
            names.add(f[:-3])
            paths.add(os.path.relpath(os.path.join(r, f), d)[:-3])
pat = re.compile(r'\[\[([^\]|#]+)(?:#[^|\]]*)?(?:\|([^\]]+))?\]\]')
changed = 0
for r, _, fs in os.walk(d):
    for f in fs:
        if not f.endswith('.md'): continue
        p = os.path.join(r, f)
        with open(p, 'r', encoding='utf-8') as fh: c = fh.read()
        def repl(m):
            t = m.group(1).strip()
            bn = os.path.basename(t)
            if bn in names or t in paths: return m.group(0)
            return (m.group(2) or t).strip()
        nc = pat.sub(repl, c)
        if nc != c:
            with open(p, 'w', encoding='utf-8') as fh: fh.write(nc)
            changed += 1
print(f"  Cleaned {changed} files")
PYEOF
echo "  Done."
cd "$SCRIPT_DIR"
NODE_OPTIONS="--max-old-space-size=4096" node ./quartz/bootstrap-cli.mjs build
echo "  Done."

# Fix: copy robots.txt and IndexNow key to site root (search engines expect /robots.txt not /static/robots.txt)
cp "$SCRIPT_DIR/public/static/robots.txt" "$SCRIPT_DIR/public/robots.txt" 2>/dev/null || true
cp "$SCRIPT_DIR/public/static/9c7910c49c47eb21f401ee25e3bd326a.txt" "$SCRIPT_DIR/public/9c7910c49c47eb21f401ee25e3bd326a.txt" 2>/dev/null || true
echo "  Copied robots.txt and IndexNow key to site root."

echo "=== 2.5. 断链检测 ==="
BROKEN=0
# Collect all wikilink targets and check if they resolve
while IFS= read -r target; do
  fname=$(basename "$target")
  if [ -n "$fname" ] && ! find "$DST" -name "${fname}.md" -print -quit 2>/dev/null | grep -q .; then
    BROKEN=$((BROKEN + 1))
  fi
done < <(grep -roh '\[\[[^]|#]*' "$DST/" --include="*.md" 2>/dev/null | sed 's/\[\[//' | sort -u)

if [ "$BROKEN" -gt 20 ]; then
  echo "  ⚠️ WARNING: $BROKEN broken wikilinks detected (threshold: 20)"
  echo "  Run fix script before publishing."
  read -p "  Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "  Aborted."
    exit 1
  fi
else
  echo "  ✅ $BROKEN broken wikilinks (OK, threshold: 20)"
fi

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
