import TabLayout from "@/components/common/TabLayout"; 
import CompanyDetails from "@/components/configurations/components/general/CompanyDetails";
import BuilderDetails from "@/components/configurations/components/general/BuilderDetails";
import SurveyorsDetails from "@/components/configurations/components/general/SurveyorsDetails";
import CustomFields from "@/components/configurations/components/general/CustomFields";
import NotesTag from "@/components/configurations/components/general/NotesTag";
import Checklist from "@/components/configurations/components/general/Checklist";
import RoleAndUser from "@/components/configurations/components/general/RoleAndUser";
import { PasswordPolicy } from "@/components/configurations/components/general/PasswordPolicy";
import { tabsLabel } from "@/components/common/TabLabel"; 
import { Setting } from "@/components/configurations/components/job/Setting";
import { JobProcess } from "@/components/configurations/components/job/JobProcess";

const TABS = [
  {
    id: "settings",
    label: tabsLabel("Settings", "Job Settings"),
    component: Setting,
  },
  {
    id: "job-process",
    label: tabsLabel("Job Process", "Configure job Stages"),
    component: JobProcess,
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

export default function GeneralConfig() {
  return <TabLayout tabs={TABS} />;
}
