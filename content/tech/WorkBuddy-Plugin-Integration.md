---
title: WorkBuddy 插件集成方案
date: 2026-03-10
tags:
  - architecture
  - plugins
  - workbuddy
  - integration
  - openclaw
status: active
type: architecture
---

# WorkBuddy 插件集成方案

## 概述

本文档分析了 `C:\Users\Administrator\.workbuddy\plugins\marketplaces` 目录下的 **228 个插件**，并提出与 OpenClaw 24 Agent 系统的集成方案。

---

## 一、插件市场概览

### 1.1 市场分布

| 市场 | 插件数量 | 类型 |
|------|----------|------|
| codebuddy-plugins-official | 201 | 官方插件 |
| cb_teams_marketplace | 27 | Teams 插件 |
| **总计** | **228** | - |

### 1.2 插件分类统计

| 类别 | 插件数 | 代表插件 |
|------|--------|----------|
| 数据分析 | 15+ | data-analysis, data, financial-analysis |
| 研究分析 | 10+ | deep-research, equity-research, spglobal |
| 代码生成 | 12+ | design-to-code, dockerfile-gen, feature-dev |
| 文档处理 | 8+ | document-skills, general-skills |
| 金融财务 | 20+ | finance, trading-assistant, wealth-management |
| 开发工具 | 15+ | plugin-dev, agent-sdk-dev, code-review |
| 测试工具 | 10+ | webapp-testing, playwright-cli |

---

## 二、高优先级集成插件

### 2.1 data-analysis (数据分析)

**功能描述**:
- Excel 表格创建、编辑和分析
- 公式计算、数据可视化
- 微信公众号文章检索

**触发词**: `数据分析`, `Excel`, `xlsx`, `csv`, `可视化`

**OpenClaw 映射**:
| Agent | 集成方式 |
|-------|----------|
| **dash** | 直接使用，数据分析专家 |
| **sage** | 辅助使用，分析支持 |
| **morgan** | 财务数据分析 |

**集成建议**:
```yaml
# ~/.openclaw/skills/data-analysis/
SKILL.md:
  triggers:
    - "数据分析"
    - "Excel"
    - "表格处理"
  agents:
    - dash
    - sage
    - morgan
```

---

### 2.2 deep-research (深度研究)

**功能描述**:
- 完整的研究型工作流系统
- 代码库分析、技术调研
- Wiki 生成、知识发现

**触发词**: `深度研究`, `代码库分析`, `技术调研`, `wiki`

**OpenClaw 映射**:
| Agent | 集成方式 |
|-------|----------|
| **sage** | 直接使用，研究分析专家 |
| **alex** | 市场研究支持 |
| **scout** | 快速调研增强 |

**集成建议**:
```yaml
# ~/.openclaw/skills/deep-research/
SKILL.md:
triggers:
    - "深度研究"
    - "技术调研"
    - "知识发现"
agents:
    - sage
    - alex
    - scout
workflow:
    1. 代码库分析
    2. 外部研究
    3. 文档生成
    4. Wiki 创建
```

---

### 2.3 design-to-code (设计转代码)

**功能描述**:
- Figma 设计转换为代码组件
- 截图转代码
- 支持 React、Svelte、Vue
- 无障碍性支持

**触发词**: `设计转代码`, `Figma`, `UI转代码`, `组件生成`

**OpenClaw 映射**:
| Agent | 集成方式 |
|-------|----------|
| **rex** | 直接使用，前端开发 |
| **pixel** | 设计协作 |
| **poc-builder** | 原型开发 |

**集成建议**:
```yaml
# ~/.openclaw/skills/design-to-code/
SKILL.md:
  triggers:
    - "设计转代码"
    - "Figma"
    - "UI组件"
  agents:
    - rex
    - pixel
    - poc-builder
  frameworks:
    - React
    - Svelte
    - Vue
    - HTML/CSS
```

---

### 2.4 document-skills (文档技能)

**功能描述**:
- Word 文档处理
- Excel 表格操作
- PowerPoint 演示文稿
- PDF 生成和处理

**触发词**: `Word`, `Excel`, `PowerPoint`, `PDF`, `文档处理`

**OpenClaw 映射**:
| Agent | 集成方式 |
|-------|----------|
| **doc** | 直接使用，文档专家 |
| **scribe** | 报告生成 |
| **presales** | 提案文档 |

**集成建议**:
```yaml
# ~/.openclaw/skills/document-skills/
SKILL.md:
triggers:
    - "Word文档"
    - "PPT"
    - "PDF"
agents:
    - doc
    - scribe
    - presales
formats:
    - docx
    - xlsx
    - pptx
    - pdf
```

---

### 2.5 plugin-dev (插件开发)

**功能描述**:
- CodeBuddy 插件开发工具包
- 7 个专家技能
- 钩子、MCP 集成、命令、代理

**触发词**: `插件开发`, `技能创建`, `MCP集成`

**OpenClaw 映射**:
| Agent | 集成方式 |
|-------|----------|
| **quinn** | 架构设计支持 |
| **rex** | 插件实现 |
| **kev** | 集成协调 |

**集成建议**:
```yaml
# ~/.openclaw/skills/plugin-dev/
SKILL.md:
  triggers:
    - "插件开发"
    - "创建技能"
    - "MCP集成"
  agents:
    - quinn
    - rex
    - kev
  components:
    - hooks
    - mcp-servers
    - commands
    - agents
```

---

## 三、中优先级集成插件

### 3.1 data (数据查询)

**功能**: SQL 查询、数据探索、可视化、仪表板

