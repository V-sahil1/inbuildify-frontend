'use client';

import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, message } from 'antd';
import { IconUser, IconSearch, IconPhone, IconMail } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Status } from '@lib/constants/enum';
import { getStructuralThunk } from '@redux/feature/structuralengg/structuralEnggThunk';

interface StructuralEngineerListModalProps {
  visible: boolean;
  onCancel: () => void;
  onAssign: (engineer: any) => void;
  selectedStructuralEngineer?: any;
}

const StructuralEngineerListModal: React.FC<StructuralEngineerListModalProps> = ({
  visible,
  onCancel,
  onAssign,
  selectedStructuralEngineer

}) => {
  const dispatch = useAppDispatch();
  const { structuralengg, status } = useAppSelector((state: RootState) => state.structural);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEngineers, setFilteredEngineers] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getStructuralThunk());
  }, [dispatch]);

  useEffect(() => {
    if (structuralengg) {
      const filtered = structuralengg.filter(engineer =>
        engineer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        engineer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        engineer.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEngineers(filtered);
    }
  }, [structuralengg, searchTerm]);

  const handleAssign = (engineer: any) => {
    onAssign(engineer);
    onCancel();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Modal
      title="Select Structural Engineer"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
      ]}
    >
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="mb-4">
          <Input
            placeholder="Search structural engineers..."
            prefix={<IconSearch size={16} />}
            value={searchTerm}
            onChange={handleSearch}
            allowClear
          />
        </div>

        {/* Engineers List */}
        <div className="max-h-96 overflow-y-auto">
          {status === Status.PENDING ? (
            <div className="flex justify-center items-center py-8">
              <div>Loading...</div>
            </div>
          ) : filteredEngineers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No structural engineers found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredEngineers.map((engineer) => {
                return (
                  <div
                    key={engineer.structureEngineerId}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      engineer.isActive === false ? 'opacity-50' : ''
                    } ${
                      engineer.structureEngineerId === selectedStructuralEngineer?.structureEngineerId
                        ? 'bg-blue-50 border-blue-200'
                        : ''
                    }`}
                    onClick={() => handleAssign(engineer)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconUser className="text-blue-500" />
                        <div>
                          <div className="font-medium">{engineer.name}</div>
                          <div className="text-sm text-gray-500">{engineer.email}</div>
                        </div>
                      </div>
                      <div className="text-sm">
                        {engineer.price ? `$${engineer.price}` : 'No price set'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default StructuralEngineerListModal;
