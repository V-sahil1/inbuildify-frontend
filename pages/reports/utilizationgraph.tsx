import React, { useState, useMemo, useEffect } from 'react';
import { Card, Row, Col, Table, Typography, Tag, Space, Button } from 'antd';
import DynamicHorizontalChart from '@/components/common/charts/DynamicHorizontalChart';
import { useUtilizedGraphColumns } from '@/components/table-columns/UtilizedGraphColumn';
import { IconArrowsDiagonal, IconArrowsDiagonalMinimize2 } from '@tabler/icons-react';

const { Title } = Typography;

const UtilizationGraphPage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showOnlyTable, setShowOnlyTable] = useState<boolean>(false);
  const { columns, data } = useUtilizedGraphColumns();

  useEffect(() => {
    console.log('selectedStatus changed to:', selectedStatus);
  }, [selectedStatus]);

  const { emailStatusValues, emailStatusLabels } = useMemo(() => {
    const stageCounts = data.reduce(
      (acc, item) => {
        acc[item.stage] = (acc[item.stage] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const labels = ['sent', 'delivered', 'opened', 'failed'];
    const values = labels.map(label => stageCounts[label] || 0);
    const formattedLabels = labels.map(label => label.charAt(0).toUpperCase() + label.slice(1));

    return {
      emailStatusValues: values,
      emailStatusLabels: formattedLabels,
    };
  }, [data]);

  const filteredData = useMemo(() => {
    if (!selectedStatus) return data;
    return data.filter(item => item.stage === selectedStatus?.toLowerCase());
  }, [data, selectedStatus]);

  const handleStatusClick = (status: string) => {
    console.log('Bar clicked:', status);
    const newStatus = selectedStatus?.toLowerCase() === status?.toLowerCase() ? '' : status;
    console.log('Setting status to:', newStatus);
    setSelectedStatus(newStatus);
  };

  const handleTagClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Tag close clicked');
    setSelectedStatus('');
  };

  const toggleView = () => {
    setShowOnlyTable(!showOnlyTable);
  };

  return (
    <div className="p-4">
      <Space className="mb-4 w-full justify-between">
        <Title level={3} className="m-0">
          Utilization Graph
        </Title>
        <Button onClick={toggleView}>
          {showOnlyTable ? <IconArrowsDiagonal /> : <IconArrowsDiagonalMinimize2 />}
        </Button>
      </Space>

      {!showOnlyTable && (
        <div>
          <Row gutter={16}>
            <Col xs={24} md={12} lg={10}>
              <DynamicHorizontalChart
                title="Email"
                categories={emailStatusLabels}
                chartType="pie"
                seriesData={emailStatusValues}
                horizontal={false}
                onBarClick={handleStatusClick}
                dropdown={{
                  options: [
                    { label: 'Current month', value: 'currentMonth' },
                    { label: 'Last Month', value: 'lastMonth' },
                    { label: 'Last 6 months', value: 'last6Months' },
                    { label: 'Last year', value: 'lastYear' },
                  ],
                  onSelect: value => console.log('Selected:', value),
                  defaultValue: 'currentMonth',
                }}
              />
            </Col>
          </Row>

          <div className="mb-2">
            {selectedStatus && (
              <Tag closable onClose={handleTagClose} className="text-xs">
                Email Status: {selectedStatus}
              </Tag>
            )}
          </div>
        </div>
      )}
      <Card bodyStyle={{ padding: 0 }}>
        <Table columns={columns} dataSource={filteredData} pagination={false} size="small" />
      </Card>
    </div>
  );
};

export default UtilizationGraphPage;
