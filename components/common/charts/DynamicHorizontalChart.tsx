import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DynamicHorizontalChartProps {
  title: string;
  categories: string[];
  seriesData: number[];
  chartType?:
    | 'area'
    | 'line'
    | 'bar'
    | 'pie'
    | 'donut'
    | 'radialBar'
    | 'scatter'
    | 'bubble'
    | 'heatmap'
    | 'candlestick'
    | 'boxPlot'
    | 'radar'
    | 'polarArea'
    | 'rangeBar'
    | 'rangeArea'
    | 'treemap';
  horizontal?: boolean; // only relevant for bar charts
  colors?: string[];
  onBarClick?: (category: string) => void;
  height?: number | string;
}

const defaultColors = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#6B7280',
  '#8B5CF6',
  '#EC4899',
  '#F97316',
  '#14B8A6',
  '#EAB308',
];

const DynamicHorizontalChart: React.FC<DynamicHorizontalChartProps> = ({
  title,
  categories,
  seriesData,
  chartType,
  horizontal = true,
  colors,
  onBarClick,
  height = 250,
}) => {
  const chartColors =
    colors && colors.length >= categories.length
      ? colors
      : categories.map((_, idx) => defaultColors[idx % defaultColors.length]);

  const [chartData, setChartData] = useState<{
    series: { name: string; data: number[] }[];
    options: ApexOptions;
  }>({
    series: [{ name: title, data: seriesData }],
    options: {
      chart: {
        type: chartType || 'bar',
        height,
        toolbar: { show: false },
        events: {
          click: (_event: any, _chartContext: any, config: any) => {
            if (config.dataPointIndex !== undefined && onBarClick) {
              onBarClick(categories[config.dataPointIndex]);
            }
          },
        },
      },
      plotOptions: {
        bar:
          chartType === 'bar'
            ? {
                horizontal,
                barHeight: '70%',
                distributed: true,
                borderRadius: 4,
                dataLabels: { position: 'top' },
              }
            : undefined,
      },
      colors: chartColors,
      dataLabels: {
        enabled: chartType === 'bar',
        textAnchor: 'start',
        style: { colors: ['#000'], fontSize: '12px', fontWeight: 'normal' },
        formatter: (_val: any, opt: any) => categories[opt.dataPointIndex],
        offsetX: 10,
      },
      xaxis: {
        categories,
        labels: { show: chartType === 'bar' },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { labels: { show: false } },
      grid: { show: false },
      tooltip: { enabled: true },
      legend: { show: false },
    },
  });

  useEffect(() => {
    setChartData(prev => ({
      ...prev,
      series: [{ ...prev.series[0], data: seriesData }],
      options: {
        ...prev.options,
        xaxis: { ...prev.options.xaxis, categories },
      },
    }));
  }, [seriesData, categories]);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {chartType === 'bar' && (
          <div className="flex space-x-2">
            {categories.map((cat, idx) => (
              <div key={cat} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: chartColors[idx] }}
                />
                <span className="text-xs text-gray-600">{cat}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {typeof window !== 'undefined' && (
        <div className="h-64">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type={chartType}
            height="100%"
          />
        </div>
      )}
    </div>
  );
};

export default DynamicHorizontalChart;
