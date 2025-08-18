import React, { useState } from "react";
import FormDetails from "./FormDetails";
import { motion, AnimatePresence } from "framer-motion";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

const AddressForm = ({
  title,
  rightButtonText,
  isForm1,
  openNewTaskModal,
  rightButtonIcon,
  shippingIcon,
  isExpanded,
  toggleExpand,
}: {
  title: string;
  rightButtonText?: string;
  isForm1?: boolean;
  openNewTaskModal?: () => void;
  rightButtonIcon?: React.ReactNode;
  shippingIcon?: React.ReactNode;
    isExpanded?: boolean;
  toggleExpand?: () => void;
}) => {
  return (
    <div
      id="accountSettingProfile"
      className="relative rounded-xl w-full lg:w-1/2 flex flex-col gap-4"
    >
      {/* Header with Expand/Collapse */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleExpand}
        aria-expanded={isExpanded}
      >
        <span className="bg-body-color text-font-color-100 px-5 font-semibold -top-[14px] flex items-center gap-2">
          {shippingIcon}
          {title}
        </span>
        <div className="flex items-center gap-3">
          {rightButtonIcon && (
            <button
              type="button"
              aria-label={rightButtonText}
              className="rounded-full hover:bg-hover-color focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
              onClick={(e) => {
                e.stopPropagation(); 
                openNewTaskModal?.();
              }}
            >
              <span className="flex items-center gap-1">
                {rightButtonIcon} {rightButtonText}
              </span>
            </button>
          )}
          <button className="transition-transform duration-300 hidden lg:block">
            {isExpanded ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
            display:"flex",flex:"1"
             }}
          >
            <div className="card bg-card-color rounded-xl p-4 flex-1">
              <FormDetails />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddressForm;
