import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { createChart, CandlestickSeries, IChartApi, ISeriesApi } from "lightweight-charts";

// K线数据类型
interface Candlestick {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

// 组件 props
interface KLineChartProps {
  data?: Candlestick[];
  height?: number;
}

// 暴露给父组件的方法
export interface KLineChartRef {
  updateData: (data: Candlestick[]) => void;
  fitContent: () => void;
}

const KLineChart = forwardRef<KLineChartRef, KLineChartProps>(({ 
  data = [], 
  height = 400 
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      height,
      layout: {
        background: { color: "white" },
        textColor: "black",
      },
      grid: {
        vertLines: { color: "#eee" },
        horzLines: { color: "#eee" },
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    // 如果有初始数据，设置数据
    if (data.length > 0) {
      candlestickSeries.setData(data);
      chart.timeScale().fitContent();
    }

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // 容器尺寸变化时自适应宽度
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries.length) return;
      const { width } = entries[0].contentRect;
      chart.applyOptions({ width });
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [height]);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    updateData: (newData: Candlestick[]) => {
      if (candlestickSeriesRef.current) {
        candlestickSeriesRef.current.setData(newData);
      }
    },
    fitContent: () => {
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }), []);

  // 当数据变化时更新图表
  useEffect(() => {
    if (candlestickSeriesRef.current && data.length > 0) {
      candlestickSeriesRef.current.setData(data);
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [data]);

  return <div ref={containerRef} style={{ width: "100%", height }} />;
});

KLineChart.displayName = "KLineChart";

export default KLineChart;
