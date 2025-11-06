import { IconMail, IconPhone, IconPlus, IconTrash, IconUser } from '@tabler/icons-react';
import { Tag } from 'antd';
import { ContentCard } from './card/ContentCard';
export function HeaderContent({ id, leadsource, data }) {
  return (
    <div className="max-h-[400px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      <div>
        <p>System Reference ID</p>
        <p>{id}</p>
      </div>
      <div className="mt-2">
        <p>Builder</p>
        <Tag color="blue">My Home</Tag>
      </div>
      <div className="mt-2">
        <p>Lead Source</p>
        <p>{leadsource}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-3">
        {data &&
          data.length > 0 &&
          data.map(item => (
            <div className="flex gap-1 items-center p-1 text-xs">
              <div className="rounded-full w-4 h-4 text-center border border-blue text-blue">
                <IconUser size={15} />
              </div>
              <div>
                <p>{item.label}</p>
                <p>
                  {item.value} {item.status === 'Inactive' && <Tag color="red">{item.status}</Tag>}
                </p>
              </div>
            </div>
          ))}
      </div>
      <div className="mt-2 flex gap-2 items-center text-blue">
        <div className="rounded-full w-3 h-3 text-center bg-blue text-white">
          <IconPlus size={12} />
        </div>
        <p>Conveyancer / Solicitor</p>
      </div>
      <div className="mt-2 flex gap-2 items-center text-blue">
        <div className="rounded-full w-3 h-3 text-center bg-blue text-white">
          <IconPlus size={12} />
        </div>
        <p>Mortgage Broker</p>
      </div>
      <div className="mt-2 flex gap-2 items-center text-blue">
        <div className="rounded-full w-3 h-3 text-center bg-blue text-white">
          <IconPlus size={12} />
        </div>
        <p>Bank / Financer</p>
      </div>
      <div className="mt-3">
        <ContentCard title="Company Details">
          <div className="text-font-color-100">
            <div className="flex justify-between">
              <p className="text-blue">Company</p>
              <IconTrash size={15} color="red" />
            </div>
            <p>VIC</p>
            <div className="flex gap-2 items-center">
              <IconPhone size={15} />
              <p>1234567898</p>
            </div>
            <div className="flex gap-2 items-center">
              <IconMail size={15} />
              <p>abc@mailinator.com</p>
            </div>
          </div>
        </ContentCard>
      </div>
    </div>
  );
}
