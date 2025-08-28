import React from "react";
import { Card } from "antd";
import Image from "next/image";

interface AvailableFacadesTabProps {
  facades: any[];
  selectedFacade: any;
  onSelect: (facade: any) => void;
}

const AvailableFacadesTab: React.FC<AvailableFacadesTabProps> = ({
  facades,
  selectedFacade,
  onSelect,
}) => {
  if (!facades?.length) {
    return (
      <div className="text-gray-500 text-center py-8">
        No facades available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left side: Facade list */}
      <div className="col-span-2 grid grid-cols-2 max-h-[calc(100svh-400px)] overflow-y-auto gap-4">
        {facades.map((facade) => (
          <Card
            key={facade.id}
            hoverable
            onClick={() => onSelect(facade)}
            className={`cursor-pointer ${
              selectedFacade?.id === facade.id ? "border-blue-500 border-2" : ""
            }`}
            cover={
              <img
                src={facade.image}
                alt={facade.name}
                className="h-40 w-full object-cover rounded"
              />
            }
          >
            <Card.Meta title={facade.name} />
          </Card>
        ))}
      </div>

      {/* Right side: Selected preview */}
      <div className="col-span-1">
        {selectedFacade ? (
          <Card
            cover={
              <Image
                src={selectedFacade.image || './images/no_image_found.png'}
                alt={selectedFacade.name}
                className="h-64 w-full object-cover rounded"
                width={200}
                height={200}
              />
            }
          >
            <p className="text-center">{selectedFacade.name}</p>
          </Card>

        ) : (
          <div className="text-gray-500 text-center py-20 border rounded">
            Select a facade to preview
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableFacadesTab;
