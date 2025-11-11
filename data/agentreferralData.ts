import { referralLead } from "@/components/agentreferral/ReferralLeads";

export interface Partners {
  id: number;
  name: string;
  email: string;
  phone: string;
  address1?: string;
  address2?: string;
  city?: string;
  country?: string;
  state?: string;
  zipcode?: string;
  abn?: string;
  company?: string;
  loginId?: string;
  referredUser?: string;
  isActive: boolean;
  isLocked?: boolean;
  reserved?: number;
  packages: number;
  hasLogin?: boolean;
}

export const initialData: Partners[] = [
  {
    id: 1,
    name: "Adam",
    email: "sales@insimplify.com.au",
    phone: "04061557834",
    country: "Australia",
    address1: "2 Leaks Road",
    city: "Tarneit",
    state: "Victoria",
    zipcode: "3029",
    company: "Insimplify",
    reserved: 6,
    packages: 26,
    isActive: true,
  },
  {
    id: 2,
    name: "Anna",
    email: "anna1@gmail.com",
    phone: "89058340534",
    address1: "9 Princess Street",
    city: "Corio",
    state: "Victoria",
    zipcode: "3212",
    reserved: 0,
    packages: 3,
    isActive: true,
  },
  {
    id: 3,
    name: "Chirag",
    email: "chirag@gmail.com",
    phone: "1122334455",
    address1: "AAA BBB CCC",
    city: "",
    state: "Victoria",
    zipcode: "221144",
    reserved: 1,
    packages: 22,
    isActive: false,
  },
  {
    id: 4,
    name: "Demo Agent",
    email: "vinay@assetpoint.com.au",
    phone: "0406166577",
    address1: "45 Tallis Cct",
    city: "Truganina",
    state: "Victoria",
    zipcode: "3029",
    reserved: 0,
    packages: 8,
    isActive: true,
  },
  {
    id: 5,
    name: "Nick",
    email: "nick@gmail.com",
    phone: "43435345435",
    address1: "8 12 North",
    city: "Norlane",
    state: "Victoria",
    zipcode: "3254",
    reserved: 0,
    packages: 3,
    isActive: false,
  },
];

export const referralLeadsData: referralLead[] = [
  { id: 1, referenceNo: "MYH00025", name: "Tanish", status: "Closed Won", commission: "$0.00", commissionPaid: "$0.00" },
  { id: 2, referenceNo: "MYH00031", name: "Daniel", status: "Closed Won", commission: "$0.00", commissionPaid: "$0.00" },
  { id: 3, referenceNo: "MYH00032", name: "Navin", status: "Closed Won", commission: "$0.00", commissionPaid: "$0.00" },
  { id: 4, referenceNo: "MYH00034", name: "Sachin", status: "Closed Won", commission: "$0.00", commissionPaid: "$0.00" },
  { id: 5, referenceNo: "MYH00035", name: "Jag", status: "Closed Won", commission: "$0.00", commissionPaid: "$0.00" },
  { id: 6, referenceNo: "MYH00036", name: "Brent", status: "Closed Won", commission: "$0.00", commissionPaid: "$0.00" },
  { id: 7, referenceNo: "MYH00037", name: "Murthy", status: "Closed Won", commission: "$0.00", commissionPaid: "$0.00" },
  { id: 8, referenceNo: "MYH00039", name: "Aman", status: "Closed Won", commission: "$0.00", commissionPaid: "$0.00" },
];
