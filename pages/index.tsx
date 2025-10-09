// import { useState, useRef, useEffect } from "react";
// import WelcomeHeader from "../components/common/WelcomeHeader";
// import Breadcrumb from "../components/common/Breadcrumb";
// import { useAppDispatch, useAppSelector } from "@hooks/redux";
// import { Status } from "@lib/constants/enum";
// import { getDashboardThunk } from "@redux/feature/dashboard/dashboardThunk";
// import NumbersCard from "@/components/dashboard/NumbersCard";
// import { IconTie, IconUserScan, IconUsersGroup } from "@tabler/icons-react";
// import { message, Spin } from "antd";
// import { Table, TableColumnsType } from "antd";
// import Link from "next/link";
// import { timeAgo } from "@lib/utils/timeAgo";
// type InputData = {
//   contractorCount: string;
//   contractorData: any[];
//   customerCount: string;
//   customerData: any[];
//   usersCount: string;
//   usersData: any[];
//   leadCount: string;
//   leadData: any[];
// };

// type role = {
//   name: string;
//   email: string;
//   createdAt: string;
// };

// export async function getStaticProps() {
//   return {
//       props: {
//           isAuthRoute: false,
//       },
//   };
// }

// function transformDashboardData(input: InputData) {
//   const countData = [
//     {
//       title: "Contractors",
//       count: input?.contractorCount,
//       description: "Total number of contractors in the system",
//       icon: (
//         <IconTie className="stroke-primary stroke-[1.5] w-[32px] h-[32px]" />
//       ),
//       route: "contractors",
//     },
//     // {
//     //   title: "Customers",
//     //   count: input?.customerCount,
//     //   description: "Total number of customers in the system",
//     //   icon: (
//     //     <IconUserScan className="stroke-primary stroke-[1.5] w-[32px] h-[32px]" />
//     //   ),
//     //   route: "customer",
//     // },
//     {
//       title: "Users",
//       count: input?.usersCount,
//       description: "Total number of users in the system",
//       icon: (
//         <IconUsersGroup className="stroke-primary stroke-[1.5] w-[32px] h-[32px]" />
//       ),
//       route: "users",
//     },
//     {
//       title: "Leads",
//       count: input?.leadCount,
//       description: "Total number of leads in the system",
//       icon: (
//         <IconUserScan className="stroke-primary stroke-[1.5] w-[32px] h-[32px]" />
//       ),
//       route: "leads",
//     },
//   ];

//   const data = [
//     input?.contractorData,
//     // input?.customerData,
//     input?.usersData,
//     input?.leadData,
//   ];

//   return { countData, data };
// }

// export default function Analysis() {
//   const [adminMenu, setAdminMenu] = useState<boolean>(false);
//   const { dashboard, status } = useAppSelector((state) => state.dashboard);
//   const useStatus = useAppSelector((state) => state.auth.status);
//   const { countData, data } = transformDashboardData(dashboard);
//   const dispatch = useAppDispatch();
//   const menuRef = useRef(null);
//   const buttonRef = useRef(null);
//   const breadcrumbItem = [
//     {
//       name: "Dashboard",
//     },
//   ];

//   useEffect(() => {
//     const fetchDashboardData = async()=>{
//     try {
//       if (status === Status.IDLE && useStatus === Status.SUCCESS) {
//        await dispatch(getDashboardThunk()).unwrap();
//       }
//     } catch (error) {
//       message.error(error || 'Failed to fetch dashboard data');
//     }
//     }
//     fetchDashboardData(); 
//   }, [useStatus]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         menuRef.current &&
//         !menuRef?.current?.contains(event.target) &&
//         !buttonRef?.current?.contains(event.target)
//       ) {
//         setAdminMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [menuRef]);

//   const getColumns = (tableIndex: number): TableColumnsType<role> => {
//     const baseColumns: TableColumnsType<role> = [
//       {
//         title: "Email",
//         dataIndex: "email",
//         key: "email",
//         ellipsis: true,
//       },
//       {
//         title: "CreatedAt",
//         dataIndex: "CreatedAt",
//         key: "CreatedAt",
//         ellipsis: true,
//         render: (_, record) => {
//           return timeAgo(record?.createdAt);
//         },
//       },
//     ];

