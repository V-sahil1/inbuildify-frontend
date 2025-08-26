import React from "react";
import { Input, Upload, Button } from "antd";
import { IconUpload } from "@tabler/icons-react";

interface CustomPlanTabProps {
  customPlanName: string;
  setCustomPlanName: (name: string) => void;
  customPlanImage: any;
  setCustomPlanImage: (file: any) => void;
}

const CustomPlanTab: React.FC<CustomPlanTabProps> = ({
  customPlanName,
  setCustomPlanName,
  customPlanImage,
  setCustomPlanImage,
}) => {
  const uploadProps = {
    name: "file",
    multiple: false,
    beforeUpload: (file: any) => {
      setCustomPlanImage(file);
      return false;
    },
    onRemove: () => setCustomPlanImage(null),
  };

  return (
    <div className="py-6 max-w-md">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <Input
          value={customPlanName}
          onChange={(e) => setCustomPlanName(e.target.value)}
          placeholder="Enter floor plan name"
        />
      </div>

      <div className="mb-6">
        <Upload {...uploadProps} className="w-full">
          <Button
            icon={<IconUpload />}
            className="w-full h-12 border-2 border-dashed border-gray-300"
          >
            Click to upload floor plan image
          </Button>
        </Upload>
        {customPlanImage && (
          <div className="mt-2 text-sm text-gray-600">
            Selected: {customPlanImage.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomPlanTab;
