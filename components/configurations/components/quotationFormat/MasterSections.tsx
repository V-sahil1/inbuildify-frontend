import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import dayjs from 'dayjs';
import { IconEdit, IconTrash, IconPlus, IconMinus, IconCopy } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import Loading from '@/components/common/Loading';
import {
  getCreateMasterFields,
  getQuotationFormatFields,
} from '../../../formFields/quotationFormatFields';
import { MasterGroup, MasterHeading, MasterItem } from '../../../../data/quotationFormatData';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import {
  getQuotationFormatMasterSectionsHeadersThunk,
  getQuotationFormatMasterSectionsItemsThunk,
  getQuotationFormatMasterSectionsThunk,
  createQuotationFormatMasterSectionHeaderThunk,
  createQuotationFormatMasterSectionItemThunk,
  deleteQuotationFormatMasterSectionThunk,
  deleteQuotationFormatMasterSectionHeaderThunk,
  deleteQuotationFormatMasterSectionItemThunk,
  updateQuotationFormatMasterSectionItemThunk,
  updateQuotationFormatMasterSectionThunk,
  updateQuotationFormatMasterSectionHeaderThunk,
  DEFAULT_PAGE_LIMIT,
} from '@redux/feature/quotation-format/quotationFormatThunk';


const MasterSections: React.FC = () => {
  const dispatch = useAppDispatch();
  const masters = useAppSelector(state => state.quotationFormat.masters);
  const pagination = useAppSelector(state => state.quotationFormat.pagination);
  const headersPagination = useAppSelector(state => state.quotationFormat.headersPagination);
  const itemsPagination = useAppSelector(state => state.quotationFormat.itemsPagination);
  const statusState = useAppSelector(state => state.quotationFormat.status);
  const errors = useAppSelector(state => state.quotationFormat.errors);

  useEffect(() => {
    dispatch(getQuotationFormatMasterSectionsThunk({ page: 1, limit: DEFAULT_PAGE_LIMIT }));
  }, [dispatch]);

  const [expanded, setExpanded] = useState<{ masters: (number | string)[]; headings: (number | string)[] }>({
    masters: [],
    headings: [],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'heading' | 'item'>('item');
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState<
    | { type: 'heading'; masterId: number | string; headingId: number | string | null }
    | { type: 'item'; headingId: number | string; itemId: number | string | null }
    | null
  >(null);

  const [masterEditOpen, setMasterEditOpen] = useState(false);
  const [editingMaster, setEditingMaster] = useState<MasterGroup | null>(null);
  const [initialValues, setInitialValues] = useState<any>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<
    | { type: 'master'; master: MasterGroup }
    | { type: 'heading'; masterId: number | string; heading: MasterHeading }
    | { type: 'item'; headingId: number | string; item: MasterItem }
    | null
  >(null);

  const isFetchingMasters = statusState.fetchMasterSections === Status.PENDING;
  const isLoadingMoreMasters = statusState.loadMoreMasterSections === Status.PENDING;
  const isMastersError = statusState.fetchMasterSections === Status.ERROR;

  const toggleMaster = (id: number | string) => {
    const isExpanding = !expanded.masters?.includes(id);
    setExpanded(prev => ({
      ...prev,
      masters: prev.masters?.includes(id)
        ? prev.masters?.filter(x => x !== id)
        : [...prev.masters, id],
    }));

    if (isExpanding) {
      const master = masters?.find(m => m.id === id);
      if (master && master.masterSectionId) {
        dispatch(getQuotationFormatMasterSectionsHeadersThunk({
          masterSectionId: master.masterSectionId,
          page: 1,
          limit: DEFAULT_PAGE_LIMIT,
        }));
      }
    }
  };

  const handleLoadMoreMasters = () => {
    if (!pagination.hasMore || isLoadingMoreMasters) return;
    dispatch(getQuotationFormatMasterSectionsThunk({
      page: pagination.currentPage + 1,
      limit: pagination.limit || DEFAULT_PAGE_LIMIT,
    }));
  };

  const handleLoadMoreHeadings = (masterSectionId: string) => {
    const pag = headersPagination[masterSectionId];
    if (!pag || !pag.hasMore) return;
    if (statusState.loadMoreHeaders[masterSectionId] === Status.PENDING) return;
    dispatch(getQuotationFormatMasterSectionsHeadersThunk({
      masterSectionId,
      page: pag.currentPage + 1,
      limit: pag.limit || DEFAULT_PAGE_LIMIT,
    }));
  };

  const handleLoadMoreItems = (headingId: string) => {
    const pag = itemsPagination[headingId];
    if (!pag || !pag.hasMore) return;
    if (statusState.loadMoreItems[headingId] === Status.PENDING) return;
    dispatch(getQuotationFormatMasterSectionsItemsThunk({
      masterSectionId: headingId,
      page: pag.currentPage + 1,
      limit: pag.limit || DEFAULT_PAGE_LIMIT,
    }));
  };

  const handleMasterEditSubmit = (values: any) => {
    if (!editingMaster) return;

    const targetId = editingMaster.masterSectionId || editingMaster.id;
    if (!targetId) {
      message.error('Master section ID is missing');
      return;
    }

    const payload = {
      masterName: values.masterName || '',
      status: values.status === 'active' || values.status === true,
    };

    dispatch(updateQuotationFormatMasterSectionThunk({ id: String(targetId), payload }))
      .unwrap()
      .then((res) => {
        message.success(res.message || 'Master section updated successfully');
        setMasterEditOpen(false);
        setEditingMaster(null);
      })
      .catch((err) => {
        message.error(err || 'Failed to update master section');
      });
  };

  const toggleHeading = (id: number | string) => {
    const isExpanding = !expanded.headings.includes(id);
    setExpanded(prev => ({
      ...prev,
      headings: prev.headings.includes(id)
        ? prev.headings.filter(x => x !== id)
        : [...prev.headings, id],
    }));

    if (isExpanding) {
      dispatch(getQuotationFormatMasterSectionsItemsThunk({
        masterSectionId: String(id),
        page: 1,
        limit: DEFAULT_PAGE_LIMIT,
      }));
    }
  };

  const isMasterExpanded = (id: number | string) => expanded.masters?.includes(id);
  const isHeadingExpanded = (id: number | string) => expanded.headings.includes(id);

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
        startDate: heading.startDate ? dayjs(heading.startDate) : null,
        endDate: heading.endDate ? dayjs(heading.endDate) : null,
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
        startDate: item.startDate ? dayjs(item.startDate) : null,
        endDate: item.endDate ? dayjs(item.endDate) : null,
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
      const master = masters?.find(m => m.id === deleteTarget.masterId);
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
      const targetId = master.masterSectionId || master.id;
      if (!targetId) {
        message.error('Master section ID is missing');
        return;
      }
      dispatch(deleteQuotationFormatMasterSectionThunk(String(targetId)))
        .unwrap()
        .then((res: any) => {
          message.success(res?.data?.message || res?.message || 'Master section deleted successfully');
          setExpanded(prev => ({
            masters: prev.masters?.filter(id => id !== master.id),
            headings: prev.headings,
          }));
        })
        .catch((err) => {
          message.error(err || 'Failed to delete master section');
        });
    } else if (deleteTarget.type === 'heading') {
      const { heading } = deleteTarget;
      const targetId = heading.id;
      if (!targetId) {
        message.error('Heading ID is missing');
        return;
      }
      dispatch(deleteQuotationFormatMasterSectionHeaderThunk(String(targetId)))
        .unwrap()
        .then((res: any) => {
          message.success(res?.data?.message || res?.message || 'Heading deleted successfully');
          setExpanded(prev => ({
            masters: prev.masters,
            headings: prev.headings.filter(id => id !== heading.id),
          }));
        })
        .catch((err) => {
          message.error(err || 'Failed to delete heading');
        });
    } else if (deleteTarget.type === 'item') {
      const { item } = deleteTarget;
      const targetId = item.id;
      if (!targetId) {
        message.error('Item ID is missing');
        return;
      }
      dispatch(deleteQuotationFormatMasterSectionItemThunk(String(targetId)))
        .unwrap()
        .then((res: any) => {
          message.success(res?.data?.message || res?.message || 'Item deleted successfully');
        })
        .catch((err) => {
          message.error(err || 'Failed to delete item');
        });
    }

    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleSubmitModal = (values: any) => {
    const sel = selected;
    if (!sel) {
      handleCloseModal();
      return;
    }

    if (modalType === 'heading') {
      if (sel.type !== 'heading') {
        handleCloseModal();
        return;
      }

      if (!isEditing) {
        const group = masters.find(m => m.id === sel.masterId);
        const masterSectionId = group?.masterSectionId;
        if (!masterSectionId) {
          message.error('Master section ID is missing');
          return;
        }

        const payload = {
          headingName: values.name || '',
          effectiveStartDate: values.startDate || null,
          effectiveEndDate: values.endDate || null,
          sortOrder: values.sortOrder ? Number(values.sortOrder) : 1,
          status: values.status === 'Active' ? true : false,
        };

        dispatch(createQuotationFormatMasterSectionHeaderThunk({ masterSectionId, payload }))
          .unwrap()
          .then((res) => {
            message.success(res.message || 'Heading created successfully');
            handleCloseModal();
          })
          .catch((err) => {
            message.error(err || 'Failed to create heading');
          });
        return;
      }

      if (isEditing && sel.headingId != null) {
        const payload = {
          headingName: values.name || '',
          effectiveStartDate: values.startDate || null,
          effectiveEndDate: values.endDate || null,
          sortOrder: values.sortOrder ? Number(values.sortOrder) : 1,
          status: values.status === 'Active' ? true : false,
        };

        dispatch(updateQuotationFormatMasterSectionHeaderThunk({ headerId: String(sel.headingId), payload }))
          .unwrap()
          .then((res) => {
            message.success(res.message || 'Heading updated successfully');
            handleCloseModal();
          })
          .catch((err) => {
            message.error(err || 'Failed to update heading');
          });
        return;
      }
    } else {
      if (sel.type !== 'item') {
        handleCloseModal();
        return;
      }

      if (!isEditing) {
        const masterSectionHeaderId = sel.headingId;
        if (!masterSectionHeaderId) {
          message.error('Heading ID is missing');
          return;
        }

        const payload = {
          itemName: values.name || '',
          effectiveStartDate: values.startDate || null,
          effectiveEndDate: values.endDate || null,
          sortOrder: values.sortOrder ? Number(values.sortOrder) : 1,
          status: values.status === 'Active' ? true : false,
        };

        dispatch(createQuotationFormatMasterSectionItemThunk({ masterSectionHeaderId: String(masterSectionHeaderId), payload }))
          .unwrap()
          .then((res) => {
            message.success(res.message || 'Item created successfully');
            handleCloseModal();
          })
          .catch((err) => {
            message.error(err || 'Failed to create item');
          });
        return;
      }

      if (isEditing && sel.itemId != null) {
        const payload = {
          itemName: values.name || '',
          effectiveStartDate: values.startDate || null,
          effectiveEndDate: values.endDate || null,
          sortOrder: values.sortOrder ? Number(values.sortOrder) : 1,
          status: values.status === 'Active' ? true : false,
        };

        dispatch(updateQuotationFormatMasterSectionItemThunk({ itemId: String(sel.itemId), payload }))
          .unwrap()
          .then((res) => {
            message.success(res.message || 'Item updated successfully');
            handleCloseModal();
          })
          .catch((err) => {
            message.error(err || 'Failed to update item');
          });
        return;
      }
    }
    handleCloseModal();
  };

  const renderMasterListBody = () => {
    if (isFetchingMasters && masters.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center">
          <Loading type="primary" />
        </div>
      );
    }

    if (isMastersError && masters.length === 0) {
      return (
        <div className="h-64 flex flex-col items-center justify-center text-sm text-danger gap-2">
          <span>{errors.fetchMasterSections || 'Failed to load master sections'}</span>
          <Button
            size="small"
            onClick={() =>
              dispatch(getQuotationFormatMasterSectionsThunk({ page: 1, limit: DEFAULT_PAGE_LIMIT }))
            }
          >
            Retry
          </Button>
        </div>
      );
    }

    if (!masters || masters.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-sm text-font-color">
          No master sections found
        </div>
      );
    }

    return masters.map(master => {
      const masterKey = String(master.masterSectionId || master.id);
      const fetchHeadersStatus = statusState.fetchHeaders[masterKey];
      const loadMoreHeadersStatus = statusState.loadMoreHeaders[masterKey];
      const headersError = errors.fetchHeaders[masterKey];
      const headersPag = master.masterSectionId ? headersPagination[master.masterSectionId] : undefined;
      const isHeadersLoading = fetchHeadersStatus === Status.PENDING;
      const isHeadersError = fetchHeadersStatus === Status.ERROR;
      const isHeadersLoadMoreLoading = loadMoreHeadersStatus === Status.PENDING;

      return (
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

          {isMasterExpanded(master.id) && (
            <>
              {isHeadersLoading && (!master.headings || master.headings.length === 0) ? (
                <div className="flex items-center justify-center py-6 border-b border-gray-100">
                  <Loading type="primary" />
                </div>
              ) : isHeadersError && (!master.headings || master.headings.length === 0) ? (
                <div className="flex flex-col items-center justify-center gap-2 py-6 text-sm text-danger border-b border-gray-100">
                  <span>{headersError || 'Failed to load headings'}</span>
                  <Button
                    size="small"
                    onClick={() =>
                      master.masterSectionId &&
                      dispatch(getQuotationFormatMasterSectionsHeadersThunk({
                        masterSectionId: master.masterSectionId,
                        page: 1,
                        limit: DEFAULT_PAGE_LIMIT,
                      }))
                    }
                  >
                    Retry
                  </Button>
                </div>
              ) : !master.headings || master.headings.length === 0 ? (
                <div className="flex items-center justify-center py-3 text-xs text-gray-400 border-b border-gray-100">
                  No headings found
                </div>
              ) : (
                <>
                  {master.headings.map(heading => {
                    const headingKey = String(heading.id);
                    const fetchItemsStatus = statusState.fetchItems[headingKey];
                    const loadMoreItemsStatus = statusState.loadMoreItems[headingKey];
                    const itemsError = errors.fetchItems[headingKey];
                    const itemsPag = itemsPagination[headingKey];
                    const isItemsLoading = fetchItemsStatus === Status.PENDING;
                    const isItemsError = fetchItemsStatus === Status.ERROR;
                    const isItemsLoadMoreLoading = loadMoreItemsStatus === Status.PENDING;

                    return (
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

                        {isHeadingExpanded(heading.id) && (
                          <>
                            {isItemsLoading && (!heading.items || heading.items.length === 0) ? (
                              <div className="flex items-center justify-center py-6 border-b border-gray-100">
                                <Loading type="primary" />
                              </div>
                            ) : isItemsError && (!heading.items || heading.items.length === 0) ? (
                              <div className="flex flex-col items-center justify-center gap-2 py-6 text-sm text-danger border-b border-gray-100">
                                <span>{itemsError || 'Failed to load items'}</span>
                                <Button
                                  size="small"
                                  onClick={() =>
                                    dispatch(getQuotationFormatMasterSectionsItemsThunk({
                                      masterSectionId: String(heading.id),
                                      page: 1,
                                      limit: DEFAULT_PAGE_LIMIT,
                                    }))
                                  }
                                >
                                  Retry
                                </Button>
                              </div>
                            ) : !heading.items || heading.items.length === 0 ? (
                              <div className="flex items-center justify-center py-3 text-xs text-gray-400 border-b border-gray-100">
                                No items found
                              </div>
                            ) : (
                              <>
                                {heading.items.map(item => (
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
                                {itemsPag?.hasMore && (
                                  <div className="flex items-center justify-center py-2 border-b border-gray-100">
                                    <Button
                                      size="small"
                                      loading={isItemsLoadMoreLoading}
                                      onClick={() => handleLoadMoreItems(headingKey)}
                                    >
                                      Load More Items
                                    </Button>
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {headersPag?.hasMore && master.masterSectionId && (
                    <div className="flex items-center justify-center py-2 border-b border-gray-100">
                      <Button
                        size="small"
                        loading={isHeadersLoadMoreLoading}
                        onClick={() => handleLoadMoreHeadings(master.masterSectionId!)}
                      >
                        Load More Headings
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="rounded bg-card-color text-md min-h-[260px]">
      <div className="px-2 py-3">
        {renderMasterListBody()}
        {masters.length > 0 && pagination.hasMore && (
          <div className="flex items-center justify-center py-3">
            <Button
              type="primary"
              size="small"
              loading={isLoadingMoreMasters}
              onClick={handleLoadMoreMasters}
            >
              Load More
            </Button>
          </div>
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
