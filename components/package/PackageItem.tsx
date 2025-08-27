import { Package } from "@redux/feature/package/IPackageState";
import { IconChevronDown } from "@tabler/icons-react";
import { Tooltip } from "antd";
import { useState } from "react";

export const PackageItem = ({ pkg }: { pkg: Package }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="border border-border-color rounded-lg overflow-hidden mb-4">
      <div 
        className="p-4 bg-card-color hover:bg-primary-5 transition-colors cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="text-lg font-medium">{pkg.name}</h3>
          <p className="text-sm text-gray-500">
            {pkg?.categoryItemIds?.length} items • ${pkg?.amount}
          </p>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">
            {new Date(pkg?.createdAt).toLocaleDateString()}
          </span>
          <IconChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 border-t border-border-color">
          <ul className="space-y-2">
            {pkg?.categoryItemDescriptions?.length > 0 ? pkg?.categoryItemDescriptions?.map((item) => (
              <li 
                key={item} 
                className="flex justify-between py-2 border-b border-gray-300 "
              >
                <Tooltip title={item}><span className="line-clamp-1 word-wrap">{item}</span></Tooltip>
              </li>
            )) : <li className="flex justify-center py-2 ">No items</li>}
          </ul>
        </div>
      )}
    </div>
  );
};