//     // Add name column for all tables except leads (index 3)
//     if (tableIndex !== 3) {
//       baseColumns.unshift({
//         title: "Name",
//         dataIndex: "name",
//         key: "name",
//         ellipsis: true,
//       });
//     }

//     return baseColumns;
//   };

//   if (status !== Status.SUCCESS) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Spin />
//       </div>
//     );
//   }
//   return (
//     <div className="md:px-6 sm:px-3 pt-4">
//       <div className="container-fluid">
//         <Breadcrumb breadcrumbItem={breadcrumbItem} />
//         <WelcomeHeader  />
//         <div className="grid grid-cols-12 gap-4">
//           {countData?.map((item, index) => (
//             <div className="lg:col-span-3 sm:col-span-6 col-span-12 card flex flex-col bg-card-color rounded-xl overflow-hidden border border-border-color">
//               <NumbersCard key={index} item={item} />
//             </div>
//           ))}
//         </div>
//         <div className="text-[20px]/[24px] font-black mb-6 mt-6">
//           Recent Activities
//         </div>
//         <div>
//           {data.flat().length > 0 ?
//            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] ">
//           {data?.map((item, index) => (
//             item?.length > 0 ? 
//             <div>
//               <div className="grid grid-cols-2">
//                 <div className="mb-2 font-bold">{countData[index]?.title}</div>
//                 <div className="flex justify-end text-primary text-sm pr-2">
//                   <Link href={countData[index]?.route}>View All</Link>
//                 </div>
//               </div>

