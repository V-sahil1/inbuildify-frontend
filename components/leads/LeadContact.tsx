import { useAppSelector } from '@hooks/redux';
import { IconEdit, IconMail, IconPhoneCall } from '@tabler/icons-react';
import { Card } from 'antd';

export const LeadContactPage = ({ setModalOpen, handleOpenContactModal }) => {
  const { leadDetail } = useAppSelector(state => state.lead);

  return (
    <>
      {leadDetail.contacts && leadDetail.contacts?.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-6 rounded-lg">
          <p onClick={() => setModalOpen('contact')} className="cursor-pointer">
            Create Contact
          </p>
          <p
            className="text-blue-600 underline cursor-pointer hover:text-blue-800"
            onClick={handleOpenContactModal}
          >
            Link Contact
          </p>
        </Card>
      ) : (
        <Card className="relative">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded">
              Contact
            </span>
            <div className="flex gap-2 items-center">
              <IconEdit
                className="text-gray-400 text-sm cursor-pointer hover:text-gray-600"
                onClick={() => setModalOpen('contact')}
              />
            </div>
          </div>
          <h2 className="font-semibold text-lg">{leadDetail?.contacts?.[0]?.name ?? '-'}</h2>

          <div className="flex items-center gap-2 mt-2">
            <IconPhoneCall className="w-4 h-4" />
            <span className="text-sm">{leadDetail?.contacts?.[0]?.phone ?? 'N/A'}</span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <IconMail className="w-4 h-4" />
            <span className="text-sm">{leadDetail?.contacts?.[0]?.email ?? 'N/A'}</span>
          </div>
        </Card>
      )}
    </>
  );
};
