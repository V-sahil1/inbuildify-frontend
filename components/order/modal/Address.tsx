import { IconX } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import FormDetails from "../FormDetails";
import ShippingAddress from "../ShippingAddress";
import AmountsEditor from "../AmountsEditor";
import ExtraField from "../ExtraField";
import Drawer from "@/components/common/Drawer";
import OtherFields from "../OtherFields";

const Address = ({
  isOpen,
  onClose,
  modelKey,
}: {
  isOpen: boolean;
  onClose: () => void;
  modelKey: string;
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      header={
        modelKey === "shipping"
          ? "Edit Shipping info"
          : modelKey === "billing"
          ? "Edit Billing info"
          : modelKey === "amounts"
          ? "Edit Amounts info"
          : modelKey === "extraFields"
          ? "Edit Extra Fields"
          : modelKey === "others"
          ? "Edit Other Fields"
          : "Edit Form info"
      }
      onSuccess={() => {}}
    >
      {modelKey === "shipping" ? (
        <ShippingAddress />
      ) : modelKey === "billing" ? (
        <FormDetails />
      ) : modelKey === "amounts" ? (
        <AmountsEditor />
      ) : modelKey === "extraFields" ? (
        <ExtraField />
      ) : modelKey === "others" ? (
        <OtherFields />
      ) : (
        <FormDetails />
      )}
    </Drawer>
  );
};

export default Address;
