import React from 'react';
import './App.css';
import Mode2 from "./pages/Mode2";
import ErrorBoundary from "./components/ErrorBoundary";
import KLineChart from './pages/KlineChart';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* 顶部导航 */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">🕯️ CandleQuest</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">盘感训练应用</span>
              </div>
            </div>
          </div>
        </nav>

        {/* 主内容区域 */}
        <main className="py-6">
          <Mode2 />
          {/* <KLineChart /> */}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
