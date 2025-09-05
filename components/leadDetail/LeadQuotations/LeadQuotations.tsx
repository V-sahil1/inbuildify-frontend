import React, { useMemo, useState } from 'react'
import LeadQuotationActionBar from './LeadQuotationActionBar'
import LeadQuotationList from './LeadQuotationList'
import { Quotation, QuotationStatus } from 'data/types';

const quotations: Quotation[] = [
    {
        quotationId: "MYH23080090",
        property: "Lot 32, Plot 12, Phase 1, Sector 12, Noida",
        versions: [
            {
                id: "v2",
                version: "V2",
                status: "approved",
                createdBy: "Murthy Muthuswamy",
                totalCost: "21312321",
                createdAt: "2023-08-12T12:00:00",
            },
            {
                id: "v1",
                version: "V1",
                status: "approved",
                createdBy: "Murthy Muthuswamy",
                totalCost: "21312321",
                createdAt: "2023-08-12T12:23:00",
            },
            {
                id: "v3",
                version: "V3",
                status: "pending",
                createdBy: "Murthy Muthuswamy",
                totalCost: "21312321",
                createdAt: "2023-08-12T12:40:00",
            },
            {
                id: "v4",
                version: "V4",
                status: "pending",
                createdBy: "Murthy Muthuswamy",
                totalCost: "21312321",
                createdAt: "2023-08-12T12:50:00",
            },
            {
                id: "v5",
                version: "V5",
                status: "pending",
                createdBy: "Murthy Muthuswamy",
                totalCost: "21312321",
                createdAt: "2023-08-12T13:00:00",
            },
            {
                id: "v6",
                version: "V6",
                status: "pending",
                createdBy: "Murthy Muthuswamy",
                totalCost: "21312321",
                createdAt: "2023-08-12T13:10:00",
            },
            {
                id: "v7",
                version: "V7",
                status: "pending",
                createdBy: "Murthy Muthuswamy",
                totalCost: "21312321",
                createdAt: "2023-08-12T13:10:00",
            },
            {
                id: "v8",
                version: "V8",
                status: "pending",
                createdBy: "Murthy Muthuswamy",
                totalCost: "21312321",
                createdAt: "2023-08-12T13:10:00",
            },
            {
                id: "v9",
                version: "V9",
                status: "pending",
                createdBy: "Murthy Muthuswamy",
                totalCost: "21312321",
                createdAt: "2023-08-12T13:10:00",
            },
            {
                id: "v10",
                version: "V10",
                status: "pending",
                createdBy: "Murthy Muthuswamy",
                totalCost: "21312321",
                createdAt: "2023-08-12T13:10:00",
            },
            {
                id: "v11",
                version: "V11",
                status: "pending",
                createdBy: "Murthy Muthuswamy",
                totalCost: "21312321",
                createdAt: "2023-08-12T13:10:00",
            },
            {
                id: "v12",
                version: "V12",
                status: "pending",
                createdBy: "Murthy Muthuswamy",
                totalCost: "21312321",
                createdAt: "2023-08-12T13:10:00",
            },
        ],
    },
    {
        quotationId: "MYH23070085",
        property: "wqdwqe",
        versions: [
            {
                id: "v1",
                version: "V1",
                status: "pending",
                createdBy: "John Doe",
                totalCost: "21312321",
                createdAt: "2023-07-12T12:00:00",
            },
            {
                id: "v2",
                version: "V2",
                status: "pending",
                createdBy: "John Doe",
                totalCost: "21312321",
                createdAt: "2023-07-12T14:00:00",
            },
            {
                id: "v3",
                version: "V3",
                status: "pending",
                createdBy: "John Doe",
                totalCost: "21312321",
                createdAt: "2023-07-12",
            },
        ],
    },
];


const LeadQuotations = () => {
    const [searchId, setSearchId] = useState<string>("");
    const [status, setStatus] = useState<QuotationStatus | "all">("all");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const filteredQuotations = useMemo(() => {
        let result = [...quotations];

        // 1. Filter by search ID
        if (searchId.trim()) {
            result = result.filter((q) =>
                q.quotationId.toLowerCase().includes(searchId.toLowerCase())
            );
        }

        // 2. Filter by status
        if (status !== "all") {
            result = result
                .map((q) => ({
                    ...q,
                    versions: q.versions.filter((v) => v.status === status),
                }))
                .filter((q) => q.versions.length > 0);
        }

        // 3. Sort by createdAt (inside versions)
        result = result.map((q) => ({
            ...q,
            versions: [...q.versions].sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
            }),
        }));

        return result;
    }, [searchId, status, sortOrder]);

    return (
        <div>
            <LeadQuotationActionBar
                quotationId={searchId}
                status={status}
                sortOrder={sortOrder}
                onSearch={setSearchId}
                onStatusChange={setStatus}
                onSortChange={setSortOrder}
                onReset={() => {
                    setSearchId("");
                    setStatus("all");
                    setSortOrder("desc");
                }}
            />
            <LeadQuotationList quotations={filteredQuotations} />
        </div>
    )
}

export default LeadQuotations