**OpenClaw 映射**: dash, sage

### 3.2 trading-assistant (交易助手)

**功能**: 多角色辩论投资分析

**OpenClaw 映射**: morgan, dash

### 3.3 playwright-cli (浏览器自动化)

**功能**: Web 测试、表单填写、截图

**OpenClaw 映射**: rex, scout

### 3.4 security-scan (安全扫描)

**功能**: 代码安全审计、多语言支持

**OpenClaw 映射**: clawdstrike skill, rex

### 3.5 code-review (代码审查)

**功能**: 自动化 PR 审查、置信度评分

**OpenClaw 映射**: verifier, rex

---

## 四、Agent-Plugin 映射矩阵

### 4.1 完整映射表

| Agent | 主责插件 | 辅助插件 | 技能增强 |
|-------|----------|----------|----------|
| **kev** | - | plugin-dev | self-improving |
| **sage** | deep-research | data-analysis | agent-memory |
| **rex** | design-to-code | security-scan, playwright-cli | clawdstrike |
| **dash** | data-analysis | data | - |
| **doc** | document-skills | - | diagram-generator |
| **morgan** | trading-assistant | finance | credential-manager |
| **scout** | - | deep-research | agent-browser |
| **alex** | deep-research | equity-research | - |
| **verifier** | code-review | security-scan | - |
| **quinn** | plugin-dev | design-to-code | - |
| **pixel** | design-to-code | - | - |
| **presales** | document-skills | - | - |
| **poc-builder** | design-to-code | dockerfile-gen | - |

### 4.2 技能层映射

```
OpenClaw Skills Layer          WorkBuddy Plugins
┌─────────────────────┐       ┌──────────────────────┐
│   Core Layer        │       │                      │
│   - self-improving  │  ←──→ │ plugin-dev           │
│   - clawdstrike     │  ←──→ │ security-scan        │
│   - credential-mgr  │       │                      │
├─────────────────────┤       ├──────────────────────┤
│   Enhancement Layer │       │                      │
│   - adaptive-reason │  ←──→ │ deep-research        │
│   - agent-autopilot │       │                      │
│   - evolver         │       │                      │
├─────────────────────┤       ├──────────────────────┤
│   Application Layer │       │                      │
│   - agent-browser   │  ←──→ │ playwright-cli       │
│   - diagram-gen     │  ←──→ │ design-to-code       │
│   - agent-memory    │  ←──→ │ data-analysis        │
└─────────────────────┘       └──────────────────────┘
```

---

## 五、集成实施步骤

### 5.1 Phase 1: 核心技能集成 (Week 1)

```bash
# 1. 复制高优先级插件到 OpenClaw skills
cp -r /mnt/c/Users/Administrator/.workbuddy/plugins/marketplaces/cb_teams_marketplace/plugins/data-analysis ~/.openclaw/skills/
cp -r /mnt/c/Users/Administrator/.workbuddy/plugins/marketplaces/cb_teams_marketplace/plugins/deep-research ~/.openclaw/skills/
cp -r /mnt/c/Users/Administrator/.workbuddy/plugins/marketplaces/cb_teams_marketplace/plugins/design-to-code ~/.openclaw/skills/
cp -r /mnt/c/Users/Administrator/.workbuddy/plugins/marketplaces/cb_teams_marketplace/plugins/document-skills ~/.openclaw/skills/

# 2. 更新 Agent SOUL.md
# 添加 Available Skills 章节
```

### 5.2 Phase 2: Agent 映射更新 (Week 2)

```yaml
# 更新 skills-integration.yaml
plugins:
workbuddy:
    data-analysis:
      agents: [dash, sage, morgan]
    deep-research:
      agents: [sage, alex, scout]
    design-to-code:
      agents: [rex, pixel, poc-builder]
    document-skills:
      agents: [doc, scribe, presales]
```

### 5.3 Phase 3: 工作流集成 (Week 3)

```markdown
# 内容创作工作流 (增强版)
1. Scout + deep-research → 深度内容采集
2. Sage + data-analysis → 数据驱动分析
3. Doc + document-skills → 专业文档输出
4. Morgan + trading-assistant → 财务决策支持
```

---

## 六、依赖关系

### 6.1 插件依赖

| 插件 | 依赖 | 状态 | 解决方案 |
|------|------|------|----------|
| design-to-code | Figma API Token | ⚠️ 可选 | 按需配置 |
| playwright-cli | Node.js | ✅ 已安装 | v22.22.0 |
| data-analysis | Python | ✅ 已安装 | 系统自带 |
| deep-research | - | ✅ 无依赖 | - |

### 6.2 环境配置

```bash
# 可选: Figma API 配置
export FIGMA_ACCESS_TOKEN="your-token"

# 可选: 数据库连接
export DATABASE_URL="your-db-url"
```

---

## 七、验证清单

- [ ] Phase 1: 核心技能复制完成
- [ ] Phase 2: Agent SOUL.md 更新完成
- [ ] Phase 3: 工作流测试通过
- [ ] data-analysis 插件测试
- [ ] deep-research 插件测试
- [ ] design-to-code 插件测试
- [ ] document-skills 插件测试

---

## 八、参考链接

- [[Skills-Integration-Architecture|~/.openclaw/architecture/Skills-Integration-Architecture.md]]
- [[Kev SOUL.md|~/.openclaw/workspaces/kev/SOUL.md]]
- [[AGENTS|~/.openclaw/workspaces/kev/AGENTS.md]]

---

## 更新历史

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-03-10 | 1.0.0 | 初始版本，完成 228 插件分析 |
