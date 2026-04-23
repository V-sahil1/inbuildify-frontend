import { useAppDispatch } from '@hooks/redux';
import { deleteFloorPlan } from '@redux/feature/floorPlan/floorPlanThunk';
import { IFloorPlanState } from '@redux/feature/floorPlan/IFloorPlanState';
import {
  IconClockHour7,
  IconDeviceIpadDollar,
  IconEdit,
  IconPhoto,
  IconTrash,
} from '@tabler/icons-react';
import { Badge, Divider, Image, message, Popconfirm, Tooltip } from 'antd';

export const FloorPlanItem = ({
  floorPlans,
  setcreateFloorPlanOpen,
  setSelectedFloorplan,
  setDrawerOpen,
}) => {
  const dispatch = useAppDispatch();

  const handleDeleteFloorplan = async (id: string) => {
    try {
      await dispatch(deleteFloorPlan(id)).unwrap();
      message.success('Floorplan deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete floorplan');
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
      {floorPlans?.map((floorPlan: IFloorPlanState) => (
        <div
          key={floorPlan.floorPlanId}
          className="card bg-card-color p-4 rounded-xl flex flex-col items-center border border-border-color relative group"
        >
          {/* Hover overlay with blur effect */}
          <div className="absolute inset-0 bg-black-50 bg-opacity-50 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-10">
            <Tooltip title="Edit">
              <button
                className="p-2 bg-white bg-opacity-80 text-black rounded-full hover:bg-opacity-100 transition-all duration-200"
                onClick={e => {
                  e.stopPropagation();
                  setcreateFloorPlanOpen(true);
                  setSelectedFloorplan(floorPlan);
                }}
              >
                <IconEdit />
              </button>
            </Tooltip>
            <Tooltip title="Map Pricelist">
              <Badge count={floorPlan?.pricelistItems?.length}>
                <button
                  className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all duration-200"
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedFloorplan(floorPlan);
                    setDrawerOpen('floorplan');
                  }}
                >
                  <IconDeviceIpadDollar />
                </button>
              </Badge>
            </Tooltip>
            <Tooltip title="Map Facade">
              <Badge count={floorPlan?.facade?.length}>
                <button
                  className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all duration-200"
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedFloorplan(floorPlan);
                    setDrawerOpen('facade');
                  }}
                >
                  <IconPhoto />
                </button>
              </Badge>
            </Tooltip>
            <Tooltip title="Quotation History">
              <Badge>
                <button
                  className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all duration-200"
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedFloorplan(floorPlan);
                    setDrawerOpen('quotation');
                  }}
                >
                  <IconClockHour7 />
                </button>
              </Badge>
            </Tooltip>
            <Tooltip title="Remove">
              <Popconfirm
                title="Are you sure you want to delete floorplan?"
                onConfirm={e => {
                  e.stopPropagation();
                  handleDeleteFloorplan(floorPlan?.floorPlanId);
                }}
              >
                <button
                  className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all duration-200"
                  onClick={e => {
                    e.stopPropagation();
                  }}
                >
                  <IconTrash className="text-red-600" />
                </button>
              </Popconfirm>
            </Tooltip>
          </div>
          <Image
            src={floorPlan?.simpleImage || '/placeholder.png'} // make sure placeholder.png exists in /public
            alt={floorPlan?.simpleImage || 'Floor Plan'}
            className="mb-6 w-[200px] h-[200px] object-contain"
            width={200}
            height={200}
          />

          <h5 className="text-[20px]/[24px] font-bold mb-2 text-center">{floorPlan?.name}</h5>
          <p className="text-font-color-100 mb-4 text-center">{floorPlan?.rangeName}</p>
          <div className="flex flex-col w-full rounded-lg p-4 overflow- bg-body-color">
            {/* Left Section */}
            <div className="flex-1 space-y-2 ">
              <div className="flex justify-between text-md  md:text-sm ">
                <span>Beds :</span>
                <span>{floorPlan?.beds || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-md  md:text-sm ">
                <span>Bath :</span>
                <span>{floorPlan?.baths || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-md  md:text-sm ">
                <span>Car Park :</span>
                <span>{floorPlan?.carpark || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-md  md:text-sm ">
                <span>Width M :</span>
                <span>{floorPlan?.minLandWidth || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-md   md:text-sm ">
                <span>Depth M :</span>
                <span>{floorPlan?.minLandDepth || 'N/A'}</span>
              </div>
            </div>

            {/* Vertical Divider */}
            <Divider type="horizontal" className="h-auto mx-4" />

            {/* Right Section */}
            <div className="flex-1 space-y-2 ">
              <div className="flex justify-between text-md  md:text-sm">
                <span>Dwelling :</span>
                <span>{floorPlan?.dwellingTypeName || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-md  md:text-sm">
                <span>Garage :</span>
                <span>{floorPlan?.garageArea || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-md  md:text-sm">
                <span>Porch :</span>
                <span>{floorPlan?.porchArea || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-md  md:text-sm">
                <span>Alfresco :</span>
                <span>{floorPlan?.alfrescoArea || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-md  md:text-sm">
                <span>SQFT :</span>
                <span>{floorPlan?.totalArea || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
