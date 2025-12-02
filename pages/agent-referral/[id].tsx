"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Tabs, Result, Card, Button, Typography } from "antd";
import { IconCirclePlus, IconLayoutBoardSplit } from "@tabler/icons-react";

import { CreateTaskModal } from "@/components/common/Models/CreatetaskModel";
import { CreateAppointmentModal } from "@/components/common/Models/createAppointementModel";
import AddNotesCard from "@/components/common/TimeLineComponents/AddNotesCard";
import ReferralLeads from "@/components/agentreferral/ReferralLeads";
import { initialData } from "data/agentreferralData";
import FileExplorer from "@/components/common/FileExplorer";
import { sdriveRootFolders } from "@/data/sdriveData";

const { TabPane } = Tabs;

const ReferralPartnerPage = () => {
  const params = useParams();
  const partnerId = Number(params?.id);

  const [partnerName, setPartnerName] = useState("");

  useEffect(() => {
    const partner = initialData.find((p) => p.id === partnerId);
    if (partner) setPartnerName(partner.name);
  }, [partnerId]);

  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAddNotes, setShowAddNotes] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveTask = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowTaskModal(false);
    }, 800);
  };

  const handleSaveAppointment = async () => {
    setShowAppointmentModal(false);
  };

  const handleSaveNote = async () => {
    setTimeout(() => {
      setShowAddNotes(false);
    }, 800);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <Typography.Title level={4}>Referral Partner - {partnerName || "Loading..."}</Typography.Title>
        <Button className="mr-2" type="text">
          <IconLayoutBoardSplit size={25} />
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

            <div className="flex flex-col">
              <div className="flex items-center justify-between mx-1">
                <span>Appointment</span>
                <button
                  onClick={() => setShowAppointmentModal(true)}
                  className="text-primary flex items-center gap-1 text-sm sm:text-base"
                >
                  <IconCirclePlus size={15} /> Appointment
                </button>
              </div>
              <Card className="h-44 overflow-y-auto flex items-center justify-center">
                <p>No Appointment Found!</p>
              </Card>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center justify-between mx-1">
                <span>Task</span>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="text-primary flex items-center gap-1 text-sm sm:text-base"
                >
                  <IconCirclePlus size={15} /> Task
                </button>
              </div>
              <Card className="h-44 overflow-y-auto flex items-center justify-center">
                <p>No Task Found!</p>
              </Card>
            </div>

          </div>

          <Tabs defaultActiveKey="leads" type="card" size="large" tabBarStyle={{ margin: 0, marginRight: "10px" }} tabBarGutter={10}>
            <TabPane tab="Referral Leads" key="leads">
              <ReferralLeads />
            </TabPane>
            <TabPane tab="Documents" key="documents">
              <div className="w-full">
                <FileExplorer
                  rootFolders={sdriveRootFolders}
                  enableSearch={true}
                  onSearchChange={query => console.log('Search:', query)}
                  enableMultiSelect={true}
                  onDelete={items => console.log('Delete items:', items)}
                  enableAddFolder={true}
                  onAddFolder={parentId => console.log('Add folder to parent:', parentId)}
                  enableAddFile={true}
                  onAddFile={parentId => console.log('Add file to parent:', parentId)}
                  enableShare={true}
                  onShare={items => console.log('Share items:', items)}
                  enableExport={true}
                  onExport={items => console.log('Export items:', items)}
                />
              </div>
            </TabPane>
          </Tabs>
        </div>

        <div>
          <div className="flex items-center justify-between mx-1">
            <span>Notes</span>

            {!showAddNotes && (
              <button
                onClick={() => setShowAddNotes(true)}
                className="text-primary flex items-center gap-1 text-sm sm:text-base"
              >
                <IconCirclePlus size={15} /> Notes
              </button>
            )}
          </div>

          {showAddNotes ? (
            <div className="p-3 border rounded-xl bg-white">
              <AddNotesCard
                onSave={handleSaveNote}
                onCancel={() => setShowAddNotes(false)}
                loading={loading}
                initialData={undefined}
                tagnSwitch={false}
              />
            </div>
          ) : (
            <Card className="h-44 flex items-center justify-center">
              <p>No Notes Found!</p>
            </Card>
          )}
        </div>
      </div>

      <CreateTaskModal
        title="Create Task"
        open={showTaskModal}
        loading={loading}
        status={true}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleSaveTask}
        initialData={undefined}
        attachment={false}
      />

      <CreateAppointmentModal
        open={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        title="Book Appointment"
        loading={false}
        onSubmit={handleSaveAppointment}
        initialData={undefined}
      />
    </div>
  );
};

export default ReferralPartnerPage;
