# CandleQuest - 盘感训练应用

一个基于React和TypeScript的盘感训练应用，帮助用户培养交易盘感，提升交易水平。

## 功能特性

### 模式1：模拟实盘模式（经典训练）
- 系统随机截取历史K线数据
- 用户做出买入/卖出/空仓决策
- 基于盈亏计算得分
- 支持错题本功能

### 模式2：快速选择题模式（反应训练）⭐
- 10秒倒计时快速判断
- 预测K线走势：上涨/下跌/震荡
- 实时K线图展示
- 立即揭示结果和得分
- 完整的游戏流程和统计

### 其他功能
- 错题本记录错误案例
- 用户统计和成绩追踪
- 响应式设计，支持多设备

## 技术栈

- **前端框架**: React.js 19.1.1
- **开发语言**: TypeScript 4.9.5
- **样式处理**: Tailwind CSS 3.4.17
- **数据存储**: Supabase
- **K线图展示**: TradingView Lightweight Charts 5.0.8
- **构建工具**: Create React App

## 安装和运行

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
在项目根目录创建 `.env.local` 文件：
```bash
# Supabase配置
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. 启动开发服务器
```bash
npm start
```

应用将在 http://localhost:3000 启动

## 项目结构

```
src/
├── components/          # 可复用组件
├── hooks/              # 自定义Hooks
│   └── useUser.ts      # 用户管理Hook
├── lib/                # 工具库
│   └── supabaseClient.ts # Supabase客户端
├── pages/              # 页面组件
│   └── Mode2.tsx       # 模式2：快速选择题
└── App.tsx             # 主应用组件
```

## 数据表结构

### users 表
- id: 用户唯一标识
- created_at: 创建时间

### training_sessions 表
- id: 训练会话ID
- user_id: 用户ID
- mode: 训练模式（1或2）
- symbol: 交易标的
- timeframe: 时间周期
- start_time: 开始时间
- end_time: 结束时间
- user_choice: 用户选择
- actual_result: 实际结果
- score: 得分
- is_wrong: 是否错误

## 开发说明

### 模式2实现特点
- 使用TradingView Lightweight Charts展示K线图
- 模拟生成真实的K线数据
- 10秒倒计时机制
- 三种预测选项：上涨(>5%)、下跌(<-5%)、震荡(-5%~5%)
- 完整的游戏流程：等待→游戏→结果→下一题→完成
- 实时统计：当前轮次、总分、正确率、正确数

### 得分计算规则
- 上涨(>5%): 100分
- 下跌(<-5%): 0分
- 震荡(-5%~5%): 线性插值计算

## 部署

### 构建生产版本
```bash
npm run build
```

### 部署到生产环境
将 `build/` 目录部署到您的Web服务器或CDN。

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请提交 Issue 或联系开发团队。
