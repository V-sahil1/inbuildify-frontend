import React, { useState } from 'react';
import { Button, Dropdown, Tag } from 'antd';
import { IconChevronDown, IconPencil, IconSettings } from '@tabler/icons-react';
import StatusTracker, { Stage } from '@/components/common/StatusTracker';

const JobVariationStatusTracker = () => {
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
                  onClick: () => {},
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
          onClick: () =>
            setStages(prev => {
              const updated = [...prev];
              if (updated[1].status === 'completed') return prev;
              updated[1].status = 'completed';
              updated[1].buttons = [];
              if (updated[2]) updated[2].status = 'active';
              console.log('Approved Step 2');
              return updated;
            }),
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
              updated[2].buttons = [];
              if (updated[3]) updated[3].status = 'active';
              console.log('eSign Step 3');
              return updated;
            }),
        },
        {
          label: 'Send',
          type: 'primary',
          onClick: () =>
            setStages(prev => {
              const updated = [...prev];
              if (updated[2].status === 'completed') return prev;
              updated[2].status = 'completed';
              updated[2].buttons = [];
              if (updated[3]) updated[3].status = 'active';
              console.log('Send Step 3');
              return updated;
            }),
        },
        {
          label: 'Skip Sending',
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
      ],
    },
    {
      id: 4,
      title: 'Upload Signed Variation',
      status: 'disabled',
      buttons: [
        {
          label: 'Upload',
          type: 'primary',
          onClick: () =>
            setStages(prev => {
              const updated = [...prev];
              if (updated[3].status === 'completed') return prev;
              updated[3].status = 'completed';
              updated[3].buttons = [];
              if (updated[4]) updated[4].status = 'active';
              console.log('Uploaded Step 4');
              return updated;
            }),
        },
      ],
    },
    {
      id: 5,
      title: 'Price Included in contract ?',
      status: 'disabled',
      buttons: [
        {
          label: 'Yes',
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
          label: 'No',
          type: 'default',
          onClick: () =>
            setStages(prev => {
              const updated = [...prev];
              if (updated[4].status === 'completed') return prev;
              updated[4].status = 'completed';
              updated[4].buttons = [];
              if (updated[6]) updated[6].status = 'active';
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
              console.log('Step 7 Sent Notice');
              return updated;
            }),
        },
      ],
    },
  ]);

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
          <Dropdown menu={{ items: [] }}>
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
        stages={stages.map(stage => ({
          ...stage,
          buttons: stage.id === 1 ? stage.buttons : stage.status === 'active' ? stage.buttons : [],
        }))}
      />
    </div>
  );
};

export default JobVariationStatusTracker;
