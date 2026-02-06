'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  Button,
  Input,
  Space,
  Tag,
  Select,
  Tooltip,
  Switch,
  Popover,
  message,
  Popconfirm,
} from 'antd';
import { IconPlus, IconX, IconUser, IconUserFilled } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { debouncedURL } from '@lib/utils/debounceURL';
import { ConstructionChecklistType } from '@redux/feature/admin/construction/constructionChecklist/IConstructionChecklistState';
import { CostCenterChecklist } from '@redux/feature/costCenter/IcostCenterState';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchAllConstructionChecklist } from '@redux/feature/admin/construction/constructionChecklist/constructionChecklistThunk';
import { useBuildersHook } from '@hooks/useBuildersHook';

const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  initialSelected?: CostCenterChecklist[];
  width?: number | string;
  recommendation?: boolean;
  onUpdate: (selected: ConstructionChecklistType) => void;
  onRemove: (selected: ConstructionChecklistType, id: string) => void;
}

export const ChecklistDrawer: React.FC<Props> = ({
  open,
  onClose,
  title,
  initialSelected,
  width = 900,
  recommendation = false,
  onUpdate,
  onRemove,
}) => {
  const searchParams = useSearchParams();
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['builder'],
    initialValue: {
      builder: 'All',
    },
    shouldSyncURL: false,
  });
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selected, setSelected] = useState<any[]>([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [assignToAll, setAssignToAll] = useState(false);
  const [recommendedTitle, setRecommendedTitle] = useState<string | null>(null);
  const [recommendationTarget, setRecommendationTarget] = useState<string | null>(null);
  const { builderOptions } = useBuildersHook();
  const { checklist } = useAppSelector(state => state.construction.constructionChecklist);
  const wasOpenRef = useRef(false);

  const fetchAllChecklistData = async () => {
    try {
      const params = {
        builder: filters.builder !== 'All' ? filters.builder : undefined,
      };
      await dispatch(fetchAllConstructionChecklist(params)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch checklist data');
    }
  };
  useEffect(() => {
    fetchAllChecklistData();
  }, [filters]);

  // useEffect(() => {
  //   if (open && !wasOpenRef.current) {
  //     setSelected(initialSelected);
  //   }
  //   wasOpenRef.current = open;
  // }, [open, initialSelected]);

  useEffect(() => {
    return () => debouncedUpdateURL.cancel();
  }, [showSelectedOnly, debouncedUpdateURL]);

  const handleToggle = (item: ConstructionChecklistType) => {
    onUpdate(item);
    // const exists = selected.some(i => i.name === item.name);
    // const next = exists ? selected.filter(i => i.name !== item.name) : [item, ...selected];
    // if (exists && recommendedTitle === item.name) {
    //   setRecommendedTitle(null);
    // }
    // setSelected(next);
    // onUpdate(next);
  };

  const isSelected = (title: string) => selected.some(i => i.name === title);
  const isRecommended = (title: string) => recommendedTitle === title;

  const openRecommendation = (title: string) => {
    setRecommendationTarget(title);
    setAssignToAll(false);
  };

  const closeRecommendation = () => {
    setRecommendationTarget(null);
    setAssignToAll(false);
  };

  const confirmRecommendation = () => {
    if (!recommendationTarget) return;
    setRecommendedTitle(recommendationTarget);
    closeRecommendation();
  };

  const baseFiltered = checklist.filter(
    item =>
      item.builder === filters.builder && item.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <Drawer
      title={`Checklists for ${title}`}
      open={open}
      onClose={onClose}
      width={width}
      closeIcon={false}
      extra={
        <Button
          className="ml-2"
          type="text"
          icon={<IconX style={{ cursor: 'pointer' }} onClick={onClose} />}
        />
      }
    >
      <Space className="mb-2.5">
        <Button
          type={!showSelectedOnly ? 'primary' : 'default'}
          onClick={() => setShowSelectedOnly(false)}
        >
          Show All
        </Button>

        <Button
          type={showSelectedOnly ? 'primary' : 'default'}
          onClick={() => setShowSelectedOnly(true)}
        >
          Selected Checklists {initialSelected.length}
        </Button>
      </Space>

      <Input
        addonBefore={
          <Select
            value={filters.builder}
            onChange={val => setParams({ builder: val })}
            className="mb-2.5 w-36"
            options={builderOptions}
          />
        }
        placeholder="Search Checklist..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-2.5"
      />

      {!showSelectedOnly &&
        selected
          .filter(item => item.builder === filters.builder)
          .map(item => (
            <div
              key={item.name}
              className="p-3 border mb-2 rounded-md flex justify-between items-center"
            >
              <div>
                <div className="font-medium flex items-center gap-2">
                  <span>{item.name}</span>
                  {recommendation && isRecommended(item.name) && <Tag color="red">Recommended</Tag>}
                </div>
                <Space>
                  <Tag>{item.constructionStage.id}</Tag>
                  <Tag>{item.constructionType.id}</Tag>
                </Space>
              </div>
              <Space>
                {recommendation && (
                  <Tooltip title={isRecommended(item.name) ? 'Recommended' : 'Mark as recommended'}>
                    <Popover
                      trigger="click"
                      open={recommendationTarget === item.name}
                      onOpenChange={open => {
                        if (!open) {
                          closeRecommendation();
                        } else {
                          openRecommendation(item.name);
                        }
                      }}
                      content={
                        <div className="p-3 bg-white flex flex-col gap-3 max-w-xs">
                          <div className="text-sm font-medium">
                            Are you sure you want to make this supplier as Recommended Supplier?
                          </div>
                          <div className="text-xs text-gray-600">
                            Note: Supplier will be automatically assigned against the checklist if
                            mapped under the type.
                          </div>
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <Space>
                              <Switch
                                checked={assignToAll}
                                onChange={value => setAssignToAll(value)}
                              />
                              <span className="text-xs sm:text-sm">
                                Assign it to new and existing checklists
                              </span>
                            </Space>
                            <Space>
                              <Button size="small" onClick={closeRecommendation}>
                                Cancel
                              </Button>
                              <Button size="small" type="primary" onClick={confirmRecommendation}>
                                Save
                              </Button>
                            </Space>
                          </div>
                        </div>
                      }
                    >
                      <Button
                        size="small"
                        type="text"
                        icon={
                          isRecommended(item.name) ? (
                            <IconUserFilled size={16} />
                          ) : (
                            <IconUser size={16} />
                          )
                        }
                      />
                    </Popover>
                  </Tooltip>
                )}
                <Tooltip title="Remove">
                  <Button
                    size="small"
                    danger
                    type="primary"
                    icon={<IconX size={16} />}
                    onClick={() => handleToggle(item)}
                  />
                </Tooltip>
              </Space>
            </div>
          ))}

      {(showSelectedOnly
        ? initialSelected?.map(i =>
            checklist.find(c => c.constructionChecklistId === i.constructionChecklistId)
          )
        : checklist
      ).map(item => (
        <div
          key={item.name}
          className="p-3 border mb-2 rounded-md flex justify-between items-center"
        >
          <div>
            <div className="font-medium">{item.name}</div>
            <Space>
              <Tag>{item.constructionStage.name}</Tag>
              <Tag>{item.constructionType.name}</Tag>
            </Space>
          </div>
          <Button
            size="small"
            type="text"
            icon={
              initialSelected
                ?.map(i => i.constructionChecklistId)
                .includes(item.constructionChecklistId) ? (
                <Popconfirm
                  title="Are you sure you want to remove this checklist?"
                  onConfirm={() =>
                    onRemove(
                      item,
                      initialSelected.find(
                        i => i.constructionChecklistId === item.constructionChecklistId
                      )?.id
                    )
                  }
                >
                  <Tooltip title="Remove">
                    <IconX size={16} color="red" />
                  </Tooltip>
                </Popconfirm>
              ) : (
                <Popconfirm
                  title="Are you sure you want to add this checklist?"
                  onConfirm={() => onUpdate(item)}
                >
                  <Tooltip title="Add">
                    <IconPlus size={16} color="blue" />
                  </Tooltip>
                </Popconfirm>
              )
            }
          />
        </div>
      ))}
    </Drawer>
  );
};
