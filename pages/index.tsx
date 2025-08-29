import { useState, useRef, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import WelcomeHeader from "../components/common/WelcomeHeader";
import Breadcrumb from "../components/common/Breadcrumb";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { Status } from "@lib/constants/enum";
import { getDashboardThunk } from "@redux/feature/dashboard/dashboardThunk";
import NumbersCard from "@/components/dashboard/NumbersCard";
import { IconUserScan } from "@tabler/icons-react";
import { Spin } from "antd";
import { Table, TableColumnsType } from "antd";
import Link from "next/link";
import { timeAgo } from "@lib/utils/timeAgo";
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

type role = {
  name: string
  email: string
  createdAt: string
}


function transformDashboardData(input: InputData) {
  const countData = [
    {
      title: "Contractors",
      count: Number(input?.contractorCount),
      description: "Total number of contractors in the system",
      icon: (
        <IconUserScan className="stroke-primary stroke-[1.5] w-[32px] h-[32px]" />
      ),
      route: "contractor"
    },
    {
      title: "Customers",
      count: Number(input?.customerCount),
      description: "Total number of customers in the system",
      icon: (
        <IconUserScan className="stroke-primary stroke-[1.5] w-[32px] h-[32px]" />
      ),
      route: "customer"
    },
    {
      title: "Users",
      count: Number(input?.usersCount),
      description: "Total number of users in the system",
      icon: (
        <IconUserScan className="stroke-primary stroke-[1.5] w-[32px] h-[32px]" />
      ),
      route: "user"
    },
    {
      title: "Leads",
      count: Number(input?.leadCount),
      description: "Total number of leads in the system",
      icon: (
        <IconUserScan className="stroke-primary stroke-[1.5] w-[32px] h-[32px]" />
      ),
      route: "leads"
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
  const useStatus = useAppSelector((state) => state.auth.status);
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
      if (status === Status.IDLE && useStatus === Status.SUCCESS) {
        dispatch(getDashboardThunk()).unwrap();
      }
    } catch (error) {
      console.log(error);
    }
  }, [useStatus]);

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

  const columns: TableColumnsType<role> = useMemo(() => [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,

    },
    {
      title: 'CreatedAt',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
      ellipsis: true,
      render: (_, record) => {
        return (
          timeAgo(record.createdAt)

        )
      }
    }
  ], [])
  if (status === Status.IDLE) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    );
  }
  return (
    <div className="md:px-6 sm:px-3 pt-4">
      <div className="container-fluid">
        <Breadcrumb breadcrumbItem={breadcrumbItem} />
        <WelcomeHeader income />
        <div className="grid grid-cols-12 gap-4">
          {countData?.map((item, index) => (
            <div className="lg:col-span-3 sm:col-span-6 col-span-12 card flex flex-col bg-card-color rounded-xl overflow-hidden border border-dashed border-border-color">
              <NumbersCard key={index} item={item} />
            </div>
          ))}
        </div>
        <div className="text-[20px]/[24px] font-black mb-12 mt-6">
          Recent Activities
        </div>
        <div className="grid md:grid-cols-1 md:grid-cols-2 gap-[20px] ">
          {data?.map((item, index) => (
            <div className="">
              <div className="grid grid-cols-2">

                <div className="mb-2 font-bold">{countData[index].title}</div>
                <div className="flex justify-end text-primary text-sm pr-2"><Link href={countData[index].route}>View All</Link></div>
              </div>

              <div> <Table
                columns={columns}
                dataSource={item}
                pagination={false}
              /></div>


            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
