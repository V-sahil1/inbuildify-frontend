import { IconCloudUpload, IconRefresh, IconX } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import ReactDataTable from 'react-data-table-component';
import { useMemo } from 'react';
import Drawer from '@/components/common/Drawer';
import CustomSelect from '@/components/common/CustomSelect';

const ItemSelectorModal = ({
  isOpen,
  onClose,
  rowData,
  setRowData,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  rowData: any[];
  setRowData: (data: any[]) => void;
  onSuccess: (updatedItems: any[]) => void;
}) => {
  const [showZeroQty, setShowZeroQty] = useState(false);
  const [data, setData] = useState<any[]>(rowData);
  const [isSuccessBtnDisabled, setIsSuccessBtnDisabled] = useState(true);
  const [warehouse, setWarehouse] = useState('');
  const warehouseOptions = [
    { label: 'Warehouse: All', value: 'all' },
    { label: 'Warehouse: A', value: 'a' },
    { label: 'Warehouse: B', value: 'b' },
  ];
  useEffect(() => {
    const isValid = data.some(
      item =>
        item.authQty !== '' &&
        item.unitPrice !== '' &&
        !isNaN(Number(item.authQty)) &&
        !isNaN(Number(item.unitPrice)) &&
        Number(item.authQty) > 0 &&
        Number(item.unitPrice) > 0
    );
    setIsSuccessBtnDisabled(!isValid);
  }, [data]);

  // useEffect(() => {
  //   const filtered = rowData.filter(
  //     (item) =>
  //       item.authQty === "" ||
  //       item.unitPrice === "" ||
  //       isNaN(Number(item.authQty)) ||
  //       isNaN(Number(item.unitPrice))
  //   );
  //   setData(filtered);
  // }, [rowData]);

  const handleInputChange = (index: number, key: string, value: string) => {
    setData(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const columnDefs = useMemo(
    () => [
      {
        name: '#',
        selector: row => row.name,
        width: '150px',
      },
      {
        name: 'Item# / Description',
        selector: row => row.title,
        width: '250px',
        cell: row => (
          <span className="text-blue-700 cursor-pointer hover:underline">{row.description}</span>
        ),
      },
      {
        name: 'Qty',
        selector: row => row.authQty,
        center: true,
        cell: (row, index) => (
          <div className="flex gap-2 form-control">
            <input
              type="number"
              className="w-full form-input"
              value={row.authQty}
              onChange={e => handleInputChange(index, 'authQty', e.target.value)}
            />
          </div>
        ),
      },
      {
        name: 'Unit Price',
        selector: row => row.unitPrice,
        cell: (row, index) => (
          <div className="flex gap-2 form-control">
            <input
              type="number"
              className="w-full form-input"
              value={row.unitPrice}
              onChange={e => handleInputChange(index, 'unitPrice', e.target.value)}
            />
          </div>
        ),
      },
      {
        name: 'Net Available',
        selector: row => row.netAvailable,
        cell: row => <div className="whitespace-pre-line text-sm">{row.netAvailable}</div>,
      },
    ],
    [data]
  );

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        header="Items"
        isSuccessBtnDisabled={isSuccessBtnDisabled}
        onSuccess={() => {
          const updatedItems = rowData.map(item => {
            const updated = data.find(d => d.name === item.name);
            return updated ? { ...item, ...updated } : item;
          });
          onSuccess(updatedItems);
          onClose();
        }}
        width="large"
      >
        <div className="flex flex-col gap-3">
          {/* Filter and Add button */}
          <div className="flex items-start md:items-center justify-between gap-3 flex-col ">
            <div className="flex gap-2 items-center w-full form-control">
              <input
                type="text"
                placeholder="Search by item # or description"
                className="form-input flex-1"
              />
              <div className="form-check">
                <input
                  type="checkbox"
                  id="accountSettingPhone"
                  className="form-check-input"
                  onChange={() => setShowZeroQty(!showZeroQty)}
                />
                <label
                  htmlFor="accountSettingPhone"
                  className="form-check-label !text-[16px]/[24px] w-[112px]"
                >
                  Show 0 Qty
                </label>
              </div>
            </div>
            <div className="flex items-start md:items-center gap-4 flex-col md:flex-row w-full md:w-4/4 ">
              <div className="w-full flex-1 form-control">
                <CustomSelect
                  options={warehouseOptions}
                  value={warehouse}
                  onChange={setWarehouse}
                  placeholder="Warehouse"
                />
              </div>
              <button className="btn btn-primary">
                <IconRefresh size={16} />
                REFRESH
              </button>
            </div>
          </div>
          {/* Grid Content */}
          <div className="rounded-xl border border-dashed border-border-color shadow-sm overflow-auto max-w-full">
            <div className="react-data-table">
              <ReactDataTable
                columns={columnDefs}
                data={data}
                highlightOnHover
                dense
                striped
                noHeader
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20]}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default ItemSelectorModal;
