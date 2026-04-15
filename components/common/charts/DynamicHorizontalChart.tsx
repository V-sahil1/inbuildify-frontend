import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Select } from 'antd';
import { themeContext } from 'contexts/ThemeContext';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DynamicHorizontalChartProps {
  title: string;
  /** Used in chart series + tooltips; keep short to avoid crowded tooltips */
  seriesName?: string;
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
  horizontal?: boolean;
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

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const DynamicHorizontalChart: React.FC<DynamicHorizontalChartProps> = ({
  title,
  seriesName,
  categories,
  seriesData,
  chartType = 'bar',
  horizontal = true,
  colors,
  onBarClick,
  height = 250,
  dropdown,
}) => {
  const resolvedSeriesName = seriesName ?? title;
  const theme = useContext(themeContext);
  const isDark = theme?.isDarkMode ?? false;
  const [hoveredRadialIndex, setHoveredRadialIndex] = useState<number | null>(null);

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
    isRadialBar: chartType === 'radialBar',
    useSeriesAsArray: ['pie', 'donut'].includes(chartType || ''),
    showLegend: ['pie', 'donut', 'radar', 'polarArea'].includes(chartType || ''),
    showDataLabels: ['pie', 'donut', 'bar'].includes(chartType || ''),
    showGrid: !['pie', 'donut', 'radar', 'polarArea', 'radialBar', 'treemap', 'heatmap'].includes(
      chartType || ''
    ),
    clickEvent: ['pie', 'donut'].includes(chartType || '') ? 'dataPointSelection' : 'click',
  };

  const overallTotal = seriesData?.reduce((a, b) => a + (b || 0), 0) ?? 0;

  // Label color adapts to theme so bars remain readable in both modes
  const labelColor = isDark ? '#e0e0e0' : '#363535';
  const axisLabelColor = isDark ? '#9399a1' : '#9399a1';

  const dataMax = Math.max(0, ...(seriesData?.length ? seriesData : [0]));
  /** Horizontal bars map the numeric scale to `yaxis` in ApexCharts */
  const horizontalValueMax =
    dataMax <= 0 ? 1 : Math.max(dataMax, Math.ceil(dataMax * 1.12));

  /** Apex sometimes passes category text into numeric axis formatters — never emit NaN */
  const formatNumericAxisLabel = (v: unknown): string => {
    if (v === null || v === undefined) return '';
    const s = String(v).trim();
    if (!s) return '';
    const n = Number(s);
    if (Number.isFinite(n)) return String(Math.round(n));
    return s;
  };

  const buildTooltipContent = (
    headerTitle: string,
    statusLabel: string,
    value: string,
    dotColor: string
  ): string => {
    const headerBg = isDark ? '#2d2d2d' : '#ececec';
    const headerFg = isDark ? '#f0f0f0' : '#1f1f1f';
    const bodyBg = isDark ? '#1f1f1f' : '#ffffff';
    const bodyFg = isDark ? '#e8e8e8' : '#262626';
    const border = isDark ? '#404040' : '#e0e0e0';

    return `
      <div class="apex-cust-tt" style="border-radius:6px;overflow:hidden;border:1px solid ${border};box-shadow:0 4px 14px rgba(0,0,0,.14);min-width:132px;max-width:min(320px,88vw);">
        <div style="padding:6px 10px;font-size:12px;font-weight:600;background:${headerBg};color:${headerFg};line-height:1.35;word-break:break-word;">
          ${escapeHtml(String(headerTitle))}
        </div>
        <div style="padding:8px 10px;font-size:12px;color:${bodyFg};background:${bodyBg};line-height:1.35;display:flex;flex-direction:row;align-items:center;gap:8px;word-break:break-word;">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:10px;height:10px;border-radius:9999px;background:${dotColor};flex:0 0 auto;line-height:0;align-self:center;"></span>
          <span style="display:flex;align-items:center;gap:4px;min-width:0;">
            <strong style="font-weight:600;">${escapeHtml(statusLabel)}</strong><span>:</span><span>${escapeHtml(value)}</span>
          </span>
        </div>
      </div>
    `;
  };

  const buildOptions = (): ApexOptions => ({
    chart: {
      type: chartType || 'bar',
      height,
      toolbar: { show: false },
      background: 'transparent',
      foreColor: axisLabelColor,
      events: {
        click: (_event: any, _chartContext: any, config: any) => {
          if (config.dataPointIndex !== undefined && config.dataPointIndex >= 0 && onBarClick) {
            onBarClick(categories[config.dataPointIndex]);
          }
        },
        ...(chartConfig.isRadialBar && {
          dataPointMouseEnter: (_event: any, _chartContext: any, config: any) => {
            if (config?.dataPointIndex !== undefined && config.dataPointIndex >= 0) {
              setHoveredRadialIndex(config.dataPointIndex);
            }
          },
          dataPointMouseLeave: () => {
            setHoveredRadialIndex(null);
          },
          mouseLeave: () => {
            setHoveredRadialIndex(null);
          },
        }),
        ...(chartConfig.clickEvent === 'dataPointSelection' && {
          dataPointSelection: (_event: any, _chartContext: any, config: any) => {
            if (config.dataPointIndex !== undefined && onBarClick) {
              onBarClick(categories[config.dataPointIndex]);
            }
          },
        }),
      },
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    ...(chartConfig.isPieOrDonut
      ? {
          labels: categories,
          legend: {
            show: chartConfig.showLegend,
            position: 'bottom' as const,
            horizontalAlign: 'center' as const,
            fontSize: '12px',
            itemMargin: { horizontal: 8, vertical: 4 },
            labels: { colors: axisLabelColor },
          },
          dataLabels: {
            enabled: chartConfig.showDataLabels,
            style: { fontSize: '11px' },
            dropShadow: { enabled: false },
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: chartType === 'donut',
                  total: {
                    show: chartType === 'donut',
                    label: 'Total',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: axisLabelColor,
                  },
                  value: {
                    fontSize: '20px',
                    fontWeight: 700,
                    color: labelColor,
                  },
                },
              },
            },
          },
        }
      : chartType === 'radialBar'
        ? {
            labels: categories,
            plotOptions: {
              radialBar: {
                hollow: { size: '30%' },
                dataLabels: {
                  show: true,
                  name: {
                    show: true,
                    fontSize: '11px',
                    color: axisLabelColor,
                    offsetY: -6,
                  },
                  value: {
                    show: true,
                    fontSize: '14px',
                    fontWeight: 700,
                    color: labelColor,
                    offsetY: 8,
                    formatter: (_val: number) => {
                      if (hoveredRadialIndex !== null) {
                        return String(seriesData[hoveredRadialIndex] ?? 0);
                      }
                      return String(overallTotal);
                    },
                  },
                  total: {
                    show: true,
                    label: 'Total',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: axisLabelColor,
                    formatter: () => String(overallTotal),
                  },
                },
              },
            },
            legend: {
              show: true,
              position: 'bottom' as const,
              horizontalAlign: 'center' as const,
              fontSize: '12px',
              itemMargin: { horizontal: 8, vertical: 4 },
              labels: { colors: axisLabelColor },
            },
          }
      : chartConfig.isBar
        ? {
            plotOptions: {
              bar: {
                horizontal: horizontal || false,
                barHeight: '70%',
                distributed: true,
                borderRadius: 4,
                dataLabels: { position: horizontal ? 'end' : 'center' },
              },
            },
            dataLabels: {
              enabled: chartConfig.showDataLabels,
              textAnchor: horizontal ? 'start' : 'middle',
              style: { colors: [labelColor], fontSize: '12px', fontWeight: 'normal' },
              formatter: (_val: any, opt: any) => {
                const n = seriesData[opt.dataPointIndex];
                if (n == null || n === 0) return '';
                return String(n);
              },
              offsetX: horizontal ? 6 : 0,
              offsetY: horizontal ? 0 : 0,
            },
            xaxis: {
              categories,
              labels: {
                show: chartType === 'bar',
                style: { colors: labelColor, fontSize: '11px' },
                formatter: (value: string) => (value != null ? String(value) : ''),
              },
              axisBorder: { show: false },
              axisTicks: { show: false },
            },
            yaxis:
              horizontal && chartConfig.isBar
                ? {
                    min: 0,
                    max: horizontalValueMax,
                    decimalsInFloat: 0,
                    labels: {
                      show: true,
                      formatter: formatNumericAxisLabel,
                      style: { colors: axisLabelColor },
                    },
                  }
                : { labels: { show: false } },
            grid: {
              show: chartConfig.showGrid,
              borderColor: isDark ? '#374151' : '#e5e7eb',
            },
            legend: { show: chartConfig.isRadar || chartConfig.isPolar },
          }
        : {
            dataLabels: {
              enabled: chartConfig.showDataLabels,
              textAnchor: 'start',
              style: { colors: [labelColor], fontSize: '12px', fontWeight: 'normal' },
              formatter: (_val: any, opt: any) => categories[opt.dataPointIndex],
              offsetX: 10,
            },
            xaxis: {
              categories,
              labels: { show: chartType === 'bar', style: { colors: axisLabelColor } },
              axisBorder: { show: false },
              axisTicks: { show: false },
            },
            yaxis: { labels: { show: false } },
            grid: {
              show: chartConfig.showGrid,
              borderColor: isDark ? '#374151' : '#e5e7eb',
            },
            legend: { show: chartConfig.isRadar || chartConfig.isPolar },
          }),
    colors: chartColors,
    tooltip: {
      enabled: true,
      theme: isDark ? 'dark' : 'light',
      style: { fontSize: '12px' },
      shared: false,
      intersect: true,
      x: { show: false },
      ...(chartConfig.isBar
        ? {
            custom: (opts: {
              series: number[][];
              seriesIndex: number;
              dataPointIndex: number;
              w?: unknown;
            }) => {
              const { series, seriesIndex, dataPointIndex } = opts;
              const cat = categories[dataPointIndex] ?? '';
              const raw = series?.[seriesIndex]?.[dataPointIndex] as unknown;
              const count = formatNumericAxisLabel(raw);
              const dot = chartColors[dataPointIndex % chartColors.length] ?? '#1890ff';
              return buildTooltipContent(title, cat, count, dot);
            },
          }
        : {}),
      ...((chartConfig.isPieOrDonut || chartConfig.isRadialBar)
        ? {
            custom: (opts: {
              series: number[][];
              seriesIndex: number;
              dataPointIndex: number;
              w?: unknown;
            }) => {
              const idx = opts.dataPointIndex >= 0 ? opts.dataPointIndex : opts.seriesIndex;
              const label = categories[idx] ?? resolvedSeriesName;
              const raw =
                chartConfig.isRadialBar
                  ? (seriesData[idx] as unknown)
                  : ((opts.series?.[0]?.[idx] ?? seriesData[idx]) as unknown);
              const count = formatNumericAxisLabel(raw);
              const dot = chartColors[idx % chartColors.length] ?? '#1890ff';
              return buildTooltipContent(title, label, count, dot);
            },
          }
        : {}),
    },
  });

  const buildSeries = () => {
    if (chartConfig.useSeriesAsArray || chartConfig.isRadialBar) return seriesData;
    return [{ name: resolvedSeriesName, data: seriesData }];
  };

  const [chartData, setChartData] = useState<{
    series: { name: string; data: number[] }[] | number[];
    options: ApexOptions;
  }>({
    series: buildSeries(),
    options: buildOptions(),
  });

  // Re-build options whenever theme, data, or categories change
  useEffect(() => {
    setChartData({
      series: buildSeries(),
      options: buildOptions(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesData, categories, isDark, title, resolvedSeriesName, horizontal, hoveredRadialIndex]);

  return (
    <div
      className="dynamic-h-chart p-4 rounded-lg min-w-0"
      style={{ backgroundColor: 'var(--card-color)' }}
    >
      {/* Header row */}
      <div className="flex flex-wrap justify-between items-start gap-2 mb-3 min-w-0">
        <h3
          className="text-base font-semibold leading-snug min-w-0 flex-1 break-words pr-2"
          style={{ color: 'var(--font-color)' }}
        >
          {title}
        </h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
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
            <div className="flex flex-wrap gap-x-3 gap-y-1 min-w-0 max-w-full">
              {categories.map((cat, idx) => (
                <div key={cat} className="flex items-start gap-1.5 min-w-0 max-w-[200px] sm:max-w-[220px]">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: chartColors[idx] }}
                  />
                  <span
                    className="text-xs leading-snug break-words"
                    style={{ color: 'var(--font-color-100)' }}
                  >
                    {cat}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {typeof window !== 'undefined' && (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type={chartType}
          height={height}
        />
      )}

      <style jsx global>{`
        .dynamic-h-chart .apexcharts-tooltip {
          max-width: min(280px, 90vw);
          white-space: normal !important;
        }
        .dynamic-h-chart .apex-cust-tt {
          width: fit-content;
          max-width: min(320px, 88vw);
        }
        .dynamic-h-chart .apexcharts-tooltip-series-group {
          display: flex !important;
          padding: 6px 10px !important;
          align-items: center !important;
        }
        .dynamic-h-chart .apexcharts-tooltip-marker {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-shrink: 0 !important;
          align-self: center !important;
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }
        .dynamic-h-chart .apexcharts-tooltip-y-group {
          align-items: center !important;
          gap: 6px !important;
        }
        .dynamic-h-chart .apexcharts-tooltip-text,
        .dynamic-h-chart .apexcharts-tooltip-text-y-value,
        .dynamic-h-chart .apexcharts-tooltip-text-y-label {
          word-break: break-word !important;
          white-space: normal !important;
          font-size: 12px !important;
        }
        @media (max-width: 640px) {
          .dynamic-h-chart .apexcharts-tooltip {
            max-width: min(240px, 88vw);
          }
          .dynamic-h-chart .apexcharts-tooltip-text,
          .dynamic-h-chart .apexcharts-tooltip-text-y-value,
          .dynamic-h-chart .apexcharts-tooltip-text-y-label {
            font-size: 11px !important;
            line-height: 1.3 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DynamicHorizontalChart;
