interface PaginationParams {
  currentPage: number;
  limit: number;
  totalRecords: number;
  setCurrentPage: (page: number) => void;
}

export const getPaginationConfig = ({
  currentPage,
  limit,
  totalRecords,
  setCurrentPage,
}: PaginationParams) => {
  return {
    current: currentPage || 1,
    pageSize: limit || 10,
    total: totalRecords || 0,
    showSizeChanger: false,
    showQuickJumper: false,
    showTotal: (total: number, range: [number, number]) => (
      <p className="text-font-color">
        {range[0]}-{range[1]} of {total} items
      </p>
    ),
    onChange: (page: number) => {
      setCurrentPage(page);
    },
  };
};
