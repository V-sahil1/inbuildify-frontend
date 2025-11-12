"use client";

import React, { useState, useEffect, useRef } from "react";
import { Drawer, Button, Input, Space, Tag, Select } from "antd";
import { IconPlus, IconX } from "@tabler/icons-react";
import { ChecklistItem, checklistItems } from "data/costCenterData";
import { useSearchParams } from "next/navigation";
import { debouncedURL } from "@lib/utils/debounceURL";

const { Option } = Select;

interface Props {
    open: boolean;
    onClose: () => void;
    costCenterName: string;
    initialSelected: ChecklistItem[];
    onUpdate: (selected: ChecklistItem[]) => void;
}

export const ChecklistDrawer: React.FC<Props> = ({
    open,
    onClose,
    costCenterName,
    initialSelected,
    onUpdate
}) => {
    const searchParams = useSearchParams();
    const debouncedUpdateURL = debouncedURL();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [selected, setSelected] = useState<ChecklistItem[]>([]);
    const [showSelectedOnly, setShowSelectedOnly] = useState(searchParams.get("selected") === "true");
    const [filterLevel, setFilterLevel] = useState<"Company Level" | "My Home">(
        (searchParams.get("level") as "Company Level" | "My Home") || "Company Level"
    );

    const wasOpenRef = useRef(false);
    useEffect(() => {
        if (open && !wasOpenRef.current) {
            setSelected(initialSelected);
        }
        wasOpenRef.current = open;
    }, [open]);

    useEffect(() => {
        debouncedUpdateURL({ search: search, level: filterLevel, selected: showSelectedOnly ? "true" : "" });
        return () => debouncedUpdateURL.cancel();
    }, [search, filterLevel, showSelectedOnly]);

    const handleCloseDrawer = () => {
        onUpdate(selected);
        onClose();
    };

    const handleToggle = (item: ChecklistItem) => {
        const exists = selected.some(i => i.title === item.title);
        const next = exists ? selected.filter(i => i.title !== item.title) : [item, ...selected];
        setSelected(next);
        onUpdate(next);
    };

    const isSelected = (title: string) => selected.some(i => i.title === title);

    const baseFiltered = checklistItems.filter(item =>
        item.level === filterLevel &&
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    const listToShow = showSelectedOnly ? selected : baseFiltered;

    return (
        <Drawer
            title={`Checklists for ${costCenterName}`}
            open={open}
            onClose={handleCloseDrawer}
            width="35%"
        >
            <Space className="mb-2.5">
                <Button
                    type={!showSelectedOnly ? "primary" : "default"}
                    onClick={() => setShowSelectedOnly(false)}
                >
                    Show All
                </Button>

                <Button
                    type={showSelectedOnly ? "primary" : "default"}
                    onClick={() => setShowSelectedOnly(true)}
                >
                    Selected Checklists {selected.length}
                </Button>
            </Space>

            <Input
                addonBefore={<Select
                    value={filterLevel}
                    onChange={(val) => setFilterLevel(val)}
                    className="mb-2.5 w-36"
                >
                    <Option value="Company Level">Company Level</Option>
                    <Option value="My Home">My Home</Option>
                </Select>}
                placeholder="Search Checklist..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mb-2.5"
            />

            {!showSelectedOnly &&
                selected
                    .filter(item => item.level === filterLevel)
                    .map((item) => (
                        <div key={item.title} className="p-3 border mb-2 rounded-md flex justify-between items-center">
                            <div>
                                <div className="font-medium">{item.title}</div>
                                <Space>
                                    {item.tags.map((tag, t) => (
                                        <Tag key={t}>{tag}</Tag>
                                    ))}
                                </Space>
                            </div>

                            <Button
                                size="small"
                                danger
                                type="primary"
                                icon={<IconX size={16} />}
                                onClick={() => handleToggle(item)}
                            />
                        </div>
                    ))
            }

            {listToShow
                .filter(item => !selected.some(i => i.title === item.title) || showSelectedOnly)
                .map((item) => (
                    <div key={item.title} className="p-3 border mb-2 rounded-md flex justify-between items-center">
                        <div>
                            <div className="font-medium">{item.title}</div>
                            <Space>
                                {item.tags.map((tag, t) => (
                                    <Tag key={t}>{tag}</Tag>
                                ))}
                            </Space>
                        </div>

                        <Button
                            size="small"
                            type="primary"
                            danger={isSelected(item.title)}
                            icon={isSelected(item.title) ? <IconX size={16} /> : <IconPlus size={16} />}
                            onClick={() => handleToggle(item)}
                        />
                    </div>
                ))}
        </Drawer>
    );
};
