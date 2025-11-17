import { Button, Image, Input, Tag } from 'antd';
import { IconPlus, IconSearch, IconX } from '@tabler/icons-react';
import { facadeData } from 'data/facadeData';
import { debouncedURL } from '@lib/utils/debounceURL';
import { useEffect } from 'react';

export const FacadeColumns = () => {
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['search'],
    shouldSyncURL: false,
  });
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);
  function handleToggle(data) {
    console.log(data);
  }
  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (_, record) => <Image src={record.image[0]?.url} width={100} />,
    },
    {
      title: (
        <Input
          addonBefore={<IconSearch size={15} />}
          placeholder="Search Name"
          onChange={e => setParams({ search: e.target.value })}
        />
      ),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div>
          <div className="flex gap-2">
            {record.label && <Tag color="blue">{record.label}</Tag>}
            {record.costType && <Tag color="orange">{record.costType}</Tag>}
          </div>
          <p>{record.name}</p>
        </div>
      ),
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      render: (_, record) => {
        return record.cost > 0 && <p>{record.cost}</p>;
      },
    },
    {
      title: '',
      render: (_, record) => {
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => handleToggle(record)}
            icon={<IconPlus size={15} />}
          />
        );
      },
    },
  ];
  return { columns, facadeData };
};

