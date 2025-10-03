import {
    Select,
    Input,
    Dropdown,
} from "antd";
import {
    IconDotsVertical,
    IconExternalLink,
} from "@tabler/icons-react";
import dayjs, { Dayjs } from "dayjs";
import { Maintenance } from "@redux/feature/maintenance/IMaintenanceState";
import AssignSupervisorDropdown from "../construction/assignSupervisorModal";

type DateRange = [Dayjs, Dayjs] | null;
type DateFilterKey = 'all' | '7' | '15' | '30' | null;

const DATE_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: '7', label: 'Last 7 days' },
    { value: '15', label: 'Last 15 days' },
    { value: '30', label: 'Last 30 days' },
];

const ALL_MAINTENANCE_STATUSES = [
    { key: "readyformaintenance", label: "Ready For Maintenance" },
    { key: "undermaintenance", label: "Under Maintenance" },
    { key: "completed", label: "Completed" },
];

const getKeyFromRange = (range: DateRange): DateFilterKey => {
    if (!range) return 'all';
    const TODAY = dayjs().endOf('day');
    const [start] = range;

    if (start.isSame(dayjs().subtract(7, 'day').startOf('day'), 'day') && range[1].isSame(TODAY, 'day')) return '7';
    if (start.isSame(dayjs().subtract(15, 'day').startOf('day'), 'day') && range[1].isSame(TODAY, 'day')) return '15';
    if (start.isSame(dayjs().subtract(30, 'day').startOf('day'), 'day') && range[1].isSame(TODAY, 'day')) return '30';

    return null;
};

const getDateRangeFromKey = (keyStr: DateFilterKey): DateRange => {
    let range: DateRange = null;
    const TODAY = dayjs();

    if (keyStr && keyStr !== 'all') {
        const days = parseInt(keyStr, 10);
        const startDate = TODAY.subtract(days, 'day');
        range = [startDate.startOf('day'), TODAY.endOf('day')];
    }
    return range;
};


export const MaintenanceFields = ({
    filters,
    setFilters,
    uniqueSupervisors,
    handleSupervisorAssign
}) => {
    const renderDateTitle = (title: string, dateKey: 'startDate' | 'endDate') => {
        const currentKey = getKeyFromRange(filters[dateKey]);
        const currentValue = currentKey || 'all';

        const handleSelectChange = (value: string) => {
            const keyStr = value as DateFilterKey;
            const range = getDateRangeFromKey(keyStr);
            setFilters(prev => ({ ...prev, [dateKey]: range }));
        };

        return (
            <div className="flex flex-col gap-1">
                <span className="font-semibold">{title}</span>
                <Select
                    value={currentValue}
                    size="small"
                    className="w-full text-left"
                    onChange={handleSelectChange}
                    options={DATE_OPTIONS}
                />
            </div>
        );
    };

    return [
        {
            title: (
                <div className="flex flex-col gap-1">
                    <span className="font-semibold">Reference ID</span>
                    <Input
                        placeholder="Search ID"
                        value={filters.id}
                        size="small"
                        onChange={(e) => setFilters({ ...filters, id: e.target.value })}
                    />
                </div>
            ),
            dataIndex: "id",
            key: "id",
            width: 150,
            render: (id: number) => <span className="font-semibold">{id}</span>,
        },
        {
            title: (
                <div className="flex flex-col gap-1">
                    <span className="font-semibold">Customer Name</span>
                    <Input
                        placeholder="Search Customer"
                        size="small"
                        value={filters.customerName}
                        onChange={(e) => setFilters({ ...filters, customerName: e.target.value })}
                    />
                </div>
            ),
            dataIndex: "customerName",
            key: "customerName",
            width: 180,
        },
        {
            title: (
                <div className="flex flex-col gap-1">
                    <span className="font-semibold">Job Address</span>
                    <Input
                        placeholder="Search Address"
                        value={filters.jobAddress}
                        size="small"
                        onChange={(e) => setFilters({ ...filters, jobAddress: e.target.value })}
                    />
                </div>
            ),
            dataIndex: "jobAddress",
            key: "jobAddress",
            width: 220,
        },
        {
            title: renderDateTitle("Start Date", 'startDate'),
            dataIndex: "startDate",
            key: "startDate",
            width: 160,
            render: (date: string) => dayjs(date, 'DD-MM-YYYY').isValid() ? dayjs(date, 'DD-MM-YYYY').format("DD-MM-YYYY") : date,
        },
        {
            title: renderDateTitle("End Date", 'endDate'),
            dataIndex: "endDate",
            key: "endDate",
            width: 160,
            render: (date: string) => dayjs(date, 'DD-MM-YYYY').isValid() ? dayjs(date, 'DD-MM-YYYY').format("DD-MM-YYYY") : date,
        },
        {
            title: (
                <div className="flex flex-col gap-1">
                    <span className="font-semibold">Site Supervisor</span>
                    <Select
                        value={filters.Supervisor || "All"}
                        size="small"
                        onChange={(val) => setFilters({ ...filters, Supervisor: val })}
                        className="w-full"
                        options={uniqueSupervisors.map((s) => ({ label: s, value: s }))}
                    />
                </div>
            ),
            dataIndex: "Supervisor",
            key: "Supervisor",
            width: 180,
            render: (supervisor: string, record: Maintenance) => {
                const currentStatusKey = record.status.toLowerCase();

                const statusChangeItems = ALL_MAINTENANCE_STATUSES
                    .filter(item => item.key !== currentStatusKey)
                    .map(item => ({
                        key: item.key,
                        label: item.label,
                    }));

                const actionMenu = {
                    items: [
                        {
                            key: "changestatusto_header",
                            label: "Change status to:",
                            type: 'group' as const,
                            children: statusChangeItems,
                        },
                        { type: 'divider' as const },
                        { key: "revert", label: "Revert to Construction" },
                        { type: 'divider' as const },
                        { key: "export", label: "Export" },
                    ],
                    onClick: (e) => {
                        if (statusChangeItems.some(item => item.key === e.key)) {
                            console.log(`Changing status of job ${record.id} from ${currentStatusKey} to ${e.key}`);
                        }
                        if (e.key === "revert") console.log("Reverting job", record.id);
                        if (e.key === "export") console.log("Exporting job", record.id);
                    },
                };

                return (
                    <div className="flex items-center justify-between">
                        
                        <AssignSupervisorDropdown
                            assignedSupervisor={supervisor}
                            onAssign={(newSupervisor) => handleSupervisorAssign(record.id.toString(), newSupervisor)}
                        />

                        <div className="flex gap-2">
                            <Dropdown
                                menu={actionMenu}
                            >
                                <IconDotsVertical size={22} stroke={2} className="cursor-pointer" />
                            </Dropdown>
                            <button className="hover:text-primary">
                                <IconExternalLink size={22} />
                            </button>
                        </div>
                    </div>
                );
            },
        },
    ];
};