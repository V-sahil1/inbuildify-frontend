import TabLayout from "@/components/common/TabLayout";
import { tabsLabel } from "@/components/common/TabLabel";
import { LeadsOrOpportunities } from "@/components/configurations/sales/LeadsOrOpportunities";
import { SalesProcess } from "@/components/configurations/sales/SalesProcess";
import { LeadSource } from "@/components/configurations/sales/LeadSource";
import { LeadLostReasons } from "@/components/configurations/sales/LeadLostReasons";
import { ClientType } from "@/components/configurations/sales/ClientType";
import { Range } from "@/components/configurations/sales/Range";
import { DwellingType } from "@/components/configurations/sales/DwellingType";
import { Quotation } from "@/components/configurations/sales/Quotation";
import { HouseAndLandPackage } from "@/components/configurations/sales/HouseAndLandPackage";


const TABS = [
  {
    id: "leads-opportunities",
    label: tabsLabel(
      "Leads or Opportunities",
      "Set leads / Opportunities settings"
    ),
    component: LeadsOrOpportunities,
  },
  {
    id: "sales-process",
    label: tabsLabel("Sales Process", "Set your sales process"),
    component: SalesProcess,
  },
  {
    id: "lead-sources",
    label: tabsLabel("Lead Sources", "Add new or manage lead sources"),
    component: LeadSource,
  },
  {
    id: "lead-lost-reasons",
    label: tabsLabel("Lead Lost Reasons", "Add new or manage lead lost reasons"),
    component: LeadLostReasons,
  },
  {
    id: "client-type",
    label: tabsLabel("Client Type", "Add new or manage client type"),
    component: ClientType,
  },
  {
    id: "range",
    label: tabsLabel("Range", "Add new or manage range"),
    component: Range,
  },
  {
    id: "dwelling-type",
    label: tabsLabel("Dwelling Type", "Add new or manage Manage Dwelling Type"),
    component: DwellingType,
  },
  {
    id: "quotation",
    label: tabsLabel("Quotation", "Make necessary quotation settings"),
    component: Quotation,
  },
  {
    id: "house-and-land-package",
    label: tabsLabel("House & Land Package", "Make necessary H & L package settings"),
    component: HouseAndLandPackage,
  },
];

export default function SalesConfig() {
  return <TabLayout tabs={TABS} />;
}
