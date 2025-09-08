import { LeadSource, Status } from "@lib/constants/enum";
import {
  emailRules,
  leadSourceRules,
  nameRules,
  phoneRules,
} from "@lib/constants/formInputValidations";
import { CreateFormField } from "@/components/common/Models/CreateFormModel";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { mapToOptions } from "@lib/utils/rangeAndDwellingObjToOptions";
import { useEffect } from "react";
import { getLeadSourcesThunk } from "@redux/feature/lead/leadThunk";
import { message } from "antd";
import { setAddInstSourceModal } from "@redux/feature/lead/leadSlice";

export type LeadFormField = Omit<CreateFormField, "type"> & {
  type?: "email" | "phone" | "select" | "textarea";
};

const leadCreateFields = (
  { isEmailDisable }: { isEmailDisable: boolean } = { isEmailDisable: false }
): readonly LeadFormField[] => {
  const dispatch = useAppDispatch();
  const { leadSources } = useAppSelector((state) => state.lead);
  const status = useAppSelector((state) => state.lead.status.leadSources);
  const LeadSourceOptions = mapToOptions(leadSources);

  useEffect(() => {
    async function getLeadSources() {
      try {
        await dispatch(getLeadSourcesThunk()).unwrap();
      } catch (error) {
        message.error(error || "failed to fetch the Lead sources");
      }
    }
    if (status === Status.IDLE) {
      getLeadSources();
    }
  }, []);

  const handleAddSource = () => {
    dispatch(setAddInstSourceModal(true));
  };

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
      // rules: emailRules,
      disabled: isEmailDisable,
    },
    {
      label: "Phone",
      name: "phone",
      placeholder: "+1 555 0100",
      type: "phone",
      // rules: phoneRules,
    },
    {
      label: "Lead Source",
      name: "leadSource",
      placeholder: "e.g. Social Media, Referral, etc.",
      type: "select",
      options: LeadSourceOptions,
      rules: leadSourceRules,
    },
    {
      label: "Notes",
      name: "notes",
      placeholder: "e.g. Social Media, Referral, etc.",
      type: "textarea",
      // rules: [{required: true, message: "Please enter notes"}],
    },
  ] as const;
};

export default leadCreateFields;
