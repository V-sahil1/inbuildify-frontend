export const ohListData = [
  {
    key: '1',
    description: 'Supervisor',
    sort: 1,
    children: [
      {
        key: '1-1',
        description: 'Are OH&S and site location signs prominently displayed?',
        sort: 1,
      },
      {
        key: '1-2',
        description: 'Are materials placed safely on block (outside 2m fall zone)?',
        sort: 2,
      },
      {
        key: '1-3',
        description: 'If fall zone is not available has guardrail been installed?',
        sort: 3,
      },
      { key: '1-4', description: 'Is there adequate, safe access around the site?', sort: 4 },
      {
        key: '1-5',
        description: 'Has rubbish bin been provided, is it accessible and not full?',
        sort: 5,
        type: 'stage',
      },
      {
        key: '1-6',
        description: 'Is the fuse / RCD protected by the security bar and pad lock?',
        sort: 6,
      },
      {
        key: '1-7',
        description: 'Is the meter box in a safe condition (eg door OK etc)?',
        sort: 7,
      },
    ],
  },
  {
    key: '2',
    description: '  Supplier/Tradies',
    sort: 2,
    children: [
      {
        key: '2-1',
        description: 'Do trades on site have White Card or Interstate equivalent?',
        sort: 1,
      },
      {
        key: '2-2',
        description: 'Do all trades have Induction booklets?',
        sort: 2,
      },
      {
        key: '2-3',
        description: 'Is trade keeping the site clean (Trade has access to bin)?',
        sort: 3,
      },
      {
        key: '2-4',
        description: 'Are footpaths/ nature strips kept clear of materials etc?',
        sort: 4,
      },
      {
        key: '2-5',
        description: 'Have materials been placed safely around the block?',
        sort: 5,
        type: 'stage',
      },
      {
        key: '2-6',
        description: 'Is the 2m fall-zone clear of debris and materials?',
        sort: 6,
      },
      {
        key: '2-7',
        description:
          'Is scaffold still in a safe condition, no parts removed? Are ladders safe, tied off, placed at 1:4 angle?',
        sort: 7,
      },
    ],
  },
];
