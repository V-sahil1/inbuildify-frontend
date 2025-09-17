import { Package } from "@redux/feature/package/IPackageState";
import { IconChevronDown, IconEdit, IconTrash } from "@tabler/icons-react";
import { Tooltip } from "antd";
import { useState } from "react";
import ConfirmationModal from "../common/ConfirmationModal";

interface PackageItemProps {
  pkg: Package;
  onEdit: (pkg: Package) => void;
  onDelete: (packageId: string) => void;
  isDeleting?: boolean;
}

export const PackageItem = ({
  pkg,
  onEdit,
  onDelete,
  isDeleting = false,
}: PackageItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="border border-border-color rounded-lg overflow-hidden mb-4">
      <div
        className="p-4 bg-card-color hover:bg-primary-5 transition-colors cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="text-lg font-medium">{pkg.name}</h3>
          <p className="text-sm text-gray-500">
            {pkg?.categoryItems?.length} items • ${pkg?.amount}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(pkg);
            }}
            className="p-1 text-gray-500 hover:text-primary transition-colors"
            aria-label="Edit package"
          >
            <IconEdit size={18} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            className="p-1 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
            aria-label="Delete package"
            disabled={isDeleting}
          >
            <IconTrash size={18} />
          </button>

          <IconChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          />
        </div>

        {showDeleteConfirm && (
          <ConfirmationModal
            open={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={() => onDelete(pkg.packageId)}
            message="Are you sure you want to delete this package?"
            type="danger"
            confirmText="Delete"
            cancelText="Cancel"
            loading={isDeleting}
            maxWidth="sm"
          />
        )}
      </div>
      {isExpanded && (
        <div className="p-4 border-t border-border-color">
          <ul className="space-y-2">
            {pkg?.categoryItems?.length > 0 ? (
              pkg?.categoryItems?.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between py-2 border-b border-gray-300 "
                >
                  <Tooltip title={item.desc}>
                    <span className="line-clamp-1 word-wrap">{item.desc}</span>
                  </Tooltip>
                </li>
              ))
            ) : (
              <li className="flex justify-center py-2 ">No items</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
