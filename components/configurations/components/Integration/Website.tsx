import { copyToClipboard } from '@lib/utils/copyToClipboard';
import {
  IconCheck,
  IconClipboard,
  IconDownload,
  IconKey,
  IconRotateClockwise,
  IconThumbUp,
} from '@tabler/icons-react';
import { Button, Dropdown, Popconfirm } from 'antd';

import Link from 'next/link';
import React, { useState, useCallback } from 'react';

const MOCK_INTEGRATION_KEY = 'F6133B4C-B513-4DBA-B7C1-4BD8B233EE49';
const API_URL = 'https://api.inbuildify.com.au/v1/sales/create';

export const Website = () => {
  const [integrationKey, setIntegrationKey] = useState(MOCK_INTEGRATION_KEY);
  const [isCopying, setIsCopying] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = useCallback(async () => {
    setIsRegenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newKey = crypto.randomUUID().toUpperCase();
    setIntegrationKey(newKey);
    setIsRegenerating(false);
  }, []);

  const handleCopy = useCallback(() => {
    copyToClipboard(integrationKey);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  }, [integrationKey]);

  return (
    <div className="">
      <div className="  p-6 md:p-10   rounded-xl">
        <div className="flex justify-between items-center border-b pb-4 mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Website Settings</h1>
          <Dropdown
            menu={{
              items: [
                { key: 'HTML-Website', label: 'HTML Website' },
                { key: 'Wordpress-Website', label: 'Wordpress Website' },
              ],
              onClick: e => {
                if (e.key === 'HTML-Website') {
                  console.log('HTML Website');
                }
                if (e.key === 'Wordpress-Website') {
                  console.log('Wordpress Website');
                }
              },
            }}
          >
            <Button
              type="primary"
              icon={<IconDownload />}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              Download Integration Help Document
            </Button>
          </Dropdown>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 md:gap-x-10">
          <div className="md:col-span-3 text-gray-700 font-medium">Integration key</div>

          <div className="md:col-span-9 flex flex-col space-y-6">
            <div className="flex items-center space-x-4">
              <IconThumbUp className="w-5 h-5 text-green-500" />
              <p className="text-gray-700">
                You have enabled integration of inBuildify with your website.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center w-full max-w-md border border-gray-300 rounded-lg p-3 bg-gray-50 shadow-inner">
                <IconKey className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm font-mono text-gray-800 truncate select-all">
                  {integrationKey}
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center text-blue-500 hover:text-blue-600 transition-colors duration-200 text-sm font-medium focus:outline-none"
              >
                {isCopying ? (
                  <>
                    <IconCheck className="w-4 h-4 mr-1 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <IconClipboard className="w-4 h-4 mr-1" />
                    Copy Key
                  </>
                )}
              </button>

              <Popconfirm
                title={
                  <div className="w-[300px]">
                    <p>
                      Are you sure you want to generate the integration key? Please note, once
                      integration key is generated, your company website must use the below API
                      service for sending all enquiries to InSimplify.
                    </p>
                    <Link
                      href="https://api.inbuildify.com.au/v1/sales/create"
                      className="text-blue-500"
                    >
                      https://api.inbuildify.com.au/v1/sales/create
                    </Link>
                  </div>
                }
                onConfirm={handleRegenerate}
                okText="Yes"
                cancelText="No"
              >
                <button
                  disabled={isRegenerating}
                  className={`
                    flex items-center text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-200 text-sm 
                  ${
                    isRegenerating
                      ? 'bg-green-700 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }
                `}
                >
                  {isRegenerating ? (
                    <>
                      <IconRotateClockwise className="w-4 h-4 mr-2 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <IconRotateClockwise className="w-4 h-4 mr-2" />
                      Regenerate Integration Key
                    </>
                  )}
                </button>
              </Popconfirm>
            </div>

            <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <h3 className="text-gray-700 text-lg font-semibold mb-4 border-b pb-2">
                Sample API Information
              </h3>

              <div className="space-y-3 text-sm text-gray-800">
                <p>
                  <span className="font-semibold w-24 inline-block">Url:</span>
                  <a
                    href={API_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 break-all underline"
                  >
                    {API_URL}
                  </a>
                </p>
                <p>
                  <span className="font-semibold w-24 inline-block">Method:</span> POST
                </p>
                <p>
                  <span className="font-semibold w-24 inline-block">Input Type:</span> json
                </p>
              </div>

              <h4 className="font-semibold mt-6 mb-2 text-base text-gray-900">Sample Input:</h4>

              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono border border-gray-200 text-gray-800 whitespace-pre">
                {`{
  "name": "Test Enquiry",
  "emailid": "sales@inbuildify.com.au",
  "contact": "0406166577",
  "comments": "Requesting for Quote",
  "source": "Website",
  "key": "${integrationKey}"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
