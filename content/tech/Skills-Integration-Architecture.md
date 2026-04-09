---
title: Skills 集成架构方案
date: 2026-03-09
tags:
  - architecture
  - skills
  - agents
  - integration
  - openclaw
status: active
type: architecture
---

# Skills 集成架构方案

## 概述

本文档描述了 OpenClaw Skills 与 24 Agents 系统的集成方案，实现技能分层管理、智能调度和和协同工作。

---

## 一、Skills 分层架构

### 1.1 三层架构

```
┌─────────────────────────────────────────────────────────────┐
│                    核心层 (Core Layer)                        │
│  self-improving | clawdstrike | credential-manager        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    增强层 (Enhancement Layer)                  │
│  adaptive-reasoning | agent-autopilot | evolver              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    应用层 (Application Layer)                   │
│  agent-browser | diagram-generator | agent-memory            │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 各层职责

| 层级 | Skills | 职责 | 优先级 |
|------|--------|------|--------|
| **核心层** | self-improving | 任务反思、持续改进 | P0 |
| | clawdstrike | 安全审计、漏洞检测 | P0 |
| | credential-manager | 凭证管理、密码存储 | P0 |
| **增强层** | adaptive-reasoning | 复杂推理、多步分析 | P1 |
| | agent-autopilot | 自动驾驶、任务自动化 | P1 |
| | evolver | 技能进化、自我优化 | P1 |
| **应用层** | agent-browser | 浏览器操作、网页交互 | P2 |
| | diagram-generator | 图表生成、架构图 | P2 |
| | agent-memory | 知识存储、记忆管理 | P2 |

---

## 二、Agent-Skills 映射

### 2.1 映射矩阵

| Agent | 主责 Skills | 辅助 Skills | 触发场景 |
|-------|------------|-------------|----------|
| **Kev** | self-improving, clawdstrike | agent-memory | 任务完成后反思、安全审计 |
| **Scout** | agent-browser | - | 浏览器操作、网页抓取 |
| **Sage** | agent-memory | - | 知识存储、深度分析 |
| **Doc** | diagram-generator | - | 画图、架构图、流程图 |
| **Rex** | clawdstrike, agent-browser | self-improving | 代码安全检查、测试网站 |
| **Morgan** | credential-manager | - | 凭证管理、密码操作 |

### 2.2 调度规则

```python
def get_skills_for_agent(agent_id: str) -> list[str]:
    mapping = {
        "kev": ["self-improving", "clawdstrike", "agent-memory"],
        "scout": ["agent-browser"],
        "sage": ["agent-memory"],
        "doc": ["diagram-generator"],
        "rex": ["clawdstrike", "agent-browser"],
        "morgan": ["credential-manager"]
    }
    return mapping.get(agent_id, [])
```

---

## 三、工作流程

### 3.1 内容创作流程

```
用户请求 → Kev(调度)
    │
    ├── Scout(agent-browser) ─→ 采集内容
    │
    ├── Sage(agent-memory) ─→ 深度分析、存储知识
    │
    ├── Doc(diagram-generator) ─→ 生成图表
    │
    └── Morgan(credential-manager) ─→ 管理凭证、发布
```

### 3.2 开发修复流程

```
用户请求 → Kev(调度)
    │
    ├── Rex(clawdstrike) ─→ 安全检查
    │   │
    │   └── 开发修复
    │
    ├── Verifier ─→ 质量验证
    │
    └── Kev(self-improving) ─→ 任务反思
```

### 3.3 技能激活流程

```
用户消息
    ↓
[关键词匹配] → 识别触发词
    ↓
[加载 SKILL.md] → read ~/.openclaw/skills/{skill}/SKILL.md
    ↓
[执行技能] → 按照技能指导执行任务
    ↓
[完成] → 如有需要，触发 self-improving
```

---

## 四、配置说明

### 4.1 文件结构

```
~/.openclaw/
├── skills/                          # Skills 目录
│   ├── self-improving/
│   │   └── SKILL.md
│   ├── clawdstrike/
│   │   └── SKILL.md
│   ├── credential-manager/
│   │   └── SKILL.md
│   ├── adaptive-reasoning/
│   │   └── SKILL.md
│   ├── agent-autopilot/
│   │   └── SKILL.md
│   ├── evolver/
│   │   └── SKILL.md
│   ├── agent-browser/
│   │   └── SKILL.md
│   ├── diagram-generator/
│   │   └── SKILL.md
│   ├── agent-memory/
│   │   └── SKILL.md
│   └── todo-management/       # 新增依赖
│       └── SKILL.md
│
├── config/
│   └── skills-integration.yaml  # 集成配置
│
└── workspaces/
    ├── kev/
    │   ├── SOUL.md              # 包含 Available Skills
    │   ├── AGENTS.md            # 包含 Skills 映射规则
    │   └── MEMORY.md            # 包含 agent-memory 整合
    ├── rex/
    │   └── SOUL.md              # 包含 Available Skills
    ├── scout/
    │   └── SOUL.md              # 包含 Available Skills
    ├── doc/
    │   └── SOUL.md              # 包含 Available Skills
    └── morgan/
        └── SOUL.md              # 包含 Available Skills
```

### 4.2 配置文件

**skills-integration.yaml**

```yaml
# Skills Integration Configuration
# See: ~/.openclaw/config/skills-integration.yaml

skills:
  core:
    - self-improving
    - clawdstrike
    - credential-manager
  enhancement:
    - adaptive-reasoning
    - agent-autopilot
    - evolver
  application:
    - agent-browser
    - diagram-generator
    - agent-memory

