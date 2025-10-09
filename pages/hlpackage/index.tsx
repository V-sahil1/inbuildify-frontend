import AssigneeSelect from "@/components/common/custom-selects/AssigneeSelect";
import DateFilterDropdown from "@/components/common/custom-selects/DateFilterDropdown";
import FilterTabs from "@/components/common/FilterTabs";
import { IconCopy, IconDotsVertical, IconShare3, IconTable } from "@tabler/icons-react";
import { Button, Dropdown, Input, Modal, Space, Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Dayjs } from "dayjs";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import CustomAvtar from "@/components/common/CustomAvtar";

type DataType = {
    packages: string;
    lotAddress: string;
    estateName: string;
    facadeName: string;
    floorplanName: string;
    cost: string;
    createdDate: string;
    assignee: string;
}
const data = [
    {
        packages: 'New HL pack',
        lotAddress: 'LOT 507 Stirling, Tarneit, 3002',
        estateName: 'Ambervue',
        facadeName: 'LKL 81',
        floorplanName: 'My Home 2',
        cost: '$3000.00',
        createdDate: '01-10-2025',
        assignee: 'Krunal'
    },
    {
        packages: 'Epping 123',
        lotAddress: 'LOT 507 Stirling, Tarneit, 3002',
        estateName: 'Ambervue',
        facadeName: 'LKL 44',
        floorplanName: 'My Home 2',
        cost: '$3000.00',
        createdDate: '01-10-2025',
        assignee: 'Meet'
    },
]

