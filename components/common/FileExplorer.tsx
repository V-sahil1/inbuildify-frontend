import React, { useState, useMemo } from 'react';
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
} from '@tabler/icons-react';
import { FolderData, FileData, formatFileSize } from '@/data/sdriveData';
import { Dropdown, MenuProps, Empty, Input } from 'antd';
import dayjs from 'dayjs';

interface FileExplorerProps {
    rootFolders: FolderData[];
    enableSearch?: boolean;
    onSearchChange?: (query: string) => void;
}

export default function FileExplorer({
    rootFolders,
    enableSearch = false,
    onSearchChange,
}: FileExplorerProps) {
    const [currentPath, setCurrentPath] = useState<FolderData[]>([]);
    const [currentFolder, setCurrentFolder] = useState<FolderData | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Handle search change
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        if (onSearchChange) {
            onSearchChange(value);
        }
    };

    // Get current items (folders and files)
    const getCurrentItems = () => {
        if (!currentFolder) {
            return { folders: rootFolders, files: [] };
        }
        return { folders: currentFolder.subFolders, files: currentFolder.files };
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
    }, [currentFolder, rootFolders, searchQuery]);

    const { folders, files } = filteredItems;

    // Navigate into a folder
    const handleFolderClick = (folder: FolderData) => {
        setCurrentPath([...currentPath, currentFolder].filter(Boolean) as FolderData[]);
        setCurrentFolder(folder);
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
    };

    // File actions menu
    const getFileMenuItems = (file: FileData): MenuProps['items'] => [
        {
            key: 'view',
            label: 'View',
            icon: <IconEye size={16} />,
            onClick: () => window.open(file.signUrl, '_blank'),
        },
        {
            key: 'download',
            label: 'Download',
            icon: <IconDownload size={16} />,
            onClick: () => {
                const link = document.createElement('a');
                link.href = file.signUrl;
                link.download = file.fileName;
                link.click();
            },
        },
    ];

    // Folder actions menu
    const getFolderMenuItems = (folder: FolderData): MenuProps['items'] => [
        {
            key: 'open',
            label: 'Open',
            onClick: () => handleFolderClick(folder),
        },
    ];

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
        const ext = fileName.split('.').pop()?.toLowerCase();
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
                    {/* <span className="font-medium">Home</span> */}
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

            {/* Search Bar */}
            {enableSearch && (
                <div className="mb-2">
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

            {/* File Explorer Grid */}
            <div className="space-y-2">
                {/* Folders */}
                {folders.length > 0 && (
                    <div className="space-y-1">
                        {folders.map(folder => (
                            <div
                                key={folder.folderId}
                                className="flex items-center justify-between p-4 bg-card-color rounded-lg hover:bg-gray-50 transition-all cursor-pointer group"
                                onClick={() => handleFolderClick(folder)}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <IconFolderFilled size={28} style={{ color: '#f1c40f' }} />

                                    <div className="flex flex-col flex-1">
                                        <p
                                            className="font-semibold group-hover:text-primary transition-colors"
                                            style={{ color: 'var(--font-color)' }}
                                        >
                                            {folder.folderName}
                                        </p>
                                        <div className="flex gap-3 text-sm" style={{ color: 'var(--font-color-100)' }}>
                                            <span>{folder.itemsCount} items</span>
                                            <span>•</span>
                                            <span>Owner: {folder.owner}</span>
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
                                className="flex items-center justify-between p-4 bg-card-color rounded-lg hover:bg-gray-50 transition-all group"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <IconFile size={28} style={{ color: getFileIconColor(file.fileName) }} />

                                    <div className="flex flex-col flex-1">
                                        <p className="font-medium" style={{ color: 'var(--font-color)' }}>
                                            {file.fileName}
                                        </p>
                                        <div className="flex gap-3 text-sm" style={{ color: 'var(--font-color-100)' }}>
                                            <span>{formatFileSize(file.fileSize)}</span>
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
