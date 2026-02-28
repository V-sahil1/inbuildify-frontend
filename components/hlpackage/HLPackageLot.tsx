import React from "react"
import { IconMapPin, IconTrash } from "@tabler/icons-react"
import { Select } from "antd"

export const HLPackageLot = ({ deatils, editOpen, setEditOpen, setHasChanges, lotOptions, lot, setDeatils }) => {
  const DataField = ({ label, value }) => (
    <div className="flex mb-2">
      <p>{label} : </p>
      <p>{value}</p>
    </div>
  );
  return (
    <div className=" p-4 text-sm ">
      {deatils?.lot ? (
        <div>
          <div className="flex justify-between gap-2 items-center mb-2">
            <div>
              <IconMapPin size={20} />
              <p>{deatils?.lot?.address}</p>
            </div>
            <IconTrash size={20} color='red' className='cursor-pointer' onClick={() => {
              setDeatils(prev => ({ ...prev, lot: null }))
              setEditOpen(prev => ({ ...prev, lot: false }))
              setHasChanges(true)
            }} />
          </div>
          <DataField label="Estate" value={deatils?.lot?.estateName || deatils?.lot?.estate?.name} />
          <DataField label="Stage" value={deatils?.lot?.estateStageName || deatils?.lot?.estateStage?.name} />
          <DataField label="Type" value={deatils?.lot?.lotType} />
          <div className="flex gap-1">
            <DataField label="W" value={deatils?.lot?.widthM} />
            <DataField label="D" value={deatils?.lot?.depthM} />
            <DataField label="Total" value={deatils?.lot?.totalSizeM2} />
          </div>
        </div>
      ) : (
        <div className="text-blue min-h-[135px] flex justify-center items-center cursor-pointer">
          <div>
            <p onClick={() => setEditOpen(prev => ({ ...prev, lot: true }))}>Create Lot</p>
            {editOpen?.linkLot ?
              <Select options={lotOptions} className="w-full" onChange={(value) => {
                setDeatils(prev => ({ ...prev, lot: lot.find(item => item.lotId === value) }))
                setHasChanges(true)
              }} />
              : <p onClick={() => setEditOpen(prev => ({ ...prev, linkLot: true }))}>Link Lot</p>}

          </div>
        </div>
      )}
    </div>
  )
}