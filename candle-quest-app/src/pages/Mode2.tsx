import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../hooks/useUser";
import LoadingSpinner from "../components/LoadingSpinner";
import KLineChart, { KLineChartRef } from "./KlineChart";

// K线数据类型
interface Candlestick {
  time: string; // 使用日期字符串格式，如 "2024-01-01"
  open: number;
  high: number;
  low: number;
  close: number;
}

// 游戏状态类型
type GameState = "waiting" | "playing" | "result" | "finished";

// 用户选择类型
type UserChoice = "up" | "down" | "sideways";

// 结果类型
type Result = "up" | "down" | "sideways";

// 生成模拟K线数据
function generateFakeCandlestickData(count: number = 50): Candlestick[] {
  const data: Candlestick[] = [];
  let basePrice = 100 + Math.random() * 20;
  
  // 生成过去的数据，使用日期字符串格式
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - count);

  for (let i = 0; i < count; i++) {
    const volatility = 0.02; // 2%波动率
    const change = (Math.random() - 0.5) * volatility;
    const open = basePrice;
    const close = basePrice * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);

    // 生成日期字符串，格式：YYYY-MM-DD
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const timeString = currentDate.toISOString().split('T')[0];
    
    data.push({
      time: timeString,
      open,
      high,
      low,
      close,
    });

    basePrice = close;
  }

  console.log('生成模拟数据:', { count, firstTime: data[0]?.time, lastTime: data[data.length - 1]?.time });
  return data;
}

// 计算结果
function calculateResult(data: Candlestick[]): Result {
  const startPrice = data[0].close;
  const endPrice = data[data.length - 1].close;
  const changePercent = ((endPrice - startPrice) / startPrice) * 100;

  if (changePercent > 5) return "up";
  if (changePercent < -5) return "down";
  return "sideways";
}

// 计算得分
function calculateScore(data: Candlestick[]): number {
  const startPrice = data[0].close;
  const endPrice = data[data.length - 1].close;
  const changePercent = ((endPrice - startPrice) / startPrice) * 100;

  if (changePercent > 5) return 100;
  if (changePercent < -5) return 0;

  // 线性插值：-5%到5%之间
  return Math.max(0, Math.min(100, 50 + (changePercent / 5) * 50));
}

