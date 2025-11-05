export const commonFolderData = [
  {
    key: '1',
    name: 'Parent Folder 1',
    roles: 'Admin',
    sortOrder: 1,
    notify: 'Yes',
    shareToCustomer: 'Yes',
    lock: 'No',
    isChild: false,
    children: [
      {
        key: '1-1',
        name: ' Folder 1',
        sortOrder: 1,
      },
      {
        key: '1-2',
        name: 'Child Folder 2',
        sortOrder: 2,
      },
    ],
  },
  {
    key: '2',
    name: 'Parent Folder 2',
    roles: 'User',
    sortOrder: 2,
    notify: 'No',
    shareToCustomer: 'No',
    lock: 'Yes',
    isChild: false,
    children: [
      {
        key: '2-1',
        name: 'Child Folder A',
        sortOrder: 1,
      },
    ],
  },
];
