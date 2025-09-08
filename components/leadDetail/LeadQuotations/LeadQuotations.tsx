import React, { useMemo, useState } from 'react'
import LeadQuotationActionBar from './LeadQuotationActionBar'
import LeadQuotationList from './LeadQuotationList'
import { Quotation, QuotationStatus } from 'data/types';



const LeadQuotations = () => {
    const [searchId, setSearchId] = useState<string>("");
    const [status, setStatus] = useState<QuotationStatus | "all">("all");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const filteredQuotations = useMemo(() => {
        let result = [];

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
            <LeadQuotationList />
        </div>
    )
}

export default LeadQuotations