import { useAppSelector } from '@hooks/redux';
import { IconBarrierBlock, IconEdit, IconTrash } from '@tabler/icons-react';
import { Button, Card, Popconfirm, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';

export const LeadPropertyPage = ({ setModalOpen, handleDeleteJobDetail }) => {
  const { leadDetail } = useAppSelector(state => state.lead);
  const propertyFromSlice = leadDetail?.property;
  return (
    <Card className="relative">
      <div className="flex items-center justify-between mb-3">
        {leadDetail?.lead?.status === 'New' || propertyFromSlice?.zipPostalCode === null ? (
          <div className="flex items-center justify-center h-full p-4 w-full">
            <Card className="text-center h-full my-auto">
              <button
                className="text-sm text-blue-600 underline hover:text-blue-800 transition-colors"
                onClick={() => setModalOpen('property')}
              >
                Add property details
              </button>
              <div className="flex items-center gap-2 mt-2">
                <p
                  className="text-sm text-gray-600 cursor-pointer"
                  onClick={() => setModalOpen('job')}
                >
                  Add Job details
                </p>
                {!!leadDetail?.job && (
                  <Popconfirm
                    title="Are you sure you want to delete job detail?"
                    onConfirm={handleDeleteJobDetail}
                  >
                    <Button size="small" type="text" icon={<IconTrash color="red" size={16} />} />
                  </Popconfirm>
                )}
              </div>
            </Card>
          </div>
        ) : (
          <>
            {' '}
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
              Property
            </span>
            <IconEdit
              className="text-gray-400 text-sm cursor-pointer hover:text-gray-600"
              onClick={() => setModalOpen('property')}
            />
          </>
        )}
      </div>
      {propertyFromSlice?.address1 ||
      propertyFromSlice?.citySuburb ||
      propertyFromSlice?.stateRegion ||
      propertyFromSlice?.zipPostalCode ? (
        <>
          <Tooltip title={propertyFromSlice?.address1}>
            <Typography.Title
              className="font-semibold !text-lg"
              ellipsis={{ rows: 2, symbol: '...' }}
            >
              {propertyFromSlice?.address1 ?? ''}
            </Typography.Title>
          </Tooltip>
          <p className="text-sm text-gray-600">
            {[
              propertyFromSlice?.citySuburb,
              propertyFromSlice?.stateRegion,
              propertyFromSlice?.zipPostalCode,
            ]
              .filter(Boolean)
              .join(', ')}
          </p>

          <div className="text-sm text-gray-600 mt-2">
            <p>
              Title :{' '}
              {propertyFromSlice?.titleDate
                ? dayjs(propertyFromSlice?.titleDate).format('DD-MM-YYYY')
                : ''}
            </p>
            <p>Type : {propertyFromSlice?.landType ?? ''}</p>
            <p>
              W: {propertyFromSlice?.widthM || ''}
              {propertyFromSlice?.widthM ? 'm' : ''} D: {propertyFromSlice?.depthM || ''}
              {propertyFromSlice?.depthM ? 'm' : ''} Total: {propertyFromSlice?.totalSizeM2 || ''}
              {propertyFromSlice?.totalSizeM2 ? ' m²' : ''}
            </p>
          </div>
        </>
      ) : (
        leadDetail?.lead?.status !== 'New' && (
          <div className="flex flex-col items-center justify-center p-6 rounded-lg">
            <IconBarrierBlock />
            <p className="text-sm text-gray-500 text-center">No property details added yet</p>
            <p className="text-xs text-gray-400 mt-1">Add property information to get started</p>
          </div>
        )
      )}
    </Card>
  );
};
