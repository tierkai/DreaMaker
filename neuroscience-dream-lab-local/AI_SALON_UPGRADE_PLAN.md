# AI沙龙功能升级计划

## 当前状态

### ✅ 已完成的工作

1. **数据库设计** 
   - 创建了3个核心数据表（等待token刷新后部署）：
     - `ai_salon_conversations` - 对话会话
     - `ai_salon_messages` - 对话消息
     - `ai_salon_reports` - 生成的研究报告
   - 配置了完整的Row Level Security策略
   - 添加了性能优化索引

2. **Edge Functions开发**
   - `ai-salon-chat` - 多智能体AI对话处理
     - 4个专业AI角色（神经科学专家、梦境分析师、数据科学家、实验设计师）
     - 智能决策系统（基于关键词判断哪些智能体应该响应）
     - 真实的LLM API调用
     - 对话历史保存
   
   - `ai-salon-generate-report` - 研究报告自动生成
     - 基于完整对话历史
     - 提取关键话题和见解
     - 生成结构化报告
     - 质量评分计算

3. **前端服务层**
   - 完整的API封装（`aiSalonService.ts`）
   - Supabase Realtime集成
   - TypeScript类型定义

## ⏳ 等待事项

### 1. Supabase Token刷新
**原因**: 当前token已过期，无法创建数据库表

**需要**: 刷新Supabase访问令牌

### 2. LLM API密钥配置
**需要以下任一API密钥**:

#### 选项1: OpenAI (推荐)
- API Key格式: `sk-...`
- 模型: GPT-4 或 GPT-3.5-turbo
- 获取方式: https://platform.openai.com/api-keys

#### 选项2: Anthropic Claude
- API Key格式: `sk-ant-...`
- 模型: Claude-3
- 获取方式: https://console.anthropic.com/

#### 选项3: 国内大模型
- 智谱AI (GLM-4)
- 百川智能
- MiniMax
- 其他兼容OpenAI格式的API

## 📋 部署步骤（收到API密钥后）

### 步骤1: 刷新Supabase Token
```
需要coordinator刷新token
```

### 步骤2: 创建数据库表
```
执行migration创建ai_salon相关表
```

### 步骤3: 配置Supabase Secrets
```bash
# 在Supabase Dashboard中配置
OPENAI_API_KEY=sk-...
# 或
LLM_API_KEY=your-api-key
```

### 步骤4: 部署Edge Functions
```
使用batch_deploy_edge_functions部署：
- ai-salon-chat
- ai-salon-generate-report
```

### 步骤5: 更新前端组件
更新 `ChatInterface.tsx` 调用真实API

### 步骤6: 测试验证
- 测试多智能体对话
- 测试报告生成
- 验证数据持久化

## 🎯 实现的功能特性

### 多智能体协作
- **智能响应决策**: 基于消息内容自动判断哪些智能体应该参与
- **专业角色分工**: 
  - 🧠 神经科学专家 - 处理大脑、神经相关话题
  - 💭 梦境分析师 - 处理睡眠、梦境、心理话题
  - 📊 数据科学家 - 处理数据、分析、统计话题
  - 🔬 实验设计师 - 处理研究方法、实验设计话题
- **并发响应**: 多个智能体可以同时或依次回复
- **自然节奏**: 添加延迟模拟真实对话

### 知识提取与报告生成
- **对话分析**: 自动分析对话历史
- **话题提取**: 识别核心讨论话题
- **见解总结**: 提取关键发现和观点
- **结构化输出**: 生成包含执行摘要、话题、见解、建议、结论的完整报告
- **质量评分**: 基于内容完整性和长度计算质量分数

### 数据持久化
- **对话历史**: 所有对话永久保存
- **报告归档**: 生成的报告可随时查看和下载
- **实时同步**: Supabase Realtime确保多端同步

## 💡 使用场景

### 场景1: 研究讨论
用户提问："REM睡眠对记忆巩固有什么作用？"

**系统响应**:
1. 神经科学专家：解释神经机制
2. 梦境分析师：分析梦境与记忆的关系
3. 数据科学家：提供相关研究数据
4. 系统自动保存对话

### 场景2: 研究报告生成
用户在进行了20轮对话后，点击"生成报告"

**系统处理**:
1. 提取所有对话内容
2. 调用LLM分析和总结
3. 生成1500-2000字的结构化报告
4. 包含话题、见解、建议等内容
5. 保存到数据库供下载

## 🔧 技术架构

```
前端 (React + TypeScript)
  ↓ 调用
AI Salon Service Layer
  ↓ 请求
Supabase Edge Functions
  ↓ 调用
LLM API (OpenAI/Claude/etc)
  ↓ 响应
Supabase Database (PostgreSQL)
  ↓ 实时同步
前端 UI 更新
```

## 📊 与Mock版本的对比

| 功能 | Mock版本 | 真实版本 |
|-----|---------|---------|
| AI响应 | 预定义模板 | 真实LLM生成 |
| 智能体决策 | 随机选择 | 基于语义理解 |
| 对话连贯性 | 无上下文 | 完整对话历史 |
| 报告生成 | 静态展示 | 动态分析生成 |
| 数据持久化 | 无 | 完整数据库 |
| 知识提取 | 无 | 智能分析 |

## 📝 待办事项清单

- [ ] 获取Supabase token刷新
- [ ] 获取LLM API密钥
- [ ] 创建数据库表
- [ ] 配置Supabase Secrets
- [ ] 部署Edge Functions
- [ ] 更新前端组件
- [ ] 端到端测试
- [ ] 性能优化
- [ ] 用户体验调优

## 🚀 预期成果

升级完成后，用户将获得：
1. **真实的AI对话体验** - 不再是预定义响应，而是基于上下文的智能对话
2. **专业的研究助手** - 4个AI专家协同工作，提供多角度见解
3. **自动化知识管理** - 对话自动保存，随时可查看历史
4. **智能报告生成** - 一键生成专业的研究报告
5. **可扩展的架构** - 易于添加更多智能体或功能
