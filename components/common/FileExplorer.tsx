import React, { useState, useMemo, useEffect } from 'react';
import {
  IconFolderFilled,
  IconFile,
  IconChevronRight,
  IconDownload,
  IconEye,
  IconDots,
  IconHome,
  IconSearch,
  IconX,
  IconTrash,
  IconFolderPlus,
  IconFilePlus,
  IconShare,
  IconFileExport,
} from '@tabler/icons-react';
import { FolderData, FileData, formatFileSize } from '../../data/sdriveData';
import { Dropdown, MenuProps, Empty, Input, Checkbox } from 'antd';
import dayjs from 'dayjs';
import TooltipButton from './TooltipButton';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { getLeadDocumentsThunk } from '@redux/feature/lead/leadThunk';

interface FileExplorerProps {
  rootFolders: FolderData[];
  enableSearch?: boolean;
  onSearchChange?: (query: string) => void;
  enableMultiSelect?: boolean;
  onDelete?: (selectedItems: { id: number; type: 'folder' | 'file' }[]) => void;
  enableAddFolder?: boolean;
  onAddFolder?: (parentId: number | null) => void;
  enableAddFile?: boolean;
  onAddFile?: (parentId: number | null) => void;
  enableShare?: boolean;
  onShare?: (items: { id: number; type: 'folder' | 'file' }[]) => void;
  enableExport?: boolean;
  onExport?: (selectedItems: { id: number; type: 'folder' | 'file' }[]) => void;
  maxHeight?: string;
}