agents:
  kev:
    - self-improving
    - clawdstrike
    - agent-memory
  scout:
    - agent-browser
  sage:
    - agent-memory
  doc:
    - diagram-generator
  rex:
    - clawdstrike
    - agent-browser
  morgan:
    - credential-manager
```

---

## 五、依赖关系

### 5.1 Skills 依赖

| Skill | 依赖 | 状态 | 说明 |
|-------|------|------|------|
| agent-browser | node/npm v22.22.0 | ✅ 已安装 | 浏览器自动化 |
| agent-autopilot | todo-management | ✅ 已安装 | 任务管理 |
| diagram-generator | mcp-diagram-generator | ⚠️ 可选 | 可使用 excalidraw/mermaid 替代 |

### 5.2 替代方案

**diagram-generator MCP 未配置时的替代方案:**

```markdown
# 方案 1: 使用 excalidraw-diagram skill
read ~/.openclaw/skills/excalidraw-diagram/SKILL.md

# 方案 2: 使用 mermaid-visualizer skill
read ~/.openclaw/skills/mermaid-visualizer/SKILL.md
```

---

## 六、验证方法

### 6.1 功能验证

```bash
# 1. 检查 Skills 加载
openclaw skills list

# 2. 测试 self-improving
# 触发词: 反思, 改进, 优化, review

# 3. 测试 clawdstrike
# 触发词: 安全审计, 漏洞检查

# 4. 测试 diagram-generator
# 触发词: 画图, 架构图, 流程图

# 5. 测试 agent-browser
# 触发词: 浏览器, 网页
```

### 6.2 鿶证清单

- [ ] Skills 加载正常 (71 skills ready)
- [ ] Agent SOUL.md 包含 Available Skills
- [ ] 关键词触发正常
- [ ] self-improving 任务后反思正常
- [ ] todo-management 依赖已安装

- [ ] 配置文件创建完成

- [ ] 文档更新完成

- [ ] MCP 配置 (可选)

- [ ] 端到端测试通过

- [ ] 集成验证通过

---

## 七、协作流程

### 7.1 内容创作

| 步骤 | Agent | Skills | 输出 |
|------|-------|--------|------|
| 1. 采集 | Scout | agent-browser | 原始内容 |
| 2. 分析 | Sage | agent-memory | 深度分析 + 知识存储 |
| 3. 可视化 | Doc | diagram-generator | 图表、架构图 |
| 4. 发布 | Morgan | credential-manager | 凭证管理 |

### 7.2 开发修复

| 步骤 | Agent | Skills | 输出 |
|------|-------|--------|------|
| 1. 开发 | Rex | clawdstrike, agent-browser | 代码 + 安全检查 |
| 2. 验证 | Verifier | - | 质量报告 |
| 3. 反思 | Kev | self-improving | 改进建议 |

---

## 八、触发词映射

### 8.1 栌心层触发词

| Skill | 触发词 |
|-------|--------|
| self-improving | 反思, 改进, 优化, review, improve, learn |
| clawdstrike | 安全审计, 漏洞检查, security audit, threat model |
| credential-manager | 凭证, 密码, token, credential, secret |

### 8.2 噌强层触发词

| Skill | 触发词 |
|-------|--------|
| adaptive-reasoning | 推理, 分析, reason, complex analysis |
| agent-autopilot | 自动驾驶, autopilot, autonomous |
| evolver | 进化, 演化, evolve, optimize skill |

### 8.3 应用层触发词

| Skill | 触发词 |
|-------|--------|
| agent-browser | 浏览器, 网页, browser, webpage, click |
| diagram-generator | 画图, 架构图, 流程图, diagram, chart |
| agent-memory | 记忆, 存储, 知识, memory, store knowledge |

---

## 九、未来优化建议

### 9.1 罯性优化

1. **MCP 配置**: 配置 diagram-generator MCP 服务器
2. **并行执行**: 优化 Skills 并行调用
3. **缓存机制**: 实现 Skills 结果缓存
4. **监控告警**: 添加 Skills 执行监控

### 9.2 功能扩展

1. **Skills 市场**: 建立内部 Skills 共享机制
2. **版本管理**: 实现 Skills 版本控制
3. **依赖分析**: 自动检测 Skills 依赖
4. **性能优化**: Skills 执行性能分析

### 9.3 运维增强

1. **日志系统**: 完善 Skills 执行日志
2. **错误追踪**: 集成错误追踪系统
3. **性能监控**: 添加性能指标收集
4. **自动化测试**: 建立 Skills 自动化测试

---

## 十、参考链接

- [[Skills 配置文件|~/.openclaw/config/skills-integration.yaml]]
- [[Kev SOUL.md|~/.openclaw/workspaces/kev/SOUL.md]
- [[AGENTS.md|~/.openclaw/workspaces/kev/AGENTS.md]
- [[MEMORY.md|~/.openclaw/workspaces/kev/MEMORY.md]
- [[Rex SOUL.md|~/.openclaw/workspaces/rex/SOUL.md]
- [[Scout SOUL.md|~/.openclaw/workspaces/scout/SOUL.md]
- [[Doc SOUL.md|~/.openclaw/workspaces/doc/SOUL.md]
- [[Morgan SOUL.md|~/.openclaw/workspaces/morgan/SOUL.md]

---

## 更新历史

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-03-09 | 1.0.0 | 初始版本， Skills 集成架构完成 |
