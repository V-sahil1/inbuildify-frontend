// MaintenanceManager.tsx

"use client";
import {
    Button,
    Card,
    Table,
    Tag,
} from "antd";
import { useRouter } from "next/navigation";
import React, { useState, useMemo, useCallback } from "react";
import {
    IconFilter,
} from "@tabler/icons-react";
import { MaintenanceDashboardData } from "data/sampleData";
import SystemRoutes from "@lib/constants/Routes";

import { MaintenanceFields } from "../formFields/maintenanceField";
import { DateRange, getStatus, Maintenance, PROJECT_STATUS_MAP } from "@lib/utils/maintenanceStatusCards";
import dayjs from "dayjs";

const MaintenanceManager = () => {
    const router = useRouter();

    const [maintenanceData, setMaintenanceData] = useState(MaintenanceDashboardData);

    const [activeStatus, setActiveStatus] = useState<string | 'All'>('All');

    const [filters, setFilters] = useState({
        id: "",
        customerName: "",
        jobAddress: "",
        jobType: "",
        currentStage: "All",
        dueDate: null as string | null,
        startDate: null as DateRange,
        endDate: null as DateRange,
        Supervisor: "All",
        siteSupervisor: "All",
    });

    const handleCardClick = useCallback((statusKey: string) => {
        setActiveStatus(prevStatus => prevStatus === statusKey ? 'All' : statusKey);
    }, []);

    const makeUnique = (key: keyof Maintenance) => {
        const values = new Set(maintenanceData.map((d) => d[key]).filter(Boolean));
        return ["All", ...Array.from(values)];
    };

    const uniqueSupervisors = useMemo(() => makeUnique("Supervisor"), [maintenanceData]);

    const filteredData = useMemo(() => {
        return maintenanceData.filter((item) => {
            if (activeStatus !== 'All' && item.status.toLowerCase() !== activeStatus) {
                return false;
            }

            let passesFilter = (
                item.id.toString().toLowerCase().includes(filters.id.toLowerCase()) &&
                item.customerName.toLowerCase().includes(filters.customerName.toLowerCase()) &&
                item.jobAddress.toLowerCase().includes(filters.jobAddress.toLowerCase()) &&
                (filters.Supervisor === "All" || item.Supervisor === filters.Supervisor)
            );

            if (!passesFilter) return false;

            if (filters.startDate || filters.endDate) {
                const itemStartDate = dayjs(item.startDate, 'DD-MM-YYYY', true);
                const itemEndDate = dayjs(item.endDate, 'DD-MM-YYYY', true);

                if (filters.startDate) {
                    const [startRange, endRange] = filters.startDate;
                    if (!itemStartDate.isValid() || !itemStartDate.isBetween(startRange, endRange, 'day', '[]')) {
                        return false;
                    }
                }

                if (filters.endDate) {
                    const [startRange, endRange] = filters.endDate;
                    if (!itemEndDate.isValid() || !itemEndDate.isBetween(startRange, endRange, 'day', '[]')) {
                        return false;
                    }
                }
            }

            return true;
        });
    }, [maintenanceData, filters, activeStatus]); // Add activeStatus to dependencies

    const finalStatusCounts = useMemo(() => {
        const statusCounts = MaintenanceDashboardData.reduce((acc, item) => {
            const statusKey = item.status.toLowerCase();
            acc[statusKey] = (acc[statusKey] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.keys(PROJECT_STATUS_MAP).reduce((acc, statusKey) => {
            acc[statusKey] = statusCounts[statusKey] || 0;
            return acc;
        }, {} as Record<string, number>);
    }, [MaintenanceDashboardData]);

    const handleSupervisorAssign = (jobId: string | number, newSupervisor: string) => {
        setMaintenanceData(prevData =>
            prevData.map(item =>
                item.id.toString() === jobId.toString()
                    ? { ...item, siteSupervisor: newSupervisor }
                    : item
            )
        );
        console.log(`Assigned ${newSupervisor} to job ${jobId}`);
    };

    const columns = useMemo(() => MaintenanceFields({
        filters,
        setFilters,
        uniqueSupervisors,
        handleSupervisorAssign,
    }), [filters, uniqueSupervisors]);


    return (
        <div>
            <div className="flex items-center justify-between p-4">
                <h1 className="text-2xl font-bold text-left mt-4">
                    Maintenance Dashboard
                </h1>
                <div className="flex items-center">
                    <Tag color="orange" className="text-base">
                        Total Records {filteredData.length}
                    </Tag>
                    <Button
                        type="text"
                        className="flex items-center text-font-color hover:text-primary"
                        icon={<IconFilter size={25} />}
                    />
                </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-start p-4">
                {Object.entries(finalStatusCounts).map(([status, count]) => {
                    const statusInfo = getStatus(status);
                    if (!statusInfo) return null;
                    const { label, color, icon } = statusInfo;

                    const isActive = activeStatus === status;

                    return (
                        <Card
                            key={status}
                            onClick={() => handleCardClick(status)}
                            className={`min-w-[250px] flex-1 border-l-4 cursor-pointer transition-all duration-200 ${isActive
                                ? 'shadow-lg'
                                : 'hover:shadow-md'
                                }`}
                            style={{
                                borderLeft: `4px solid ${color}`,
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">{icon}</div>
                                <div className="flex-1">
                                    <h3 className="m-0 font-medium">{label}</h3>
                                </div>
                                <div className="text-xl font-bold">{count}</div>
                            </div>
                        </Card>
                    );
                })}
            </div>
            <div className="p-4">
                <Table
                    dataSource={filteredData}
                    columns={columns}
                    rowKey="id"
                    size="small"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1400 }}
                    onRow={(record) => ({
                        onClick: () => router.push(`/${SystemRoutes.MAINTENANCE}/${record.id}`),
                    })}
                />
            </div>
        </div>
    );
};

export default MaintenanceManager;