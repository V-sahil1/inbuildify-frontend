import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconChevronDown,
  IconChevronUp,
  IconCalendar,
} from "@tabler/icons-react";
import CustomSelect from "../common/CustomSelect";
import InlineCalendar from "../common/InlineCalendar";

type OrderFormProps = {
  title: string;
  newOrderIcon?: React.ReactNode;
  isForm1?: boolean;
  orderIcon?: React.ReactNode;
  newOrderTooltip?: string;
  isExpanded?: boolean;
  toggleExpand?: () => void;
};

const OrderForm: React.FC<OrderFormProps> = ({
  title,
  newOrderIcon,
  isForm1,
  orderIcon,
  newOrderTooltip = "Create New Order",
  isExpanded,
  toggleExpand,
}) => {
  const [account, setAccount] = useState("");
  const [item, setItem] = useState("");
  const [status, setStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        dateInputRef.current &&
        !dateInputRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    }

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);
  const accountOptions = [
    { label: "Account 1", value: "Account 1" },
    { label: "Account 2", value: "Account 2" },
    { label: "Account 3", value: "Account 3" },
  ];
  const itemOptions = [
    { label: "Item 1", value: "Item 1" },
    { label: "Item 2", value: "Item 2" },
    { label: "Item 3", value: "Item 3" },
    { label: "Item 4", value: "Item 4" },
  ];
  const statusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Shipped", value: "Shipped" },
    { label: "Delivered", value: "Delivered" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  return (
    <div
      id="accountSettingProfile"
      className="relative rounded-xl w-full lg:w-1/2 flex flex-col gap-4"
    >
      {/* Header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleExpand}
        aria-expanded={isExpanded}
      >
        <span className="bg-body-color text-font-color-100 px-5 font-semibold -top-[14px] flex items-center gap-2">
          {orderIcon}
          {title}
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            {newOrderIcon && (
              <button
                type="button"
                aria-label={newOrderTooltip}
                className="rounded-full hover:bg-hover-color focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents collapse toggle on button click
                }}
              >
                <span className="flex items-center gap-1">
                  {newOrderIcon} {newOrderTooltip}
                </span>
              </button>
            )}
          </div>
          <button className="transition-transform duration-300 lg:hidden block">
            {isExpanded ? (
              <IconChevronUp size={20} />
            ) : (
              <IconChevronDown size={20} />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: "flex",
              flex: "1"
            }}
          >
            <div className="card bg-card-color rounded-xl p-4 flex-1">
              <form action="" className="space-y-4">
                {/* Row 1 */}
                <div className="flex md:space-x-8 w-full gap-4 md:gap-0 flex-col md:flex-row">
                  <div className="w-full md:w-1/2 form-control">
                    <label className="form-label">Account#- Warehouse:</label>
                    <CustomSelect
                      options={accountOptions}
                      value={account}
                      onChange={setAccount}
                      placeholder="Select Account"
                    />
                  </div>
                  <div className="w-full md:w-1/2 form-control">
                    <label className="form-label">Order #:</label>
                    <input type="text" className="form-input" />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="flex md:space-x-8 w-full flex-col md:flex-row gap-4 md:gap-0">
                  <div className="w-full md:w-1/2 form-control">
                    <label className="form-label">Customer # :</label>
                    <input type="text" className="form-input" />
                  </div>
                  <div className="w-full md:w-1/2 form-control">
                    <label className="form-label">PO #:</label>
                    <input type="text" className="form-input" />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="flex md:space-x-8 w-full flex-col md:flex-row gap-4 md:gap-0">
                  <div className="w-full md:w-1/2 form-control">
                    <label className="form-label">Item List :</label>
                    <CustomSelect
                      options={itemOptions}
                      value={item}
                      onChange={setItem}
                      placeholder="Select Item"
                    />
                  </div>
                  <div className="w-full md:w-1/2 form-control">
                    <label className="form-label">Quantity :</label>
                    <input type="number" className="form-input" />
                  </div>
                </div>

                {/* Row 4 */}
                <div className="flex md:space-x-8 w-full flex-col md:flex-row gap-4 md:gap-0">
                  <div className="w-full md:w-1/2 form-control">
                    <label className="form-label mb-0">Order Status :</label>
                    <CustomSelect
                      options={statusOptions}
                      value={status}
                      onChange={setStatus}
                      placeholder="Select Status"
                    />
                  </div>
                  <div className="w-full md:w-1/2 form-control relative">
                    <label className="form-label">PO Date :</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="form-input cursor-pointer pr-10"
                        value={
                          selectedDate ? selectedDate.toLocaleDateString() : ""
                        }
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const calendarHeight = 300; // Approximate height of the calendar
                          setCalendarPosition({
                            top: rect.top + window.scrollY - calendarHeight - 8, // 8px gap
                            left: rect.left + window.scrollX,
                          });
                          setShowCalendar(true);
                        }}
                        readOnly
                        ref={dateInputRef}
                        placeholder="Select date"
                      />
                      <div
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect =
                            dateInputRef.current?.getBoundingClientRect();
                          if (rect) {
                            const calendarHeight = 300;
                            setCalendarPosition({
                              top:
                                rect.top + window.scrollY - calendarHeight - 8,
                              left: rect.left + window.scrollX,
                            });
                            setShowCalendar(true);
                          }
                        }}
                      >
                        <IconCalendar size={20} />
                      </div>
                    </div>
                    {showCalendar && (
                      <div ref={calendarRef}>
                        <InlineCalendar
                          position={calendarPosition}
                          value={selectedDate}
                          onChange={(date) => {
                            // setSelectedDate(date);
                            setShowCalendar(false);
                          }}
                          onClose={() => setShowCalendar(false)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 5 */}
                <div className="flex md:space-x-8 w-full flex-col md:flex-row gap-4 md:gap-0">
                  <div className="w-full md:w-1/2 form-control">
                    <label className="form-label">
                      Shipping Instructions :
                    </label>
                    <textarea
                      name="shippingInstructions"
                      className="form-textarea"
                      rows={4}
                    ></textarea>
                  </div>
                  <div className="w-full md:w-1/2 form-control">
                    <label className="form-label">Comments :</label>
                    <textarea
                      name="comments"
                      className="form-textarea"
                      rows={4}
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderForm;
