# 🧠 神经梦境实验室

> 集成了3D可视化、用户认证、实验管理和AI智能体的综合性科研平台

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.1-purple.svg)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.180.0-orange.svg)](https://threejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green.svg)](https://supabase.com/)

## ✨ 主要功能

- 🧠 **神经映射3D可视化** - 实时3D大脑神经网络展示
- 🐭 **3D小鼠数字孪生** - 基于物理引擎的完整生理模型  
- 🔬 **实验管理系统** - 支持5种实验类型的完整管理
- 🤖 **AI智能沙龙** - 4个专业智能体协作对话
- 👤 **用户认证系统** - 完整的注册登录权限管理

## 🚀 快速开始

### 方法1: 使用启动脚本 (推荐)

**Linux/macOS:**
```bash
./start.sh
```

**Windows:**
```cmd
start.bat
```

### 方法2: 手动安装

1. **安装依赖**
```bash
pnpm install
# 或
npm install
```

2. **配置环境变量**
```bash
cp .env.example .env.local
# 编辑 .env.local 文件，填入你的配置
```

3. **启动开发服务器**
```bash
pnpm dev
# 或
npm run dev
```

4. **访问应用**
打开浏览器访问: http://localhost:5173

## 📋 环境要求

- **Node.js**: >= 18.0.0
- **包管理器**: pnpm (推荐) 或 npm
- **浏览器**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- **硬件**: 支持WebGL 2.0的显卡

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── AISalon/        # AI沙龙相关组件
│   ├── DigitalTwin/    # 数字孪生组件  
│   ├── Experiments/    # 实验管理组件
│   └── Layout/         # 布局组件
├── contexts/           # React上下文
├── hooks/              # 自定义Hooks
├── lib/                # 工具库
├── pages/              # 页面组件
├── services/           # API服务
├── store/              # 状态管理
├── types/              # TypeScript类型定义
└── utils/              # 工具函数
```

## 🛠️ 开发命令

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 代码检查
pnpm lint

# 类型检查
pnpm type-check
```

## ⚙️ 配置说明

### Supabase配置 (必需)

1. 创建Supabase项目: https://supabase.com
2. 获取项目URL和API密钥
3. 在`.env.local`中配置:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### MiniMax AI配置 (可选)

用于启用AI沙龙功能:

```env
VITE_MINIMAX_API_KEY=your_minimax_api_key
VITE_MINIMAX_GROUP_ID=your_group_id
```

## 🐛 故障排除

### 常见问题

**依赖安装失败:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**端口占用:**
```bash
# 查看端口占用
lsof -i :5173
# 杀死进程
kill -9 <PID>
```

**WebGL支持检查:**
在浏览器控制台运行:
```javascript
console.log(WebGLRenderingContext);
```

## 📊 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 6
- **3D渲染**: Three.js + @react-three/fiber
- **后端服务**: Supabase
- **样式方案**: TailwindCSS + Radix UI
- **状态管理**: Zustand + React Query
- **物理引擎**: Cannon.js

## 📚 文档

- [完整安装运行指南](./本地安装运行指南.md) - 详细的安装和配置说明
- [在线演示](https://vv03a3emjo7n.space.minimaxi.com) - 查看线上版本

## 🤝 贡献

欢迎提交Issue和Pull Request来改进项目！

## 📄 许可证

MIT License

## 📞 支持

如有问题，请查看[完整安装运行指南](./本地安装运行指南.md)或联系技术支持。

---

**版本**: v1.0.0 | **更新时间**: 2025-10-31 | **作者**: MiniMax Agent