export default function Mode2() {
  const userId = useUser();
  const chartRef = useRef<KLineChartRef>(null);

  const [gameState, setGameState] = useState<GameState>("waiting");
  const [countdown, setCountdown] = useState(10);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(10);
  const [candlestickData, setCandlestickData] = useState<Candlestick[]>([]);
  const [displayData, setDisplayData] = useState<Candlestick[]>([]);
  const [userChoice, setUserChoice] = useState<UserChoice | null>(null);
  const [actualResult, setActualResult] = useState<Result | null>(null);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 开始新游戏
  const startNewGame = useCallback(() => {
    try {
      console.log('开始新游戏');

      const data = generateFakeCandlestickData(30); // 30根K线
      setCandlestickData(data);
      
      // 只显示前25根K线，隐藏最后5根
      const display = data.slice(0, -5);
      setDisplayData(display);
      
      setGameState("playing");
      setCountdown(10);
      setUserChoice(null);
      setActualResult(null);
      setScore(0);
      setShowNextButton(false);
      setError(null);
    } catch (err) {
      setError("游戏初始化失败，请刷新页面重试");
      console.error("游戏初始化错误:", err);
    }
  }, []);

  // 初始化游戏
  useEffect(() => {
    if (userId) {
      startNewGame();
    }
  }, [userId, startNewGame]);

  // 倒计时逻辑
  useEffect(() => {
    if (gameState !== "playing" || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // 时间到，自动选择
          if (!userChoice) {
            handleAnswer("sideways");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, countdown, userChoice]);

  // 处理用户答案
  const handleAnswer = async (choice: UserChoice) => {
    if (gameState !== "playing" || userChoice) return;

    setIsLoading(true);
    setError(null);

    try {
      setUserChoice(choice);
      setGameState("result");

      // 计算实际结果
      const result = calculateResult(candlestickData);
      setActualResult(result);

      // 计算得分
      const roundScore = calculateScore(candlestickData);
      setScore(roundScore);
      setTotalScore((prev) => prev + roundScore);

      // 判断是否正确
      const isCorrect = choice === result;
      if (isCorrect) {
        setCorrectAnswers((prev) => prev + 1);
      }

      // 显示完整K线图
      setDisplayData(candlestickData);

      // 保存到Supabase
      if (userId) {
        try {
          await supabase.from("training_sessions").insert([
            {
              user_id: userId,
              mode: 2,
              symbol: "FAKE",
              timeframe: "1d",
              start_time: new Date().toISOString(),
              end_time: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
              user_choice: choice,
              actual_result: result,
              score: roundScore,
              is_wrong: !isCorrect,
            },
          ]);
        } catch (error) {
          console.error("保存训练记录失败:", error);
          setError("保存记录失败，但不影响游戏进行");
        }
      }

      setShowNextButton(true);
    } catch (err) {
      setError("处理答案时出现错误，请重试");
      console.error("处理答案错误:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 下一题
  const handleNext = () => {
    if (currentRound < totalRounds) {
      setCurrentRound((prev) => prev + 1);
      startNewGame();
    } else {
      setGameState("finished");
    }
  };

  // 重新开始
  const handleRestart = () => {
    setCurrentRound(1);
    setTotalScore(0);
    setCorrectAnswers(0);
    startNewGame();
  };

  // 计算正确率
  const accuracy = currentRound > 1 ? (correctAnswers / (currentRound - 1)) * 100 : 0;

  // 如果用户未加载完成，显示加载状态
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="初始化用户..." />
      </div>
    );
  }

  // 如果出现错误，显示错误信息
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">出现错误</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            刷新页面
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部信息 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">模式2：快速选择题模式</h1>
          <p className="text-gray-600 mb-4">在10秒内预测K线走势，培养快速盘感判断能力</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{currentRound}</div>
              <div className="text-sm text-gray-500">当前轮次</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">{totalScore}</div>
              <div className="text-sm text-gray-500">总分</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">{accuracy.toFixed(1)}%</div>
              <div className="text-sm text-gray-500">正确率</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">{correctAnswers}</div>
              <div className="text-sm text-gray-500">正确数</div>
            </div>
          </div>
        </div>

        {/* 游戏区域 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* K线图 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-700">K线走势图</h3>
            </div>
            <div className="border border-gray-200 rounded-lg">
              <KLineChart 
                ref={chartRef}
                data={displayData}
                height={400}
              />
            </div>
            {/* 调试信息 */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <div className="flex items-center space-x-4">
                  <span>数据点数: <span className="font-semibold">{displayData.length}</span></span>
                  <span>总数据点数: <span className="font-semibold">{candlestickData.length}</span></span>
                </div>
              </div>
            )}
          </div>

          {/* 倒计时 */}
          {gameState === "playing" && (
            <div className="text-center mb-6">
              <div className={`text-3xl font-bold ${countdown <= 3 ? "text-red-600" :
                countdown <= 7 ? "text-orange-500" : "text-blue-600"
                }`}>
                倒计时: {countdown}s
              </div>
              <div className="text-sm text-gray-500 mt-2">
                请快速判断未来走势
              </div>
            </div>
          )}

          {/* 选择按钮 */}
          {gameState === "playing" && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="flex-1 px-6 py-4 rounded-lg bg-green-500 text-white font-semibold text-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                onClick={() => handleAnswer("up")}
                disabled={!!userChoice || isLoading}
              >
                📈 上涨 (&gt;5%)
              </button>
              <button
                className="flex-1 px-6 py-4 rounded-lg bg-red-500 text-white font-semibold text-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                onClick={() => handleAnswer("down")}
                disabled={!!userChoice || isLoading}
              >
                📉 下跌 (&lt;-5%)
              </button>
              <button
                className="flex-1 px-6 py-4 rounded-lg bg-gray-500 text-white font-semibold text-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                onClick={() => handleAnswer("sideways")}
                disabled={!!userChoice || isLoading}
              >
                ↔️ 震荡 (-5%~5%)
              </button>
            </div>
          )}

          {/* 加载状态 */}
          {isLoading && (
            <div className="text-center py-8">
              <LoadingSpinner size="md" text="处理中..." />
            </div>
          )}

          {/* 结果展示 */}
          {gameState === "result" && !isLoading && (
            <div className="text-center mb-6">
              <div className="text-2xl font-bold mb-4">
                {userChoice === actualResult ? (
                  <span className="text-green-600">🎉 预测正确！</span>
                ) : (
                  <span className="text-red-600">❌ 预测错误</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">你的选择</div>
                  <div className="text-lg font-semibold">
                    {userChoice === "up" ? "📈 上涨" :
                      userChoice === "down" ? "📉 下跌" : "↔️ 震荡"}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">实际结果</div>
                  <div className="text-lg font-semibold">
                    {actualResult === "up" ? "📈 上涨" :
                      actualResult === "down" ? "📉 下跌" : "↔️ 震荡"}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">本轮得分</div>
                  <div className="text-lg font-semibold text-blue-600">{score}</div>
                </div>
              </div>

              {/* 价格变化信息 */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="text-sm text-gray-600 mb-2">价格变化详情</div>
                <div className="text-lg">
                  起始价格: <span className="font-semibold">${candlestickData[0]?.close.toFixed(2)}</span>
                  {" → "}
                  结束价格: <span className="font-semibold">${candlestickData[candlestickData.length - 1]?.close.toFixed(2)}</span>
                  {" "}
                  <span className={`font-semibold ${candlestickData[candlestickData.length - 1]?.close > candlestickData[0]?.close
                    ? "text-green-600" : "text-red-600"
                    }`}>
                    ({((candlestickData[candlestickData.length - 1]?.close - candlestickData[0]?.close) / candlestickData[0]?.close * 100).toFixed(2)}%)
                  </span>
                </div>
              </div>

              {showNextButton && (
                <button
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={handleNext}
                >
                  {currentRound < totalRounds ? "下一题" : "完成游戏"}
                </button>
              )}
            </div>
          )}

          {/* 游戏结束 */}
          {gameState === "finished" && (
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-4">🎊 游戏完成！</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">总得分</div>
                  <div className="text-2xl font-bold text-blue-600">{totalScore}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">正确率</div>
                  <div className="text-2xl font-bold text-green-600">{accuracy.toFixed(1)}%</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">正确数</div>
                  <div className="text-2xl font-bold text-purple-600">{correctAnswers}/{totalRounds}</div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors mr-4"
                  onClick={handleRestart}
                >
                  再来一轮
                </button>
                <button
                  className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={() => window.location.href = "/"}
                >
                  返回首页
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 游戏说明 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">游戏规则</h3>
          <div className="text-gray-600 space-y-2">
            <p>• 系统会展示一段K线走势图，你需要预测未来价格变化</p>
            <p>• 上涨：价格涨幅超过5%</p>
            <p>• 下跌：价格跌幅超过5%</p>
            <p>• 震荡：价格变化在-5%到5%之间</p>
            <p>• 每轮有10秒时间做出判断，超时自动选择震荡</p>
            <p>• 共10轮，完成后查看总成绩</p>
          </div>
        </div>
      </div>
    </div>
  );
}
