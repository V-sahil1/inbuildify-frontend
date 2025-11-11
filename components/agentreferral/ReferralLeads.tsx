"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Avatar, Table, Input } from "antd";
import { IconSearch } from "@tabler/icons-react";
import { useSearchParams, useRouter } from "next/navigation";
import { referralLeadsData } from "data/agentreferralData";
import { debouncedURL } from "@lib/utils/debounceURL";

export interface referralLead {
  id: number;
  referenceNo: string;
  name: string;
  status: string;
  commission: string;
  commissionPaid: string;
}

const ReferralLeads = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
  });

  const debouncedUpdateURL = debouncedURL();

  const handleFilterChange = useCallback(
    (updates: Partial<typeof filters>) => {
      setFilters(prev => {
        const newFilters = { ...prev, ...updates };
        debouncedUpdateURL(newFilters);
        return newFilters;
      });
    },
    [debouncedUpdateURL]
  );

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const columns = [
    {
      title: "S.No",
      dataIndex: "id",
      width: 70,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Reference No",
      dataIndex: "referenceNo",
      width: "15%",
    },
    { title: "Name", dataIndex: "name", width: "30%" },
    { title: "Status", dataIndex: "status" },
    { title: "Commission", dataIndex: "commission" },
    {
      title: "Commission Paid",
      dataIndex: "commissionPaid",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "",
      render: (_: any, record: referralLead) => (
        <Avatar>
          {record.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </Avatar>
      ),
    },
  ];

  const filteredData = referralLeadsData.filter((lead) =>
    `${lead.referenceNo} ${lead.name}`
      .toLowerCase()
      .includes(filters.search.toLowerCase())
  );

  return (
    <div className="p-6 bg-card-color">
      <div className="mb-4">
        <Input
          addonBefore={<IconSearch size={18} />}
          placeholder="Search by Name or Reference No"
          value={filters.search}
          onChange={(e) => handleFilterChange({ search: e.target.value })}
          size="large"
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={false}
        //  onRow={record => ({
        //     onClick: () => router.push(`${SystemRoutes.LEADS}/#`),
        //     style: { cursor: 'pointer' },
        //   })}
      />
    </div>
  );
};

export default ReferralLeads;
