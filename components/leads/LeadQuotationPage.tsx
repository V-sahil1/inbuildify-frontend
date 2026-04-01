import React, { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import SystemRoutes from '@lib/constants/Routes';
import { createQuotationThunk } from '@redux/feature/quotation/quotationThunk';
import { IconFileText, IconSearch, IconTrash, IconX } from '@tabler/icons-react';
import { Card, Input, List, message, Tag } from 'antd';
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
  const [showSearchInput, setShowSearchInput] = useState(false);
  const hasQuotations = Boolean(quotation && quotation.length > 0);

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
        <div
          className={`flex flex-col justify-between ${hasQuotations ? '' : 'min-h-[220px] items-center justify-center'}`}
        >
          <div
            className={`flex items-center gap-2 overflow-hidden ${hasQuotations ? 'justify-between w-full' : 'justify-center'}`}
          >
            <p className="text-sm cursor-pointer text-blue text-nowrap text-center" onClick={handleCreateQuotation}>
              Create Quotation
            </p>
            {hasQuotations && (
              <div className={`flex items-center min-w-0  ${showSearchInput && 'max-w-[45%]'} flex-shrink-0`}>
                <button
                  type="button"
                  aria-label="Open quotation search"
                  onClick={() => setShowSearchInput(prev => !prev)}
                  className={`inline-flex items-center justify-center p-1 text-gray-600 hover:text-black transition-all duration-200 ${showSearchInput ? 'hidden' : 'opacity-100 w-auto'
                    }`}
                >
                  <IconSearch size={15} />
                </button>

                <div
                  className={`transition-all duration-200 ease-in-out overflow-hidden ${showSearchInput ? 'opacity-100 ' : 'opacity-0'
                    }`}
                  style={{
                    width: showSearchInput ? 'clamp(110px, 40vw, 160px)' : '0px',
                    maxWidth: '100%',
                  }}
                >
                  <Input
                    autoFocus
                    type="text"
                    prefix={<IconSearch size={15} />}
                    suffix={
                      <button
                        type="button"
                        aria-label="Close quotation search"
                        onClick={() => {
                          setSearchTerm('');
                          setShowSearchInput(false);
                        }}
                        className="inline-flex items-center justify-center text-gray-500 hover:text-black"
                      >
                        <IconX size={14} />
                      </button>
                    }
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onBlur={() => {
                      if (!searchTerm.trim()) {
                        setShowSearchInput(false);
                      }
                    }}
                    placeholder="Search"
                    className="w-full border border-border-color rounded-md px-2 py-1 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {hasQuotations && (
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
                      className='flex flex-col gap-1 items-start'
                    >
                      <div className="flex items-center justify-between w-full overflow-hidden">
                        <div className="flex items-center space-x-4">
                          <div className="bg-gray-100 p-2 rounded-lg">
                            {quotation.indexOf(item) + 1}
                          </div>
                          <div>
                            <div className="flex flex-col gap-2 font-medium text-gray-900">
                              <span className=" text-sm text-gray-500">
                                {item?.referenceNumber}
                              </span>
                              {item?.versions[0]?.isApprove && (
                                <Tag color="green-inverse" className="text-xs mr-auto">
                                  Approved
                                </Tag>
                              )}
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
