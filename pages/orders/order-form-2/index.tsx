// pages/order-entry.tsx
import { useState, useEffect, useRef } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Breadcrumb from "@/components/common/Breadcrumb";
import AddressForm from "@/components/order/AddressForm";
import { ColDef, ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useMemo } from "react";
import {
  IconArrowDown,
  IconArrowUp,
  IconBook2,
  IconCurrencyDollar,
  IconEdit,
  IconLocationFilled,
  IconTruck,
} from "@tabler/icons-react";
import Address from "@/components/order/modal/Address";
import RmaForm from "@/components/order/RmaForm";
import ReactDataTable from "react-data-table-component";
import ItemSelectorModal from "@/components/order/modal/ItemSelectorModal";
import { AnimatePresence, motion } from "framer-motion";
import taskData from "../../../data/items.json";
import { SidebarBox } from "@/components/order/SidebarBox";
import { SidebarRow } from "@/components/order/SidebarRow";
import CustomDataTable from "@/components/common/CustomDataTable";
// Register required module
ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function OrderEntryPage1() {
  const breadcrumbItem = [{ name: "Orders" }, { name: "Order Form 2" }];
  const [openItemSelectorModal, setOpenItemSelectorModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [itemRows, setItemRows] = useState<any[]>(taskData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [clearSelected, setClearSelected] = useState(false);

  const rowData = useMemo(() => {
    return itemRows.filter(
      (item) =>
        item.authQty !== "" &&
        item.unitPrice !== "" &&
        !isNaN(Number(item.authQty)) &&
        !isNaN(Number(item.unitPrice)) &&
        Number(item.authQty) !== 0 &&
        Number(item.unitPrice) !== 0
    );
  }, [itemRows]);

  const handleRowSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const columnDefs = useMemo(
    () => [
      { name: "#", selector: (row) => row.name, width: "60px" },
      {
        name: "Item # / Description",
        selector: (row) => row.description,
        grow: 1, // use 'grow' instead of 'flex'
      },
      {
        name: "Auth. Qty",
        selector: (row) => row.authQty,
        width: "100px",
      },
      {
        name: "Auth. Serial #",
        selector: (row) => row.authSerial,
        width: "140px",
      },
      {
        name: "Ship Qty",
        selector: (row) => row.shipQty,
        width: "100px",
      },
      {
        name: "Unit Price",
        selector: (row) => row.unitPrice,
        width: "120px",
      },
    ],
    []
  );
  const handleItemModalSuccess = (updatedItems) => {
    setItemRows(updatedItems);
  };

  const handleRemoveSelected = () => {
    const updatedItems = itemRows.map((item) => {
      const isSelected = selectedRows.find((row) => row.name === item.name);
      if (isSelected) {
        return {
          ...item,
          authQty: "",
          unitPrice: "",
          extPrice: 0,
        };
      }
      return item;
    });

    setItemRows(updatedItems);
    setSelectedRows([]); // clear selection
    setClearSelected(prev => !prev);
  };

  return (
    <div className=" pt-4">
      <div className="container-fluid">
        <Breadcrumb breadcrumbItem={breadcrumbItem} />
        <div className="flex flex-col lg:flex-row relative px-0 py-2 md:p-4 gap-4">
          {" "}
          {/* Main Left Form Section */}
          <div className="flex-1 space-y-6 sm:space-y-4 min-w-0">
            {/* Top Button Row */}
            <div className="flex flex-wrap justify-center md:justify-end gap-2 ">
              <button className="btn btn-primary ">NEW ORDER</button>
              <button className="btn btn-secondary">SAVE DRAFT</button>
              <button className="btn btn-secondary">PLACE ORDER</button>
            </div>
            <div
              id="accountSettingProfile"
              className="relative rounded-xl w-full border border-dashed border-border-color p-4"
            >
              <div className=" flex flex-col lg:flex-row gap-6 lg:gap-8">
                <RmaForm
                  isForm1={true}
                  orderIcon={<IconBook2 size={16} />}
                  isExpanded={isExpanded}
                  toggleExpand={toggleExpand}
                />
                <AddressForm
                  title="RMA ADDRESS"
                  isForm1={true}
                  shippingIcon={<IconTruck size={16} />}
                  isExpanded={isExpanded}
                  toggleExpand={toggleExpand}
                />
              </div>
            </div>{" "}
            <div
              id="accountSettingProfile"
              className="relative rounded-xl !mt-8 border border-dashed border-border-color p-4"
            >
              <span className="bg-body-color flex items-center gap-1 text-font-color-100 px-5 font-semibold absolute -top-[14px]">
                {" "}
                <h2>Items </h2>
              </span>
              <div className="py-2 flex flex-col md:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center bg-card-color rounded-[8px] px-3 py-1 border border-gray-300 shadow-sm">
                    <IconBook2 size={16} className="text-sm" />
                    <input
                      type="text"
                      placeholder="Add item..."
                      className="bg-transparent focus:outline-none ml-2 text-sm w-32"
                    />
                  </div>

                  <button
                    disabled
                    className="bg-card-color rounded-[8px] h-[30px]  px-3 py-1 text-xs text-gray-400 border border-gray-300 shadow-sm"
                  >
                    AUTH.
                  </button>
                  <button
                    disabled
                    className="bg-card-color rounded-[8px] h-[30px]  px-3 py-1 text-xs text-gray-400 border border-gray-300 shadow-sm"
                  >
                    TO SHIP <IconArrowUp size={12} className="inline ml-1" />
                  </button>
                </div>

                <button
                  type="button"
                  aria-label="Browse Items"
                  className="rounded-full hover:bg-hover-color self-end focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => setOpenItemSelectorModal(true)}
                >
                  <span className="flex items-center gap-1 ">
                    <IconBook2 size={16} />
                    Browse Items
                  </span>
                </button>
              </div>
              <div className="card bg-card-color rounded-xl mt-2">
                <div className="react-data-table rounded-[8px]">
                  <CustomDataTable
                    columns={columnDefs}
                    data={rowData}
                    selectableRows
                    onSelectedRowsChange={handleRowSelected}
                    clearSelectedRows={clearSelected}
                    selectedRows={selectedRows}
                    noDataComponent={
                      <div className="w-full !py-6 flex items-center justify-center bg-card-color text-font-color">
                        <span>No items found. Add items to get started.</span>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
            {/* Bottom Totals */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-2 text-xs gap-4 md:gap-2">
              <div className="flex flex-row justify-between items-start sm:items-center mt-2 text-xs gap-2">
                <div className="text-right  flex items-center gap-2">
                  <div className="flex items-start justify-start gap-1 self-start text-danger">
                    <IconArrowDown size={16} />
                  </div>
                  <div className="flex flex-col">
                    <p className="flex items-start gap-1">Total Lines: 0</p>
                    <p className="flex items-start gap-1">Total Qty: 0</p>
                    <p className="flex items-start gap-1">
                      Total Ext Price: 0.00
                    </p>
                  </div>
                </div>
                <div className="text-right  flex items-center gap-2">
                  <div className="flex items-start justify-start gap-1 self-start text-primary">
                    <IconArrowUp size={16} />
                  </div>
                  <div className="flex flex-col">
                    <p className="flex items-start gap-1">Total Lines: 0</p>
                    <p className="flex items-start gap-1">Total Qty: 0</p>
                    <p className="flex items-start gap-1">
                      Total Ext Price: 0.00
                    </p>
                  </div>
                </div>
              </div>
              {/* {selectedRows.length > 0 && ( */}
              <button
                className="btn bg-secondary text-white px-3 py-1 rounded disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={handleRemoveSelected}
                disabled={selectedRows.length === 0}
              >
                Remove Selected Items
              </button>
              {/* )} */}
            </div>
          </div>
          {/* Right Sidebar Section */}
          <div className="w-full lg:w-1/4  h-fit p-4 md:pt-[50px] space-y-4 text-xs border-t lg:border-t-0 ">
            <SidebarBox
              title="SHIPPING ADDRESS"
              modelKey={"shipping"}
              icon={<IconLocationFilled size={16} />}
            >
              <SidebarRow label="International Code:" value="0" />
              <SidebarRow label="Shipping Carrier:" value="UPS" />
              <SidebarRow label="Shipping Service:" value="GROUND" />
              <SidebarRow label="Freight Account:" value="00500" />
              <SidebarRow label="Consignee #:" value="" />
              <SidebarRow label="Incoterms:" value="" />
              <SidebarRow label="FOB Location:" value="" />
              <SidebarRow label="Payment Type:" value="" />
              <SidebarRow label="Packing List:" value="538" />
            </SidebarBox>

            <SidebarBox
              title="AMOUNTS"
              modelKey={"amounts"}
              icon={<IconCurrencyDollar size={16} />}
            >
              <div className="flex flex-col gap-2">
                <div>
                  <SidebarRow label="Order Amount:" value="0.00" />
                  <SidebarRow label="S & H:" value="0.00" />
                  <SidebarRow label="Sales Taxes:" value="0.00" />
                  <SidebarRow label="Discount/Add. Chgs:" value="0.00" />
                  <SidebarRow
                    label="Total Amount:"
                    value="0.00"
                    isHighLightedText={true}
                  />
                </div>
                <div>
                  <SidebarRow label="Amount Paid:" value="0.00" />
                  <SidebarRow
                    label="Net Due:"
                    value="0.00"
                    isHighLightedText={true}
                  />
                </div>
                <div>
                  <SidebarRow label="Balance Due (US):" value="0.00" />
                  <SidebarRow label="Int. Decl. Value:" value="0.00" />
                  <SidebarRow label="Insurance:" value="0.00" />
                </div>
              </div>
            </SidebarBox>

            <SidebarBox
              title="OTHERS"
              modelKey={"others"}
              icon={<IconLocationFilled size={16} />}
            >
              <div className="flex flex-col gap-2">
                <div>
                  <SidebarRow label="Original Order #:" value="" />
                  <SidebarRow label="Customer Number:" value="" />
                  <SidebarRow
                    label="Est. Weight for RS Label (lb):"
                    value="0"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-font-color-100">
                    Shipping Instructions:
                  </label>
                  <textarea className="w-full h-12 border border-border-color rounded-[8px] p-2 resize-none"></textarea>
                </div>
                <div>
                  <label className="text-font-color-100">Comments:</label>
                  <textarea className="w-full h-12 border border-border-color rounded-[8px] p-2 resize-none"></textarea>
                </div>
              </div>
            </SidebarBox>
          </div>
        </div>
      </div>
      {openItemSelectorModal && (
        <ItemSelectorModal
          isOpen={openItemSelectorModal}
          onClose={() => setOpenItemSelectorModal(false)}
          rowData={itemRows}
          setRowData={setItemRows}
          onSuccess={handleItemModalSuccess}
        />
      )}
    </div>
  );
}
