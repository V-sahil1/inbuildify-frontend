export interface FileData {
    fileId: number;
    fileName: string;
    fileSize: number;
    createdAt: string;
    updatedAt: string;
    signUrl: string;
    thumbnailUrl: string;
}

export interface FolderData {
    folderId: number;
    folderName: string;
    itemsCount: number;
    subFolders: FolderData[];
    files: FileData[];
    createdAt: string;
    updatedAt: string;
    owner: string;
    parentId: number | null;
}

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Dummy data for SDrive
export const sdriveRootFolders: FolderData[] = [
    {
        folderId: 1,
        folderName: 'Projects',
        itemsCount: 15,
        owner: 'Karan Mehta',
        parentId: null,
        createdAt: '2025-01-15T10:30:00Z',
        updatedAt: '2025-11-28T14:20:00Z',
        subFolders: [
            {
                folderId: 11,
                folderName: 'Website Redesign',
                itemsCount: 8,
                owner: 'Karan Mehta',
                parentId: 1,
                createdAt: '2025-02-01T09:00:00Z',
                updatedAt: '2025-11-25T16:45:00Z',
                subFolders: [
                    {
                        folderId: 111,
                        folderName: 'Design Assets',
                        itemsCount: 12,
                        owner: 'Priya Sharma',
                        parentId: 11,
                        createdAt: '2025-02-05T11:20:00Z',
                        updatedAt: '2025-11-20T10:30:00Z',
                        subFolders: [],
                        files: [
                            {
                                fileId: 1111,
                                fileName: 'homepage-mockup.fig',
                                fileSize: 2457600,
                                createdAt: '2025-02-05T11:25:00Z',
                                updatedAt: '2025-11-15T14:20:00Z',
                                signUrl: 'https://example.com/files/homepage-mockup.fig',
                                thumbnailUrl: 'https://via.placeholder.com/150/4A90E2/FFFFFF?text=FIG',
                            },
                            {
                                fileId: 1112,
                                fileName: 'logo-variations.ai',
                                fileSize: 1843200,
                                createdAt: '2025-02-06T10:15:00Z',
                                updatedAt: '2025-11-10T09:30:00Z',
                                signUrl: 'https://example.com/files/logo-variations.ai',
                                thumbnailUrl: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=AI',
                            },
                            {
                                fileId: 1113,
                                fileName: 'color-palette.pdf',
                                fileSize: 524288,
                                createdAt: '2025-02-07T14:30:00Z',
                                updatedAt: '2025-11-05T11:20:00Z',
                                signUrl: 'https://example.com/files/color-palette.pdf',
                                thumbnailUrl: 'https://via.placeholder.com/150/E74C3C/FFFFFF?text=PDF',
                            },
                        ],
                    },
                    {
                        folderId: 112,
                        folderName: 'Development',
                        itemsCount: 5,
                        owner: 'Rahul Kumar',
                        parentId: 11,
                        createdAt: '2025-02-10T08:45:00Z',
                        updatedAt: '2025-11-28T13:15:00Z',
                        subFolders: [],
                        files: [
                            {
                                fileId: 1121,
                                fileName: 'requirements.docx',
                                fileSize: 1048576,
                                createdAt: '2025-02-10T09:00:00Z',
                                updatedAt: '2025-11-20T15:40:00Z',
                                signUrl: 'https://example.com/files/requirements.docx',
                                thumbnailUrl: 'https://via.placeholder.com/150/3498DB/FFFFFF?text=DOCX',
                            },
                            {
                                fileId: 1122,
                                fileName: 'api-documentation.pdf',
                                fileSize: 2097152,
                                createdAt: '2025-02-12T10:30:00Z',
                                updatedAt: '2025-11-18T12:00:00Z',
                                signUrl: 'https://example.com/files/api-documentation.pdf',
                                thumbnailUrl: 'https://via.placeholder.com/150/E74C3C/FFFFFF?text=PDF',
                            },
                        ],
                    },
                ],
                files: [
                    {
                        fileId: 110,
                        fileName: 'project-brief.pdf',
                        fileSize: 3145728,
                        createdAt: '2025-02-01T09:15:00Z',
                        updatedAt: '2025-11-22T10:00:00Z',
                        signUrl: 'https://example.com/files/project-brief.pdf',
                        thumbnailUrl: 'https://via.placeholder.com/150/E74C3C/FFFFFF?text=PDF',
                    },
                ],
            },
            {
                folderId: 12,
                folderName: 'Mobile App',
                itemsCount: 6,
                owner: 'Manish M.',
                parentId: 1,
                createdAt: '2025-03-01T10:00:00Z',
                updatedAt: '2025-11-27T09:30:00Z',
                subFolders: [],
                files: [
                    {
                        fileId: 121,
                        fileName: 'app-wireframes.sketch',
                        fileSize: 5242880,
                        createdAt: '2025-03-02T11:00:00Z',
                        updatedAt: '2025-11-25T14:30:00Z',
                        signUrl: 'https://example.com/files/app-wireframes.sketch',
                        thumbnailUrl: 'https://via.placeholder.com/150/F39C12/FFFFFF?text=SKETCH',
                    },
                    {
                        fileId: 122,
                        fileName: 'user-flow.png',
                        fileSize: 1572864,
                        createdAt: '2025-03-05T15:20:00Z',
                        updatedAt: '2025-11-20T16:00:00Z',
                        signUrl: 'https://example.com/files/user-flow.png',
                        thumbnailUrl: 'https://via.placeholder.com/150/9B59B6/FFFFFF?text=PNG',
                    },
                ],
            },
        ],
        files: [
            {
                fileId: 10,
                fileName: 'project-overview.xlsx',
                fileSize: 2621440,
                createdAt: '2025-01-15T10:45:00Z',
                updatedAt: '2025-11-28T11:00:00Z',
                signUrl: 'https://example.com/files/project-overview.xlsx',
                thumbnailUrl: 'https://via.placeholder.com/150/27AE60/FFFFFF?text=XLSX',
            },
        ],
    },
    {
        folderId: 2,
        folderName: 'Documents',
        itemsCount: 20,
        owner: 'Karan Mehta',
        parentId: null,
        createdAt: '2025-01-10T08:00:00Z',
        updatedAt: '2025-11-29T10:15:00Z',
        subFolders: [
            {
                folderId: 21,
                folderName: 'Contracts',
                itemsCount: 8,
                owner: 'Legal Team',
                parentId: 2,
                createdAt: '2025-01-12T09:30:00Z',
                updatedAt: '2025-11-28T15:00:00Z',
                subFolders: [],
                files: [
                    {
                        fileId: 211,
                        fileName: 'vendor-agreement-2025.pdf',
                        fileSize: 4194304,
                        createdAt: '2025-01-12T10:00:00Z',
                        updatedAt: '2025-11-15T12:30:00Z',
                        signUrl: 'https://example.com/files/vendor-agreement-2025.pdf',
                        thumbnailUrl: 'https://via.placeholder.com/150/E74C3C/FFFFFF?text=PDF',
                    },
                    {
                        fileId: 212,
                        fileName: 'nda-template.docx',
                        fileSize: 786432,
                        createdAt: '2025-01-15T11:20:00Z',
                        updatedAt: '2025-11-10T09:45:00Z',
                        signUrl: 'https://example.com/files/nda-template.docx',
                        thumbnailUrl: 'https://via.placeholder.com/150/3498DB/FFFFFF?text=DOCX',
                    },
                ],
            },
            {
                folderId: 22,
                folderName: 'Reports',
                itemsCount: 12,
                owner: 'Analytics Team',
                parentId: 2,
                createdAt: '2025-02-01T10:00:00Z',
                updatedAt: '2025-11-29T08:30:00Z',
                subFolders: [],
                files: [
                    {
                        fileId: 221,
                        fileName: 'q4-2024-report.pdf',
                        fileSize: 6291456,
                        createdAt: '2025-02-01T10:30:00Z',
                        updatedAt: '2025-11-25T14:00:00Z',
                        signUrl: 'https://example.com/files/q4-2024-report.pdf',
                        thumbnailUrl: 'https://via.placeholder.com/150/E74C3C/FFFFFF?text=PDF',
                    },
                    {
                        fileId: 222,
                        fileName: 'sales-analysis.xlsx',
                        fileSize: 3145728,
                        createdAt: '2025-02-05T09:15:00Z',
                        updatedAt: '2025-11-28T16:20:00Z',
                        signUrl: 'https://example.com/files/sales-analysis.xlsx',
                        thumbnailUrl: 'https://via.placeholder.com/150/27AE60/FFFFFF?text=XLSX',
                    },
                ],
            },
        ],
        files: [],
    },
    {
        folderId: 3,
        folderName: 'Media',
        itemsCount: 35,
        owner: 'Marketing Team',
        parentId: null,
        createdAt: '2025-01-05T12:00:00Z',
        updatedAt: '2025-11-30T09:00:00Z',
        subFolders: [
            {
                folderId: 31,
                folderName: 'Images',
                itemsCount: 25,
                owner: 'Design Team',
                parentId: 3,
                createdAt: '2025-01-06T10:30:00Z',
                updatedAt: '2025-11-29T14:45:00Z',
                subFolders: [],
                files: [
                    {
                        fileId: 311,
                        fileName: 'banner-hero.jpg',
                        fileSize: 2097152,
                        createdAt: '2025-01-06T11:00:00Z',
                        updatedAt: '2025-11-20T10:15:00Z',
                        signUrl: 'https://example.com/files/banner-hero.jpg',
                        thumbnailUrl: 'https://via.placeholder.com/150/E67E22/FFFFFF?text=JPG',
                    },
                    {
                        fileId: 312,
                        fileName: 'product-showcase.png',
                        fileSize: 3670016,
                        createdAt: '2025-01-08T14:20:00Z',
                        updatedAt: '2025-11-18T11:30:00Z',
                        signUrl: 'https://example.com/files/product-showcase.png',
                        thumbnailUrl: 'https://via.placeholder.com/150/9B59B6/FFFFFF?text=PNG',
                    },
                ],
            },
            {
                folderId: 32,
                folderName: 'Videos',
                itemsCount: 10,
                owner: 'Video Team',
                parentId: 3,
                createdAt: '2025-01-10T09:00:00Z',
                updatedAt: '2025-11-28T16:00:00Z',
                subFolders: [],
                files: [
                    {
                        fileId: 321,
                        fileName: 'product-demo.mp4',
                        fileSize: 52428800,
                        createdAt: '2025-01-10T09:30:00Z',
                        updatedAt: '2025-11-22T13:45:00Z',
                        signUrl: 'https://example.com/files/product-demo.mp4',
                        thumbnailUrl: 'https://via.placeholder.com/150/1ABC9C/FFFFFF?text=MP4',
                    },
                ],
            },
        ],
        files: [],
    },
    {
        folderId: 4,
        folderName: 'Archives',
        itemsCount: 50,
        owner: 'Admin',
        parentId: null,
        createdAt: '2024-06-01T08:00:00Z',
        updatedAt: '2025-10-15T10:00:00Z',
        subFolders: [],
        files: [
            {
                fileId: 401,
                fileName: '2024-backup.zip',
                fileSize: 104857600,
                createdAt: '2024-12-31T23:59:00Z',
                updatedAt: '2025-01-01T00:15:00Z',
                signUrl: 'https://example.com/files/2024-backup.zip',
                thumbnailUrl: 'https://via.placeholder.com/150/95A5A6/FFFFFF?text=ZIP',
            },
        ],
    },
];

// Get all folders and files for a specific type
export const getSdriveDataByType = (type: string): FolderData[] => {
    // You can filter or return different data based on type
    // For now, returning the same data for all types
    return sdriveRootFolders;
};
