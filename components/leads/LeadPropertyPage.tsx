import { useAppSelector } from '@hooks/redux';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { Button, Card, Popconfirm, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';

export const LeadPropertyPage = ({ setModalOpen, handleDeleteJobDetail }) => {
  const { leadDetail } = useAppSelector(state => state.lead);
  const propertyFromSlice = leadDetail?.property;
  return (
    <Card className="relative">
      <div className="flex items-center justify-between mb-3">
        {!leadDetail?.property ? (
          <div className="flex items-center justify-center h-full p-4 w-full">
            <Card className="text-center h-full my-auto">
              <button
                className="text-sm text-blue-600 underline hover:text-blue-800 transition-colors"
                onClick={() => setModalOpen('property')}
              >
                Add property details
              </button>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-sm cursor-pointer" style={{ color: 'var(--secondary-gray)' }}
                  onClick={() => setModalOpen('job')}
                >
                  {!!leadDetail?.job ? 'Job details' : 'Add Job details'}
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
              className="text-sm cursor-pointer hover:text-font-color"
              style={{ color: 'var(--secondary-gray)' }}
              onClick={() => setModalOpen('property')}
            />
          </>
        )}
      </div>
      {(propertyFromSlice?.addressLine1 ||
        propertyFromSlice?.city ||
        propertyFromSlice?.stateName ||
        propertyFromSlice?.zipCode) && (
        <>
          <Tooltip title={propertyFromSlice?.addressLine1}>
            <Typography.Title
              className="font-semibold !text-lg"
              ellipsis={{ rows: 2, symbol: '...' }}
            >
              {propertyFromSlice?.addressLine1 ?? ''}
            </Typography.Title>
          </Tooltip>
          <p className="text-sm" style={{ color: 'var(--secondary-gray)' }}>
            {[propertyFromSlice?.city, propertyFromSlice?.stateName, propertyFromSlice?.zipCode]
              .filter(Boolean)
              .join(', ')}
          </p>

          <div className="text-sm mt-2" style={{ color: 'var(--secondary-gray)' }}>
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
          <div className="flex items-center justify-between gap-2 mt-2">
            <p
              className="text-sm text-font-color-100 cursor-pointer"
              onClick={() => setModalOpen('job')}
            >
              {!!leadDetail?.job ? 'Job details' : 'Add Job details'}
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
        </>
      )}
    </Card>
  );
};
