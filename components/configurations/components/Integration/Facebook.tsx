import { Button } from 'antd';
import React from 'react';

export const Facebook = () => {
  const serviceName = 'Facebook Lead Ads';
  const serviceDescription = 'Join Facebook and start connecting today.';
  const statusText = 'You are not connected with Facebook';

  const FacebookIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" id="facebook">
      <path
        fill="#1877f2"
        d="M1024,512C1024,229.23016,794.76978,0,512,0S0,229.23016,0,512c0,255.554,187.231,467.37012,432,505.77777V660H302V512H432V399.2C432,270.87982,508.43854,200,625.38922,200,681.40765,200,740,210,740,210V336H675.43713C611.83508,336,592,375.46667,592,415.95728V512H734L711.3,660H592v357.77777C836.769,979.37012,1024,767.554,1024,512Z"
      ></path>
      <path
        fill="#fff"
        d="M711.3,660,734,512H592V415.95728C592,375.46667,611.83508,336,675.43713,336H740V210s-58.59235-10-114.61078-10C508.43854,200,432,270.87982,432,399.2V512H302V660H432v357.77777a517.39619,517.39619,0,0,0,160,0V660Z"
      ></path>
    </svg>
  );

  return (
    <div className="bg-gray-50 p-4 min-h-screen flex items-start justify-center font-sans">
      <div
        className="
                bg-white 
                p-4 sm:p-6 
                border border-gray-200 
                rounded-xl 
                shadow-lg 
                w-full 
                max-w-4xl 
                mt-10
            "
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-start flex-grow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 text-white bg-blue-600 rounded-full flex items-center justify-center mr-4 shadow-md">
              {FacebookIcon}
            </div>

            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-gray-800">{serviceName}</h2>
              <p className="text-sm text-gray-600 mt-0.5">{serviceDescription}</p>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
            <Button
              type="primary"
              onClick={() => console.log('Connecting to', serviceName)}
              className="
                                bg-blue-600 
                                hover:bg-blue-700 
                                text-white 
                                font-medium 
                                py-2 px-6 
                                rounded-md 
                                transition 
                                duration-150 
                                ease-in-out
                                w-full sm:w-auto
                                shadow-md
                            "
            >
              Connect
            </Button>
          </div>
        </div>

        <div className="text-right mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500 italic">{statusText}</p>
        </div>
      </div>
    </div>
  );
};
