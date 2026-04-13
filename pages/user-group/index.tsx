import StatusSelect from '@/components/common/custom-selects/StatusSelect';
import { userGroupColumn } from '@/components/table-columns/userGroupColumn';
import { Button, Empty, Input, message, Spin, Table } from 'antd';
import { debouncedURL } from '@lib/utils/debounceURL';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { useUserGroupField } from '@/components/formFields/userGroupFields';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchAllUserGroup } from '@redux/feature/userGroup/userGroupThunk';
import { Status } from '@lib/constants/enum';
import { IconLoader2 } from '@tabler/icons-react';

const UserGroup = () => {
  const dispatch = useAppDispatch();
  const { status, pagination } = useAppSelector(state => state.userGroup);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [renderList, setRenderList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const inFlightRequestsRef = useRef(new Set<string>());
  const userGroupFields = useUserGroupField();
  const isLoading = status.fetch === Status.PENDING;
  const { column, userGroupSubmit } = userGroupColumn(
    setModalOpen,
    setSelectedGroup,
    selectedGroup
  );
  const { debouncedUpdateURL, setParams, filters, resetParams, instantFilters } = debouncedURL({
    filtersKey: ['groupName', 'status'],
    initialValue: { status: 'true' },
  });

  const getIsActiveValue = () => {
    if (filters?.status === 'true') return true;
    if (filters?.status === 'false') return false;
    return undefined;
  };

  const fetchUserGroup = useCallback(async (pageToLoad: number, append: boolean) => {
    const requestKey = JSON.stringify({
      pageToLoad,
      append,
      groupName: filters?.groupName || '',
      status: filters?.status || '',
    });
    if (inFlightRequestsRef.current.has(requestKey)) return;

    try {
      inFlightRequestsRef.current.add(requestKey);
      if (append) setIsLoadingMore(true);

      const payload = await dispatch(
        fetchAllUserGroup({
          page: pageToLoad,
          limit: 20,
          isActive: getIsActiveValue(),
          search: filters?.groupName?.trim() || undefined,
          append,
        })
      ).unwrap();

      const nextItems = payload?.userGroups || [];
      const nextPagination = payload?.pagination || {
        currentPage: pageToLoad,
        totalPages: 0,
      };

      setRenderList(prev => {
        if (!append) return nextItems;
        const merged = [...prev, ...nextItems];
        const byId = new Map(merged.map(item => [item.userGroupId, item]));
        return Array.from(byId.values());
      });
      setHasMore((nextPagination.currentPage || pageToLoad) < (nextPagination.totalPages || 0));
    } catch (error) {
      message.error(error || 'Failed to fetch user group');
    } finally {
      inFlightRequestsRef.current.delete(requestKey);
      if (append) setIsLoadingMore(false);
    }
  }, [dispatch, filters?.groupName, filters?.status]);

  useEffect(() => {
    setCurrentPage(1);
    setRenderList([]);
    setHasMore(true);
  }, [filters?.groupName, filters?.status]);

  useEffect(() => {
    fetchUserGroup(currentPage, currentPage > 1);
  }, [currentPage, fetchUserGroup]);

  useEffect(() => {
    if (status.create === Status.SUCCESS) {
      setCurrentPage(1);
      setRenderList([]);
      setHasMore(true);
      fetchUserGroup(1, false);
    }
  }, [fetchUserGroup, status.create]);

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Group List</h1>
        <div className="flex gap-2">
          <Button type="primary" onClick={() => {}}>
            Total Records {pagination?.totalRecords || 0}
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            New Group
          </Button>
        </div>
      </div>
      <div className="flex items-end gap-3 mb-2 ">
        <div>
          <p>Status</p>
          <StatusSelect
            value={instantFilters?.status}
            onChange={value => setParams({ status: value })}
            activeInactive={true}
            width={200}
          />
        </div>
        <div>
          <p>Group</p>
          <Input
            value={instantFilters?.groupName}
            onChange={e => setParams({ groupName: e.target.value })}
          />
        </div>
        <Button onClick={() => resetParams()}>Clear</Button>
      </div>
      <div
        className="rounded-lg shadow-sm overflow-auto max-h-[70vh]"
        style={{
          backgroundColor: 'var(--card-color)',
          border: '1px solid var(--border-color)',
        }}
        onScroll={event => {
          const target = event.currentTarget;
          const nearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 120;
          if (nearBottom && hasMore && !isLoadingMore && !isLoading) {
            setCurrentPage(prev => prev + 1);
          }
        }}
      >
        <Spin spinning={isLoading && currentPage === 1} tip="Loading user groups...">
          <Table
            columns={column}
            dataSource={renderList}
            rowKey={record => record.userGroupId}
            pagination={false}
            locale={{
              emptyText: (
                <Empty
                  description={
                    filters?.groupName || (filters?.status ?? '') !== 'true'
                      ? 'No user groups match your filters'
                      : 'No user groups found'
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
          />
          <div className="py-3 text-center text-sm" style={{ color: 'var(--font-color-100)' }}>
            {isLoadingMore ? (
              <span className="inline-flex items-center gap-2">
                <IconLoader2 size={14} className="animate-spin" />
                Loading more user groups...
              </span>
            ) : hasMore && renderList.length > 0 ? (
              'Scroll to load more'
            ) : renderList.length > 0 ? (
              'You have reached the end'
            ) : null}
          </div>
        </Spin>
      </div>
      {modalOpen && (
        <ActionDialogmodel
          title="User Group"
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onSubmit={values => {
            userGroupSubmit(values);
          }}
          fields={userGroupFields}
          isEditing={!!selectedGroup}
          initialValues={
            selectedGroup && { ...selectedGroup, usersId: selectedGroup.users?.map(i => i.id) }
          }
        />
      )}
    </div>
  );
};

export default UserGroup;
