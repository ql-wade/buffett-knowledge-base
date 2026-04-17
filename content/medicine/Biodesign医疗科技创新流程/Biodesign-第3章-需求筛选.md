---
title: "Biodesign 第3章 需求筛选"
description: "六维评估矩阵：从100+候选需求中筛选出最值得投入的核心需求"
source: "Biodesign: The Process of Innovating Medical Technologies"
author:
  - "Paul Yock"
  - "Todd Brinton"
  - "Joshua Makower"
created: "2026-04-15"
tags:
  - 内容/医疗创新
  - 主题/需求筛选
  - 主题/评估矩阵
links:
  - "[[Biodesign医疗科技创新流程]]"
  - "[[Biodesign-第2章-需求发现]]"
  - "[[Biodesign-第4章-需求侦察]]"
---

# 第3章 需求筛选（Need Screening）

## 核心观点

### 六维评估矩阵

对每个 candidate need 从六个维度打分（1-5分），**不是所有需求都值得投入**：

| 维度 | 评估问题 | 权重 | 打分标准 |
|------|---------|------|---------|
| Clinical Impact | 影响了多少患者？严重程度？ | 高 | 5=百万级患者/危及生命；1=极少数/轻微 |
| Current Solutions | 现有方案有多差？ | 高 | 5=无方案或极度不满；1=方案已足够好 |
| Technical Feasibility | 2-3年内技术上能解决吗？ | 中 | 5=用现有技术即可；1=需要重大技术突破 |
| Market Size | 目标市场规模和增长？ | 中 | 5=>$1B且增长；1=<$10M |
| Competition | 有多少人在解决这个问题？ | 中 | 5=蓝海无竞争；1=红海竞争激烈 |
| Reimbursement | 医保会为此付费吗？ | 高 | 5=有现成编码和高支付；1=需新编码且不确定 |

### 筛选硬标准

只保留**同时满足以下三项**的 needs：
1. Clinical Impact ≥ 4（临床影响大）
2. Current Solutions ≥ 3（现有方案差距显著）
3. Reimbursement ≥ 3（有支付路径）

三项中任一项不满足，直接淘汰。不需要争论"但这个想法很酷"——如果没人付钱，就不值得做。

### 快速淘汰信号

出现以下任一信号的需求应立即淘汰：
- 目标患者群 < 10,000 人/年（除非单次治疗价值极高）
- 需要改变医生已有习惯才能推广
- 监管路径不明确（既不是 510(k) 也不确定 De Novo）
- 现有方案已经"够好"（满意度 > 7/10）

## 操作方法

### 筛选流程

```
100+ candidate needs
    ↓ 第一轮：Clinical Impact < 4 → 淘汰（约去掉60%）
    ↓
~40 needs
    ↓ 第二轮：Current Solutions < 3 → 淘汰（约去掉50%）
    ↓
~20 needs
    ↓ 第三轮：六维综合打分，取 Top 5
    ↓
5 needs
    ↓ 第四轮：团队讨论 + 导师评审 → 选 1-3 个
    ↓
1-3 核心需求 → 进入 Need Scouting
```

### 打分工具

使用简单电子表格，每个 need 一行：

| Need # | 简述 | Clinical | Solutions | Feasibility | Market | Competition | Reimbursement | 总分 | 通过? |
|--------|------|----------|-----------|-------------|--------|-------------|---------------|------|-------|
| N-001 | 导管接口感染 | 5 | 4 | 4 | 4 | 3 | 4 | 24 | ✅ |
| N-002 | 术后疼痛管理 | 4 | 2 | 3 | 5 | 2 | 5 | 21 | ❌ |

## 章节关联

| 方向 | 章节 | 连接 |
|------|------|------|
| ← | [[Biodesign-第2章-需求发现]] | 上一步：从临床观察产生 needs pool |
| → | [[Biodesign-第4章-需求侦察]] | 下一步：对筛选出的 needs 做深度验证 |
