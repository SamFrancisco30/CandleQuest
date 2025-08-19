# CandleQuest 项目开发总结

## 项目概述

CandleQuest是一个基于React和TypeScript的盘感训练应用，专注于"模式2：快速选择题模式"的开发。该模式旨在通过快速判断K线走势来培养用户的交易盘感。

## 已完成功能

### ✅ 核心游戏逻辑
- **10秒倒计时机制**：用户必须在10秒内做出判断，超时自动选择震荡
- **三种预测选项**：上涨(>5%)、下跌(<-5%)、震荡(-5%~5%)
- **完整的游戏流程**：等待→游戏→结果→下一题→完成
- **10轮游戏机制**：每轮独立计分，最终统计总成绩

### ✅ 用户系统
- **免登录设计**：使用UUID自动生成用户ID
- **本地存储**：用户ID保存在localStorage中
- **Supabase集成**：训练记录自动保存到数据库

### ✅ 得分系统
- **精确计算**：基于价格变化百分比计算得分
- **线性插值**：震荡区间使用线性插值计算得分
- **实时统计**：显示当前轮次、总分、正确率、正确数

### ✅ 用户体验
- **响应式设计**：支持移动端、平板和桌面设备
- **加载状态**：显示加载动画和错误处理
- **错误边界**：捕获并优雅处理应用错误
- **美观UI**：使用Tailwind CSS构建现代化界面

### ✅ 数据管理
- **模拟K线数据**：生成真实的K线数据用于训练
- **训练记录**：完整保存每次训练的结果
- **错题标记**：自动标记错误预测，支持错题本功能

## 技术架构

### 前端技术栈
- **React 19.1.1**：现代React框架，支持最新特性
- **TypeScript 4.9.5**：类型安全的JavaScript开发
- **Tailwind CSS 3.4.17**：实用优先的CSS框架
- **Create React App**：零配置的React开发环境

### 后端服务
- **Supabase**：开源的Firebase替代方案
- **PostgreSQL**：强大的关系型数据库
- **实时API**：支持实时数据同步

### 组件结构
```
src/
├── components/
│   ├── ErrorBoundary.tsx    # 错误边界组件
│   └── LoadingSpinner.tsx   # 加载状态组件
├── hooks/
│   └── useUser.ts           # 用户管理Hook
├── lib/
│   └── supabaseClient.ts    # Supabase客户端
├── pages/
│   └── Mode2.tsx            # 模式2主组件
└── App.tsx                  # 主应用组件
```

## 核心算法

### K线数据生成
```typescript
function generateFakeCandlestickData(count: number = 30): Candlestick[] {
  const data: Candlestick[] = [];
  let basePrice = 100 + Math.random() * 20;
  let currentTime = Date.now() - count * 24 * 3600 * 1000;

  for (let i = 0; i < count; i++) {
    const volatility = 0.02; // 2%波动率
    const change = (Math.random() - 0.5) * volatility;
    const open = basePrice;
    const close = basePrice * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);

    data.push({ time: currentTime + i * 24 * 3600 * 1000, open, high, low, close });
    basePrice = close;
  }

  return data;
}
```

### 得分计算
```typescript
function calculateScore(data: Candlestick[]): number {
  const startPrice = data[0].close;
  const endPrice = data[data.length - 1].close;
  const changePercent = ((endPrice - startPrice) / startPrice) * 100;

  if (changePercent > 5) return 100;      // 上涨
  if (changePercent < -5) return 0;       // 下跌
  
  // 震荡区间线性插值
  return Math.max(0, Math.min(100, 50 + (changePercent / 5) * 50));
}
```

## 数据库设计

### users 表
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### training_sessions 表
```sql
CREATE TABLE training_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  mode INTEGER NOT NULL,
  symbol TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  user_choice TEXT NOT NULL,
  actual_result TEXT NOT NULL,
  score INTEGER NOT NULL,
  is_wrong BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 部署说明

### 环境要求
- Node.js 16+ 
- npm 或 yarn
- 现代浏览器支持

### 快速启动
1. **Windows用户**：双击 `start.bat`
2. **Linux/Mac用户**：运行 `./start.sh`
3. **手动启动**：
   ```bash
   npm install
   npm start
   ```

### 环境配置
创建 `.env.local` 文件：
```bash
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 未来扩展

### 短期目标
- [ ] 集成真实的股票数据API
- [ ] 添加更多的时间周期选项
- [ ] 实现K线图可视化（修复lightweight-charts集成）

### 中期目标
- [ ] 开发模式1：模拟实盘模式
- [ ] 实现错题本功能
- [ ] 添加用户排行榜

### 长期目标
- [ ] 移动端应用开发
- [ ] 社交功能集成
- [ ] AI辅助分析功能

## 开发心得

### 技术挑战
1. **lightweight-charts集成**：v5版本API变化较大，需要深入研究文档
2. **类型安全**：TypeScript类型定义需要精确匹配API
3. **状态管理**：复杂的游戏状态需要合理设计

### 解决方案
1. **渐进式开发**：先实现核心逻辑，再添加复杂功能
2. **错误处理**：完善的错误边界和用户友好的错误提示
3. **组件化设计**：可复用的组件和清晰的代码结构

### 最佳实践
1. **响应式设计**：使用Tailwind CSS的响应式类
2. **性能优化**：合理的useEffect依赖和useCallback优化
3. **用户体验**：加载状态、错误处理和清晰的反馈

## 总结

CandleQuest的模式2已经成功实现，具备了完整的游戏逻辑、用户系统和数据管理功能。虽然K线图可视化功能暂时简化，但核心的游戏体验和训练功能已经完全可用。

项目采用了现代化的技术栈和最佳实践，代码结构清晰，易于维护和扩展。为后续开发模式1和其他功能奠定了坚实的基础。

