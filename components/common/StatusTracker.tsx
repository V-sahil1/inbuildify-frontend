import React from 'react';
import { Button, Upload } from 'antd';
import { IconCheck } from '@tabler/icons-react';

type StageStatus = 'disabled' | 'active' | 'completed';

export type StageButton = {
  label: string;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  className?: string;
  upload?: boolean;
  onClick?: () => void;
};

export type Stage = {
  id: number;
  title: string;
  status: StageStatus;
  buttons?: StageButton[];
};

type Props = {
  stages: Stage[];
  setIsUploadComplete?;
};

const StatusTracker: React.FC<Props> = ({ stages, setIsUploadComplete }) => {
  return (
    <div className="p-3 bg-card-color">
      <div className="mt-10 flex flex-col gap-[20px] relative">
        <div className="absolute left-9 top-10 bottom-10 w-0.5 bg-gray-200"></div>

        {stages.map((stage, index) => (
          <div
            key={stage.id}
            className={`z-[2] bg-body-color relative rounded-xl border transition-shadow ${
              stage.status === 'active' ? 'shadow-lg' : 'shadow-sm'
            }`}
          >
            <div
              className={`flex items-center justify-between px-3 py-1 w-full h-16 ${
                stage.status === 'disabled' ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {stage.status === 'completed' ? (
                <div className="px-2 py-2 ml-1 font-semibold bg-green-500 text-white rounded-full">
                  <IconCheck size={18} />
                </div>
              ) : (
                <div className="px-4 py-2 ml-1 font-semibold text-gray-700 border rounded-full">
                  {index + 1}
                </div>
              )}

              <div className="flex-1 px-4 text-gray-800">{stage.title}</div>
              <div className="flex gap-2">
                {stage.buttons?.map((btn, i) =>
                  btn.upload ? (
                    <Upload
                      key={i}
                      showUploadList={false}
                      onChange={file => {
                        if (file.file.status === 'done') {
                          btn.onClick();
                        }
                      }}
                    >
                      <Button
                        key={i}
                        size="small"
                        type={btn.type || 'default'}
                        className={btn.className}
                        onClick={btn.onClick}
                      >
                        {btn.label}
                      </Button>
                    </Upload>
                  ) : (
                    <Button
                      key={i}
                      size="small"
                      type={btn.type || 'default'}
                      className={btn.className}
                      onClick={btn.onClick}
                    >
                      {btn.label}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusTracker;
