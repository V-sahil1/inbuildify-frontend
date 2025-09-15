import { IconGrid3x3, IconPlus, IconFilter } from '@tabler/icons-react';
import { Button, Dropdown, Input, InputNumber, MenuProps, Select, Space } from 'antd';
import React from 'react';

interface VariationHeaderProps {
    title: string;
    requestedBy?: string;
    delayedDays?: number;
    selectedCount: number;
    totalCost: number;
    extraCount: number;
    onTitleChange: (value: string) => void;
    onRequestedByChange: (value: string) => void;
    onDelayedDaysChange: (value: number | null) => void;
    onExtraSelect: (key: string) => void;
    onShowAll: () => void;
    onPreview: () => void;
    onContinue: () => void;
    personOptions: { label: string; value: string }[];
}

const JobVariationActionBar = ({
    title,
    requestedBy,
    delayedDays,
    selectedCount,
    totalCost,
    extraCount,
    onTitleChange,
    onRequestedByChange,
    onDelayedDaysChange,
    onExtraSelect,
    onShowAll,
    onPreview,
    onContinue,
    personOptions,
}: VariationHeaderProps) => {
    const extraItems: MenuProps['items'] = [
        { key: 'additional', label: 'Additional Item' },
        { key: 'complimentary', label: 'Complimentary' },
        { key: 'discount', label: 'Discount' },
        { key: 'notes', label: 'Notes' },
    ];

    /** Box that will open inside dropdown */
    const filterContent = (
        <div className="p-3 w-[300px] space-y-3 bg-card-color rounded border border-border-color">

            {/* Requested By */}
            <div>
                <span className="block text-sm mb-1 text-font-color">Requested by</span>
                <Select
                    placeholder="Please select"
                    value={requestedBy}
                    onChange={onRequestedByChange}
                    options={personOptions}
                    style={{ width: '100%' }}
                />
            </div>

            {/* Delayed Days */}
            <div>
                <span className="block text-sm mb-1 text-font-color">Delayed Days</span>
                <InputNumber
                    min={0}
                    value={delayedDays}
                    type='number'
                    onChange={onDelayedDaysChange}
                    style={{ width: '100%' }}
                />
            </div>
        </div>
    );

    return (
        <div className="w-full flex items-center justify-between gap-4 px-3 py-6">
            <Space>
                <Button type="primary" onClick={onShowAll}>
                    Show All
                </Button>

                <Button>
                    Selected Items <span className="ml-1">{selectedCount}</span>
                </Button>
                {/* Extra Dropdown */}
                <div>
                    <Dropdown.Button icon={<IconPlus size={20} />} menu={{ items: extraItems, onClick: ({ key }) => onExtraSelect(key), }}>Extra 0</Dropdown.Button>
                </div>

                {/* Title */}
                <span className="text-sm mb-1">Title</span>
                <Input
                    placeholder="Post Contract Variation"
                    className='max-w-36'
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                />
                {/* All filters packed inside dropdown */}
                <Dropdown dropdownRender={() => filterContent} trigger={['click']}>
                    <Button icon={<IconFilter />} />
                </Dropdown>
            </Space>

            {/* Right Side */}
            <Space>
                <span className="font-medium">Total Cost: ${totalCost.toFixed(2)}</span>
                <Button onClick={onPreview}>Preview</Button>
                <Button type="primary" onClick={onContinue}>
                    Continue
                </Button>
                <Button icon={<IconGrid3x3 />} />
            </Space>
        </div>
    );
};

export default JobVariationActionBar;
