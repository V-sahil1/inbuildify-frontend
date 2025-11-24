'use client';

import React from 'react';
import { Table, Button } from 'antd';
import { IconCirclePlus } from '@tabler/icons-react';
import { useEstateStagesColumns } from 'components/table-columns/EstateStagesColumns';

type Props = { estateName?: string };

export default function EstateStages({ estateName }: Props) {
  const { columns, data, startAdd } = useEstateStagesColumns(estateName);

  return (
    <div className="bg-card-color p-4 flex flex-col">
      <div className="flex items-center justify-center gap-1 text-primary mb-3">
        <Button type="text" onClick={startAdd}>
          <IconCirclePlus size={16} />
          <span>Stage</span>
        </Button>
      </div>
      <div>
        <Table rowKey="key" columns={columns} dataSource={data} pagination={false} />
      </div>
    </div>
  );
}
