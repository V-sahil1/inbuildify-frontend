// pages/order-entry.tsx
import { useEffect, useRef, useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import OrderForm from "@/components/order/OrderForm";
import AddressForm from "@/components/order/AddressForm";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useMemo } from "react";
import AddressBook from "@/components/order/modal/AddressBook";
import CustomDataTable from "@/components/common/CustomDataTable";
import {
  IconBook2,
  IconCurrencyDollar,
  IconEdit,
  IconLocationFilled,
  IconPlus,
  IconTagsFilled,
  IconTruck,
} from "@tabler/icons-react";
import Address from "@/components/order/modal/Address";
import ItemSelectorModal from "@/components/order/modal/ItemSelectorModal";
import DatepickerModal from "@/components/order/modal/DatepickerModal";
import { AnimatePresence, motion } from "framer-motion";
import taskData from "../../../data/items.json";
import { SidebarBox } from "@/components/order/SidebarBox";
import { SidebarRow } from "@/components/order/SidebarRow";
import Calendar from "react-calendar";
import InlineCalendar from "@/components/common/InlineCalendar";
import DateCell from "@/components/order/DateCell";

export default function OrderEntryPage1() {
  const breadcrumbItem = [{ name: "Orders" }, { name: "Order Form 1" }];
  const [openAddressBookModal, setOpenAddressBookModal] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [openItemSelectorModal, setOpenItemSelectorModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [itemRows, setItemRows] = useState<any[]>(taskData);
  const calendarAnchorRef = useRef<HTMLDivElement | null>(null);
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
  const [clearSelected, setClearSelected] = useState(false);

  const rowData = useMemo(() => {
    return itemRows.filter(
      (item) =>
        item.authQty !== "" ||
        (item.unitPrice !== "" && !isNaN(Number(item.authQty))) ||
        (!isNaN(Number(item.unitPrice)) && Number(item.authQty) !== 0) ||
        Number(item.unitPrice) !== 0
    );
  }, [itemRows]);

  const handleItemModalSuccess = (updatedItems) => {
    setItemRows(updatedItems);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  const openNewTaskModal = () => {
    setOpenAddressBookModal(!openAddressBookModal);
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
    setClearSelected(prev => !prev);   };

  const columnDefs = useMemo(
    () => [
      { name: "#", selector: (row) => row.name, width: "60px" },
      {
        name: "Item # / Description",
        selector: (row) => row.description,
        width: "200px",
      },
      {
        name: "Qty",
        selector: (row) => row.authQty,
        width: "100px",
      },
      {
        name: "Unit Price",
        selector: (row) => row.unitPrice,
        width: "100px",
      },
      {
        name: "Ext Price",
        selector: (row) => row.extPrice,
        width: "150px",
      },
      {
        name: "Dont Ship Before",
        selector: (row) => row.dontShipBefore,
        width: "150px",
        cell: (row, index) => (
          <DateCell
            value={row.dontShipBefore}
            onChange={(date) => {
              const updatedRows = [...itemRows];
              updatedRows[index].dontShipBefore = date;
              setItemRows(updatedRows);
            }}
          />
        ),
      },
      {
        name: "Ship By",
        selector: (row) => row.shipBy,
        width: "150px",
      },
    ],
    []
  );

  return (
    <div className="pt-4">
      <div className="container-fluid">
        <Breadcrumb breadcrumbItem={breadcrumbItem} />
        <div className="flex flex-col lg:flex-row relative px-0 py-2 md:p-4 gap-4">
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
                <OrderForm
                  title="Order Header"
                  isForm1={true}
                  orderIcon={<IconBook2 size={16} />}
                  newOrderTooltip="New Order"
                  newOrderIcon={<IconPlus size={16} />}
                  isExpanded={isExpanded}
                  toggleExpand={toggleExpand}
                />
                <AddressForm
                  title="Shipping Address"
                  openNewTaskModal={openNewTaskModal}
                  rightButtonText="Address Book"
                  rightButtonIcon={<IconBook2 size={16} />}
                  isForm1={true}
                  shippingIcon={<IconTruck size={16} />}
                  isExpanded={isExpanded}
                  toggleExpand={toggleExpand}
                />
              </div>
            </div>
            {/* AG Grid Table */}
            <div
              id="accountSettingProfile"
              className="relative rounded-xl !mt-8 border border-dashed border-border-color p-4"
            >
              {/* Title Label */}
              <span className="bg-body-color flex items-center gap-1 text-font-color-100 px-5 font-semibold absolute -top-[14px]">
                {" "}
                <IconTagsFilled
                  size={16}
                  // className="text-primary font-bold"
                />
                <h2>Items </h2>
              </span>
              <div className="py-2 flex items-center justify-between gap-2">
                <div className="flex items-center bg-card-color rounded-[8px] px-2 py-1 border border-gray-300 shadow-sm">
                  <IconBook2 size={16} className="text-sm" />
                  <input
                    type="text"
                    placeholder="Add item..."
                    className="bg-transparent focus:outline-none ml-2 text-sm w-32"
                  />
                </div>

                <button
                  type="button"
                  aria-label="Browse Items"
                  className="rounded-full hover:bg-hover-color focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => setOpenItemSelectorModal(true)}
                >
                  <span className="flex items-center gap-1 ">
                    <IconBook2 size={16} />
                    Browse Items
                  </span>
                </button>
              </div>
              <div className="card bg-card-color rounded-xl mt-2">
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
            {/* Bottom Totals */}
            <div className="flex flex-row justify-between items-center mt-2 text-xs gap-2">
              <div className="text-left space-y-1">
                <p>Total Lines: {rowData.length}</p>
                <p>
                  Total Qty:{" "}
                  {/* {rowData.reduce((acc, row) => acc + row.authQty, 0)} */}
                </p>
                <p>
                  Total Ext Price:{" "}
                  {rowData
                    .reduce((acc, row) => acc + row.extPrice, 0)
                    .toFixed(2)}
                </p>
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
          <div className="w-full lg:w-1/4 p-4 pt-[50px] space-y-4 text-xs border-t lg:border-t-0 ">
            <SidebarBox
              title="SHIPPING ADDRESS"
              modelKey={"shipping"}
              icon={<IconLocationFilled size={16} />}
            >
              <SidebarRow label="International Code:" value="0" />
              <SidebarRow label="Shipping Carrier:" value="UPS" />
              <SidebarRow
                label="Shipping Service:"
                value="GROUND SERVVICE RESIDEENTIAL"
              />
              <SidebarRow label="Freight Account:" value="00500" />
              <SidebarRow label="Consignee #:" value="" />
              <SidebarRow label="Incoterms:" value="CIP" />
              <SidebarRow label="FOB Location:" value="" />
              <SidebarRow label="Payment Type:" value="" />
              <SidebarRow label="Packing List:" value="100" />
            </SidebarBox>

            <SidebarBox
              title="BILLING ADDRESS"
              modelKey={"billing"}
              icon={<IconLocationFilled size={16} />}
            >
              <SidebarRow label="Company:" value="" />
              <SidebarRow label="Attention:" value="" />
              <SidebarRow label="Address 1:" value="" />
              <SidebarRow label="Address 2:" value="" />
              <SidebarRow label="City:" value="" />
              <SidebarRow label="Postal Code:" value="" />
              <SidebarRow label="State:" value="" />
              <SidebarRow label="Country:" value="" />
              <SidebarRow label="Phone:" value="" />
              <SidebarRow label="Email:" value="" />
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
              title="EXTRA FIELDS"
              modelKey={"extraFields"}
              icon={<IconLocationFilled size={16} />}
            >
              <SidebarRow label="Agent Name:" value="" />
              <SidebarRow label="Custom Field 2:" value="" />
              <SidebarRow label="Custom Field 3:" value="" />
              <SidebarRow label="Custom Field 4:" value="" />
              <SidebarRow label="Custom Field 5:" value="" />
            </SidebarBox>
          </div>
        </div>
      </div>
      {openAddressBookModal && (
        <AddressBook
          isOpen={openAddressBookModal}
          onClose={() => setOpenAddressBookModal(false)}
        />
      )}
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
