import { ContractColumn } from '@/components/table-columns/ContractColumn';
import SystemRoutes from '@lib/constants/Routes';
import { debouncedURL } from '@lib/utils/debounceURL';
import { Button, Space, Table } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Contract = () => {
  const router = useRouter();
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['builderName', 'formatName', 'createdDate', ' updatedDate', 'status', 'contract'],
  });
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);
  const { columns, contractData } = ContractColumn({ filters, setParams });
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Contract Format Listing</h1>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              router.push(`${SystemRoutes.CONTRACT}/create`);
            }}
          >
            New Contract Format
          </Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={contractData} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default Contract;
