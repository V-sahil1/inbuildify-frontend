import { Radio } from "antd"

export const HLPackagePrice = ({ setEditOpen, packageDetails, form, setHasChanges }) => {
  return (
    <div className="p-3 text-sm ">
      <div className="flex gap-6 items-center mb-2">
        <p>Type</p>
        <Radio.Group
          block
          options={[
            { label: 'Estimate', value: 'estimate' },
            { label: 'Fixed', value: 'fixed' },
          ]}
          value={packageDetails?.priceType}
          onChange={(e) => {
            setHasChanges(true)
            form.setFieldValue('priceType', e.target.value)
          }}
        />
      </div>
      <div className="flex gap-4 mb-2">
        <p>House</p>
        <p>${packageDetails?.houseTotal}</p>
      </div>
      <div className="flex gap-2">
        <div className="flex gap-2">
          <p>Land</p>
          <p>${packageDetails?.landPrice}</p>
        </div>
        <div className="flex gap-2" onClick={() => setEditOpen(prev => ({ ...prev, commission: true }))}>
          <p>Comm</p>
          <p className="text-blue">${packageDetails?.commissionTotal}</p>
        </div>
      </div>
    </div>
  )
}