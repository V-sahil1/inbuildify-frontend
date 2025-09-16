import React, { useMemo, useState } from 'react'
import JobVariationActionBar from './JobVariationActionBar'
import JobVariationCreateTable from './JobVariationCreateTable';
import { JobVariationItems } from 'data/types';
import { JobVariationCreateTableData } from 'data/sampleData';

const JobVariationCreatePage = ({ setActiveScreen }) => {
    const [dataSource, setDataSource] = useState<JobVariationItems[]>(JobVariationCreateTableData);
    const [selectedVariation, setSelectedVariation] = useState<JobVariationItems[] | null>(null);
    const [filters, setFilters] = useState({
        title: "Post Contract Variation",
        requestedBy: undefined as string | undefined,
        delayedDays: undefined as number | undefined,
        extraCount: 0,
    });

    const updateFilter = (key: string, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleExtraSelect = (key: string) => {
        updateFilter("extraCount", filters.extraCount + 1);
    };

    // calculation
    const { totalCost, selectedCount } = useMemo(() => {
        const total = selectedVariation?.reduce((sum, item) => sum + (item.total || 0), 0);
        return { totalCost: total || 0, selectedCount: selectedVariation?.length || 0 };
    }, [selectedVariation]);

    return (
        <div className='bg-card-color'>
            <JobVariationActionBar
                title={filters.title}
                requestedBy={filters.requestedBy}
                delayedDays={filters.delayedDays}
                selectedCount={selectedCount}
                extraCount={filters.extraCount}
                totalCost={totalCost}
                onTitleChange={(val) => updateFilter("title", val)}
                onRequestedByChange={(val) => updateFilter("requestedBy", val)}
                onDelayedDaysChange={(val) => updateFilter("delayedDays", val ?? undefined)}
                onExtraSelect={handleExtraSelect}
                onShowAll={() => console.log("Show all clicked")}
                onPreview={() => console.log("Preview clicked")}
                onContinue={() => setActiveScreen('statusTracker')}
                personOptions={[
                    { label: "John Doe", value: "john" },
                    { label: "Jane Smith", value: "jane" },
                ]}
            />
            <JobVariationCreateTable dataSource={dataSource} setDataSource={setDataSource} selectedVariation={selectedVariation} setSelectedVariation={setSelectedVariation} />
        </div>
    )
}

export default JobVariationCreatePage