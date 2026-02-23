'use client';

import React, { useMemo, useState } from 'react';
import { Drawer, Input, Button, Badge } from 'antd';
import { IconMapPin } from '@tabler/icons-react';
import { IEstate } from '@redux/feature/estate/IEstateState';

interface EstateFeaturedProps {
  open: boolean;
  onClose: () => void;
  estates?: IEstate[];
  initialSelectedKeys?: string[];
  onChangeSelected?: (keys: string[]) => void;
}

const EstateFeatured: React.FC<EstateFeaturedProps> = ({
  open,
  onClose,
  estates = [],
  initialSelectedKeys = [],
  onChangeSelected,
}) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>(initialSelectedKeys);

  const filteredEstates = useMemo(
    () =>
      estates.filter(e => {
        const term = search.toLowerCase();
        if (!term) return true;
        return (
          e.name.toLowerCase().includes(term) ||
          // e.location.toLowerCase().includes(term) ||
          e.zip.toLowerCase().includes(term)
        );
      }),
    [estates, search]
  );

  const toggleSelected = (key: string) => {
    setSelected(prev => {
      const exists = prev.includes(key);
      const next = exists ? prev.filter(k => k !== key) : [...prev, key];
      onChangeSelected?.(next);
      return next;
    });
  };

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between m-auto">
          <span>Featured Estates</span>
          <Button type="primary" size="small">
            Selected Estates{' '}
            <span className="text-primary bg-white rounded-full w-4 h-4 ml-1 flex items-center justify-center">
              {`${selected.length}`}
            </span>
          </Button>
        </div>
      }
      placement="right"
      width="50%"
      open={open}
      onClose={onClose}
    >
      <div className="flex flex-col">
        <div className="text-sm text-font-color mb-2 text-center">
          Choose estates from our premium collection
        </div>
        <Input
          placeholder="Search estates..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 flex-1">
          {filteredEstates.map(estate => {
            const isSelected = selected.includes(estate.estateId);
            return (
              <button
                key={estate.estateId}
                type="button"
                onClick={() => toggleSelected(estate.estateId)}
                className={`relative text-left rounded-xl border p-3 h-72 flex flex-col justify-between transition-all cursor-pointer focus:outline-none ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary bg-primary-10'
                    : 'hover:bg-primary-10'
                }`}
              >
                <div className="w-full h-[60%] flex items-center justify-center overflow-hidden">
                  {estate.estateLogo ? (
                    <img
                      src={estate.estateLogo}
                      alt={estate.name}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">{estate.name}</div>
                  <div className="flex items-start gap-1 text-xs text-gray-600">
                    <IconMapPin size={14} className="mt-0.5" />
                    <span>
                      {/* {estate.location} */}
                      {estate.zip ? `, ${estate.zip}` : ''}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {!filteredEstates.length && (
          <div className="text-center text-xs text-gray-500 py-6">No estates found.</div>
        )}
      </div>
    </Drawer>
  );
};

export default EstateFeatured;
