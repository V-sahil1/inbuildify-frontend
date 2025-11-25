import React, { useState } from 'react';
import { Button } from 'antd';
import { IconEdit, IconTrash, IconPlus, IconMinus, IconCopy } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import {
  getCreateMasterFields,
  getQuotationFormatFields,
} from '../../../formFields/quotationFormatFields';
import {
  MasterGroup,
  MasterHeading,
  MasterItem,
  mockMasters,
} from '../../../../data/quotationFormatData';

const MasterSections: React.FC = () => {
  const [masters, setMasters] = useState<MasterGroup[]>(mockMasters);
  const [expanded, setExpanded] = useState<{ masters: number[]; headings: number[] }>({
    masters: [],
    headings: [],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'heading' | 'item'>('item');
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState<
    | { type: 'heading'; masterId: number; headingId: number | null }
    | { type: 'item'; headingId: number; itemId: number | null }
    | null
  >(null);

  const [masterEditOpen, setMasterEditOpen] = useState(false);
  const [editingMaster, setEditingMaster] = useState<MasterGroup | null>(null);
  const [initialValues, setInitialValues] = useState<any>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<
    | { type: 'master'; master: MasterGroup }
    | { type: 'heading'; masterId: number; heading: MasterHeading }
    | { type: 'item'; headingId: number; item: MasterItem }
    | null
  >(null);

  const toggleMaster = (id: number) => {
    setExpanded(prev => ({
      ...prev,
      masters: prev.masters.includes(id)
        ? prev.masters.filter(x => x !== id)
        : [...prev.masters, id],
    }));
  };

  const handleMasterEditSubmit = (values: any) => {
    if (!editingMaster) return;

    setMasters(prev =>
      prev.map(group =>
        group.id === editingMaster.id
          ? {
              ...group,
              name: values.masterName || '',
              active: values.status ? values.status === 'active' : group.active,
            }
          : group
      )
    );

    setMasterEditOpen(false);
    setEditingMaster(null);
  };

  const toggleHeading = (id: number) => {
    setExpanded(prev => ({
      ...prev,
      headings: prev.headings.includes(id)
        ? prev.headings.filter(x => x !== id)
        : [...prev.headings, id],
    }));
  };

  const isMasterExpanded = (id: number) => expanded.masters.includes(id);
  const isHeadingExpanded = (id: number) => expanded.headings.includes(id);

  const openEditMasterModal = (master: MasterGroup) => {
    setEditingMaster(master);
    setMasterEditOpen(true);
  };

  const openStructureModal = (action: any) => {
    setIsEditing(action.type === 'editHeading' || action.type === 'editItem');

    if (action.type === 'newHeading') {
      setModalType('heading');
      setSelected({ type: 'heading', masterId: action.masterId, headingId: null });
      setInitialValues({});
    } else if (action.type === 'editHeading') {
      const { masterId, heading } = action;
      setModalType('heading');
      setSelected({ type: 'heading', masterId, headingId: heading.id });
      setInitialValues({
        name: heading.name,
        startDate: heading.startDate,
        endDate: heading.endDate,
        sortOrder: heading.sortOrder,
        status: heading.active ? 'Active' : 'Inactive',
      });
    } else if (action.type === 'newItem') {
      setModalType('item');
      setSelected({ type: 'item', headingId: action.headingId, itemId: null });
      setInitialValues({});
    } else if (action.type === 'editItem') {
      const { headingId, item } = action;
      setModalType('item');
      setSelected({ type: 'item', headingId, itemId: item.id });
      setInitialValues({
        name: item.name,
        startDate: item.startDate,
        endDate: item.endDate,
        sortOrder: item.sortOrder,
        status: item.active ? 'Active' : 'Inactive',
      });
    }

    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsEditing(false);
    setSelected(null);
    setInitialValues({});
  };

  const openDeleteModal = (action: any) => {
    setDeleteTarget(action);
    setDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const getDeleteHeaderName = () => {
    if (!deleteTarget) return '';

    if (deleteTarget.type === 'heading') {
      const master = masters.find(m => m.id === deleteTarget.masterId);
      return master?.name || '';
    }

    if (deleteTarget.type === 'item') {
      for (const group of masters) {
        const heading = group.headings.find(h => h.id === deleteTarget.headingId);
        if (heading) return heading.name;
      }
    }

    return '';
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'master') {
      const { master } = deleteTarget;
      setMasters(prev => prev.filter(group => group.id !== master.id));
      setExpanded(prev => ({
        masters: prev.masters.filter(id => id !== master.id),
        headings: prev.headings,
      }));
    } else if (deleteTarget.type === 'heading') {
      const { masterId, heading } = deleteTarget;
      setMasters(prev =>
        prev.map(group =>
          group.id !== masterId
            ? group
            : {
                ...group,
                headings: group.headings.filter(h => h.id !== heading.id),
              }
        )
      );
      setExpanded(prev => ({
        masters: prev.masters,
        headings: prev.headings.filter(id => id !== heading.id),
      }));
    } else if (deleteTarget.type === 'item') {
      const { headingId, item } = deleteTarget;
      setMasters(prev =>
        prev.map(group => ({
          ...group,
          headings: group.headings.map(h =>
            h.id !== headingId
              ? h
              : {
                  ...h,
                  items: (h.items || []).filter(i => i.id !== item.id),
                }
          ),
        }))
      );
    }

    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleSubmitModal = (values: any) => {
    if (modalType === 'heading') {
      if (!selected || selected.type !== 'heading') {
        handleCloseModal();
        return;
      }
      setMasters(prev =>
        prev.map(group => {
          if (group.id !== selected.masterId) return group;

          if (isEditing && selected.headingId != null) {
            return {
              ...group,
              headings: group.headings.map(h =>
                h.id === selected.headingId
                  ? {
                      ...h,
                      name: values.name || '',
                      startDate: values.startDate,
                      endDate: values.endDate,
                      active: values.status ? values.status === 'Active' : true,
                      sortOrder: values.sortOrder ?? h.sortOrder,
                    }
                  : h
              ),
            };
          }

          const newHeading: MasterHeading = {
            id: Date.now(),
            name: values.name || '',
            startDate: values.startDate,
            endDate: values.endDate,
            active: values.status ? values.status === 'Active' : true,
            sortOrder: values.sortOrder ?? (group.headings?.length || 0) + 1,
            items: [],
          };

          return {
            ...group,
            headings: [...group.headings, newHeading],
          };
        })
      );
    } else {
      if (!selected || selected.type !== 'item') {
        handleCloseModal();
        return;
      }
      setMasters(prev =>
        prev.map(group => ({
          ...group,
          headings: group.headings.map(heading => {
            if (heading.id !== selected.headingId) return heading;

            if (isEditing && selected.itemId != null) {
              return {
                ...heading,
                items: (heading.items || []).map(item =>
                  item.id === selected.itemId
                    ? {
                        ...item,
                        name: values.name || '',
                        startDate: values.startDate,
                        endDate: values.endDate,
                        active: values.status ? values.status === 'Active' : true,
                        sortOrder: values.sortOrder ?? item.sortOrder,
                      }
                    : item
                ),
              };
            }

            const newItem: MasterItem = {
              id: Date.now(),
              name: values.name || '',
              startDate: values.startDate,
              endDate: values.endDate,
              active: values.status ? values.status === 'Active' : true,
              sortOrder: values.sortOrder ?? (heading.items?.length || 0) + 1,
            };

            return {
              ...heading,
              items: heading.items ? [...heading.items, newItem] : [newItem],
            };
          }),
        }))
      );
    }
    handleCloseModal();
  };

  return (
    <div className="rounded bg-card-color text-md min-h-[260px]">
      <div className="px-2 py-3">
        {masters.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm text-font-color">
            No master found
          </div>
        ) : (
          masters.map(master => (
            <React.Fragment key={master.id}>
              <div
                className="flex items-center justify-between px-2 py-1 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleMaster(master.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-primary flex items-center justify-center w-4 h-4 border border-primary rounded-sm text-[10px]">
                    {isMasterExpanded(master.id) ? <IconMinus size={18} /> : <IconPlus size={18} />}
                  </span>
                  <span className="font-semibold uppercase text-sm">{master.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs w-16 text-right">
                    {master.active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs w-6 text-right" />
                  <div className="flex items-center gap-2 w-24 justify-end">
                    <Button
                      type="text"
                      size="small"
                      icon={<IconCopy size={18} />}
                      onClick={e => e.stopPropagation()}
                    />
                    <Button
                      type="text"
                      size="small"
                      icon={<IconEdit size={18} />}
                      onClick={e => {
                        e.stopPropagation();
                        openEditMasterModal(master);
                      }}
                    />
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<IconTrash size={18} />}
                      onClick={e => {
                        e.stopPropagation();
                        openDeleteModal({ type: 'master', master });
                      }}
                    />
                  </div>
                  <div className="w-28">
                    <Button
                      type="primary"
                      size="small"
                      onClick={e => {
                        e.stopPropagation();
                        openStructureModal({ type: 'newHeading', masterId: master.id });
                      }}
                    >
                      Add Heading
                    </Button>
                  </div>
                </div>
              </div>

              {isMasterExpanded(master.id) &&
                master.headings.map(heading => (
                  <React.Fragment key={heading.id}>
                    <div
                      className="flex items-center justify-between px-2 py-1 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleHeading(heading.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-primary flex items-center justify-center w-4 h-4 border border-primary10 rounded-sm text-[10px]">
                          {isHeadingExpanded(heading.id) ? (
                            <IconMinus size={10} />
                          ) : (
                            <IconPlus size={10} />
                          )}
                        </span>
                        <span className="text-sm">{heading.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs w-16 text-right">
                          {heading.active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs w-6 text-right">{heading.sortOrder}</span>
                        <div className="flex items-center gap-2 w-24 justify-end">
                          <Button
                            type="text"
                            size="small"
                            icon={<IconCopy size={18} />}
                            onClick={e => e.stopPropagation()}
                          />
                          <Button
                            type="text"
                            size="small"
                            icon={<IconEdit size={18} />}
                            onClick={e => {
                              e.stopPropagation();
                              openStructureModal({
                                type: 'editHeading',
                                masterId: master.id,
                                heading,
                              });
                            }}
                          />
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<IconTrash size={18} />}
                            onClick={e => {
                              e.stopPropagation();
                              openDeleteModal({ type: 'heading', masterId: master.id, heading });
                            }}
                          />
                        </div>
                        <div className="w-28">
                          <Button
                            size="small"
                            onClick={e => {
                              e.stopPropagation();
                              openStructureModal({ type: 'newItem', headingId: heading.id });
                            }}
                          >
                            Add Item
                          </Button>
                        </div>
                      </div>
                    </div>

                    {isHeadingExpanded(heading.id) &&
                      heading.items &&
                      heading.items.length > 0 &&
                      heading.items.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between px-2 py-1 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                        >
                          <span className="ml-[4%]">{item.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs w-16 text-right">
                              {item.active ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-xs w-6 text-right text-danger">
                              {item.sortOrder}
                            </span>
                            <div className="flex items-center gap-2 w-24 justify-end">
                              <Button type="text" size="small" icon={<IconCopy size={18} />} />
                              <Button
                                type="text"
                                size="small"
                                icon={<IconEdit size={18} />}
                                onClick={() =>
                                  openStructureModal({
                                    type: 'editItem',
                                    headingId: heading.id,
                                    item,
                                  })
                                }
                              />
                              <Button
                                type="text"
                                size="small"
                                danger
                                icon={<IconTrash size={18} />}
                                onClick={e => {
                                  e.stopPropagation();
                                  openDeleteModal({ type: 'item', headingId: heading.id, item });
                                }}
                              />
                            </div>
                            <div className="w-28" />
                          </div>
                        </div>
                      ))}
                  </React.Fragment>
                ))}
            </React.Fragment>
          ))
        )}
      </div>
      <ActionDialogmodel
        title={
          modalType === 'heading'
            ? isEditing
              ? 'Edit Heading'
              : 'Create Heading'
            : isEditing
              ? 'Edit Item'
              : 'Create Item'
        }
        open={modalOpen}
        onCancel={handleCloseModal}
        onSubmit={handleSubmitModal}
        submitButtonText="Save"
        isEditing={isEditing}
        initialValues={initialValues}
        fields={getQuotationFormatFields(modalType)}
      />
      <ActionDialogmodel
        title="Edit Master"
        open={masterEditOpen}
        onCancel={() => {
          setMasterEditOpen(false);
          setEditingMaster(null);
        }}
        onSubmit={handleMasterEditSubmit}
        submitButtonText="Save"
        isEditing
        initialValues={
          editingMaster
            ? {
                masterName: editingMaster.name,
                status: editingMaster.active ? 'active' : 'inactive',
              }
            : {}
        }
        fields={getCreateMasterFields()}
      />
      <ConfirmationContentModal
        open={deleteModalOpen}
        onClose={handleCancelDelete}
        onSubmit={handleConfirmDelete}
        okText="Delete"
        title="Confirm Deletion"
        content={
          deleteTarget ? (
            <div className="text-sm">
              {deleteTarget.type !== 'master' && (
                <p className="font-semibold mb-2">Header: {getDeleteHeaderName()}</p>
              )}
              <p className="text-primary mb-2">
                Please note deleting header can't be recovered! If this header is needed for future
                reference please mark as Inactive by clicking on the edit icon.
              </p>
              <p>Are you sure you want to delete this?</p>
            </div>
          ) : null
        }
      />
    </div>
  );
};

export default MasterSections;
