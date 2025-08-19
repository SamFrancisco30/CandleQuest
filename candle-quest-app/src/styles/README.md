# 样式文件结构说明

## 文件组织

```
src/styles/
├── index.css          # 主样式入口文件，导入所有样式
├── mode2.css          # Mode2页面专用样式
└── README.md          # 本说明文档
```

## 样式设计原则

### 1. 组件化样式
- 使用 `@layer components` 定义可复用的组件样式
- 每个样式类都有明确的用途和命名规范
- 支持状态变体（如 hover、focus、disabled）

### 2. 响应式设计
- 使用 Tailwind 的响应式前缀（sm:, md:, lg:）
- 移动优先的设计理念
- 灵活的网格系统

### 3. 动画效果
- 平滑的过渡动画（transition-all duration-200）
- 悬停效果（hover:scale-105）
- 加载和结果展示的动画

### 4. 视觉层次
- 使用渐变背景和阴影创建深度
- 一致的颜色主题
- 清晰的视觉分组

## 主要样式类

### 游戏卡片
- `.game-card` - 主要游戏区域卡片
- `.stat-card` - 统计信息卡片
- `.result-card` - 结果展示卡片

### 按钮样式
- `.btn-primary` - 主要操作按钮
- `.btn-success` - 成功操作按钮
- `.btn-danger` - 危险操作按钮
- `.btn-secondary` - 次要操作按钮
- `.choice-btn` - 选择按钮基础样式

### 状态样式
- `.countdown-urgent` - 紧急倒计时
- `.countdown-warning` - 警告倒计时
- `.countdown-normal` - 正常倒计时

### 动画效果
- `.fade-in` - 淡入动画
- `.slide-up` - 向上滑动动画
- `.bounce-in` - 弹跳进入动画

## 使用方法

1. 在组件中导入样式文件：
```tsx
import "../styles/mode2.css";
```

2. 使用预定义的样式类：
```tsx
<div className="game-card p-8">
  <h1 className="gradient-text">标题</h1>
  <button className="btn-primary">按钮</button>
</div>
```

3. 组合使用 Tailwind 类：
```tsx
<div className="game-card hover:shadow-2xl transition-all duration-300">
  {/* 内容 */}
</div>
```

## 扩展指南

### 添加新样式
1. 在对应的 CSS 文件中使用 `@layer components`
2. 使用 `@apply` 指令组合 Tailwind 类
3. 保持命名的一致性和可读性

### 自定义动画
1. 在 CSS 文件中定义 `@keyframes`
2. 使用 Tailwind 的 `animate-*` 类或自定义类名
3. 确保动画性能良好

### 主题定制
1. 在 `tailwind.config.js` 中扩展颜色和间距
2. 使用 CSS 变量定义主题色
3. 保持与现有设计的一致性
