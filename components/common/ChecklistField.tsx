import { Button, Row, Col, Tooltip, Table, message, Switch } from 'antd';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import {
  ConstructionChecklistType,
  IConstructionSubChecklist,
} from '@redux/feature/admin/construction/constructionChecklist/IConstructionChecklistState';
import { useState } from 'react';
import { useAppDispatch } from '@hooks/redux';
import {
  createSubChecklist,
  deleteSubChecklist,
  fetchAllSubChecklist,
  updateSubChecklist,
} from '@redux/feature/admin/construction/constructionChecklist/constructionChecklistThunk';
import { ActionDialogmodel } from './Models/ActionDialogModel';
import { checklistFormFields } from '../formFields/checklistFormFields';
import ConfirmationModal from './ConfirmationModal';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { toggleExpand } from '@redux/feature/admin/construction/constructionChecklist/constructionChecklistSlice';
import TooltipButton from './TooltipButton';

export const ChecklistField = ({
  data,
  setEditing,
  setChecklistModalOpen,
}: {
  data: ConstructionChecklistType;
  setEditing?: (editing: ConstructionChecklistType | null) => void;
  setChecklistModalOpen?: (open: 'create' | 'delete' | null) => void;
}) => {
  const [showSubChecklist, setShowSubChecklist] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<'create' | 'deleteSubChecklist' | null>(null);
  const [editedSubChecklist, setEditedSubChecklist] = useState<IConstructionSubChecklist | null>(
    null
  );
  const [dataRequired, setDataRequired] = useState(false);
  const dispatch = useAppDispatch();

  const fetchSubChecklist = async (checklist: ConstructionChecklistType) => {
    if (!checklist.isExpanded) {
      dispatch(toggleExpand(checklist.constructionChecklistId));
      try {
        await dispatch(fetchAllSubChecklist(checklist.constructionChecklistId)).unwrap();
      } catch (error) {
        message.error(error || 'Failed to fetch sub checklist');
      }
    }
  };

  const handleSubChecklistSubmit = async values => {
    try {
      if (editedSubChecklist) {
        const { isUpdated, updatedFields } = getUpdatedFields(values, editedSubChecklist);
        if (!isUpdated) {
          setModalOpen(null);
          setEditedSubChecklist(null);
          return;
        }
        await dispatch(
          updateSubChecklist({
            id: editedSubChecklist.constructionSubChecklistId,
            data: updatedFields,
          })
        ).unwrap();
        message.success('Sub Checklist updated successfully');
      } else {
        await dispatch(
          createSubChecklist({
            ...values,
            constructionChecklistId: data.constructionChecklistId,
            dataRequired: values.dataRequired,
          })
        ).unwrap();
        message.success('Sub Checklist created successfully');
      }
      setModalOpen(null);
      setEditedSubChecklist(null);
    } catch (error) {
      message.error(error || 'Failed to save subchecklist');
    }
  };
  const handleDeleteSubChecklist = async () => {
    try {
      await dispatch(
        deleteSubChecklist({
          id: editedSubChecklist?.constructionSubChecklistId,
          checklistId: editedSubChecklist?.constructionChecklistId,
        })
      ).unwrap();
      message.success('Sub Checklist deleted successfully');
      setModalOpen(null);
      setEditedSubChecklist(null);
    } catch (error) {
      message.error(error || 'Failed to delete sub checklist');
    }
  };
  console.log('data---', data);
  return (
    <>
      <Col flex="auto">
        <Row gutter={8}>
          <Col flex={1} className="flex items-center">
            <Tooltip title="Show Sub Checklist">
              <IconPlus
                size={15}
                onClick={() => {
                  setShowSubChecklist(!showSubChecklist);
                  fetchSubChecklist(data);
                }}
                className="cursor-pointer"
              />
            </Tooltip>
          </Col>
          <Col flex="3" className="rounded">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <p>{data.name}</p>
                <p className="bg-green-500 text-white text-center  rounded w-[60px]">
                  {data.noOfDays} days
                </p>
              </div>
              {/* show only if cost type is available */}
              {data.costCenters?.length > 0 &&
                data.costCenters.map((item, index: number) => (
                  <p key={index} className="bg-pink-500 text-white text-center  rounded w-[60px]">
                    {item.name}
                  </p>
                ))}
            </div>
          </Col>
          <Col flex="1" className="p-2 rounded flex justify-center items-center h-[50px]">
            <p className="bg-green-500 text-white text-center rounded w-[60px]">
              {data.supplierType.name}
            </p>
          </Col>
          <Col flex="1" className="p-2 rounded">
            <p className="text-center">1</p>
          </Col>
          <Col flex="1" className="flex items-center justify-end gap-2">
            <TooltipButton
              title="Add Sub checklist"
              icon={<IconPlus size={14} />}
              onClick={() => {
                setModalOpen('create');
              }}
            />

            <TooltipButton
              title="Edit"
              icon={<IconEdit size={14} />}
              onClick={() => {
                setEditing(data);
              }}
            />
            <TooltipButton
              title="Delete"
              icon={<IconTrash size={14} />}
              onClick={() => {
                setEditing(data);
                setChecklistModalOpen('delete');
              }}
            />
          </Col>
        </Row>
        {/* below row is conditional if the data are avialbale then only the table will visible other wise it will be the null */}
        {data.predecessor.length > 0 && (
          <Row gutter={8} align="middle" className=" py-1 w-full">
            <Col flex="1" className="rounded" />
            <Col flex="7">
              <Row gutter={8}>
                <Col flex="8" className="rounded">
                  <Table
                    bordered
                    pagination={false}
                    columns={[
                      {
                        title: 'predecessor',
                        dataIndex: 'predecessorChecklistName',
                        key: 'predecessorChecklistName',
                        width: '60%',
                      },
                      {
                        title: 'offSet',
                        dataIndex: 'offset',
                        key: 'offset',
                        width: '60%',
                        render: offset => <Switch checked={offset} />,
                      },
                      {
                        title: 'Duration',
                        dataIndex: 'duration',
                        key: 'duration',
                        width: '60%',
                      },
                    ]}
                    dataSource={data.predecessor}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        )}
        {showSubChecklist && (
          <Row gutter={8} align="middle" className=" py-1 w-full">
            <Col flex="1" className="p-2 rounded" />
            <Col flex="7">
              <Row gutter={8}>
                <Col flex="6" className="p-2 rounded">
                  <Table
                    bordered
                    pagination={false}
                    columns={[
                      {
                        title: 'Sub Checklist',
                        dataIndex: 'name',
                        key: 'name',
                        width: '60%',
                      },
                      {
                        title: 'Sort Order',
                        dataIndex: 'sortOrder',
                        key: 'sortOrder',
                        width: '60%',
                      },
                      {
                        render: (_, record) => (
                          <div className="flex justify-between gap-2">
                            <TooltipButton
                              title="Edit"
                              icon={<IconEdit size={14} />}
                              onClick={() => {
                                setEditedSubChecklist(record);
                                setDataRequired(record.dataRequired);
                                setModalOpen('create');
                              }}
                            />
                            <TooltipButton
                              title="Delete"
                              icon={<IconTrash size={14} />}
                              onClick={() => {
                                setEditedSubChecklist(record);
                                setModalOpen('deleteSubChecklist');
                              }}
                            />
                          </div>
                        ),
                      },
                    ]}
                    dataSource={data.subChecklist}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        )}
        {modalOpen === 'create' && (
          <ActionDialogmodel
            open={modalOpen === 'create'}
            title="Add Sub checklist"
            onCancel={() => setModalOpen(null)}
            onSubmit={values => handleSubChecklistSubmit(values)}
            fields={checklistFormFields(dataRequired, setDataRequired)}
            isEditing={!!editedSubChecklist}
            initialValues={editedSubChecklist || {}}
          />
        )}
        {/* model for the delete */}
        {modalOpen === 'deleteSubChecklist' && (
          <ConfirmationModal
            open={modalOpen === 'deleteSubChecklist'}
            onClose={() => setModalOpen(null)}
            onConfirm={() => handleDeleteSubChecklist()}
            message="Are you sure you want to delete this?"
          />
        )}
      </Col>
    </>
  );
};
