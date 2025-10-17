import {
  IconDotsVertical,
  IconList,
  IconUserSquareRounded,
} from "@tabler/icons-react";
import { Button, Modal, Switch, Tag } from "antd";
import { useEffect, useState } from "react";
import JobChecklist from "./JobChecklist";
import { JobOptions } from "data/options";
import { useRouter } from "next/navigation";
import { jobOptionRenderer } from "./joboptions";
const JobDetailHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecklistDreawerOpen, setChecklistDrawerOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [isJobOptionModalOpen, setJobOptionModalOpen] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setIsModalOpen(false);
  };
  const summaryItems = {
    costItems: [
      { key: "Quotation", value: "450280.00" },
      { key: "Colors", value: "" },
      { key: "Contract Cost", value: "450280.00" },
    ],
    paymentItems: [
      { key: "MYH0046-I1 Initial Deposit", value: "5000.00" },
      { key: "MYH0046-I3 Returns", value: "-50000.00" },
    ],
  };

  const quickUpdateSection = JobOptions.find(
    (section) => section.title === "Job Information"
  );
  const otherSections = JobOptions.filter(
    (section) => section.title !== "Job Information"
  );

  useEffect(() => {
    const handleClickOutside = () => {
      if (isDropdownOpen) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleOptionClick = (item) => {
    setDropdownOpen(false);
    setActiveAction(item.key);
    setJobOptionModalOpen(true);
  };

  return (
    <>
      <div className="w-full pr-[100px]">
        <div className="flex justify-between w-full text-sm m-3">
          <div className="border-l-2 pl-2">
            <div className="flex gap-2 items-center text-base font-semibold text-blue">
              Murthy <IconUserSquareRounded color="var(--blue)" size={20} />
            </div>
            <div className="flex items-center gap-1">
              Lot 300 Tallis Cct,Tarneit,VIC,5345<Tag color="green">Titled</Tag>
            </div>
          </div>
          <div className="border-l-2 pl-2">
            <div className="text-base font-semibold flex items-center">
              My Home
            </div>
            <div className="mt-1">Builder</div>
          </div>
          <div
            className="border-l-2 pl-2 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="flex text-base font-semibold text-blue">
              $ 495,280.00
            </div>
            <div>
              Balance to be paid <Tag color="orange">Finance Pending</Tag>
            </div>
          </div>
          <div className="flex gap-2 relative">
            <Button
              icon={<IconList />}
              onClick={() => setChecklistDrawerOpen(true)}
            ></Button>

            <Button
              icon={<IconDotsVertical />}
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!isDropdownOpen);
              }}
              className="relative"
            />
            {isDropdownOpen && (
              <div
                className="absolute right-0 top-10 z-50 bg-white border border-gray-200 shadow-xl rounded-lg w-[500px] p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid grid-cols-2 gap-4">
                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 top-10 z-50 bg-white border border-gray-200 shadow-xl rounded-lg w-[500px] p-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex">
                        {/* Left side - First 3 sections */}
                        <div className="w-1/2 pr-4 border-r border-gray-200">
                          {otherSections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="space-y-2 mb-4">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {section.title}
                              </h4>
                              <div className="space-y-1">
                                {section.items.map((item, itemIndex) => (
                                  <div
                                    key={itemIndex}
                                    className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                                    onClick={() => {
                                      handleOptionClick(item);
                                      if (item.href) {
                                        router.push(item.href);
                                      }
                                    }}
                                  >
                                    {item.hasToggle ? (
                                      <Switch
                                        size="small"
                                        className="mr-2"
                                        onChange={(checked) => {
                                          console.log(
                                            `Finance Approval ${
                                              checked
                                                ? "approved"
                                                : "not approved"
                                            }`
                                          );
                                        }}
                                      />
                                    ) : (
                                      <span className={`mr-2 ${item.color}`}>
                                        {item.icon}
                                      </span>
                                    )}
                                    <span className="text-sm text-gray-700">
                                      {item.label}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              {sectionIndex < otherSections.length - 1 && (
                                <div className="border-t border-gray-100 my-2" />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Right side - Quick Update section */}
                        <div className="w-1/2 pl-4">
                          {quickUpdateSection && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {quickUpdateSection.title}
                              </h4>
                              <div className="space-y-1">
                                {quickUpdateSection.items.map(
                                  (item, itemIndex) => (
                                    <div
                                      key={itemIndex}
                                      className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                                      onClick={() => {
                                        handleOptionClick(item);
                                        if (item.href) {
                                          router.push(item.href);
                                        }
                                      }}
                                    >
                                      <span className={`mr-2 ${item.color}`}>
                                        {item.icon}
                                      </span>
                                      <span className="text-sm text-gray-700">
                                        {item.label}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <JobChecklist
          open={isChecklistDreawerOpen}
          onClose={() => setChecklistDrawerOpen(false)}
        />
        {jobOptionRenderer({
          activeAction,
          onCancel: () => setJobOptionModalOpen(false),
          open: isJobOptionModalOpen,
        })}
        <Modal
          title={"Cost Summary"}
          onOk={handleClose}
          onCancel={handleClose}
          cancelButtonProps={{ style: { display: "none" } }}
          centered
          open={isModalOpen}
        >
          <div>
            <div className="grid grid-cols-2 gap-6  text-xs">
              <div className="flex flex-col">
                <div className="flex justify-between mb-4 mt-3 font-medium">
                  <div>Cost Item</div>
                  <div>Amount $</div>
                </div>
                {summaryItems.costItems?.map((item, idx) => (
                  <div className="flex justify-between my-2" key={idx}>
                    <div>{item.key}</div>
                    <div>{item.value}</div>
                  </div>
                ))}
                <div className="flex justify-between  my-2">
                  <div>Total Cost</div>
                  <div className="font-medium">450280.00</div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between mb-4 mt-3 font-medium">
                  <div>Payments</div>
                  <div>Amount $</div>
                </div>
                {summaryItems.paymentItems?.map((item, idx) => (
                  <div className="flex justify-between my-2" key={idx}>
                    <div>{item.key}</div>
                    <div>{item.value}</div>
                  </div>
                ))}
                <div className="flex justify-between mt-40">
                  <div>Total Paid</div>
                  <div className="font-medium">450280.00</div>
                </div>
              </div>
            </div>
            <div className="border-t-2 border-b-2 border-border-color text-red-600 flex justify-end gap-9 py-15 mt-3 font-semibold   ">
              <div>Balanced To Be Paid</div>
              <div>$ 450280.0</div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};
export default JobDetailHeader;
