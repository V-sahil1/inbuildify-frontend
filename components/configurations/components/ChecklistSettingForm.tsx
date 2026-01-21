'use client';
import {
  Row,
  Col,
  Input,
  InputNumber,
  Select,
  Checkbox,
  Button,
  Table,
  Form,
  message,
  Switch,
  Tooltip,
} from 'antd';
import { IconCheck, IconEdit, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { useEffect, useState } from 'react';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import {
  ConstructionChecklistType,
  IConstructionChecklistPredecessor,
} from '@redux/feature/admin/construction/constructionChecklist/IConstructionChecklistState';
import { CustomBulkSelect } from '@/components/common/CustomBulkSelect';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createChecklistPredecessor,
  deleteChecklistPredecessor,
  updateChecklistPredecessor,
} from '@redux/feature/admin/construction/constructionChecklist/constructionChecklistThunk';
import { useCostCenterHook } from '@hooks/useCostCenterHook';
import { useConstructionOptionHook } from '@hooks/useConstructionOptionHook';
import { useCommonFolderHook } from '@hooks/useCommonFolderHook';
import { useComplianceTypeHook } from '@hooks/useComplianceTypeHook';
import { fetchAllSupplierType } from '@redux/feature/supplier/supplierThunk';
import { Status } from '@lib/constants/enum';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import TooltipButton from '@/components/common/TooltipButton';

