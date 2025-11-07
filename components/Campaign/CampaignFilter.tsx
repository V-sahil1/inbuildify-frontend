import { Checkbox, Input, Radio, Select } from 'antd';
import { useRouter } from 'next/router';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import DateFilterDropdown from '../common/custom-selects/DateFilterDropdown';
export default function CampaignFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [address, setAddress] = useState(searchParams.get('address') || '');
  const debouncedUpdateURL = useMemo(
    () =>
      debounce((value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
          params.set('address', value);
        } else {
          params.delete('address');
        }
        router.replace(`${pathname}?${params.toString()}`);
      }, 500), // 500ms debounce delay
    [pathname, router, searchParams]
  );

  useEffect(() => {
    debouncedUpdateURL(address);
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL, address]);

  const filterCheckBoxData = [
    { title: 'Lead Status', options: ['Open-Leads', 'Open-Opportunity', 'Closed Lost', 'On Hold'] },
    {
      title: 'Job Status',
      options: ['In Progress', 'Cancelled', 'Archived', 'Completed', 'On Hold'],
    },
    {
      title: 'Construction',
      options: ['Ready for Construction', 'Under Construction', 'Completed', 'On Hold'],
    },
    { title: 'Purpose', options: ['Own House', 'Investment Property'] },
    { title: 'Rating', options: ['Hot', 'Cold', 'Warm'] },
    { title: 'Land', options: ['No', 'Yes'] },
    { title: 'Finance', options: ['No', 'Yes'] },
  ];
  const filterOptions = [
    'Leads/jobs',
    'Import Contacts',
    'Campaign Contacts',
    'Groups',
    'Referral Partners',
    'Supplier/Trades',
  ];
  return (
    <>
      <div>
        <div className="flex justify-between mb-3 text-sm">
          {filterOptions.map(opt => (
            <div>
              <Checkbox /> {opt}
            </div>
          ))}
        </div>
        <div className="bg-body-color p-3 mb-3">
          <p className="mb-2 font-medium">Filter Options</p>
          <div className="flex justify-between text-sm">
            {filterCheckBoxData.map((item, ind) => (
              <div key={ind}>
                <p>{item.title}</p>
                <div className="text-xs">
                  {item.options.map((op, ind) => (
                    <div key={ind}>
                      <Checkbox /> {op}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <p>Created Date</p>
              <DateFilterDropdown onFilter={() => { }} onClear={() => { }} />
            </div>
            <div>
              <p>Address</p>
              <div className="flex flex-col gap-3">
                <div>
                  <Radio.Group
                    options={[
                      { value: 'contact', label: 'Contact' },
                      { value: 'property', label: 'Property' },
                    ]}
                  ></Radio.Group>
                </div>
                <Select size="small" placeholder="Suburb/ City"></Select>
                <Input
                  size="small"
                  placeholder="search"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center text-sm gap-3">
            <div>
              <p>Client Type</p>
              <Select placeholder="Select Client Type"></Select>
            </div>
            <div>
              <p>Sales Executive</p>
              <Select placeholder="Select Assignee"></Select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
