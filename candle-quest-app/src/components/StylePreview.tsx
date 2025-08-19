import React from 'react';
import '../styles/mode2.css';

const StylePreview: React.FC = () => {
  return (
    <div className="min-h-screen gradient-bg p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 标题 */}
        <div className="text-center">
          <h1 className="text-5xl font-bold gradient-text mb-4">🎨 样式预览</h1>
          <p className="text-xl text-gray-600">展示所有新定义的样式类和效果</p>
        </div>

        {/* 卡片样式 */}
        <div className="game-card p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">📋 卡片样式</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="stat-card text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">统计卡片</div>
              <div className="text-sm text-gray-600">stat-card 样式</div>
            </div>
            <div className="result-card text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">结果卡片</div>
              <div className="text-sm text-gray-600">result-card 样式</div>
            </div>
            <div className="price-change text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">价格卡片</div>
              <div className="text-sm text-gray-600">price-change 样式</div>
            </div>
          </div>
        </div>

        {/* 按钮样式 */}
        <div className="game-card p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">🔘 按钮样式</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary">主要按钮</button>
              <button className="btn-success">成功按钮</button>
              <button className="btn-danger">危险按钮</button>
              <button className="btn-secondary">次要按钮</button>
            </div>
            <div className="button-group">
              <button className="choice-btn choice-btn-up">📈 上涨</button>
              <button className="choice-btn choice-btn-down">📉 下跌</button>
              <button className="choice-btn choice-btn-sideways">↔️ 震荡</button>
            </div>
          </div>
        </div>

        {/* 倒计时样式 */}
        <div className="game-card p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">⏰ 倒计时样式</h2>
          <div className="text-center space-y-4">
            <div className="countdown countdown-normal">倒计时: 10s</div>
            <div className="countdown countdown-warning">倒计时: 5s</div>
            <div className="countdown countdown-urgent">倒计时: 2s</div>
          </div>
        </div>

        {/* 动画效果 */}
        <div className="game-card p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">✨ 动画效果</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="fade-in bg-blue-100 p-6 rounded-lg text-center">
              <div className="text-lg font-semibold">淡入动画</div>
              <div className="text-sm text-gray-600">fade-in 类</div>
            </div>
            <div className="slide-up bg-green-100 p-6 rounded-lg text-center">
              <div className="text-lg font-semibold">滑动动画</div>
              <div className="text-sm text-gray-600">slide-up 类</div>
            </div>
            <div className="bounce-in bg-purple-100 p-6 rounded-lg text-center">
              <div className="text-lg font-semibold">弹跳动画</div>
              <div className="text-sm text-gray-600">bounce-in 类</div>
            </div>
          </div>
        </div>

        {/* 特殊效果 */}
        <div className="game-card p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">🌟 特殊效果</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-lg text-center">
              <div className="text-lg font-semibold">玻璃拟态</div>
              <div className="text-sm text-gray-600">glass 类</div>
            </div>
            <div className="neon-border p-6 rounded-lg text-center bg-white">
              <div className="text-lg font-semibold">霓虹边框</div>
              <div className="text-sm text-gray-600">neon-border 类</div>
            </div>
          </div>
        </div>

        {/* 响应式网格 */}
        <div className="game-card p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">📱 响应式网格</h2>
          <div className="stats-grid">
            <div className="stat-card text-center">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <div className="text-sm text-gray-600">stats-grid</div>
            </div>
            <div className="stat-card text-center">
              <div className="text-2xl font-bold text-green-600">2</div>
              <div className="text-sm text-gray-600">响应式</div>
            </div>
            <div className="stat-card text-center">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-gray-600">网格</div>
            </div>
            <div className="stat-card text-center">
              <div className="text-2xl font-bold text-orange-600">4</div>
              <div className="text-sm text-gray-600">系统</div>
            </div>
          </div>
        </div>

        {/* 游戏结束样式 */}
        <div className="game-complete text-center">
          <h2 className="text-3xl font-bold gradient-text mb-6">🎊 游戏完成样式</h2>
          <p className="text-lg text-gray-600 mb-6">展示游戏结束时的特殊样式效果</p>
          <div className="space-x-4">
            <button className="btn-success">再来一轮</button>
            <button className="btn-secondary">返回首页</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StylePreview;
