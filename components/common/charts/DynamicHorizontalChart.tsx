import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Select } from 'antd';

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
  dropdown?: {
    options: { label: string; value: string }[];
    onSelect?: (value: string) => void;
    placeholder?: string;
    defaultValue?: string;
  };
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
  dropdown,
}) => {
  const chartColors =
    colors && colors.length >= categories.length
      ? colors
      : categories.map((_, idx) => defaultColors[idx % defaultColors.length]);

  const chartConfig = {
    isPieOrDonut: ['pie', 'donut'].includes(chartType || ''),
    isBar: chartType === 'bar',
    isLineOrArea: ['line', 'area'].includes(chartType || ''),
    isRadar: chartType === 'radar',
    isPolar: chartType === 'polarArea',
    useSeriesAsArray: ['pie', 'donut'].includes(chartType || ''),
    showLegend: ['pie', 'donut', 'radar', 'polarArea'].includes(chartType || ''),
    showDataLabels: ['pie', 'donut', 'bar'].includes(chartType || ''),
    showGrid: !['pie', 'donut', 'radar', 'polarArea', 'radialBar', 'treemap', 'heatmap'].includes(
      chartType || ''
    ),
    clickEvent: ['pie', 'donut'].includes(chartType || '') ? 'dataPointSelection' : 'click',
  };

  const [chartData, setChartData] = useState<{
    series: { name: string; data: number[] }[] | number[];
    options: ApexOptions;
  }>({
    series: chartConfig.useSeriesAsArray ? seriesData : [{ name: title, data: seriesData }],
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
          ...(chartConfig.clickEvent === 'dataPointSelection' && {
            dataPointSelection: (_event: any, _chartContext: any, config: any) => {
              if (config.dataPointIndex !== undefined && onBarClick) {
                onBarClick(categories[config.dataPointIndex]);
              }
            },
          }),
        },
        // Only pass horizontal for bar charts
        ...(chartType === 'bar' ? { horizontal } : {}),
      },
      ...(chartConfig.isPieOrDonut
        ? {
            labels: categories,
            legend: { show: chartConfig.showLegend, position: 'right' },
            dataLabels: { enabled: chartConfig.showDataLabels },
          }
        : {
            plotOptions: {
              bar: chartConfig.isBar
                ? {
                    horizontal,
                    barHeight: '70%',
                    distributed: true,
                    borderRadius: 4,
                    dataLabels: { position: 'top' },
                  }
                : undefined,
            },
            dataLabels: {
              enabled: chartConfig.showDataLabels,
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
            grid: { show: chartConfig.showGrid },
            legend: { show: chartConfig.isRadar || chartConfig.isPolar },
          }),
      colors: chartColors,
      tooltip: { enabled: true },
    },
  });

  useEffect(() => {
    setChartData(prev => ({
      ...prev,
      series: chartConfig.useSeriesAsArray ? seriesData : [{ name: title, data: seriesData }],
      options: {
        ...prev.options,
        ...(chartConfig.isPieOrDonut
          ? { labels: categories }
          : { xaxis: { ...prev.options.xaxis, categories } }),
      },
    }));
  }, [seriesData, categories, chartConfig.useSeriesAsArray, chartConfig.isPieOrDonut, title]);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center space-x-4">
          {dropdown && (
            <Select
              placeholder={dropdown.placeholder || 'Select an option'}
              style={{ width: 150 }}
              options={dropdown.options}
              onChange={dropdown.onSelect}
              allowClear
            />
          )}
          {chartConfig.isBar && (
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
