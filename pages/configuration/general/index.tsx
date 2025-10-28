import TabLayout from "@/components/common/TabLayout";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { message } from "antd";
import { getDwellingTypes, getRanges } from "@redux/feature/types/typesThunk";
import { Status } from "@lib/constants/enum";
import SettingsPage from "@/components/configurations/general/Settings";
import CompanyDetails from "@/components/configurations/general/CompanyDetails";
import BuilderDetails from "@/components/configurations/general/BuilderDetails";
import SurveyorsDetails from "@/components/configurations/general/SurveyorsDetails";
import CustomFields from "@/components/configurations/general/CustomFields";
import NotesTag from "@/components/configurations/general/NotesTag";
import Checklist from "@/components/configurations/general/Checklist";
import RoleAndUser from "@/components/configurations/general/RoleAndUser";
import { PasswordPolicy } from "@/components/configurations/general/PasswordPolicy";

const tabsLabel = (label: string, note: string) => {
  return (
    <div>
      <p>{label}</p>
      <span className="text-sm font-medium">{note}</span>
    </div>
  );
};

const TABS = [
  {
    id: "settings",
    label: tabsLabel("Settings", "Common Settings"),
    component: SettingsPage,
  },
  {
    id: "company-details",
    label: tabsLabel("Company Details", "Contact and bank details"),
    component: CompanyDetails,
  },
   {
    id: "builder-details",
    label: tabsLabel("Builders Details", "Mapped builders details"),
    component: BuilderDetails,
  },
   {
    id: "surveyors-details",
    label: tabsLabel("Surveyors Details", "Mapped surveyors details"),
    component: SurveyorsDetails,
  },
  {
    id: "custom-fields",
    label: tabsLabel("Custom Fields", "Customize the required fields"),
    component: CustomFields,
  },
  {
    id: "notes-tag",
    label: tabsLabel("Notes Tag", "Add tags to category the notes"),
    component: NotesTag,
  },
   {
    id: "checklist",
    label: tabsLabel("Checklist", "Manage Checklist"),
    component: Checklist,
  },
  {
    id: "role-and-user-mapping",
    label: tabsLabel("Role and User Mapping", "set default user each role"),
    component: RoleAndUser,
  },
  {
    id: "password-policy",
    label: tabsLabel("Password Policy", "Password privacy settings"),
    component: PasswordPolicy,
  },
  
];

export default function ProjectList() {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state: any) => state.types);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status.range === Status.IDLE) await dispatch(getRanges()).unwrap();
        if (status.dwellingType === Status.IDLE)
          await dispatch(getDwellingTypes()).unwrap();
      } catch (err: any) {
        message.error(err);
      }
    };
    fetchData();
  }, [dispatch, status]);

  return <TabLayout tabs={TABS} />;
}
