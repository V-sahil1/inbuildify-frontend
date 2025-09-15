import { LeadSource, Status } from "@lib/constants/enum";
import {
  addressRules,
  emailRules,
  leadSourceRules,
  nameRules,
  phoneRules,
} from "@lib/constants/formInputValidations";
import { CreateFormField } from "@/components/common/Models/CreateFormModel";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { useEffect } from "react";
import { message } from "antd";
import { getServicesThunk } from "@redux/feature/contractor/contractorThunk";
import { setAddServiceModal } from "@redux/feature/contractor/contractorSlice";

export type ContractorFormField = Omit<CreateFormField, "type"> & {
  type?: "email" | "phone" | "select" | "textarea";
};

const contractorFields = (
  { isEmailDisable }: { isEmailDisable: boolean } = { isEmailDisable: false }
): readonly ContractorFormField[] => {
  const dispatch = useAppDispatch();
  const { services } = useAppSelector((state) => state.contractor);
  const status = useAppSelector((state) => state.contractor.status);
  const servicesOptions = services?.map((item) => ({
    label: item.service,
    value: item.service,
  }));

  useEffect(() => {
    async function getServices() {
      try {
        await dispatch(getServicesThunk()).unwrap();
      } catch (error) {
        message.error(error || "failed to fetch the Lead sources");
      }
    }
    if (status === Status.IDLE) {
      getServices();
    }
  }, []);

  const handleAddService = () => {
    dispatch(setAddServiceModal(true));
  }

  return [
    {
      label: "Full Name",
      name: "name",
      placeholder: "John Doe",
      rules: nameRules,
    },
    {
      label: "Email",
      name: "email",
      placeholder: "john@example.com",
      type: "email",
      rules: emailRules,
      disabled: isEmailDisable,
    },
    {
      label: "Phone",
      name: "phone",
      type: "phone",
      placeholder: "1234567890",
      rules: phoneRules,
    },
    {
      label: "Address",
      name: "address",
      placeholder: "123 Main St, Springfield",
      rules: addressRules,
    },
    {
      label: "Services",
      name: "service",
      type: "select",
      options: servicesOptions,
      placeholder: "Select services",
      rules: leadSourceRules,
      onClick: handleAddService,
      button: "Add Service",
    },
  ] as const;
};

export default contractorFields;
