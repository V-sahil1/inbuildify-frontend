import { useAppDispatch, useAppSelector } from '@hooks/redux';
import SystemRoutes from '@lib/constants/Routes';
import { enumToReadable } from '@lib/utils/enumToRedable';
import {
  createQuotationThunk,
  deleteQuotationThunk,
} from '@redux/feature/quotation/quotationThunk';
import { IconFileText, IconTemperatureOff, IconTrash } from '@tabler/icons-react';
import { Card, List, message, Tag } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
import TooltipButton from '../common/TooltipButton';

interface LeadQuotationsProps {
  leadId: string;
  setModalOpen: Dispatch<
    SetStateAction<
      | 'closeLead'
      | 'convert'
      | 'contact'
      | 'property'
      | 'invoice'
      | 'linkContact'
      | 'job'
      | 'deposit'
    >
  >;
  createdQuotations: any[];
  setSelectedQuotationId: Dispatch<SetStateAction<string | null>>;
  setShowDeleteConfirm: Dispatch<SetStateAction<boolean>>;
}

export const LeadQuotation: React.FC<LeadQuotationsProps> = ({
  leadId,
  setModalOpen,
  createdQuotations,
  setSelectedQuotationId,
  setShowDeleteConfirm,
}) => {
  const dispatch = useAppDispatch();
  const { leadDetail } = useAppSelector(state => state.lead);
  const { quotation } = useAppSelector(state => state.quotation);
  const router = useRouter();

  const handleCreateQuotation = async () => {
    try {
      await dispatch(createQuotationThunk(leadId)).unwrap();
      router.push(SystemRoutes.QUOTATION_CREATE(leadId));
    } catch (error) {
      message.error(error || 'Failed to create quotation');
    }
  };

  const handleDeleteQuotation = async id => {
    try {
      await dispatch(deleteQuotationThunk(id)).unwrap();
      router.push(SystemRoutes.QUOTATION_CREATE(leadId));
    } catch (error) {
      message.error(error || 'Failed to create quotation');
    }
  };

  return (
    <>
      {/* {leadDetail?.lead?.status === 'New' ? (
        <Card className="flex flex-col items-center justify-center p-6 rounded-lg">
          <p
            // href={SystemRoutes.QUOTATION_CREATE(leadId)}
            className="text-sm text-gray-500 text-center underline"
            onClick={handleCreateQuotation}
          >
            Create Quotation
          </p>
        </Card>
      ) : (
        leadDetail?.lead?.status !== 'New' && ( */}
      <Card>
        <div className="flex flex-col justify-between">
          <p className="text-sm cursor-pointer text-blue" onClick={handleCreateQuotation}>
            Create Quotation
          </p>

          {quotation && quotation?.length > 0 && (
            <div className="max-h-[200px] my-2 overflow-y-auto">
              <List
                dataSource={quotation.slice(-2) || []}
                locale={{
                  emptyText: (
                    <div className="flex flex-col items-center justify-center p-6">
                      <IconFileText />
                      <p className=" text-sm text-gray-500 text-center">No quotations found</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Create a quotation to get started
                      </p>
                    </div>
                  ),
                }}
                renderItem={(item: any) => (
                  <List.Item
                    key={item?.quotationId}
                    onClick={() => {
                      return router.push(
                        `${SystemRoutes.QUOTATION}/${item?.versions[item?.versions?.length - 1 || 0]?.quotationVersionId}`
                      );
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="flex items-center justify-between w-full overflow-hidden">
                      <div className="flex items-center space-x-4">
                        {/* <div className="bg-gray-100 p-2 rounded-lg">
                          {createdQuotations.indexOf(quotation) + 1}
                        </div> */}
                        <div>
                          <div className="font-medium text-gray-900">
                            <span className=" text-sm text-gray-500">
                              {item?.referenceNumber}...
                            </span>
                          </div>
                          {/* <div className="flex items-center space-x-2 mt-1">
                            <Tag
                              color={quotation?.lead?.status === 'Open' ? 'blue' : 'green'}
                              className="m-0"
                            >
                              {enumToReadable(quotation?.leadStatus)}
                            </Tag>
                          </div> */}
                        </div>
                      </div>

                      <div className="text-lg font-semibold text-gray-900">
                        ${Number(item?.totalAmount || 0)}
                      </div>

                      <TooltipButton
                        title="Delete Quotation"
                        type="text"
                        size="small"
                        icon={<IconTrash color="red" size={15} />}
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedQuotationId(item?.quotationId);
                          setShowDeleteConfirm(true);
                        }}
                      />
                    </div>
                  </List.Item>
                )}
              />
            </div>
          )}
          {leadDetail?.lead?.status !== 'New' && (
            <p
              className="text-sm text-blue text-center mt-2 cursor-pointer"
              onClick={() => setModalOpen('invoice')}
            >
              Capture deposit
            </p>
          )}
        </div>
      </Card>
      {/* )
      )} */}
    </>
  );
};
