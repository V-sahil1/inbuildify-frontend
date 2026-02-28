import { Image } from "antd";
import { IconTrash } from "@tabler/icons-react";

export const HLPackageFloorPlan = ({ setEditOpen, deatils, setDeatils }) => {
  return (
    <div className="m-3 h-full" onClick={() => setEditOpen(prev => ({ ...prev, floorplan: true }))}>
      {deatils?.floorplan ? (
        <div className="h-full flex flex-col gap-4">
          <div className="flex justify-center">
            <div
              onClick={e => {
                e.stopPropagation();
              }}
            >
              <Image src={deatils?.floorplan.simpleImage} height={190} />
            </div>
          </div>
          <div
            className="flex justify-between items-center"
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <p className="font-medium text-font-color">{deatils?.floorplan?.name}</p>
            <IconTrash
              size={15}
              onClick={() => setDeatils(prev => ({ ...prev, floorplan: null }))}
              color="red"
              cursor="pointer"
            />
          </div>
        </div>
      ) : (
        <div
          className="text-center mt-[100px] text-blue cursor-pointer"
          onClick={() => setEditOpen(prev => ({ ...prev, floorplan: true }))}
        >
          Select Floor Plan
        </div>
      )}
    </div>
  )
}