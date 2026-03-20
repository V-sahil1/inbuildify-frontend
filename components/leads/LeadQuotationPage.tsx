import React, { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import SystemRoutes from '@lib/constants/Routes';
import { createQuotationThunk } from '@redux/feature/quotation/quotationThunk';
import { IconFileText, IconSearch, IconTrash } from '@tabler/icons-react';
import { Card, Input, List, message } from 'antd';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
import TooltipButton from '../common/TooltipButton';
import { Quotation } from '@redux/feature/quotation/IQuotationState';

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
  createdQuotations: Quotation[];
  setSelectedQuotationId: Dispatch<SetStateAction<string | null>>;
  setShowDeleteConfirm: Dispatch<SetStateAction<boolean>>;
}

export const LeadQuotation: React.FC<LeadQuotationsProps> = ({
  leadId,
  setModalOpen,
  setSelectedQuotationId,
  setShowDeleteConfirm,
}) => {
  const dispatch = useAppDispatch();
  const { leadDetail } = useAppSelector(state => state.lead);
  const { quotation } = useAppSelector(state => state.quotation);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuotations = useMemo(() => {
    if (!quotation) return [];
    const query = searchTerm.trim().toLowerCase();
    if (!query) return quotation;
    return quotation.filter(item => {
      const reference = item?.referenceNumber?.toLowerCase() || '';
      const total = String(
        item?.versions?.find(v => v.quotationVersionNo === item?.versions?.length)
          ?.grandTotalCost || ''
      );
      return (
        reference.includes(query) ||
        total.includes(query)
      );
    });
  }, [quotation, searchTerm]);

  const handleCreateQuotation = async () => {
    try {
      router.push(SystemRoutes.QUOTATION_CREATE(leadId));
      await dispatch(createQuotationThunk(leadId)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to create quotation');
    }
  };
  return (
    <>
      <Card>
        <div className="flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm cursor-pointer text-blue text-nowrap" onClick={handleCreateQuotation}>
              Create Quotation
            </p>
            {quotation && quotation.length > 0 && (
              <Input
                type="text"
                prefix={<IconSearch size={15} />}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="border border-border-color rounded-md px-2 py-1 text-sm w-32"
              />
            )}
          </div>

          {quotation && quotation.length > 0 && (
            <div className="max-h-[200px] my-2 overflow-y-auto">
              <List
                dataSource={filteredQuotations}
                locale={{
                  emptyText: (
                    <div className="flex flex-col items-center justify-center p-6">
                      <IconFileText />
                      <p className=" text-sm text-gray-500 text-center">
                        {searchTerm ? 'No matching quotations' : 'No quotations found'}
                      </p>
                      {!searchTerm ? (
                        <p className="text-xs text-gray-400 mt-1">
                          Create a quotation to get started
                        </p>
                      ) : null}
                    </div>
                  ),
                }}
                renderItem={(item: Quotation) => {
                  const latestVersion = item?.versions.find(
                    i => i.quotationVersionNo === item?.versions?.length
                  );

                  return (
                    <List.Item
                      key={item?.quotationId}
                      onClick={() => {
                        return router.push(
                          `${SystemRoutes.QUOTATION}/${latestVersion?.quotationVersionId}`
                        );
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="flex items-center justify-between w-full overflow-hidden">
                        <div className="flex items-center space-x-4">
                          <div className="bg-gray-100 p-2 rounded-lg">
                            {quotation.indexOf(item) + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              <span className=" text-sm text-gray-500">
                                {item?.referenceNumber}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-lg font-semibold text-gray-900">
                          ${Number(latestVersion?.grandTotalCost || 0)}
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
                  );
                }}
              />
            </div>
          )}
          {leadDetail?.lead?.status === 'Job' && (
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
