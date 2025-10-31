import React, { useState } from 'react';
import { Card, Pagination } from 'antd';
import Image from 'next/image';
import { Status } from '@lib/constants/enum';
import { useAppSelector } from '@hooks/redux';
import Loading from '../common/Loading';

interface AvailableFacadesTabProps {
  facades: any[];
  selectedFacade: any;
  onSelect: (facade: any) => void;
}
const PAGE_SIZE = 6;

const AvailableFacadesTab: React.FC<AvailableFacadesTabProps> = ({
  facades,
  selectedFacade,
  onSelect,
}) => {
  const { status } = useAppSelector(state => state.facade);
  const [currentPage, setCurrentPage] = useState(1);
  if (!facades?.length) {
    return <div className="text-gray-500 text-center py-8">No facades available</div>;
  }
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentFacades = facades.slice(startIndex, endIndex);

  if (status === Status.PENDING) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loading type="primary" />
      </div>
    );
  }
  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      {/* Left side: Facade list */}
      <div className="w-full md:w-2/3 flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
          {currentFacades.map(facade => (
            <div key={facade.id} className="h-full">
              <Card
                hoverable
                onClick={() => onSelect(facade)}
                className={`h-full flex flex-col cursor-pointer transition-all ${
                  selectedFacade?.id === facade.id
                    ? 'border-blue-500 border-2 shadow-lg'
                    : 'hover:shadow-md'
                }`}
                cover={
                  <div className="relative h-40 w-full">
                    <Image
                      src={facade.image || '/images/no_image_found.png'}
                      alt={facade.name || 'Facade'}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover rounded-t"
                      placeholder="blur"
                      blurDataURL="/images/blur-placeholder.png"
                    />
                  </div>
                }
              >
                <Card.Meta title={facade.name} className="flex-grow" />
              </Card>
            </div>
          ))}
        </div>

        {facades.length > PAGE_SIZE && (
          <div className="flex justify-center mt-4">
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              size="small"
              total={facades.length}
              onChange={page => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>

      {/* Right side: Selected preview */}
      <div className="w-full md:w-1/3">
        <div className="sticky top-4">
          {selectedFacade ? (
            <Card
              className="w-full h-full"
              cover={
                <div className="relative w-full pt-[100%]">
                  <Image
                    src={selectedFacade.image || '/images/no_image_found.png'}
                    alt={selectedFacade.name || 'Facade'}
                    fill
                    loading="lazy"
                    className="object-cover rounded-t"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL="/images/blur-placeholder.png"
                  />
                </div>
              }
            >
              <div className="p-4">
                <h3 className="text-lg font-medium text-center">{selectedFacade.name}</h3>
                {selectedFacade.description && (
                  <p className="text-gray-600 mt-2 text-sm">{selectedFacade.description}</p>
                )}
                <p className="text-gray-600 mt-2 text-sm text-center">{selectedFacade.cost}</p>
              </div>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg text-gray-400">
              <div className="text-center p-4">
                <svg
                  className="mx-auto h-12 w-12 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p>Select a facade to preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableFacadesTab;
