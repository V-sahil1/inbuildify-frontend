import { Button, Space, Table, Popconfirm, Form } from 'antd';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { fetchJobPredecessorTask } from '@redux/feature/admin/job/jobProcess/jobProcessThunk';

export const PredecessorTable = ({
  predecessors,
  onEdit,
  onDelete,
  onAdd,
}: {
  predecessors: any[];
  onEdit: (id: string, values: any) => void;
  onDelete: (id: string) => void;
  onAdd: (values: any) => void;
}) => {
  const dispatch = useAppDispatch();
  const { jobPredecessorTask, status } = useAppSelector(state => state.job.jobProcess);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const [editingProcessor, setEditingProcessor] = useState<any>(null);

  useEffect(() => {
    if (status.fetchbPredecessorTask === Status.IDLE) {
      dispatch(fetchJobPredecessorTask()).unwrap();
    }
    if (editingId) {
      const predecessor = predecessors.find(p => p.id === editingId);
      if (predecessor) {
        setEditingProcessor({ name: predecessor.name, sort: predecessor.sort });
      }
    } else {
      form.resetFields();
    }
  }, [editingId, form, predecessors]);

  const handleSubmit = (values: { task: string; sort: number }) => {
    if (editingId) {
      onEdit(editingId, values);
    } else {
      onAdd(values);
    }
    setIsModalOpen(false);
    form.resetFields();
    setEditingId(null);
  };

  const handleEdit = (predecessor: any) => {
    setEditingId(predecessor.id);
    form.setFieldsValue({
      name: predecessor.name,
      sort: predecessor.sort,
    });
    setIsModalOpen(true);
  };
  return (
    <div className="mt-4 ">
      <div className="flex justify-between items-center mb-2">
        <h4 className="mb-2 font-semibold text-font-color">Predecessor Tasks</h4>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Add Predecessor
        </Button>
      </div>
      <Table
        className="mt-3"
        size="small"
        dataSource={predecessors.slice().sort((a, b) => a.sort - b.sort)}
        pagination={false}
        rowKey="id"
        columns={[
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Sort', dataIndex: 'sort', key: 'sort', width: 100 },
          {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_: any, rec: any) => (
              <Space>
                <Button
                  type="text"
                  icon={<IconEdit size={16} />}
                  onClick={() => {
                    handleEdit(rec);
                  }}
                />
                <Popconfirm title="Remove predecessor?" onConfirm={() => onDelete(rec.id)}>
                  <Button type="text" icon={<IconTrash size={16} />} />
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <ActionDialogmodel
        title={`${editingId ? 'Edit' : 'Add'} Predecessor`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        isEditing={!!editingId}
        initialValues={editingProcessor}
        onSubmit={handleSubmit}
        fields={[
          {
            name: 'task',
            label: 'Name',
            type: 'select',
            options: jobPredecessorTask.map(pTask => ({ label: pTask.name, value: pTask.taskId })),
          },
        ]}
      />
    </div>
  );
};
