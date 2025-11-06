import { Input, Switch, Table, Tag } from 'antd';
import { history, plans } from 'data/configuration/integrationESignData';
import React, { useState } from 'react';
import { PlanCard } from './PlanCard';

export const ESign = () => {
  const [selectedPlan, setSelectedPlan] = useState('Medium');
  const [isAutomaticRenewal, setIsAutomaticRenewal] = useState(true);
  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sNo',
      key: 'sNo',
      render: (text: string) => <span className="text-sm font-medium text-gray-900">{text}</span>,
    },
    {
      title: 'Previous Balance',
      dataIndex: 'prevBalance',
      key: 'prevBalance',
      render: (text: string) => <span className="text-sm text-gray-500">{text}</span>,
    },
    {
      title: 'Plan',
      dataIndex: 'plan',
      key: 'plan',
      render: (plan: string) => {
        const color = plan === 'Small' ? 'blue' : 'gray';
        return (
          <Tag
            color={color}
            className={`px-2 text-xs font-semibold rounded-full bg-${color}-100 text-${color}-800`}
          >
            {plan}
          </Tag>
        );
      },
    },
    {
      title: 'Topup',
      dataIndex: 'topup',
      key: 'topup',
      render: (text: string) => <span className="text-sm text-gray-500">{text}</span>,
    },
    {
      title: 'Amount($)',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: string) => <span className="text-sm text-gray-500">{text}</span>,
    },
    {
      title: 'Payment Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color =
          status === 'Success' ? 'green' : status === 'Manually Added' ? 'gold' : 'gray';
        return (
          <Tag
            color={color}
            className={`px-2 text-xs font-semibold rounded-full bg-${color}-100 text-${color}-800`}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (text: string) => <span className="text-sm text-gray-500">{text}</span>,
    },
    {
      title: 'Created User',
      dataIndex: 'createdUser',
      key: 'createdUser',
      render: (text: string) => (
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-700 mx-auto">
          {text}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white  text-gray-800">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold">eSign enabled</h2>
          <p className="text-sm text-gray-500">
            Current Balance: <span className="font-bold text-gray-700">96</span>
          </p>
        </div>
        <button className="px-4 py-2 text-white bg-red-500 rounded-md text-sm font-medium hover:bg-red-600 transition-colors">
          Disable
        </button>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label htmlFor="emailReminder" className="block text-base font-semibold mb-1">
            Send Email Reminder when eSign Balance is Low
          </label>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-500">
              An email notification will be sent to the admin when the eSign balance falls to or
              below the specified threshold.
            </p>
            <Input
              id="emailReminder"
              type="number"
              defaultValue="50"
              className="w-60 p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-base font-semibold mb-1">
              Builder Name Alternative Text
            </label>
            <p className="text-sm text-gray-500 mb-2">
              This customized text will appear in the Quotation, Color and Variation PDF documents,
              replacing the Builder's name with the specified alternate text.
            </p>
          </div>
          <Input
            id="emailReminder"
            type="text"
            defaultValue="Builder Name"
            className="w-[200px] p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-start space-x-3">
          <Switch onClick={() => setIsAutomaticRenewal(!isAutomaticRenewal)} />
          <div>
            <label className="block text-base font-semibold">Automatic Renewal</label>
            <p className="text-sm text-gray-500">
              Automatic renewal will be triggered when the eSign balance drops to or below the
              predefined minimum threshold.
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold my-4">eSign Plans</h3>
      <div className="grid grid-cols-4 gap-6 mb-10">
        {plans.map(plan => (
          <PlanCard
            key={plan.name}
            plan={plan}
            isSelected={selectedPlan === plan.name}
            setSelectedPlan={setSelectedPlan}
          />
        ))}
      </div>

      <h3 className="text-xl font-bold my-8">eSign History</h3>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <Table
          columns={columns}
          dataSource={history}
          rowKey="sNo"
          pagination={false}
          className="bg-white rounded-md border border-gray-200"
        />
      </div>
    </div>
  );
};
