import FileExplorer from '@/components/common/FileExplorer';
import { getSdriveDataByType } from '@/data/sdriveData';
import { useDebounce } from '@hooks/useDebounce';
import { useState, useEffect } from 'react';

export default function MyDrive({ type }: { type: string }) {
    const rootFolders = getSdriveDataByType(type);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Handle search query changes
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    // Effect to trigger API call when debounced query changes
    useEffect(() => {
        if (debouncedSearchQuery) {
            console.log('Fetching results for:', debouncedSearchQuery);
            // TODO: Call your API here with debouncedSearchQuery
            // Example: fetchSearchResults(debouncedSearchQuery, type);
        }
    }, [debouncedSearchQuery, type]);

    return (
        <div className="w-full">
            <FileExplorer
                rootFolders={rootFolders}
                enableSearch={true}
                onSearchChange={handleSearchChange}
            />
        </div>
    );
}