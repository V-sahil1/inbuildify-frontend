import React from "react";
import { Button, Input, InputNumber, Switch, Table, Space, Empty, Select } from "antd";
import { IconCheck, IconEdit, IconPlus, IconX } from "@tabler/icons-react";
import { JobVariationItems } from "data/types";

type JobVariationCreateTableProps = {
    dataSource: JobVariationItems[];
    setDataSource: React.Dispatch<React.SetStateAction<JobVariationItems[]>>;
    selectedVariation: JobVariationItems[] | null;
    setSelectedVariation: React.Dispatch<React.SetStateAction<JobVariationItems[] | null>>;
};
const JobVariationCreateTable: React.FC<JobVariationCreateTableProps> = ({ dataSource, setDataSource, selectedVariation, setSelectedVariation }: { dataSource: JobVariationItems[]; setDataSource: React.Dispatch<React.SetStateAction<JobVariationItems[]>>; selectedVariation: JobVariationItems[] | null; setSelectedVariation: React.Dispatch<React.SetStateAction<JobVariationItems[] | null>> }) => {
    const [editingKey, setEditingKey] = React.useState<string | null>(null);

    // const handleAdd = () => {
    //     const newRow: JobVariationItems = {
    //         key: new Date().toISOString(),
    //         additional: "",
    //         siteCost: "",
    //         cost: "",
    //         drawingChanges: false,
    //         quantity: 0,
    //         price: 0,
    //         total: 0,
    //     };
    //     setDataSource([newRow, ...dataSource]);
    // };

    const isEditing = (record: JobVariationItems) => record.key === editingKey;

    const handleEdit = (key: string) => {
        setEditingKey(key);
    };

    const handleSave = (key: string) => {
        setDataSource((prev) =>
            prev.map((row) => (row.key === key ? { ...row } : row))
        );
        setEditingKey(null);
    };

    const handleCancel = () => {
        setEditingKey(null);
    };

    const handleChange = (key: string, field: keyof JobVariationItems, value: any) => {
        setDataSource((prev) =>
            prev.map((row) =>
                row.key === key
                    ? {
                        ...row,
                        [field]: value,
                        total:
                            field === "quantity" || field === "price"
                                ? (field === "quantity" ? value : row.quantity) *
                                (field === "price" ? value : row.price)
                                : row.total,
                    }
                    : row
            )
        );
    };

    const handleSetSelectedVariation = (record: JobVariationItems) => {
        setSelectedVariation((prev) => {
            if (!prev) return [record]; // first time
            const alreadyExists = prev.some((item) => item.key === record.key);
            return alreadyExists ? prev : [...prev, record]; // append if not duplicate
        });
    };

    const handleRemoveSelectedVariation = (record: JobVariationItems) => {
        setSelectedVariation((prev) =>
            prev.filter((item) => item.key !== record.key)
        );
    };
    const columns = [
        {
            title: "Additional Items",
            dataIndex: "additional",
            render: (_: any, record: JobVariationItems) =>
                isEditing(record) ? (
                    <div className="flex flex-wrap gap-2">
                        <Input
                            placeholder="Enter description"
                            value={record.additional}
                            onChange={(e) =>
                                handleChange(record.key, "additional", e.target.value)
                            }
                        />
                        <Select
                            placeholder="Select Site Cost"
                            value={record.siteCost}
                            onChange={(val) => handleChange(record.key, "siteCost", val)}
                            options={[
                                { label: "Excavation", value: "excavation" },
                                { label: "Foundation", value: "foundation" },
                                { label: "Landscaping", value: "landscaping" },
                            ]}
                        />
                        <Select
                            placeholder="Select Cost"
                            value={record.cost}
                            onChange={(val) => handleChange(record.key, "cost", val)}
                            options={[
                                { label: "Material", value: "material" },
                                { label: "Labor", value: "labor" },
                                { label: "Transport", value: "transport" },
                            ]}
                        />
                    </div>
                ) : (
                    <div>
                        <div>{record.additional}</div>
                        {record.siteCost && <div>Site Cost: {record.siteCost}</div>}
                        {record.cost && <div>Cost: {record.cost}</div>}
                    </div>
                ),
        },
        {
            title: "Drawing Changes Required",
            dataIndex: "drawingChanges",
            render: (_: any, record: JobVariationItems) =>
                isEditing(record) ? (
                    <Switch
                        checked={record.drawingChanges}
                        onChange={(checked) =>
                            handleChange(record.key, "drawingChanges", checked)
                        }
                    />
                ) : record.drawingChanges ? (
                    <Switch
                        value={true}
                        disabled
                    />
                ) : (
                    <Switch
                        value={false}
                        disabled
                    />
                ),
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            render: (_: any, record: JobVariationItems) =>
                isEditing(record) ? (
                    <InputNumber
                        min={0}
                        step={0.1}
                        value={record.quantity}
                        onChange={(val) => handleChange(record.key, "quantity", val ?? 0)}
                    />
                ) : (
                    record.quantity
                ),
        },
        {
            title: "Price",
            dataIndex: "price",
            render: (_: any, record: JobVariationItems) =>
                isEditing(record) ? (
                    <InputNumber
                        min={0}
                        step={0.01}
                        value={record.price}
                        onChange={(val) => handleChange(record.key, "price", val ?? 0)}
                    />
                ) : (
                    `$${record.price.toFixed(2)}`
                ),
        },
        {
            title: "Total",
            dataIndex: "total",
            render: (_: any, record: JobVariationItems) =>
                isEditing(record) ? (
                    <span className="font-semibold">
                        ${record.total.toFixed(2)}
                    </span>
                ) : (
                    `$${record.total.toFixed(2)}`
                ),
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (_: any, record: JobVariationItems) =>
                isEditing(record) ? (
                    <Space>
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<IconCheck />}
                            disabled={
                                !record.additional.trim() ||
                                record.quantity <= 0 ||
                                record.price <= 0
                            }
                            onClick={() => handleSave(record.key)}
                        />
                        <Button
                            danger
                            shape="circle"
                            icon={<IconX />}
                            onClick={handleCancel}
                        />
                    </Space>
                ) : (
                    <div className="flex align-center gap-2">
                        <Button

                            shape="circle"
                            icon={<IconEdit size={20} />}
                            onClick={() => handleEdit(record.key)}
                        />
                        {
                            selectedVariation?.some((item) => item.key === record.key) ? (
                                <Button
                                    danger
                                    shape="circle"
                                    icon={<IconX />}
                                    onClick={() => handleRemoveSelectedVariation(record)}
                                />
                            ) : (
                                <Button
                                    shape="circle"
                                    icon={<IconPlus />}
                                    onClick={() => handleSetSelectedVariation(record)}
                                />
                            )
                        }
                    </div>
                ),
        },
    ];


    return (
        <div>
            <Table
                bordered
                rowClassName={() => "editable-row"}
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                locale={{
                    emptyText: (
                        <div className="flex flex-col items-center gap-3 py-10">
                            <Empty className="!text-[var(--font-color)]" description="No data available" />
                            {/* <Button type="primary" onClick={handleAdd}>
                                Add Variation
                            </Button> */}
                        </div>
                    ),
                }}
            />
        </div>
    );
};

export default JobVariationCreateTable;
