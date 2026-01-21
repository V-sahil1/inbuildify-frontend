import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Status } from '@lib/constants/enum';
import { message } from 'antd';
import { fetchAllDocumentArea } from '@redux/feature/admin/document/area/documentAreaThunk';

export const useCommonFolderHook = () => {
  const dispatch = useAppDispatch();
  const { commonFolder, status } = useAppSelector((state: RootState) => state.document.area);

  const fetchCommonFolderData = async () => {
    try {
      await dispatch(fetchAllDocumentArea()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch folders');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchCommonFolderData();
    }
  }, [status.fetch]);

  const folderOptions =
    commonFolder &&
    commonFolder.length > 0 &&
    commonFolder.map(type => ({
      label: type.name,
      value: type.documentCommonFolderId,
    }));

  return {
    folderOptions,
    isLoading: status.fetch === Status.PENDING,
  };
};