export default function HLPackage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
    const [filters, setFilters] = useState<{
        packages: string;
        lotAddress: string;
        estateName: string;
        facadeName: string;
        floorplanName: string;
        cost: string;
        createdDate: [Dayjs, Dayjs] | string | null;
        assignee: string;
    }>({
        packages: searchParams.get("packages") || "",
        lotAddress: searchParams.get("lotAddress") || "",
        estateName: searchParams.get("estateName") || "",
        facadeName: searchParams.get("facadeName") || "",
        floorplanName: searchParams.get("floorplanName") || "",
        cost: searchParams.get("cost") || "",
        createdDate: searchParams.get("createdDate") || "",
        assignee: searchParams.get("assignee") || "",
    });

    const debouncedUpdateURL = useMemo(
        () =>
            debounce((newFilters: typeof filters) => {
                const params = new URLSearchParams(searchParams.toString());

                Object.entries(newFilters).forEach(([key, value]) => {
                    if (value) {
                        params.set(key, value.toString());
                    } else {
                        params.delete(key);
                    }
                });

                router.replace(`${pathname}?${params.toString()}`);
            }, 500), // 500ms debounce delay
        [pathname, router, searchParams]
    );

    const handleFilterChange = useCallback(
        (updates: Partial<typeof filters>) => {
            setFilters((prev) => {
                const newFilters = { ...prev, ...updates };
                debouncedUpdateURL(newFilters);
                return newFilters;
            });
        },
        [debouncedUpdateURL]
    );

    useEffect(() => {
        return () => {
            debouncedUpdateURL.cancel();
        };
    }, [debouncedUpdateURL]);

    const columns: ColumnsType<DataType> = [
        {
            title: (
                <div>
                    <span>Package</span>
                    <Input
                        value={filters.packages}
                        onChange={(e) =>
                            handleFilterChange({ ...filters, packages: e.target.value })
                        }
                    />
                </div>
            ),
            dataIndex: "packages",
            key: "packages",
            width: 150,
        },
        {
            title: (
                <div>
                    <span>Lot Address</span>
                    <Input
                        value={filters.lotAddress}
                        onChange={(e) =>
                            handleFilterChange({ ...filters, lotAddress: e.target.value })
                        }
                    />
                </div>
            ),
            dataIndex: "lotAddress",
            key: "lotAddress",
            width: 150,
        },
        {
            title: (
                <div>
                    <span>Estate Name</span>
                    <Input
                        value={filters.estateName}
                        onChange={(e) =>
                            handleFilterChange({ ...filters, estateName: e.target.value })
                        }
                    />
                </div>
            ),
            dataIndex: "estateName",
            key: "estateName",
            width: 150,
        },
        {
            title: (
                <div>
                    <span>Facade Name</span>
                    <Input
                        value={filters.facadeName}
                        onChange={(e) =>
                            handleFilterChange({ ...filters, facadeName: e.target.value })
                        }
                    />
                </div>
            ),
            dataIndex: "facadeName",
            key: "facadeName",
            width: 150,
        },
        {
            title: (
                <div>
                    <span>Floor Plan Name</span>
                    <Input
                        value={filters.floorplanName}
                        onChange={(e) =>
                            handleFilterChange({ ...filters, floorplanName: e.target.value })
                        }
                    />
                </div>
            ),
            dataIndex: "floorplanName",
            key: "floorplanName",
            width: 150,
        },
        {
            title: (
                <div>
                    <span>Cost</span>
                    <Input
                        value={filters.cost}
                        onChange={(e) =>
                            handleFilterChange({ ...filters, cost: e.target.value })
                        }
                    />
                </div>
            ),
            dataIndex: "cost",
            key: "cost",
            width: 150,
        },
        {
            title: (
                <div className="flex flex-col">
                    <span>Created Date</span>
                    <DateFilterDropdown
                        onFilter={(type, dates) => {
                            const dateString = dates
                                ? `${dates[0].toISOString()},${dates[1].toISOString()}`
                                : "";
                            handleFilterChange({ ...filters, createdDate: dateString });
                        }}
                        onClear={() => {
                            console.log("Cleared date filter");
                            handleFilterChange({ ...filters, createdDate: "" });
                        }}
                    />
                </div>
            ),
            dataIndex: "createdDate",
            key: "createdDate",
            width: 150,
        },
        {
            title: (
                <div>
                    <span>Assignee</span>
                    <AssigneeSelect
                        value={filters.assignee}
                        onChange={(value) =>
                            handleFilterChange({ ...filters, assignee: value })
                        }
                    />
                </div>
            ),
            dataIndex: "assignee",
            key: "assignee",
            width: 200,
            render: (_, record) => (
                <div className="flex justify-between items-center">

                    <CustomAvtar label={record.assignee} />
                    <div className="flex gap-4 text-blue items-center">
                        <Dropdown menu={{
                            items: [
                                {
                                    key: 'Available',
                                    label: 'Available',
                                    onClick: () => { }
                                },
                                {
                                    key: 'Delete',
                                    label: 'Delete',
                                    onClick: () => { }
                                }
                            ]
                        }}><IconDotsVertical size={15} />
                        </Dropdown>
                        <IconCopy size={15} onClick={() => setIsCopyModalOpen(true)} />
                        <IconShare3 size={15} /></div>
                </div>

            )
        },
    ];

    type FilterType =
        | "all"
        | "available"
        | "modified"
        | "approved"
        | "published"
        | "sold"
        | "unavailable";
    const [activeFilter, setActiveFilter] = useState<{
        type: FilterType;
        label: string;
        count?: number;
    }>({ type: "all", label: "All" });

    const filterOptions: Array<{
        type: FilterType;
        label: string;
        count: number;
    }> = [
            { type: "all", label: "All", count: data.length },
            { type: "available", label: "Available", count: data.length },
            { type: "modified", label: "Modified", count: data.length },
            { type: "approved", label: "Approved", count: data.length },
            { type: "published", label: "Published", count: data.length },
            { type: "sold", label: "Sold", count: data.length },
            { type: "unavailable", label: "Unavailable", count: data.length },

        ];
    const handleFilterTabChange = (selectedType: string) => {
        console.log("Selected filter:", selectedType);
    };

    const handleNewPackaheSubmit = () => {
        // create new package
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">H & L Packages</h1>
                <div className="flex space-x-1 border-b items-center justify-center">
                    <FilterTabs
                        options={filterOptions}
                        defaultType="all"
                        onChange={handleFilterTabChange}
                    />
                </div>
                <Space>
                    <Button onClick={() => setIsModalOpen(true)}>New Package</Button>
                    <div className="text-primary border border-primary p-1 rounded-lg"> <IconTable /></div>
                </Space>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                pagination={{
                    pageSize: 10,
                }}
            />
            {/* create package modal */}
            <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} title="New Package" okText="Create" onOk={handleNewPackaheSubmit} centered>
                <div className="p-3">
                    <div> <p className="mb-1">Title</p> <Input /> </div>
                    <p className="mt-3">Are you sure you want to create the new package?</p>
                </div>
            </Modal>

            {/* copy package modal */}
            <Modal open={isCopyModalOpen} onCancel={() => setIsCopyModalOpen(false)} title="Copy Package" okText="Copy" centered>
                <div className="p-3">
                    <div className="mb-4">
                        <Button type="primary">Link Lot</Button>
                        <Button>Copy Lot</Button>
                    </div>
                    <div>
                        <p className="mb-1">Title</p>
                        <Input />
                    </div>
                    <p className="text-red-500">Note: Linked lot details can't be modified</p>
                    <p className="mt-3">Are you sure you want to copy this package?</p>
                    <div className="my-3 flex gap-2">
                        <Switch /> <p>Get price from master</p>
                    </div>
                    <p className="text-red-500">Note: TBA,TBC and Additional items will be copied to the  new package  with the old price. Please review the new package and update the costs for applicable items.</p>
                </div>
            </Modal>
        </div>
    )
}