export default function FileExplorer({
  rootFolders,
  enableSearch = false,
  onSearchChange,
  enableMultiSelect = false,
  onDelete,
  enableAddFolder = false,
  onAddFolder,
  enableAddFile = false,
  onAddFile,
  enableShare = false,
  onShare,
  enableExport = false,
  onExport,
  maxHeight
}: FileExplorerProps) {
  const [currentPath, setCurrentPath] = useState<FolderData[]>([]);
  const [currentFolder, setCurrentFolder] = useState<FolderData | any | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [documents, setDocuments] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const { leadDetail } = useAppSelector(state => state.lead);

  // Fetch lead documents only once when leadId is available
  useEffect(() => {
    if (leadDetail?.lead?.leadsId) {
      dispatch(getLeadDocumentsThunk({ leadId: leadDetail.lead.leadsId }))
        .unwrap()
        .then((response) => {
          setDocuments(response);
        })
        .catch((error) => {
          console.error('Error fetching documents:', error);
        });
    }
  }, [leadDetail?.lead?.leadsId]); // Remove dispatch from dependencies
  console.log('Documents stored in local state:', documents);

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  // Get current items (folders and files)
  const getCurrentItems = () => {
  // Root level
  if (!currentFolder) {
    return {
      folders: documents || [],
      files: [],
    };
  }

  // Opened folder
  return {
    folders: currentFolder.subFolders || [],
    files: currentFolder.files || [],
  };
};

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    const { folders, files } = getCurrentItems();

    if (!searchQuery.trim()) {
      return { folders, files };
    }

    const query = searchQuery.toLowerCase();

    const filteredFolders = folders.filter(
      folder =>
        folder.folderName.toLowerCase().includes(query) ||
        folder.owner.toLowerCase().includes(query) 
    );

    const filteredFiles = files.filter(file => file.fileName.toLowerCase().includes(query));

    return { folders: filteredFolders, files: filteredFiles };
  }, [currentFolder, rootFolders, searchQuery, documents]);

  const { folders, files } = filteredItems;

  // Selection Logic
  const toggleSelection = (id: number, type: 'folder' | 'file') => {
    const key = `${type}-${id}`;
    const newSelected = new Set(selectedItems);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedItems(newSelected);
  };

  const isSelected = (id: number, type: 'folder' | 'file') => {
    return selectedItems.has(`${type}-${id}`);
  };

  const handleSelectAll = (e: any) => {
    if (e.target.checked) {
      const newSelected = new Set<string>();
      folders.forEach(f => newSelected.add(`folder-${f.folderId}`));
      files.forEach(f => newSelected.add(`file-${f.fileId}`));
      setSelectedItems(newSelected);
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      const itemsToDelete = Array.from(selectedItems).map(key => {
        const [type, id] = key.split('-');
        return { id: parseInt(id), type: type as 'folder' | 'file' };
      });
      onDelete(itemsToDelete);
      setSelectedItems(new Set());
    }
  };

  const handleAddFolder = () => {
    if (onAddFolder) {
      onAddFolder(currentFolder ? currentFolder.folderId : null);
    }
  };

  const handleAddFile = () => {
    if (onAddFile) {
      onAddFile(currentFolder ? currentFolder.folderId : null);
    }
  };

  const handleExport = () => {
    if (onExport) {
      const itemsToExport = Array.from(selectedItems).map(key => {
        const [type, id] = key.split('-');
        return { id: parseInt(id), type: type as 'folder' | 'file' };
      });
      onExport(itemsToExport);
      setSelectedItems(new Set());
    }
  };

  const handleSingleShare = (id: number, type: 'folder' | 'file') => {
    if (onShare) {
      onShare([{ id, type }]);
    }
  };

  // Navigate into a folder
  const handleFolderClick = (folder: any) => {
    setCurrentPath([...currentPath, currentFolder].filter(Boolean) as FolderData[]);
    setCurrentFolder(folder);
    setSelectedItems(new Set()); // Clear selection on navigation
    setSearchQuery(''); // Clear search on navigation
    if (onSearchChange) onSearchChange('');
  };

  // Navigate to a specific breadcrumb
  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      // Go to root
      setCurrentPath([]);
      setCurrentFolder(null);
    } else {
      // Go to specific folder in path
      const newPath = currentPath.slice(0, index + 1);
      setCurrentFolder(newPath[newPath.length - 1]);
      setCurrentPath(newPath.slice(0, -1));
    }
    setSelectedItems(new Set());
    setSearchQuery('');
    if (onSearchChange) onSearchChange('');
  };

  // File actions menu
  const getFileMenuItems = (file: FileData): MenuProps['items'] => {
    const items: MenuProps['items'] = [
      {
        key: 'view',
        label: 'View',
        icon: <IconEye size={16} />,
        onClick: () => window.open(file.s3Key, '_blank'),
      },
      {
        key: 'download',
        label: 'Download',
        icon: <IconDownload size={16} />,
        onClick: async () => {
          try {
            // Fetch the file from S3
            const response = await fetch(file.s3Key);
            const blob = await response.blob();
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.fileName;
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } catch (error) {
            console.error('Download failed:', error);
            // Fallback to opening in new tab
            window.open(file.s3Key, '_blank');
          }
        },
      },
    ];

    if (enableShare) {
      items.push({
        key: 'share',
        label: 'Share',
        icon: <IconShare size={16} />,
        onClick: () => handleSingleShare(file.fileId, 'file'),
      });
    }

    return items;
  };

  // Folder actions menu
  const getFolderMenuItems = (folder: FolderData): MenuProps['items'] => {
    const items: MenuProps['items'] = [
      {
        key: 'open',
        label: 'Open',
        onClick: () => handleFolderClick(folder),
      },
    ];

    if (enableShare) {
      items.push({
        key: 'share',
        label: 'Share',
        icon: <IconShare size={16} />,
        onClick: () => handleSingleShare(folder.folderId, 'folder'),
      });
    }

    return items;
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return dayjs(dateString).format('DD-MM-YYYY hh:mm A');
    } catch {
      return dateString;
    }
  };

  // Get file icon color based on extension
  const getFileIconColor = (fileName: string) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    const colorMap: Record<string, string> = {
      pdf: '#E74C3C',
      doc: '#3498DB',
      docx: '#3498DB',
      xls: '#27AE60',
      xlsx: '#27AE60',
      ppt: '#E67E22',
      pptx: '#E67E22',
      jpg: '#E67E22',
      jpeg: '#E67E22',
      png: '#9B59B6',
      gif: '#1ABC9C',
      zip: '#95A5A6',
      rar: '#95A5A6',
      mp4: '#1ABC9C',
      mp3: '#F39C12',
      ai: '#FF6B6B',
      fig: '#4A90E2',
      sketch: '#F39C12',
    };
    return colorMap[ext || ''] || '#7F8C8D';
  };

  console.log("document", documents);
  console.log("folders", folders);

  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 mb-3 p-4 bg-card-color rounded-lg">
        <button
          onClick={() => handleBreadcrumbClick(-1)}
          className="flex items-center gap-2 hover:text-primary transition-colors"
          style={{ color: 'var(--font-color-100)' }}
        >
          <IconHome size={18} />
        </button>

        {currentPath.map((folder, index) => (
          <React.Fragment key={folder.folderId}>
            <IconChevronRight size={16} style={{ color: 'var(--font-color-400)' }} />
            <button
              onClick={() => handleBreadcrumbClick(index)}
              className="hover:text-primary transition-colors font-medium"
              style={{ color: 'var(--font-color-100)' }}
            >
              {folder.folderName}
            </button>
          </React.Fragment>
        ))}

        {currentFolder && (
          <>
            <IconChevronRight size={16} style={{ color: 'var(--font-color-400)' }} />
            <span className="text-primary font-semibold">{currentFolder.folderName}</span>
          </>
        )}
      </div>

      {/* Toolbar: Search, Add Folder, Add File, Export, Delete */}
      {(enableSearch || enableAddFolder || enableAddFile || enableMultiSelect || enableExport) && (
        <div className="flex items-center gap-3 mb-2">
          {enableSearch && (
            <div className="flex-1">
              <Input
                size="large"
                placeholder="Search files and folders..."
                value={searchQuery}
                onChange={e => handleSearchChange(e.target.value)}
                prefix={<IconSearch size={18} style={{ color: 'var(--font-color-400)' }} />}
                suffix={
                  searchQuery && (
                    <button
                      onClick={() => handleSearchChange('')}
                      className="rounded-full p-1 transition-colors"
                      style={{
                        backgroundColor: 'transparent',
                        color: 'var(--font-color-400)',
                      }}
                      onMouseEnter={e =>
                        (e.currentTarget.style.backgroundColor = 'var(--border-color)')
                      }
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <IconX size={16} />
                    </button>
                  )
                }
                className="rounded-lg"
                style={{
                  backgroundColor: 'var(--card-color)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--font-color)',
                }}
              />
            </div>
          )}

          {enableAddFolder && selectedItems.size === 0 && (
            <TooltipButton
              title="Create New Folder"
              icon={<IconFolderPlus size={20} />}
              onClick={handleAddFolder}
            />
          )}

          {enableAddFile && selectedItems.size === 0 && (
            <TooltipButton
              title="Upload File"
              icon={<IconFilePlus size={20} />}
              onClick={handleAddFile}
            />
          )}

          {enableExport && selectedItems.size > 0 && (
            <TooltipButton
              title={`Export ${selectedItems.size} items`}
              icon={<IconFileExport size={20} />}
              onClick={handleExport}
            />
          )}

          {enableMultiSelect && selectedItems.size > 0 && (
            <TooltipButton
              title={`Delete ${selectedItems.size} items`}
              icon={<IconTrash size={20} />}
              onClick={handleDelete}
            />
          )}
        </div>
      )}

      {/* Select All Header (Only if multi-select enabled and items exist) */}
      {enableMultiSelect && (folders.length > 0 || files.length > 0) && (
        <div className="flex items-center px-4 py-2 mb-2">
          <Checkbox
            checked={selectedItems.size > 0 && selectedItems.size === folders.length + files.length}
            indeterminate={
              selectedItems.size > 0 && selectedItems.size < folders.length + files.length
            }
            onChange={handleSelectAll}
          >
            <span className="text-sm font-medium" style={{ color: 'var(--font-color-100)' }}>
              Select All
            </span>
          </Checkbox>
        </div>
      )}

      {/* File Explorer Grid */}
      <div className="space-y-2">
        {/* Folders */}
        {folders.length > 0 && (
          <div className="space-y-1">
            {folders.map(folder => (
              <div
                key={folder.folderId}
                className={`flex items-center justify-between p-4 bg-card-color rounded-lg hover:bg-gray-50 transition-all cursor-pointer group ${isSelected(folder.folderId, 'folder') ? 'ring-2 ring-primary ring-opacity-50' : ''
                  }`}
                onClick={() => handleFolderClick(folder)}
              >
                <div className="flex items-center gap-4 flex-1">
                  {enableMultiSelect && (
                    <div onClick={e => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected(folder.folderId, 'folder')}
                        onChange={() => toggleSelection(folder.folderId, 'folder')}
                      />
                    </div>
                  )}
                  <IconFolderFilled size={28} style={{ color: '#f1c40f' }} />

                  <div className="flex flex-col flex-1">
                    <p
                      className="font-semibold group-hover:text-primary transition-colors"
                      style={{ color: 'var(--font-color)' }}
                    >
                      {folder.folderName}
                    </p>
                    <div className="flex gap-3 text-sm" style={{ color: 'var(--font-color-100)' }}>
                      <span>{folder.count} items</span>
                      <span>•</span>
                      <span>Owner: {folder.ownerName || currentFolder?.ownerName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className="text-sm min-w-[180px]"
                    style={{ color: 'var(--font-color-100)' }}
                  >
                    {formatDate(folder.updatedAt)}
                  </span>

                  <Dropdown
                    menu={{ items: getFolderMenuItems(folder) }}
                    trigger={['click']}
                    placement="bottomRight"
                  >
                    <button
                      className="p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      style={{ backgroundColor: 'transparent' }}
                      onMouseEnter={e =>
                        (e.currentTarget.style.backgroundColor = 'var(--border-color)')
                      }
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      onClick={e => e.stopPropagation()}
                    >
                      <IconDots size={20} style={{ color: 'var(--font-color-100)' }} />
                    </button>
                  </Dropdown>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Files */}
        {files.length > 0 && (
          <div className="space-y-1 mt-4">
            {files.map(file => (
              <div
                key={file.fileId}
                className={`flex items-center justify-between p-4 bg-card-color rounded-lg hover:bg-gray-50 transition-all group ${isSelected(file.fileId, 'file') ? 'ring-2 ring-primary ring-opacity-50' : ''
                  }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {enableMultiSelect && (
                    <div onClick={e => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected(file.fileId, 'file')}
                        onChange={() => toggleSelection(file.fileId, 'file')}
                      />
                    </div>
                  )}
                  <IconFile size={28} style={{ color: getFileIconColor(file.fileName) }} />

                  <div className="flex flex-col flex-1">
                    <p className="font-medium" style={{ color: 'var(--font-color)' }}>
                      {file.fileName}
                    </p>
                    <div className="flex gap-3 text-sm" style={{ color: 'var(--font-color-100)' }}>
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{formatDate(file.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className="text-sm min-w-[180px]"
                    style={{ color: 'var(--font-color-100)' }}
                  >
                    {formatDate(file.updatedAt)}
                  </span>

                  <Dropdown
                    menu={{ items: getFileMenuItems(file) }}
                    trigger={['click']}
                    placement="bottomRight"
                  >
                    <button
                      className="p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      style={{ backgroundColor: 'transparent' }}
                      onMouseEnter={e =>
                        (e.currentTarget.style.backgroundColor = 'var(--border-color)')
                      }
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      onClick={e => e.stopPropagation()}
                    >
                      <IconDots size={20} style={{ color: 'var(--font-color-100)' }} />
                    </button>
                  </Dropdown>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {folders.length === 0 && files.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <Empty
              description={
                <span style={{ color: 'var(--font-color-100)' }}>
                  {searchQuery.trim()
                    ? `No results found for "${searchQuery}"`
                    : 'This folder is empty'}
                </span>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
