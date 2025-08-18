import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconChevronDown,
  IconChevronUp,
  IconCalendar,
} from "@tabler/icons-react";
import CustomSelect from "../common/CustomSelect";
import InlineCalendar from "../common/InlineCalendar";

const RmaForm = ({
  isForm1,
  orderIcon,
  isExpanded,
  toggleExpand,
}: {
  isForm1: boolean;
  orderIcon: React.ReactNode;
  isExpanded: boolean;
  toggleExpand: () => void;
}) => {
  const [accountRmaWh, setAccountRmaWh] = useState("DCL-00500");
  const [accountShipWh, setAccountShipWh] = useState("DCL-00501");
  const [defectReasonCodes, setDefectReasonCodes] = useState("DCL-00502");
  const [reasonForReturn, setReasonForReturn] = useState("dummy-2");
  const [didItemCauseSafetyIssue, setDidItemCauseSafetyIssue] = useState("no");
  const [gelPadExpirationDate, setGelPadExpirationDate] = useState<Date | null>(new Date());
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
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);
  return (
    <div
      id="accountSettingProfile"
      className="relative w-full lg:w-1/2 rounded-xl flex flex-col"
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleExpand}
        aria-expanded={isExpanded}
      >
        <span className="bg-body-color text-font-color-100 px-5 font-semibold -top-[14px] flex items-center gap-2">
          RMA
        </span>
        <button className="transition-transform duration-300 lg:hidden block">
            {isExpanded ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
          </button>
      </div>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{  display:"flex",flex:"1" }}
          >
            <div className="card bg-card-color rounded-xl p-4 mt-4 flex-1">
              <form className="space-y-4 text-sm w-full">
                {/* Row 1 */}
                <div className="flex space-y-4 md:space-y-0 md:space-x-4 w-full flex-col md:flex-row">
                  <div className="w-full form-control">
                    <label className="block mb-1 font-medium form-label">
                      Account # - RMA WH: *
                    </label>
                    {/* //use dummy opttions  */}
                    <CustomSelect
                      options={[
                        { label: "DCL-00500", value: "DCL-00500" },
                        { label: "DCL-00501", value: "DCL-00501" },
                        { label: "DCL-00502", value: "DCL-00502" },
                      ]}
                      value={accountRmaWh}
                      onChange={setAccountRmaWh}
                      placeholder="Select account RMA WH"
                    />
                  </div>
                  <div className="w-full form-control">
                    <label className="block mb-1 font-medium form-label">
                      Account # - Ship WH:
                    </label>
                    <CustomSelect
                      options={[
                        { label: "DCL-00500", value: "DCL-00500" },
                        { label: "DCL-00501", value: "DCL-00501" },
                        { label: "DCL-00502", value: "DCL-00502" },
                      ]}
                      value={accountShipWh}
                      onChange={setAccountShipWh}
                      placeholder="Select account Ship WH"
                    />
                  </div>
                </div>
                <div className="flex space-y-4 md:space-y-0 md:space-x-4 w-full flex-col md:flex-row">
                  <div className="w-full form-control">
                    <label className="block mb-1 font-medium form-label">
                      RMA Type:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value="T"
                        readOnly
                        className="w-full form-input"
                      />
                    </div>
                  </div>

                  {/* Row 2 */}

                  <div className="w-full form-control">
                    <label className="block mb-1 font-medium form-label">
                      Disposition:
                    </label>
                    <input
                      type="text"
                      value="D"
                      readOnly
                      className="w-full form-input"
                    />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="flex space-y-4 md:space-y-0 md:space-x-4 w-full flex-col md:flex-row">
                  <div className="w-full form-control">
                    <label className="block mb-1 font-medium form-label">
                      Defect - Reason Codes:
                    </label>
                    {/* use dummy options */}
                    <CustomSelect
                      options={[
                        { label: "DCL-00500", value: "DCL-00500" },
                        { label: "DCL-00501", value: "DCL-00501" },
                        { label: "DCL-00502", value: "DCL-00502" },
                      ]}
                      value={defectReasonCodes}
                      onChange={setDefectReasonCodes}
                      placeholder="Select defect reason codes"
                    />
                  </div>
                  <div className="w-full form-control">
                    <label className="block mb-1 font-medium form-label">
                      Reason for Return:
                    </label>
                    {/* use dummy options */}
                    <CustomSelect
                      options={[
                        { label: "Dummy Reason 1", value: "dummy-1" },
                        { label: "Dummy Reason 2", value: "dummy-2" },
                      ]}
                      value={reasonForReturn}
                      onChange={setReasonForReturn}
                      placeholder="Select reason for return"
                    />
                  </div>
                </div>
                <div className="flex md:space-x-4 w-full flex-col md:flex-row">
                  {/* Row 4 */}
                  <div className="w-full form-control">
                    <label className="block mb-1 font-medium form-label">
                      Freshdesk Ticket ID:
                    </label>
                    <input type="text" className="w-full form-input" />
                  </div>
                  <div className="w-full form-control">
                    <label className="block mb-1 font-medium form-label">
                      RMA #: *
                    </label>
                    <input type="text" className="w-full form-input" />
                  </div>
                </div>
                {/* Row 5 */}
                <div className=" flex flex-col w-full gap-4 ">
                  <div className="w-full form-control relative">
                    <label className="block mb-1 font-medium form-label">
                      Gel Pad Expiration Date:
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        className="w-full form-input cursor-pointer pr-10" 
                        value={gelPadExpirationDate ? gelPadExpirationDate.toLocaleDateString() : ''}
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const calendarHeight = 300; // Approximate height of the calendar
                          setCalendarPosition({
                            top: rect.top + window.scrollY - calendarHeight + 20, // Position above with 8px gap
                            left: rect.left + window.scrollX
                          });
                          setShowCalendar(true);
                        }}
                        readOnly
                        ref={dateInputRef}
                        placeholder="Select expiration date"
                      />
                      <div 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = dateInputRef.current?.getBoundingClientRect();
                          if (rect) {
                            const calendarHeight = 300;
                            setCalendarPosition({
                              top: rect.top + window.scrollY - calendarHeight + 20,
                              left: rect.left + window.scrollX
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
                          value={gelPadExpirationDate}
                          onChange={(date) => {
                            // setGelPadExpirationDate(date);
                            setShowCalendar(false);
                          }}
                          onClose={() => setShowCalendar(false)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="w-full form-control">
                    <label className="block mb-1 font-medium form-label">
                      Did the item cause safety issue?:
                    </label>
                    {/* <select className="form-select cursor-pointer rounded-e-md bg-card-color py-[6px] ps-15 pe-30 text-[14px]/[20px] appearance-none border border-border-color focus:outline-0 focus:border-primary">
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select> */}
                    <CustomSelect
                      options={[
                        { label: "Yes", value: "yes" },
                        { label: "No", value: "no" },
                      ]}
                      value={didItemCauseSafetyIssue}
                      onChange={setDidItemCauseSafetyIssue}
                      placeholder="Select did item cause safety issue"
                    />
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

export default RmaForm;
