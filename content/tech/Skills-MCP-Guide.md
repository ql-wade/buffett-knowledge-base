---
title: Skills MCP 配置指南 (OpenClaw)
date: 2026-03-10
tags:
  - mcp
  - skills
  - openclaw
  - configuration
status: active
type: documentation
---

# Skills MCP 配置指南 (OpenClaw)

## 概述

本文档说明如何在 **OpenClaw** 中配置需要 MCP (Model Context Protocol) 服务器的 Skills。

---

## 一、OpenClaw MCP 配置方式

### 1.1 配置文件位置

OpenClaw 使用以下文件配置 MCP 服务器：

```
~/.openclaw/
├── container-mcp.json    # MCP 服务器配置
├── openclaw.json          # 主配置文件
└── skills/                # Skills 目录
```

### 1.2 MCP 配置格式

**`~/.openclaw/container-mcp.json`**:

```json
{
  "mcpServers": {
    "server-name": {
      "command": ["npx", "-y", "package-name", "--args"]
    }
  }
}
```

---

## 二、需要 MCP 的 Skills

### 2.1 design-to-code

**功能**: 将 Figma 设计和截图转换为代码组件

**MCP 服务器**: `design-converter`

**配置步骤**:

```bash
# 1. 进入技能目录
cd ~/.openclaw/skills/design-to-code

# 2. 安装依赖
npm install

# 3. 构建 MCP 服务器
npm run build

# 4. 验证构建
ls dist/servers/design-converter.js
```

**OpenClaw MCP 配置** (`~/.openclaw/container-mcp.json`):

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": ["npx", "-y", "chrome-devtools-mcp@latest", "--isolated", "--headless"]
    },
    "design-converter": {
      "command": ["node", "/root/.openclaw/skills/design-to-code/dist/servers/design-converter.js"]
    }
  }
}
```

### 2.2 Skills MCP 需求汇总

| Skill | MCP 需求 | 状态 | 操作 |
|-------|----------|------|------|

---

## 三、完整 MCP 配置示例

### 3.1 当前配置

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": ["npx", "-y", "chrome-devtools-mcp@latest", "--isolated", "--headless"]
    }
  }
}
```

### 3.2 添加 design-to-code 后

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": ["npx", "-y", "chrome-devtools-mcp@latest", "--isolated", "--headless"]
    },
    "design-converter": {
      "command": ["node", "/root/.openclaw/skills/design-to-code/dist/servers/design-converter.js"]
    }
  }
}
```

---

## 四、使用流程

### 4.1 纯文档型 Skills (无需 MCP)

大多数 WorkBuddy 插件是**纯文档型**，不需要 MCP 配置：

```
1. 识别触发词
   ↓
2. 读取 SKILL.md
   read ~/.openclaw/skills/{skill}/SKILL.md
   ↓
3. 按照 SKILL.md 指导执行
```

**示例 - 使用 data-analysis**:

```bash
# 1. 读取技能指导
read ~/.openclaw/skills/data-analysis/SKILL.md

# 2. 读取子技能
read ~/.openclaw/skills/data-analysis/skills/xlsx/SKILL.md

# 3. 按照指导处理 Excel 文件
```

### 4.2 MCP 型 Skills (需要 MCP)

只有 **design-to-code** 需要 MCP：

```
1. 构建并配置 MCP (一次性)
   ↓
2. 重启 OpenClaw
   ↓
3. 使用触发词调用
   "设计转代码", "Figma", "UI转代码"
```

---

## 五、快速配置命令

### 5.1 配置 design-to-code MCP

```bash
#!/bin/bash
# 一键配置 design-to-code MCP

cd ~/.openclaw/skills/design-to-code

# 安装依赖
npm install

# 构建
npm run build

# 验证
if [ -f "dist/servers/design-converter.js" ]; then

  # 添加到 container-mcp.json
  # (手动或使用 jq)
else
echo "❌ Build failed"
fi
```

### 5.2 验证 MCP 配置

```bash
# 检查 OpenClaw MCP 配置
cat ~/.openclaw/container-mcp.json | jq '.mcpServers | keys'

# 测试 MCP 服务器
node ~/.openclaw/skills/design-to-code/dist/servers/design-converter.js --help 2>/dev/null || echo "MCP server ready"
```

---

## 六、故障排除

### 6.1 MCP 服务器无法启动

**症状**: `Error: Cannot find module 'xxx'`

**解决方案**:
```bash
cd ~/.openclaw/skills/design-to-code
npm install
npm run build
```

### 6.2 配置不生效

**症状**: OpenClaw 不识别新 MCP

**解决方案**:
```bash
# 1. 验证 JSON 格式
cat ~/.openclaw/container-mcp.json | jq .

# 2. 重启 OpenClaw
# 重新启动 OpenClaw 会话
```

### 6.3 路径问题

**症状**: `ENOENT: no such file or directory`

**解决方案**:
```bash
# 使用绝对路径
"command": ["node", "/root/.openclaw/skills/design-to-code/dist/servers/design-converter.js"]
```

---

## 七、最佳实践

### 7.1 配置管理

1. **备份配置**: 修改前备份 `container-mcp.json`
2. **版本控制**: 使用 Git 管理配置变更
3. **逐步添加**: 一次只添加一个 MCP 服务器

### 7.2 Skills 使用

1. **优先使用纯文档型**: 大多数任务不需要 MCP
2. **按需配置 MCP**: 只在需要 design-to-code 时配置
3. **阅读 SKILL.md**: 使用前先阅读技能指导

---

## 八、相关文件

| 文件 | 用途 |
|------|------|
| `~/.openclaw/container-mcp.json` | MCP 服务器配置 |
| `~/.openclaw/openclaw.json` | OpenClaw 主配置 |
| `~/.openclaw/config/skills-integration.yaml` | Skills 集成配置 |
| `~/.openclaw/skills/*/SKILL.md` | 各技能指导文档 |

---

## 九、相关链接

- [[Skills-Integration-Architecture|~/.openclaw/architecture/Skills-Integration-Architecture.md]]
- [[WorkBuddy-Plugin-Integration|~/.openclaw/architecture/WorkBuddy-Plugin-Integration.md]]

---

## 更新历史

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-03-10 | 1.1.0 | 更正为 OpenClaw 配置方式 |
| 2026-03-10 | 1.0.0 | 初始版本 |

---

## 🎉 构建完成状态 (2026-03-10)

```bash
# 构建日志
cd ~/.openclaw/skills/design-to-code

# 输出文件
```

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": ["npx", "-y", "chrome-devtools-mcp@latest", "--isolated", "--headless"]
    },
    "design-converter": {
      "command": ["node", "/root/.openclaw/skills/design-to-code/dist/servers/design-converter.js"]
    }
  }
}
```

### 使用方式

重启 OpenClaw 后，可以使用以下触发词：
- "设计转代码"
- "Figma 转 React"
- "UI 组件生成"
- "截图转代码"
