import React, { useState, useMemo } from 'react';
import { Button, Popover, Radio, Switch } from 'antd';
import {
  IconDownload,
  IconFilter,
  IconSettings,
  IconDots,
  IconArrowsDiagonalMinimize2,
  IconArrowsDiagonal,
  IconPlus,
  IconEqual,
  IconEqualNot,
} from '@tabler/icons-react';
import { CustomBulkSelect } from '@/components/common/CustomBulkSelect';
import { useWorkflowStatusColumns } from '@/components/table-columns/WorkflowStatusReportColumns';
import CustomizeColumnDrawer from '@/components/workflowstatus/customizeColumnDrawer';

interface WorkflowStatusHeaderProps {
  onChartToggle?: (isMinimized: boolean) => void;
  dataLength: number;
  columnVisibility: Record<string, boolean>;
  columnWidths: Record<string, string>;
  onChangeColumnVisibility: (key: string, visible: boolean) => void;
  onChangeColumnWidth: (key: string, width: string) => void;
  onExport?: () => void;
}

const WorkflowStatusHeader: React.FC<WorkflowStatusHeaderProps> = ({
  onChartToggle,
  dataLength,
  columnVisibility,
  columnWidths,
  onChangeColumnVisibility,
  onChangeColumnWidth,
  onExport,
}) => {
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [selectedStatusFilters, setSelectedStatusFilters] = useState<string[]>([]);
  const [isChartMinimized, setIsChartMinimized] = useState(false);
  const [isCustomizeDrawerOpen, setIsCustomizeDrawerOpen] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [moreOptions, setMoreOptions] = useState({
    cancelled: false,
    archived: false,
    completed: false,
    workflowCompleted: false,
  });

  const { columns: allColumns } = useWorkflowStatusColumns();

  const moreOptionConfig: {
    key: 'cancelled' | 'archived' | 'completed' | 'workflowCompleted';
    label: string;
  }[] = [
    { key: 'cancelled', label: 'Include Cancelled Jobs' },
    { key: 'archived', label: 'Include Archived Jobs' },
    { key: 'completed', label: 'Include Completed Jobs' },
    { key: 'workflowCompleted', label: 'Include Workflow Completed Jobs' },
  ];

  const statusOptions = useMemo(
    () => [
      { label: 'Yet to start', value: 'yet_to_start' },
      { label: 'InProgress', value: 'in_progress' },
      { label: 'Completed', value: 'completed' },
      { label: 'Skipped', value: 'skipped' },
      { label: 'Not Applicable', value: 'not_applicable' },
      { label: 'Rejected', value: 'rejected' },
    ],
    []
  );

  const columnOptions = useMemo(() => {
    return allColumns
      .filter(col => col.title && col.dataIndex && typeof col.title === 'string')
      .map(col => ({
        label: col.title as string,
        value: col.dataIndex as string,
      }));
  }, [allColumns]);

  const handleToggleChart = () => {
    const newState = !isChartMinimized;
    setIsChartMinimized(newState);
    onChartToggle?.(newState);
  };

  const handleMoreOptionChange = (
    actionType: 'cancelled' | 'archived' | 'completed' | 'workflowCompleted',
    value: boolean
  ) => {
    setMoreOptions(prev => ({
      ...prev,
      [actionType]: value,
    }));
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="text-md md:text-2xl font-bold">Workflow Status Report</div>
      <div className="flex justify-between items-center gap-2">
        <Button type="primary">Total Records {dataLength}</Button>
        <Popover
          trigger="click"
          open={showColumnSelector}
          onOpenChange={setShowColumnSelector}
          content={
            <div className="w-[850px] p-4">
              <div className="flex gap-4">
                <div className="w-[35%] min-w-[35%]">
                  <div className="font-medium text-gray-700 mb-2">Tasks</div>
                  <CustomBulkSelect
                    value={selectedColumns}
                    onChange={setSelectedColumns}
                    options={columnOptions}
                    className="w-full"
                    placeholder="select task"
                  />
                </div>
                <div className="w-[35%] min-w-[35%]">
                  <div className="font-medium text-gray-700 mb-2">Status</div>
                  <CustomBulkSelect
                    value={selectedStatusFilters}
                    onChange={setSelectedStatusFilters}
                    options={statusOptions}
                    className="w-full"
                    placeholder="select status"
                  />
                </div>
                <div className="w-[30%] flex justify-between ">
                  <Radio.Group defaultValue="equal">
                    <Radio.Button value="equal">
                      <IconEqual />
                    </Radio.Button>
                    <Radio.Button value="notequal">
                      <IconEqualNot />
                    </Radio.Button>
                  </Radio.Group>
                  <Button icon={<IconPlus size={20} />} />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4 pt-3 border-t">
                <Button
                  onClick={() => {
                    setSelectedColumns([]);
                    setSelectedStatusFilters([]);
                  }}
                >
                  Clear Filter
                </Button>
                <Button onClick={() => {}} type="primary">
                  Apply Filter
                </Button>
              </div>
            </div>
          }
          placement="bottomRight"
        >
          <Button
            icon={<IconFilter size={22} />}
            className={
              selectedColumns.length < columnOptions.length || selectedStatusFilters.length > 0
                ? 'bg-blue-50 text-blue-600'
                : ''
            }
          />
        </Popover>
        <Button icon={<IconDownload size={25} />} onClick={onExport} />
        <Button
          icon={
            isChartMinimized ? (
              <IconArrowsDiagonal size={25} />
            ) : (
              <IconArrowsDiagonalMinimize2 size={25} />
            )
          }
          onClick={handleToggleChart}
        />
        <Popover
          trigger="click"
          open={showMoreOptions}
          onOpenChange={setShowMoreOptions}
          placement="bottomRight"
          content={
            <div className="w-72 py-2">
              {moreOptionConfig.map(option => (
                <div key={option.key} className="flex items-center justify-between px-2 py-1">
                  <Switch
                    size="small"
                    checked={moreOptions[option.key]}
                    onChange={checked => handleMoreOptionChange(option.key, checked)}
                  />
                  <span className="text-sm ml-3 flex-1">{option.label}</span>
                </div>
              ))}
            </div>
          }
        >
          <Button icon={<IconDots size={25} />} />
        </Popover>
        <Button icon={<IconSettings size={22} />} onClick={() => setIsCustomizeDrawerOpen(true)} />
      </div>
      <CustomizeColumnDrawer
        open={isCustomizeDrawerOpen}
        onClose={() => setIsCustomizeDrawerOpen(false)}
        visibleMap={columnVisibility}
        widthMap={columnWidths}
        onToggleColumn={onChangeColumnVisibility}
        onChangeWidth={onChangeColumnWidth}
      />
    </div>
  );
};

export default WorkflowStatusHeader;