export function ChecklistSettingForm({
  setModalOpen,
  setEditing,
  handleSubmit,
  checklistOptions,
  isEditing,
  initialValue,
}: {
  setModalOpen: (open: 'create' | 'delete' | null) => void;
  setEditing?: (editing: ConstructionChecklistType | null) => void;
  handleSubmit?: (values: ConstructionChecklistType) => void;
  checklistOptions?: { label: string; value: string }[];
  isEditing?: boolean;
  initialValue?: ConstructionChecklistType;
}) {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [openModel, setOpenModel] = useState<'create' | 'delete' | null>(null);
  const [offset, setOffset] = useState(false);
  const { checklist } = useAppSelector(state => state.construction.constructionChecklist);
  const { supplierType, status: supplierTypeStatus } = useAppSelector(state => state.supplier);
  const [editedPredecessor, setEditedPredecessor] =
    useState<IConstructionChecklistPredecessor | null>(null);
  const { costCenterOptions } = useCostCenterHook();
  const { constructionOptions } = useConstructionOptionHook();
  const { folderOptions } = useCommonFolderHook();
  const { complianceTypeOptions } = useComplianceTypeHook();

  const supplierOptions =
    supplierType && supplierType.map(i => ({ label: i.name, value: i.supplierTypeId }));
  const fetchSupplierType = async () => {
    try {
      await dispatch(fetchAllSupplierType()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch supplier type');
    }
  };
  useEffect(() => {
    if (supplierTypeStatus.fetch === Status.IDLE) {
      fetchSupplierType();
    }
  }, [supplierTypeStatus.fetch]);

  const onFinish = (values: ConstructionChecklistType) => {
    handleSubmit(values);
  };
  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue(initialValue);
    }
  }, []);

  const handleChecklistPredecessorSubmit = async values => {
    try {
      if (editedPredecessor) {
        const { isUpdated, updatedFields } = getUpdatedFields(
          { ...values, offset: offset },
          editedPredecessor
        );
        if (!isUpdated) {
          setModalOpen(null);
          setEditedPredecessor(null);
          return;
        }
        await dispatch(
          updateChecklistPredecessor({
            id: editedPredecessor.constructionChecklistPredecessorId,
            data: updatedFields,
          })
        ).unwrap();
        message.success('Sub Checklist updated successfully');
      } else {
        await dispatch(
          createChecklistPredecessor({
            ...values,
            constructionChecklistId: initialValue.constructionChecklistId,
            offset: offset,
          })
        ).unwrap();
        message.success('Sub Checklist created successfully');
      }
      setOpenModel(null);
      setEditedPredecessor(null);
    } catch (error) {
      message.error(error || 'Failed to save subchecklist');
    }
  };

  const handleDeleteChecklistPredecessor = async () => {
    try {
      await dispatch(
        deleteChecklistPredecessor({
          id: editedPredecessor?.constructionChecklistPredecessorId,
          checklistId: editedPredecessor?.constructionChecklistId,
        })
      ).unwrap();
      message.success('Sub Checklist deleted successfully');
      setOpenModel(null);
      setEditedPredecessor(null);
    } catch (error) {
      message.error(error || 'Failed to delete sub checklist');
    }
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200 w-full">
      <Form form={form} onFinish={onFinish} initialValues={initialValue || {}}>
        <Row gutter={8} align="middle" className="  border-gray-200 py-1">
          <Col flex="auto">
            <Row gutter={8}>
              <Col flex="3" className="p-2 rounded">
                <Form.Item name="name">
                  <Input placeholder="Checklist Name" />
                </Form.Item>
              </Col>
              <Col flex="1" className="p-2 rounded">
                <Form.Item name="supplierTypeId">
                  <Select placeholder="Select Type" className="w-full" options={supplierOptions} />
                </Form.Item>
              </Col>
              <Col flex="1" className="p-2 rounded">
                <Form.Item name="sortOrder">
                  <Input placeholder="Sort" />
                </Form.Item>
              </Col>
              <Col flex="1" className="flex items-center justify-end gap-2">
                <Tooltip title="Submit">
                  <Button type="default" htmlType="submit" icon={<IconCheck size={14} />} />
                </Tooltip>
                <TooltipButton
                  title="Cancel"
                  icon={<IconX size={14} />}
                  onClick={() => {
                    setModalOpen(null);
                    setEditing(null);
                  }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={8} align="middle" className="  border-gray-200 py-1">
          <Col flex="80px" className="text-center" />
          <Col flex="auto">
            <Row gutter={8}>
              {/* Text spanning two columns */}
              <Col flex="1" className="p-2 rounded">
                <Form.Item name="dataRequired" valuePropName="checked">
                  <Checkbox>Date required</Checkbox>
                </Form.Item>
              </Col>
              <Col flex="1" className="p-2 rounded">
                <Form.Item name="supplier" valuePropName="checked">
                  <Checkbox>Supplier</Checkbox>
                </Form.Item>
              </Col>
              <Col flex="1" className="p-2 rounded">
                <Form.Item name="claim" valuePropName="checked">
                  <Checkbox>Claim</Checkbox>
                </Form.Item>
              </Col>
              <Col flex="1" className="p-2 rounded">
                <Form.Item name="dependent" valuePropName="checked">
                  <Checkbox>Dependent</Checkbox>
                </Form.Item>
              </Col>
              <Col flex="1" className="p-2 rounded" />
              <Col flex="1" className="p-2 rounded" />
            </Row>
          </Col>
        </Row>
        <Row gutter={8} align="middle" className="  border-gray-200 py-1">
          <Col flex="80px" className="text-center" />
          <Col flex="auto">
            <Row gutter={8}>
              {/* Text spanning two columns */}
              <Col flex="1" className="p-2 rounded">
                <Form.Item name="noOfDays">
                  <div className="flex">
                    <p>No of Days:</p>
                    <InputNumber min={0} className="ml-2 w-[90px]" placeholder="Duration" />
                  </div>
                </Form.Item>
              </Col>
              <Col flex="1" className="p-2 rounded">
                <Form.Item name="notify" valuePropName="checked">
                  <Checkbox>Notify</Checkbox>
                </Form.Item>
              </Col>
              <Col flex="1" className="p-2 rounded">
                <Form.Item name="milestone" valuePropName="checked">
                  <Checkbox>Milestone</Checkbox>
                </Form.Item>
              </Col>
              <Col flex="1" className="p-2 rounded">
                <Form.Item name="attachmentMandatory" valuePropName="checked">
                  <Checkbox>Attachement mandatory</Checkbox>
                </Form.Item>
              </Col>
              <Col flex="1" className="p-2 rounded" />
              <Col flex="1" className="p-2 rounded" />
            </Row>
          </Col>
        </Row>
        <Row gutter={8} align="middle" className="  border-gray-200 py-1">
          <Col flex="80px" className="text-center" />
          <Col flex="auto">
            <Row gutter={8}>
              <Col flex="2" className="p-2 rounded">
                <Form.Item name="complianceTypeId">
                  <div className="flex gap-2">
                    <p>compliance type:</p>
                    <Select placeholder="Select Compliance Type" options={complianceTypeOptions} />
                  </div>
                </Form.Item>
              </Col>
              <Col flex="2" className="p-2 rounded">
                <div className="flex gap-2">
                  <p>cost center:</p>
                  <Form.Item name="costCenterId">
                    <CustomBulkSelect
                      options={costCenterOptions || []}
                      placeholder="Select Cost Center"
                      onChange={() => {}}
                    />
                  </Form.Item>
                </div>
              </Col>
              <Col flex="2" className="p-2 rounded">
                <div className="flex gap-2">
                  <p>construction options:</p>
                  <Form.Item name="constructionOptionId">
                    <CustomBulkSelect
                      options={constructionOptions || []}
                      placeholder="Select Construction Options"
                      onChange={() => {}}
                    />
                  </Form.Item>
                </div>
              </Col>

              <Col flex="1" className="p-2 rounded" />
            </Row>
          </Col>
        </Row>
        {isEditing && (
          <Row gutter={8} align="middle" className=" py-1">
            <Col flex="80px" className="text-center" />
            <Col flex="auto">
              <Col flex="6" className="p-2 rounded">
                <div className="flex gap-2">
                  <p>PO Folder:</p>
                  <Form.Item name="poFolderId">
                    <Select placeholder="Select PO Folder" options={folderOptions} />
                  </Form.Item>
                </div>
              </Col>
            </Col>
            <Col flex="auto">
              <Col flex="6" className="p-2 rounded">
                <div className="flex gap-2">
                  <p>Job Document Folder:</p>
                  <Form.Item name="jobDocumentsFolderId">
                    <Select placeholder="Select Job Folder" options={folderOptions} />
                  </Form.Item>
                </div>
              </Col>
            </Col>
          </Row>
        )}
        <Row gutter={8} align="middle" className=" py-1">
          <Col flex="80px" className="text-center" />
          <Col flex="auto">
            <Row gutter={7}>
              <Col flex="6" className="p-2 rounded">
                <Table
                  bordered
                  columns={[
                    {
                      title: 'prodecessor',
                      dataIndex: 'predecessorChecklistName',
                      key: 'predecessorChecklistName',
                      width: '60%',
                      render: predecessorChecklistName => predecessorChecklistName,
                    },
                    {
                      title: 'Offset',
                      dataIndex: 'offset',
                      key: 'offset',
                      width: '20%',
                      render: offset => <Switch checked={offset} />,
                    },
                    {
                      title: 'Duration',
                      dataIndex: 'duration',
                      key: 'duration',
                      width: '20%',
                    },
                    {
                      title: (
                        <Button type="primary" size="small" onClick={() => setOpenModel('create')}>
                          Add
                        </Button>
                      ),
                      key: 'action',
                      width: '20%',
                      render: (_, record: IConstructionChecklistPredecessor) => (
                        <div className="flex gap-2">
                          <TooltipButton
                            title="Edit"
                            icon={<IconEdit />}
                            onClick={() => {
                              setOffset(record.offset);
                              setEditedPredecessor(record);
                              setOpenModel('create');
                            }}
                          />
                          <TooltipButton
                            title="Delete"
                            icon={<IconTrash />}
                            onClick={() => {
                              setEditedPredecessor(record);
                              setOpenModel('delete');
                            }}
                          />
                        </div>
                      ),
                    },
                  ]}
                  dataSource={
                    checklist.find(
                      i => i.constructionChecklistId === initialValue?.constructionChecklistId
                    )?.predecessor || []
                  }
                />
              </Col>
              <Col flex="1" className="p-2 rounded" />
            </Row>
          </Col>
        </Row>
      </Form>
      {openModel === 'create' && (
        <ActionDialogmodel
          open={openModel === 'create'}
          onCancel={() => {
            setOpenModel(null);
            setEditedPredecessor(null);
          }}
          onSubmit={values => {
            handleChecklistPredecessorSubmit(values);
          }}
          title="Add Predecessor"
          isEditing={!!editedPredecessor}
          initialValues={editedPredecessor || {}}
          fields={[
            {
              label: 'Name',
              name: 'predecessorChecklistId',
              type: 'select',
              options: checklistOptions,
            },
            {
              label: 'Offset',
              name: 'offset',
              type: 'switch',
              initialValue: offset,
              onChange: value => setOffset(value),
            },
            {
              label: 'Duration',
              name: 'duration',
              type: 'text',
            },
          ]}
        />
      )}

      {/* model for the delete */}
      {openModel === 'delete' && (
        <ConfirmationModal
          open={openModel === 'delete'}
          onClose={() => setOpenModel(null)}
          onConfirm={() => handleDeleteChecklistPredecessor()}
          message="Are you sure you want to delete this?"
        />
      )}
    </div>
  );
}
