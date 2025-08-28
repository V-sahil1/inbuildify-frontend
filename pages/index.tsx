import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import WelcomeHeader from "../components/common/WelcomeHeader";
import Link from "next/link";
import Breadcrumb from "../components/common/Breadcrumb";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { Status } from "@lib/constants/enum";
import { getDashboardThunk } from "@redux/feature/dashboard/dashboardThunk";
import NumbersCard from "@/components/dashboard/NumbersCard";

type InputData = {
  contractorCount: string;
  contractorData: any[];
  customerCount: string;
  customerData: any[];
  usersCount: string;
  usersData: any[];
  leadCount: string;
  leadData: any[];
};

function transformDashboardData(input: InputData) {
  const countData = [
    {
      title: "Contractors",
      count: Number(input?.contractorCount),
      description: "Total number of contractors in the system",
    },
    {
      title: "Customers",
      count: Number(input?.customerCount),
      description: "Total number of customers in the system",
    },
    {
      title: "Users",
      count: Number(input?.usersCount),
      description: "Total number of users in the system",
    },
    {
      title: "Leads",
      count: Number(input?.leadCount),
      description: "Total number of leads in the system",
    },
  ];

  const data = [
    input?.contractorData,
    input?.customerData,
    input?.usersData,
    input?.leadData,
  ];

  return { countData, data };
}

export default function Analysis() {
  const [adminMenu, setAdminMenu] = useState<boolean>(false);
  const { dashboard, status } = useAppSelector((state) => state.dashboard);
  const { countData, data } = transformDashboardData(dashboard);
  const dispatch = useAppDispatch();
  const { role } = useAppSelector((state) => state.auth);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  console.log(role);
  const breadcrumbItem = [
    {
      name: "Dashboard",
    },
  ];

  useEffect(() => {
    try {
      if (status === Status.IDLE) {
        dispatch(getDashboardThunk()).unwrap();
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef?.current?.contains(event.target) &&
        !buttonRef?.current?.contains(event.target)
      ) {
        setAdminMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="md:px-6 sm:px-3 pt-4">
      <div className="container-fluid">
        <Breadcrumb breadcrumbItem={breadcrumbItem} />
        <WelcomeHeader report />
        <div className="grid grid-cols-12 gap-4">
          {countData?.map((item, index) => (
            <div className="lg:col-span-3 sm:col-span-6 col-span-12 card flex flex-col bg-card-color rounded-xl overflow-hidden border border-dashed border-border-color">
              <NumbersCard
                key={index}
                item={item}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
