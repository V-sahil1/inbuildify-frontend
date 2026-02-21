'use client';

import React, { useState } from 'react';
import { Button, Input, List, message } from 'antd';
import { IconCirclePlus, IconPencil } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useAppDispatch } from '@hooks/redux';
import { EstateFeature, IEstate } from '@redux/feature/estate/IEstateState';
import { createEStateFeature, updateEStateFeature } from '@redux/feature/estate/estateThunk';
import TooltipButton from '../common/TooltipButton';

export default function EstateFeatures({ estate }: { estate: IEstate }) {
  const dispatch = useAppDispatch();
  const [editingFeature, setEditingFeature] = useState<EstateFeature | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleFeatureSubmit = async () => {
    const featureName = editingFeature?.featureName?.trim() || '';
    if (!featureName || !estate?.estateId) return;
    try {
      if (editingFeature?.estateFeatureId === '') {
        const newFeature: Partial<EstateFeature> = {
          estateId: estate.estateId,
          featureName,
        };
        await dispatch(createEStateFeature(newFeature as EstateFeature)).unwrap();
        message.success('Feature created successfully');
      } else {
        await dispatch(
          updateEStateFeature({
            id: editingFeature?.estateFeatureId,
            data: { featureName },
          })
        ).unwrap();
        message.success('Feature updated successfully');
      }
      setEditingFeature(null);
      setIsAdding(false);
    } catch (error) {
      message.error(error || `Failed to save feature`);
    }
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingFeature({ estateFeatureId: '', featureName: '' });
  };

  const cancelAdd = () => {
    setIsAdding(false);
    setEditingFeature(null);
  };

  return (
    <div className="bg-white p-4">
      <div className="flex items-center justify-center mb-3 text-primary">
        <Button type="text" onClick={startAdd} disabled={isAdding}>
          <IconCirclePlus size={16} />
          <span>Feature</span>
        </Button>
      </div>

      {isAdding && (
        <div className="mb-3">
          <Input
            value={editingFeature?.featureName || ''}
            onChange={e => setEditingFeature({ estateFeatureId: '', featureName: e.target.value })}
            placeholder="Enter feature name..."
            onPressEnter={() => handleFeatureSubmit()}
          />
          <div className="mt-2 flex gap-2 justify-end">
            <Button onClick={cancelAdd}>Cancel</Button>
            <Button type="primary" onClick={() => handleFeatureSubmit()}>
              Add
            </Button>
          </div>
        </div>
      )}

      <List
        dataSource={estate?.features || []}
        locale={{ emptyText: 'No features added yet' }}
        renderItem={(item: EstateFeature) => (
          <List.Item className="border rounded-md mb-3 p-3">
            <div className="w-full mx-3">
              {editingFeature?.estateFeatureId === item.estateFeatureId ? (
                <div>
                  <Input
                    value={editingFeature?.featureName || ''}
                    onChange={e =>
                      setEditingFeature({ ...editingFeature, featureName: e.target.value })
                    }
                    onPressEnter={() => handleFeatureSubmit()}
                  />
                  <div className="mt-2 flex gap-2 justify-end">
                    <Button onClick={() => setEditingFeature(null)}>Cancel</Button>
                    <Button type="primary" onClick={() => handleFeatureSubmit()}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>{item.featureName}</div>
                  <TooltipButton
                    type="text"
                    title="Edit"
                    icon={<IconPencil size={16} />}
                    onClick={() => setEditingFeature(item)}
                  />
                </div>
              )}
              <div className="text-xs text-primary mt-2">
                {item?.featureName} added on {dayjs(item.createdAt).format('DD-MM-YYYY')}
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}
