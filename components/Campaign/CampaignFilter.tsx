import { Checkbox, Form, Input, Radio, Select } from 'antd';
import { useEffect } from 'react';
import DateFilterDropdown from '../common/custom-selects/DateFilterDropdown';
import { useUsersHook } from '@hooks/useUserHook';
import { debouncedURL } from '@lib/utils/debounceURL';
export default function CampaignFilter() {
  const { users } = useUsersHook();
  const userOptions = users.map(user => ({ label: user.name, value: user.usersId }));
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({ filtersKey: ['address'] });

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

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
              <Form.Item name={opt} valuePropName="checked" initialValue={false}>
                <Checkbox /> {opt}
              </Form.Item>
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
                  <Form.Item name={item.title}>
                    <Checkbox.Group options={item.options} />
                  </Form.Item>
                </div>
              </div>
            ))}
            <div>
              <p>Created Date</p>
              <Form.Item name="createdDate">
                <DateFilterDropdown onFilter={() => {}} onClear={() => {}} />
              </Form.Item>
            </div>
            <div>
              <p>Address</p>
              <div className="flex flex-col gap-3">
                <div>
                  <Form.Item>
                    <Radio.Group
                      options={[
                        { value: 'contact', label: 'Contact' },
                        { value: 'property', label: 'Property' },
                      ]}
                    />
                  </Form.Item>
                </div>
                <Form.Item name="city">
                  {' '}
                  <Select size="small" placeholder="Suburb/ City"></Select>
                </Form.Item>
                <Form.Item name="addressSearch">
                  {' '}
                  <Input
                    size="small"
                    placeholder="search"
                    value={filters.address}
                    onChange={e => setParams({ address: e.target.value })}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="flex justify-center text-sm gap-3">
            <div>
              <p>Client Type</p>
              <Form.Item name="clientType">
                {' '}
                <Select placeholder="Select Client Type" />
              </Form.Item>
            </div>
            <div>
              <p>Sales Executive</p>
              <Form.Item name="assignee">
                <Select placeholder="Select Assignee" options={userOptions} />
              </Form.Item>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
