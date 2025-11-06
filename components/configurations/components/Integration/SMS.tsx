import React from 'react';

export const SMS = () => {
  const Badge = () => (
    <div className="relative">
      <div className="w-12 h-12 bg-green-200 text-green-700 font-bold text-sm flex items-center justify-center rounded-full shadow-inner">
        SMS
      </div>
      <div className="absolute top-1/2 left-full -mt-2 -ml-3 w-4 h-4 bg-green-200 transform rotate-45 rounded-sm opacity-90"></div>
    </div>
  );

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gray-50 flex items-start justify-center">
      <div className="w-full max-w-4xl bg-white p-6 shadow-xl rounded-xl border border-gray-100 mt-10">
        <div className="flex space-x-4 sm:space-x-6 items-start">
          <div className="flex-shrink-0 pt-1">
            <Badge />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-medium text-gray-800">SMS gateway not enabled</h3>
            <div className="mt-1 text-sm space-y-1">
              <p className="text-red-600">
                Additional costs and configurations are required for SMS gateway activation.
              </p>
              <p className="text-red-600">
                To enable the SMS feature, please contact our support team at{' '}
                <a
                  href="mailto:support@inbuildify.com.au"
                  className="font-semibold hover:underline"
                >
                  support@inbuildify.com.au
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
