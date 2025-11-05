import React, { useState } from 'react';
import { Button, Dropdown, Tag } from 'antd';
import { IconChevronDown, IconPencil, IconSettings } from '@tabler/icons-react';
import StatusTracker, { Stage } from '@/components/common/StatusTracker';
import MailSendModal from '@/components/common/Models/MailSendModal';

const JobVariationStatusTracker = () => {
  const [mailSendTypeOpen, setMailSendTypeOpen] = useState(null);
  const [uploadComplete, setIsUploadComplete] = useState(false);
  const [stages, setStages] = useState<Stage[]>([
    {
      id: 1,
      title: 'Create Variation',
      status: 'active',
      buttons: [
        {
          label: 'Approve',
          type: 'primary',
          onClick: () =>
            setStages(prev => {
              const updated = [...prev];
              if (updated[0].status === 'completed') return prev;
              updated[0].status = 'completed';
              updated[0].buttons = [
                {
                  label: 'Edit Variation',
                  type: 'default',
                  onClick: () => { },
                },
              ];
              if (updated[1]) updated[1].status = 'active';
              console.log('Approved Step 1');
              return updated;
            }),
        },
      ],
    },
    {
      id: 2,
      title: 'Approval Variation',
      status: 'disabled',
      buttons: [
        {
          label: 'Approve',
          type: 'primary',
          onClick: () => {
            setMailSendTypeOpen(2);
          },
        },
      ],
    },
    {
      id: 3,
      title: 'Send Variation to Customer',
      status: 'disabled',
      buttons: [
        {
          label: 'eSign',
          type: 'primary',
          onClick: () =>
            setStages(prev => {
              const updated = [...prev];
              if (updated[2].status === 'completed') return prev;
              updated[2].status = 'completed';
              updated[2].buttons = [
                {
                  label: 'Send',
                  type: 'default',
                  onClick: () => {
                    setMailSendTypeOpen(3);
                    setStages(prev => {
                      const updated = [...prev];
                      if (updated[2].status === 'completed') return prev;
                      updated[2].status = 'completed';
                      updated[2].buttons = [];
                      if (updated[3]) updated[3].status = 'active';
                      console.log('Skipped Step 3');
                      return updated;
                    });
                  },
                },
                {
                  label: 'Skip',
                  type: 'default',
                  onClick: () =>
                    setStages(prev => {
                      const updated = [...prev];
                      if (updated[2].status === 'completed') return prev;
                      updated[2].status = 'completed';
                      updated[2].buttons = [];
                      if (updated[3]) updated[3].status = 'active';
                      console.log('Skipped Step 3');
                      return updated;
                    }),
                },
              ];
              if (updated[3]) updated[3].status = 'active';
              console.log('Skipped Step 3');
              return updated;
            }),
        },
        {
          label: 'Send',
          type: 'primary',
          onClick: () => {
            setMailSendTypeOpen(3);
          },
        },
        {
          label: 'Skip Sending',
          type: 'default',
          onClick: () =>
            setStages(prev => {
              const updated = [...prev];
              if (updated[2].status === 'completed') return prev;
              updated[2].status = 'completed';
              updated[2].buttons = [
                {
                  label: 'eSign',
                  type: 'default',
                  onClick: () =>
                    setStages(prev => {
                      const updated = [...prev];
                      if (updated[2].status === 'completed') return prev;
                      updated[2].status = 'completed';
                      updated[2].buttons = [];
                      if (updated[3]) updated[3].status = 'active';
                      console.log('Skipped Step 3');
                      return updated;
                    }),
                },
                {
                  label: 'Send',
                  type: 'default',
                  onClick: () => {
                    setMailSendTypeOpen(3);
                    setStages(prev => {
                      const updated = [...prev];
                      if (updated[2].status === 'completed') return prev;
                      updated[2].status = 'completed';
                      updated[2].buttons = [];
                      if (updated[3]) updated[3].status = 'active';
                      console.log('Skipped Step 3');
                      return updated;
                    });
                  },
                },
              ];
              if (updated[3]) updated[3].status = 'active';
              console.log('Skipped Step 3');
              return updated;
            }),
        },
      ],
    },
    {
      id: 4,
      title: 'Upload Signed Variation',
      status: 'disabled',
      buttons: [
        {
          label: 'Upload Signed Variation',
          type: 'primary',
          upload: true,
          onClick: () => {
            setStages(prev => {
              const updated = [...prev];
              if (updated[3].status === 'completed') return prev;
              updated[3].status = 'completed';
              updated[3].buttons = [
                {
                  label: 'Download',
                  type: 'primary',
                  onClick: () => { },
                },
                {
                  label: 'Delete',
                  type: 'primary',
                  upload: true,
                  onClick: () => { },
                },
              ];
              if (updated[4]) updated[4].status = 'active';
              console.log('eSign Step 3');
              return updated;
            });
          },
        },
      ],
    },
    {
      id: 5,
      title: 'Price Included in contract ?',
      status: 'disabled',
      buttons: [
        {
          label: 'Included',
          type: 'primary',
          onClick: () =>
            setStages(prev => {
              const updated = [...prev];
              if (updated[4].status === 'completed') return prev;
              updated[4].status = 'completed';
              updated[4].buttons = [];
              if (updated[5]) updated[5].status = 'active';
              console.log('Yes Step 5');
              return updated;
            }),
        },
        {
          label: 'Not Included',
          type: 'default',
          onClick: () =>
            setStages(prev => {
              const updated = [...prev];
              if (updated[4].status === 'completed') return prev;
              updated[4].status = 'completed';
              updated[4].buttons = [];
              if (updated[5]) updated[5].status = 'active';
              console.log('No Step 5');
              return updated;
            }),
        },
      ],
    },
    {
      id: 6,
      title: 'Send Invoice to Customer',
      status: 'disabled',
      buttons: [
        {
          label: 'Send Invoice',
          type: 'primary',
          onClick: () =>
            setStages(prev => {
              const updated = [...prev];
              if (updated[5].status === 'completed') return prev;
              updated[5].status = 'completed';
              updated[5].buttons = [];
              if (updated[6]) updated[6].status = 'active';
              console.log('Step 6 Sent Invoice');
              return updated;
            }),
        },
      ],
    },
    {
      id: 7,
      title: 'Send Extension Notice to Customer',
      status: 'disabled',
      buttons: [
        {
          label: 'Send Notice',
          type: 'primary',
          onClick: () =>
            setStages(prev => {
              const updated = [...prev];
              if (updated[6].status === 'completed') return prev;
              updated[6].status = 'completed';
              updated[6].buttons = [];
              if (updated[7]) updated[7].status = 'active';
              console.log('Step 7 Sent Notice');
              return updated;
            }),
        },
      ],
    },
  ]);
  console.log('button', stages[3].buttons);

  return (
    <div className="p-3 bg-card-color">
      {/* Header */}
      <div className="flex justify-between border-b-2 p-3">
        <div className="flex gap-2">
          Variation Name
          <IconPencil size={20} />
        </div>
        <div className="flex gap-2">
          <Button type="primary" className="text-sm">
            Create Another Variation
          </Button>
          <Dropdown menu={{ items: [{ key: 'preview', label: 'Preview Variation' }] }}>
            <Button className="text-sm">
              More Activities
              <IconChevronDown />
            </Button>
          </Dropdown>
          <Button icon={<IconSettings />} />
        </div>
      </div>

      {/* Status & Amount */}
      <div className="mt-20 space-y-2">
        <div className="flex justify-between">
          <div className="text-xs font-bold">STATUS</div>
          <div className="text-xs font-bold">AMOUNT</div>
        </div>
        <div className="flex justify-between">
          <div>
            <Tag color="green">Approved</Tag>
          </div>
          <div className="text-lg font-extrabold flex">$ 15000</div>
        </div>
      </div>

      {/* Variation Steps */}
      <StatusTracker
        setIsUploadComplete={setIsUploadComplete}
        stages={stages.map(stage => ({
          ...stage,
          buttons:
            stage.id === 1
              ? stage.buttons
              : stage.status === 'active' || stage.status === 'completed'
                ? stage.buttons
                : [],
        }))}
      />
      <MailSendModal
        open={mailSendTypeOpen === 2}
        onCancel={() => setMailSendTypeOpen(null)}
        onSend={() => {
          setStages(prev => {
            const updated = [...prev];
            if (updated[1].status === 'completed') return prev;
            updated[1].status = 'completed';
            updated[1].buttons = [];
            if (updated[2]) updated[2].status = 'active';
            console.log('Approved Step 2');
            return updated;
          });
          setMailSendTypeOpen(null);
        }}
        title="Send Variation approved Notofication"
        attachedCopy={true}
        attachFile={false}
      />
      <MailSendModal
        open={mailSendTypeOpen === 3}
        onCancel={() => setMailSendTypeOpen(null)}
        onSend={() => {
          setMailSendTypeOpen(null);
          setStages(prev => {
            const updated = [...prev];
            if (updated[2].status === 'completed') return prev;
            updated[2].status = 'completed';
            updated[2].buttons = [
              {
                label: 'eSign',
                type: 'default',
                onClick: () =>
                  setStages(prev => {
                    const updated = [...prev];
                    if (updated[2].status === 'completed') return prev;
                    updated[2].status = 'completed';
                    updated[2].buttons = [];
                    if (updated[3]) updated[3].status = 'active';
                    console.log('Skipped Step 3');
                    return updated;
                  }),
              },
              {
                label: 'ReSend',
                type: 'default',
                onClick: () =>
                  setStages(prev => {
                    setMailSendTypeOpen(3);
                    const updated = [...prev];
                    if (updated[2].status === 'completed') return prev;
                    updated[2].status = 'completed';
                    updated[2].buttons = [];
                    if (updated[3]) updated[3].status = 'active';
                    console.log('Skipped Step 3');
                    return updated;
                  }),
              },
            ];
            if (updated[3]) updated[3].status = 'active';
            console.log('Skipped Step 3');
            return updated;
          });
        }}
        title="Send this Variation"
        attachedCopy={true}
        attachFile={true}
      />
    </div>
  );
};

export default JobVariationStatusTracker;