//               <div className="min-h-[250px]">
//                 <Table columns={getColumns(index)} dataSource={item} pagination={false} className="flex-1"/>
//               </div>
//             </div> : <></>)
//           )}
//         </div>
//            :
//            <div className="flex flex-1 justify-center items-center h-[215px] bg-card-color text-font-color-100 rounded-xl border border-border-color"><p>No recent data available. Add your first record to get started.</p></div>}
//         </div>
       
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import {
  createLeadSourceThunk,
  createLeadThunk,
  getLeadThunk,
} from "@redux/feature/lead/leadThunk";
import { message, Typography, Empty, Spin } from "antd";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { Status } from "@lib/constants/enum";
import { useRouter } from "next/navigation";
import { ILead } from "@redux/feature/lead/ILeadState";
import { IconMail, IconPhone } from "@tabler/icons-react";
import { timeAgo } from "@lib/utils/timeAgo";
import { enumToReadable } from "@lib/utils/enumToRedable";
import leadCreateFields from "@/components/formFields/LeadCreateFields";
import SystemRoutes from "@lib/constants/Routes";
import { setAddInstSourceModal } from "@redux/feature/lead/leadSlice";
import rangeAndDwellingTypeFields from "@/components/formFields/rangeAndDwellingTypeFields";
const Leads = () => {
  const { leads } = useAppSelector((state) => state.lead);
  const status = useAppSelector((state) => state.lead.status.leads);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const addInstSourceModal = useAppSelector(
    (state) => state.lead.addInstSourceModal
  );
  const [openLeadCreateModal, setOpenLeadCreateModal] = useState(false);
  const [loading, setLoading] = useState({leadLoading:false,leadSourceLoading:false});

  useEffect(() => {
    async function fetchData() {
      if (status === Status.IDLE) {
        await dispatch(getLeadThunk()).unwrap();
      }
    }
    if (status === Status.IDLE || status === Status.ERROR) {
      fetchData();
    }
  }, [dispatch, status]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading({...loading,leadLoading:true});
      const payload = {
        lead_source: values.leadSource,
        notes: values.notes,
        contact: {
          name: values.name,
          ...(values.email && { email: values.email }),
          ...(values.phone && { phone: values.phone }),
        },
      };
      await dispatch(createLeadThunk(payload)).unwrap();
      message.success("Lead created successfully");
      setOpenLeadCreateModal(false);
    } catch (error) {
      message.error(error || "Failed to create lead");
    } finally {
      setLoading({...loading,leadLoading:false});
    }
  };

  const handleAddLeadSourceSubmit = async (values: any) => {
    try {
      setLoading({...loading,leadSourceLoading:true});
      await dispatch(createLeadSourceThunk({ name: values.name })).unwrap();
      message.success("Lead source created successfully");
      setOpenLeadCreateModal(true);
    } catch (error: any) {
      message.error(error || "Failed to create lead source");
    } finally {
      dispatch(setAddInstSourceModal(false));
      setLoading({...loading,leadSourceLoading:false});
    }
  };
  const handleOpenModal = () => {
    setOpenLeadCreateModal(true);
  };
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Typography.Title
          level={4}
          style={{ margin: 0, color: "var(--font-color)" }}
        >
          Leads
        </Typography.Title>
        <button
          className="btn large bg-[var(--primary)] cursor-pointer text-white"
          onClick={handleOpenModal}
        >
          Create
        </button>
      </div>
      {status === Status.PENDING ? (
        <div className="flex justify-center items-center pt-[20vh]">
          <Spin size="large" />
        </div>
      ) : leads.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {leads.map((lead: ILead) => (
            <div
              key={lead.leadId}
              onClick={() => {
                if (lead.status === "CANCELLED") return;
                else if (lead.status === "JOB") router.push(`${SystemRoutes.JOB}/${lead.leadId}`);
                else router.push(`${SystemRoutes.LEADS}/${lead.leadId}`);
              }}
              className={`rounded-2xl border border-border-color shadow-sm p-6 ${
                lead.status === "CANCELLED"
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:shadow-xl hover:scale-[1.02]"
              } 
                transition-all duration-200 bg-card-color flex flex-col`}
            >
              {/* Header with Tag on Top Right */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">{lead.name}</h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                    lead.status === "IN_PROGRESS"
                      ? "bg-purple-100 text-purple-700"
                      : lead.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : lead.status === "JOB"
                      ? "bg-fuchsia-300 text-fuchsia-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {enumToReadable(lead.status)}
                </span>
              </div>
            
              {/* Contact Info */}
              <div className=" flex-1 space-y-2 mb-4">
                
                <p className="flex items-center text-sm ">
                  <IconPhone size={16} className="mr-2 text-gray-400" />
                  {lead.phone ? lead.phone : 'N/A'}
                </p>
                <p className="flex items-center text-sm ">
                  <IconMail size={16} className="mr-2 text-gray-400" />
                  {lead.email ? lead.email : 'N/A'}
                </p>
                <p className="text-xs">Source: {lead.leadSource ? enumToReadable(lead.leadSource) : 'N/A'}</p>
                 
              </div>
            
              {/* Footer with dates */}
              <div className="flex border-t border-gray-100 pt-3 gap-4 text-xs text-gray-400">
                <p
                  className="flex-1 truncate"
                  title={`Created: ${timeAgo(lead.createdAt)}`}
                >
                  Created: {timeAgo(lead.createdAt)}
                </p>
                <p
                  className="flex-1 truncate"
                  title={`Updated: ${timeAgo(lead.updatedAt)}`}
                >
                  Updated: {timeAgo(lead.updatedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty
          description={
            <span className="text-gray-500">
              No Leads found. Create your first Lead to get started.
            </span>
          }
          className="pt-100"
        />
      )}

      <CreateFormModal
        title="Lead"
        open={openLeadCreateModal}
        loading={loading.leadLoading}
        onCancel={() => setOpenLeadCreateModal(false)}
        onSubmit={handleSubmit}
        fields={leadCreateFields({
          isEmailDisable: false,
        })}
      />

      <CreateFormModal
        title="LeadSource"
        open={addInstSourceModal}
        loading={loading.leadSourceLoading}
        onCancel={() => {
          dispatch(setAddInstSourceModal(false));
          setOpenLeadCreateModal(true);
        }}
        onSubmit={handleAddLeadSourceSubmit}
        fields={rangeAndDwellingTypeFields()}
      />
    </div>
  );
};

export default Leads;
