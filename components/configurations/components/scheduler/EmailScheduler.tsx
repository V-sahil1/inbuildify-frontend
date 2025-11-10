"use client";

import TimelineActionsBar from "@/components/common/TimeLineComponents/TimelineActionsBar";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { Button, Table, Tag, Avatar, message, Popconfirm, Input } from "antd";
import { useState } from "react";
import { SchedulerSettingsForm } from "./SchedulerSettingsForm";
import { schedulerInitialData } from "data/schedulerData";
import { useUsersHook } from "@hooks/useUserData";

// Create initials from name
const initials = (name: string) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
};

export const EmailScheduler = () => {
  const { users } = useUsersHook(); // ✅ Load users list
  const [data, setData] = useState(schedulerInitialData);
  const [openSchedulerForm, setOpenSchedulerForm] = useState<any>(null);
  const [searchValue, setSearchValue] = useState("");

  // ✅ Convert userId to user Full Name
  const getUserName = (id: string) => {
    const user = users?.find((u: any) => u.usersId === id);
    return user?.name || id;
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSave = (updatedRow: any) => {
    const newData = data.map((item) =>
      item.key === updatedRow.key ? { ...item, ...updatedRow, scheduled: true } : item
    );
    setData(newData);
    message.success("Scheduler settings saved successfully");
    setOpenSchedulerForm(null);
  };

  const filterOptions = [
    { type: "All", label: "All", count: data.length },
    { type: "Standard", label: "Standard", count: 2 },
    { type: "Nonscheduled", label: "Non Scheduled", count: data.filter((d) => !d.scheduled).length },
  ];

  const columns = [
    {
      title: (
        <div className="flex gap-[10%]">
          <span>Name</span>
          <Input
            size="small"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-[140px]"
            placeholder="Search..."
          />
        </div>
      ),
      key: "name",
      width: "40%",
      render: (_: any, record: any) => (
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-sm">{record.name}</p>
          <p className="text-xs text-gray-600">{record.description}</p>

          <div className="flex gap-2 mt-1">
            {record.scheduled ? (
              <>
                <Tag color="green">Scheduled</Tag>
                {record.frequency && <Tag color="blue">{record.frequency}</Tag>}
              </>
            ) : (
              <Tag color="red">Not Scheduled</Tag>
            )}
          </div>
        </div>
      ),
    },

    {
      title: "Targeted Recipients",
      width: "25%",
      render: (_: any, r: any) => {
        if (!r.scheduled) return;
        if (r.sendToActive) return "Send to all users";

        if (Array.isArray(r.notificationUsers) && r.notificationUsers.length) {
          return (
            <div className="flex gap-2">
              {r.notificationUsers.map((id: string, i: number) => {
                const name = getUserName(id);
                return (
                  <Avatar key={i} className="bg-gray-400 text-white text-xs">
                    {initials(name)}
                  </Avatar>
                );
              })}
            </div>
          );
        }
        return;
      },
    },

    {
      title: "Exclude Recipients",
      width: "20%",
      render: (_: any, r: any) => (
        r.scheduled &&
        r.sendToActive &&
        Array.isArray(r.excludeUsers) &&
        r.excludeUsers.length ? (
          <div className="flex gap-2">
            {r.excludeUsers.map((id: string, i: number) => {
              const name = getUserName(id);
              return (
                <Avatar key={i} className="bg-gray-400 text-white text-xs">
                  {initials(name)}
                </Avatar>
              );
            })}
          </div>
        ) : (
          <span className="text-gray-400"></span>
        )
      ),
    },

    {
      title: "Action",
      width: "15%",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          {record.scheduled ? (
            <>
              <Button onClick={() => setOpenSchedulerForm(record)}>
                <IconEdit size={18} />
              </Button>

              <Popconfirm
                title="Disable scheduler?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => {
                  const updated = data.map((item) =>
                    item.key === record.key ? { ...item, scheduled: false } : item
                  );
                  setData(updated);
                  message.success("Scheduler disabled");
                }}
              >
                <Button danger>
                  <IconTrash size={18} />
                </Button>
              </Popconfirm>
            </>
          ) : (
            <Button onClick={() => setOpenSchedulerForm(record)}>
              <IconPlus size={18} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {openSchedulerForm ? (
        <SchedulerSettingsForm
          data={openSchedulerForm}
          onCancel={() => setOpenSchedulerForm(null)}
          onSave={handleSave}
        />
      ) : (
        <>
          <h1 className="text-lg font-semibold">
            The following job emails are available to be scheduled as per your requirement
          </h1>

          <TimelineActionsBar tabs={filterOptions} onTabChange={() => {}} isActionShow={false} isCountShow={true} />

          <Table columns={columns} dataSource={filteredData} pagination={false} />
        </>
      )}
    </div>
  );
};
