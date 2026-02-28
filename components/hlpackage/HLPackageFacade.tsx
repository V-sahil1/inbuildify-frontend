import { IconTrash } from "@tabler/icons-react";
import { Image } from "antd";

export const HLPackageFacade = ({ setEditOpen, deatils, setDeatils }) => {
  return (
    <div className="m-3 h-full" onClick={() => setEditOpen(prev => ({ ...prev, facade: true }))}>
      {deatils?.facade ? (
        <div className="h-full flex flex-col gap-4">
          <div
            className="flex justify-center"
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <Image src={deatils?.facade.image} height={190} width="100%" />
          </div>
          <div
            className="flex justify-between items-center"
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <p className="font-medium text-font-color">{deatils?.facade?.name}</p>
            <IconTrash
              size={15}
              onClick={() => setDeatils(prev => ({ ...prev, facade: null }))}
              color="red"
              cursor="pointer"
            />
          </div>
        </div>
      ) : (
        <div
          className="text-center mt-[100px] text-blue cursor-pointer"
          onClick={() => setEditOpen(prev => ({ ...prev, facade: true }))}
        >
          Select Facade
        </div>
      )}
    </div>
  )
}