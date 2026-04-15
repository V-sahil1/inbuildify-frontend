import { Badge, Input, message, Popconfirm, Space, Tag } from 'antd';
import StatusSelect from '../common/custom-selects/StatusSelect';
import { ICostCenter } from '@redux/feature/costCenter/IcostCenterState';
import TooltipButton from '../common/TooltipButton';
import { IconList, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { useAppDispatch } from '@hooks/redux';
import {
  createCostCenter,
  deleteCostCenter,
  updateCostCenter,
} from '@redux/feature/costCenter/costCenterThunk';

export const CostCenterColumn = (filters, setParams, setEditRecord, setOpenModal, editRecord) => {
  const dispatch = useAppDispatch();
  const columns = [
    {
      title: (
        <div className="flex flex-col">
          <span>Code</span>
          <Input value={filters.code} onChange={e => setParams({ code: e.target.value })} />
        </div>
      ),
      dataIndex: 'code',
      width: '15%',
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Name</span>
          <Input value={filters.name} onChange={e => setParams({ name: e.target.value })} />
        </div>
      ),
      dataIndex: 'name',
      width: '25%',
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Description</span>
          <Input
            value={filters.description}
            onChange={e => setParams({ description: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'description',
      width: '30%',
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Sort Order</span>
          <Input
            value={filters.sortOrder}
            onChange={e => setParams({ sortOrder: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'sortOrder',
      width: '8%',
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium">Status</span>
          <StatusSelect
            activeInactive
            value={filters.isActive}
            onChange={val => setParams({ isActive: val })}
            width="100%"
          />
        </div>
      ),
      width: '10%',
      render: (_, record: ICostCenter) => (
        <Tag color={record.status ? 'green' : 'red'}>{record.status ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: 'Actions',
      width: '14%',
      render: (_, record: ICostCenter) => (
        <Space size="middle">
          {record.status && (
            <>
              <Badge count={record.checklist?.length} style={{ background: 'var(--primary)' }}>
                <TooltipButton
                  title="Map Checklists"
                  type="link"
                  icon={<IconList size={15} />}
                  onClick={e => {
                    e.stopPropagation();
                    if (!record.status) {
                      message.warning('Inactive cost center cannot manage checklists');
                      return;
                    }
                    setEditRecord(record);
                    setOpenModal('checklist');
                  }}
                />
              </Badge>
              <TooltipButton
                title="Edit"
                type="link"
                icon={<IconPencil size={15} />}
                onClick={e => {
                  e.stopPropagation();
                  setEditRecord(record);
                  setOpenModal('costCenter');
                }}
              />
            </>
          )}
          {record.status ? (
            <span onClick={e => e.stopPropagation()}>
              <Popconfirm
                title={
                  (record?.checklist?.length || 0) > 0
                    ? 'Are you sure you want to inactivate?'
                    : 'Are you sure you want to delete the cost center?'
                }
                description={
                  (record?.checklist?.length || 0) > 0 ? (
                    <div className="text-sm">
                      <p>
                        This Cost Center is already mapped for existing jobs hence it can only be
                        inactivated.
                      </p>
                      <p className="mt-1">
                        Note: Inactivating the cost center will also remove the checklist(s) mapped
                        with this cost center.
                      </p>
                    </div>
                  ) : undefined
                }
                okText={(record?.checklist?.length || 0) > 0 ? 'Inactive' : 'Delete'}
                cancelText="Cancel"
                onConfirm={() => handleCostCenterStatus(record)}
              >
                <TooltipButton
                  title="Delete"
                  type="link"
                  icon={<IconTrash color="red" size={15} />}
                />
              </Popconfirm>
            </span>
          ) : (
            <Popconfirm
              title="Are you sure you want to activate?"
              onConfirm={() => handleCostCenterStatus(record)}
            >
              <TooltipButton title="Activate" icon={<IconPlus size={15} />} type="text" />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const handleSubmit = async values => {
    try {
      if (editRecord) {
        await dispatch(
          updateCostCenter({
            data: { ...values, status: values.status === 'true' },
            id: editRecord.costCenterId,
          })
        );
        message.success('Cost Center updated successfully');
      } else {
        await dispatch(createCostCenter({ ...values, status: true })).unwrap();
        message.success('Cost Center created successfully');
      }
      setEditRecord(null);
      setOpenModal(null);
    } catch (error) {
      message.error(error || 'Failed to save cost center');
    }
  };

  const handleCostCenterStatus = async (record: ICostCenter) => {
    //if cost has checklist then costcenter cannot be deleted , can be inactivated
    try {
      const hasChecklist = (record?.checklist?.length || 0) > 0;
      if (hasChecklist) {
        await dispatch(
          updateCostCenter({
            data: { status: false },
            id: record.costCenterId,
          })
        ).unwrap();
        message.success('Cost Center inactivated and checklists removed');
      } else {
        if (record.status) {
          await dispatch(deleteCostCenter(record.costCenterId)).unwrap();
          message.success('Cost Center deleted');
        } else {
          await dispatch(
            updateCostCenter({
              data: { status: true },
              id: record.costCenterId,
            })
          ).unwrap();
          message.success('Cost Center inactivated and checklists removed');
        }
      }
    } catch (error) {
      message.error(error || 'Failed to delete cost center');
    }
  };
  return {
    columns,
    handleSubmit,
  };
};
