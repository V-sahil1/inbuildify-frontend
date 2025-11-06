import { IconBrandZapier, IconExternalLink, IconRefresh, IconUxCircle } from '@tabler/icons-react';
import { Button, Input, Select } from 'antd';
import {
  CONNECTION_STATUS,
  INITIAL_SETTINGS,
  INVOICE_STATUS_OPTIONS,
} from 'data/configuration/XeroOptions';
import Image from 'next/image';
import React, { useState, useCallback } from 'react';

const SettingInput = ({ label, value, description, placeholder, children }) => (
  <div className="py-4 border-b border-gray-100 last:border-b-0">
    <div className="flex flex-col md:flex-row md:items-center">
      <div className="md:w-1/3 text-gray-700 font-medium mb-2 md:mb-0 text-sm">
        {label}
        <p className="text-xs text-gray-500 font-normal mt-0.5 max-w-sm">{description}</p>
      </div>

      <div className="md:w-2/3">
        {children ? (
          children
        ) : (
          <Input type="text" value={value} placeholder={placeholder} className="w-full" />
        )}
      </div>
    </div>
  </div>
);

export const Xero = () => {
  const [status, setStatus] = useState(CONNECTION_STATUS.FAILED);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  const handleSettingsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setSettings(prev => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleSelectChange = useCallback(
    (name: string) => (value: string) => {
      setSettings(prev => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );
  const getConnectionStatusInfo = () => {
    switch (status) {
      case CONNECTION_STATUS.CONNECTED:
        return {
          message: 'Connected successfully to Xero.',
          messageClass: 'text-green-600',
          buttonText: 'Connected',
          buttonClass: 'bg-gray-400 cursor-not-allowed',
          Icon: IconBrandZapier,
        };
      case CONNECTION_STATUS.FAILED:
        return {
          message: 'Connection failed. Please try to Reconnect.',
          messageClass: 'text-red-600 font-semibold',
          buttonText: 'Reconnect',
          buttonClass: 'bg-blue-500 hover:bg-blue-600',
          Icon: IconUxCircle,
        };
      default: // DISCONNECTED
        return {
          message: 'This account is currently disconnected.',
          messageClass: 'text-yellow-600',
          buttonText: 'Connect Now',
          buttonClass: 'bg-blue-500 hover:bg-blue-600',
          Icon: IconUxCircle,
        };
    }
  };

  const statusInfo = getConnectionStatusInfo();

  const handleReconnect = useCallback(async () => {
    if (status === CONNECTION_STATUS.CONNECTED) return;

    setIsReconnecting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const success = Math.random() > 0.3;

    if (success) {
      setStatus(CONNECTION_STATUS.CONNECTED);
    } else {
      setStatus(CONNECTION_STATUS.FAILED);
    }

    setIsReconnecting(false);
  }, [status]);

  return (
    <div className="">
      <div className=" rounded-xl">
        <div className="flex justify-between items-center pb-6 mb-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500">
              <Image
                src="https://media.licdn.com/dms/image/v2/C510BAQHCwoJzm8Yhvw/company-logo_200_200/company-logo_200_200/0/1630566733635/xero_logo?e=2147483647&v=beta&t=jowjfH9YQdPpz8sx5EGpGTxePVrBVfADP-cd-3Gr5iM"
                width={60}
                height={60}
                alt="Xero Logo"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">Xero</h2>
              <p className="text-sm text-gray-600">Online accounting software</p>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <p className={`text-xs ${statusInfo.messageClass}`}>{statusInfo.message}</p>

            <Button
              type="primary"
              onClick={handleReconnect}
              loading={isReconnecting}
              disabled={status === CONNECTION_STATUS.CONNECTED || isReconnecting}
              className={`
                flex items-center text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors duration-200 text-sm min-w-[120px] justify-center
                ${statusInfo.buttonClass}
                ${isReconnecting ? 'opacity-80 cursor-wait' : ''}
              `}
            >
              {isReconnecting ? 'Connecting...' : statusInfo.buttonText}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <SettingInput
            label="Use Xero Income Account"
            value={settings.incomeAccount}
            description="This sales default code should match the sales default code in Xero else integration will not work"
            placeholder="e.g., 200"
          >
            <Input
              type="text"
              name="incomeAccount"
              value={settings.incomeAccount}
              className="w-full border-b border-gray-300 py-1.5 focus:border-blue-500 focus:outline-none transition-colors duration-200"
              onChange={handleSettingsChange}
            />
          </SettingInput>

          <SettingInput
            label="Xero Default Invoice Status"
            description="Invoices in Xero will be created in selected status. eg: If draft is selected - Status column in xero will be draft"
            value={settings.defaultInvoiceStatus}
            placeholder="e.g., Draft"
          >
            <div className="relative">
              <Select
                value={settings.defaultInvoiceStatus}
                onChange={handleSelectChange('defaultInvoiceStatus')}
                options={INVOICE_STATUS_OPTIONS.map(option => ({
                  key: option.value,
                  value: option.value,
                  label: option.label,
                }))}
                className="w-full cursor-pointer"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </SettingInput>

          <SettingInput
            label="Tracking Category Option"
            description="This field visible only when the tracking category option is created in Xero."
            value={settings.trackingCategory}
            placeholder="e.g., Website Leads"
          >
            <div className="space-y-4">
              <Input
                type="text"
                name="trackingCategory"
                value={settings.trackingCategory}
                placeholder="e.g., Website Leads"
                className="w-full border-b border-gray-300 py-1.5 focus:border-blue-500 focus:outline-none transition-colors duration-200"
                onChange={handleSettingsChange}
              />
              <p className="text-xs text-blue-500 flex items-center space-x-1 cursor-pointer hover:underline">
                <span>View Xero Tracking Categories</span>
                <IconExternalLink className="w-3 h-3" />
              </p>
            </div>
          </SettingInput>
        </div>
      </div>
    </div>
  );
};
