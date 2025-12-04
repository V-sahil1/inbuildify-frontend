import React, { useMemo, useState } from 'react';
import { Drawer, Input, Switch, Typography, Space, Button } from 'antd';
import { IconSearch } from '@tabler/icons-react';
import { useWorkflowStatusColumns } from '@/components/table-columns/WorkflowStatusReportColumns';
import TimelineActionsBar, { FilterOption } from '../common/TimeLineComponents/TimelineActionsBar';

interface CustomizeColumnDrawerProps {
  open: boolean;
  onClose: () => void;
  visibleMap: Record<string, boolean>;
  widthMap: Record<string, string>;
  onToggleColumn: (key: string, visible: boolean) => void;
  onChangeWidth: (key: string, width: string) => void;
}

const CustomizeColumnDrawer: React.FC<CustomizeColumnDrawerProps> = ({
  open,
  onClose,
  visibleMap,
  widthMap,
  onToggleColumn,
  onChangeWidth,
}) => {
  const { columns } = useWorkflowStatusColumns();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabs: FilterOption[] = [
    { type: 'all', label: 'All' },
    { type: 'job_fields', label: 'Job Fields' },
    { type: 'workflow_tasks', label: 'Workflow Tasks' },
  ];

  const normalizedColumns = useMemo(
    () =>
      columns.map((col, index) => {
        let titleText = '';

        if (typeof col.title === 'string') {
          titleText = col.title;
        } else if (col.dataIndex) {
          titleText = String(col.dataIndex);
        } else {
          titleText = `Column ${index + 1}`;
        }

        return {
          key: (col.key as string) || String(col.dataIndex) || String(index),
          title: titleText,
          width: (col as any).width as number | undefined,
        };
      }),
    [columns]
  );

  const filteredColumns = useMemo(() => {
    const term = search.toLowerCase();
    let base = normalizedColumns;

    if (activeTab === 'job_fields') {
      base = normalizedColumns.slice(0, 8);
    } else if (activeTab === 'workflow_tasks') {
      base = normalizedColumns.slice(8);
    }

    if (!term) return base;
    return base.filter(col => col.title.toLowerCase().includes(term));
  }, [normalizedColumns, search, activeTab]);

  const handleToggle = (key: string, checked: boolean) => {
    onToggleColumn(key, checked);
  };

  return (
    <Drawer
      title="Customize the report columns"
      placement="right"
      width="40%"
      open={open}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4 h-full">
        <Typography.Text type="secondary">
          You can choose the columns, move columns (drag and drop), rename and resize column width
          by click on the respective data.
        </Typography.Text>
        <div className="flex items-center justify-between">
          <TimelineActionsBar
            tabs={tabs}
            defaultActiveTab={activeTab}
            onTabChange={tab => setActiveTab(tab)}
            isActionShow={false}
            isCountShow={false}
          />
          <Button type="primary">Apply to all users</Button>
        </div>

        <div className="flex justify-between text-xs font-medium text-gray-500 mt-1 mb-1">
          <Input
            prefix={<IconSearch size={16} />}
            placeholder="Search by column name"
            allowClear
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-96"
          />
          <span className="mr-6">Width (px)</span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <Space direction="vertical" className="w-full">
            {filteredColumns.map(col => {
              const enabled = visibleMap[col.key] ?? true;
              const widthValue = widthMap[col.key] ?? (col.width ? String(col.width) : '');
              return (
                <div
                  key={col.key}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={enabled}
                      onChange={checked => handleToggle(col.key, checked)}
                      size="small"
                    />
                    <span className="text-sm">{col.title}</span>
                  </div>
                  <Input
                    size="small"
                    style={{ width: 80 }}
                    value={widthValue}
                    onChange={e => onChangeWidth(col.key, e.target.value)}
                    disabled={!enabled}
                  />
                </div>
              );
            })}
          </Space>
        </div>
      </div>
    </Drawer>
  );
};

export default CustomizeColumnDrawer;
