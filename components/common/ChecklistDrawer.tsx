'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Button, Input, Space, Tag, Select, Tooltip, Switch, Popover } from 'antd';
import { IconPlus, IconX, IconUser, IconUserFilled } from '@tabler/icons-react';
import { ChecklistItem } from 'data/costCenterData';
import { useSearchParams } from 'next/navigation';
import { debouncedURL } from '@lib/utils/debounceURL';

const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  items: ChecklistItem[];
  initialSelected: ChecklistItem[];
  width?: number | string;
  recommendation?: boolean;
  onUpdate: (selected: ChecklistItem[]) => void;
}

export const ChecklistDrawer: React.FC<Props> = ({
  open,
  onClose,
  title,
  items,
  initialSelected,
  width = 900,
  recommendation = false,
  onUpdate,
}) => {
  const searchParams = useSearchParams();
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['level'],
    initialValue: {
      level: 'Company Level',
    },
    shouldSyncURL: false,
  });

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selected, setSelected] = useState<ChecklistItem[]>([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(searchParams.get('selected') === 'true');
  const [assignToAll, setAssignToAll] = useState(false);
  const [recommendedTitle, setRecommendedTitle] = useState<string | null>(null);
  const [recommendationTarget, setRecommendationTarget] = useState<string | null>(null);
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setSelected(initialSelected);
    }
    wasOpenRef.current = open;
  }, [open, initialSelected]);

  useEffect(() => {
    return () => debouncedUpdateURL.cancel();
  }, [search, filters, showSelectedOnly, debouncedUpdateURL]);

  const handleCloseDrawer = () => {
    onUpdate(selected);
    onClose();
  };

  const handleToggle = (item: ChecklistItem) => {
    const exists = selected.some(i => i.title === item.title);
    const next = exists ? selected.filter(i => i.title !== item.title) : [item, ...selected];
    if (exists && recommendedTitle === item.title) {
      setRecommendedTitle(null);
    }
    setSelected(next);
    onUpdate(next);
  };

  const isSelected = (title: string) => selected.some(i => i.title === title);
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

  const baseFiltered = items.filter(
    item => item.level === filters.level && item.title.toLowerCase().includes(search.toLowerCase())
  );

  const listToShow = showSelectedOnly ? selected : baseFiltered;

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
          icon={<IconX style={{ cursor: 'pointer' }} onClick={handleCloseDrawer} />}
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
          Selected Checklists {selected.length}
        </Button>
      </Space>

      <Input
        addonBefore={
          <Select
            value={filters.level}
            onChange={val => setParams({ level: val })}
            className="mb-2.5 w-36"
          >
            <Option value="Company Level">Company Level</Option>
            <Option value="My Home">My Home</Option>
          </Select>
        }
        placeholder="Search Checklist..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-2.5"
      />

      {!showSelectedOnly &&
        selected
          .filter(item => item.level === filters.level)
          .map(item => (
            <div
              key={item.title}
              className="p-3 border mb-2 rounded-md flex justify-between items-center"
            >
              <div>
                <div className="font-medium flex items-center gap-2">
                  <span>{item.title}</span>
                  {recommendation && isRecommended(item.title) && (
                    <Tag color="red">Recommended</Tag>
                  )}
                </div>
                <Space>
                  {(item.tags || []).map((tag, t) => (
                    <Tag key={t}>{tag}</Tag>
                  ))}
                </Space>
              </div>
              <Space>
                {recommendation && (
                  <Tooltip
                    title={isRecommended(item.title) ? 'Recommended' : 'Mark as recommended'}
                  >
                    <Popover
                      trigger="click"
                      open={recommendationTarget === item.title}
                      onOpenChange={open => {
                        if (!open) {
                          closeRecommendation();
                        } else {
                          openRecommendation(item.title);
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
                          isRecommended(item.title) ? (
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

      {listToShow
        .filter(item => !selected.some(i => i.title === item.title) || showSelectedOnly)
        .map(item => (
          <div
            key={item.title}
            className="p-3 border mb-2 rounded-md flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{item.title}</div>
              <Space>
                {(item.tags || []).map((tag, t) => (
                  <Tag key={t}>{tag}</Tag>
                ))}
              </Space>
            </div>
            <Button
              size="small"
              type="primary"
              danger={isSelected(item.title)}
              icon={
                isSelected(item.title) ? (
                  <IconX size={16} />
                ) : (
                  <Tooltip title="Add">
                    <IconPlus size={16} />
                  </Tooltip>
                )
              }
              onClick={() => handleToggle(item)}
            />
          </div>
        ))}
    </Drawer>
  );
};
