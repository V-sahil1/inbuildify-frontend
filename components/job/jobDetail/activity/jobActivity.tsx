"use client";
import React, { useState } from "react";
import { Card, Typography, Tag, Input } from "antd";
import {
  IconMail,
  IconSearch,
  IconFilter,
  IconArrowsDiagonal,
} from "@tabler/icons-react";
import TimelineActionsBar from "@/components/common/TimeLineComponents/TimelineActionsBar";

const { Text, Title } = Typography;

interface EmailItem {
  id: string;
  date: string;
  time: string;
  sender: string;
  status: "Sent" | "Delivered";
  subject: string;
  body: string;
  recipient: string;
}

const emailData: EmailItem[] = [
  {
    id: "1",
    date: "30-09-2025",
    time: "1:11PM",
    sender: "jacob@insimplify.com.au",
    status: "Sent",
    subject: "Extension Notice – Weather",
    body: "Lot 28 Ballarat Street, Epping: Extension Notice",
    recipient: "Murthy Muthuswamy",
  },
  {
    id: "2",
    date: "30-09-2025",
    time: "1:06PM",
    sender: "sales@insimplify.com.au",
    status: "Delivered",
    subject: "Book Supplier",
    body: "Lot 28 Ballarat Street, Epping - Contribution tax assessment with Water Authority",
    recipient: "Murthy Muthuswamy",
  },
];

const getStatusTag = (status: "Sent" | "Delivered") => {
  const color = status === "Delivered" ? "green" : "blue";
  return (
    <Tag color={color} className="flex items-center w-fit">
      {status}
    </Tag>
  );
};

export const JobActivity: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Own");

  return (
    <Card className="w-full overflow-hidden">
      <div className="flex sm:flex-row justify-between sm:items-center gap-3 mb-4">
        <TimelineActionsBar
          tabs={["Own", "All"]}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          actionItems={[]}
          isActionShow={false}
        />
        <Input
          prefix={<IconSearch size={16} />}
          placeholder="Search by type, subject, sender & recipient email ID's..."
          className="w-full sm:w-[300px] lg:w-[400px]"
        />
        <button className="cursor-pointer">
          <IconFilter size={25} className="text-primary" />
        </button>
      </div>

      <div className="flex flex-col relative">
        <div className="absolute top-1 bottom-0 left-[140px] w-0.5 bg-primary-10 z-0 m-0.5" />

        {emailData.map((item) => (
          <div key={item.id} className="relative flex items-start mb-8">
            <div className="flex flex-col items-end w-36 pr-8 flex-shrink-0">
              <Title level={5} className="text-sm !m-0 !mb-1">
                {item.date}
              </Title>
              <Title level={5} className="text-sm !m-0">
                {item.time}
              </Title>
            </div>

            <div className="flex-shrink-0 w-8 flex justify-center mt-1 z-10">
              <div className="relative transform -translate-x-1/2">
                <IconMail className="text-primary border rounded-full p-1 bg-orange-100" size={35} />
              </div>
            </div>

            <div className="flex-grow pl-5 -mt-2">
              <Card size="small" className="shadow-sm bg-card-color hover:bg-body-color">
                <div className="flex justify-between mb-2 mr-[40%]">
                  <div>
                    <Title level={5} className="!m-0 !mb-1 text-base font-medium text-gray-800">
                      {item.subject}
                    </Title>
                    <Text className="text-gray-500 text-sm">
                      {item.body}
                    </Text>
                  </div>
                  <div className="flex flex-col items-start">
                    <Text className="text-sm text-gray-500">
                      {item.sender}
                    </Text>
                    <div className="text-left">
                      {getStatusTag(item.status)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Text className="text-gray-500">
                    {item.recipient}
                  </Text>
                  <button>
                    <IconArrowsDiagonal size={22} className="text-primary" />
                  </button>
                </div>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};