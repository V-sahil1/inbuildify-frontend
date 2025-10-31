import { IconCaretDownFilled, IconDotsVertical, IconMessage, IconPlus } from '@tabler/icons-react';
import { Button, Checkbox, Input, Table, Dropdown, MenuProps, DatePicker } from 'antd';
import { useEffect } from 'react';

const ConstructionFrameStage = () => {
  useEffect(() => {
    const fetchConstructionFrameStageData = () => {
      // call fetch api of constructionframestage
    };
    fetchConstructionFrameStageData();
  }, []);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '1st menu item',
    },
    {
      key: '2',
      label: '2nd menu item',
    },
  ];
  const data = [
    {
      checklistitem: 'Site measure by car penter',
      supplier: '',
      start: '14-07-21',
      finish: '',
      complete: false,
    },
    {
      checklistitem: 'Car measurement from truss company',
      supplier: '',
      start: '',
      finish: '',
      complete: false,
    },
    {
      checklistitem: 'Delivery of bricks',
      supplier: 'Meet',
      start: '',
      finish: '',
      complete: true,
    },
  ];
  const columns = [
    {
      title: (
        <div className="flex flex-col gap-1">
          <div>Checklist Items</div>
          <div>
            <Input></Input>
          </div>
        </div>
      ),
      dataIndex: 'checklistitems',
      key: 'checklistitems',
      render: (_, record) => {
        return (
          <div>
            <p className="text-black">{record.checklistitem}</p>
            <p className="flex items-center gap-1 text-xs text-blue">
              {' '}
              <div className="rounded-full w-3 h-3 bg-blue text-white">
                <IconPlus size={12} />
              </div>
              Notes
            </p>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <div>Supplier</div>
          <div>
            <Input />
          </div>
        </div>
      ),
      dataIndex: 'supplier',
      key: 'supplier',
      render: (_, record) => {
        return (
          <div className="flex flex-col gap-1">
            {record.supplier ? (
              <p>{record.supplier}</p>
            ) : (
              <div className="flex items-center gap-1 text-xs text-blue">
                <Dropdown menu={{ items }} trigger={['click']}>
                  Assign Supplier
                </Dropdown>
                <IconCaretDownFilled size={15} />
              </div>
            )}
            <div className="text-blue">
              <IconMessage size={20} />
            </div>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <div>Start</div>
          <div>
            <Input />
          </div>
        </div>
      ),
      dataIndex: 'start',
      key: 'start',
      render: (_, record) => {
        return (
          <div>
            {' '}
            {record.start ? (
              <p>{record.start}</p>
            ) : (
              <DatePicker
                className="!pl-0"
                variant="borderless"
                suffixIcon={null}
                allowClear={false}
              />
            )}
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <div>Finish</div>
          <div>
            <Input />
          </div>
        </div>
      ),
      dataIndex: 'finish',
      key: 'finish',
      render: (_, record) => {
        return (
          <div>
            {' '}
            {record.finish ? (
              <p>{record.finish}</p>
            ) : (
              <DatePicker
                className="!pl-0"
                variant="borderless"
                suffixIcon={null}
                allowClear={false}
              />
            )}
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <Checkbox></Checkbox>Complete
          </div>
          <div>
            <Input />
          </div>
        </div>
      ),
      dataIndex: 'complete',
      key: 'complete',
      render: (_, record) => {
        return <div>{record.complete ? <p>Yes</p> : <Checkbox />}</div>;
      },
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-blue">
            <div className="rounded-full w-3 h-3 bg-blue text-white">
              <IconPlus size={12} />
            </div>
            Checklist
          </div>
          <div className="flex items-center gap-1 text-blue">
            <div className="rounded-full w-3 h-3 bg-blue text-white">
              <IconPlus size={12} />
            </div>
            Defects
          </div>
        </div>
      ),
      dataIndex: 'operation',
      key: 'operation',
      render: () => {
        return (
          <div className="text-blue">
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'edit',
                    label: 'Edit',
                    onClick: () => {},
                  },
                  {
                    key: 'delete',
                    label: 'Delete',
                    onClick: () => {},
                  },
                ],
              }}
              trigger={['click']}
            >
              <IconDotsVertical size={15} />
            </Dropdown>
          </div>
        );
      },
    },
  ];
  return (
    <div className="bg-card-color !mt-0 p-3">
      <div className="flex justify-end gap-1">
        <Button size="small" type="primary" className="text-xs">
          Update Status
        </Button>
        <Button size="small" type="primary" className="text-xs">
          Inspection
        </Button>
        <Button size="small" type="primary" className="text-xs">
          OH&S
        </Button>
      </div>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
};

export default ConstructionFrameStage;
