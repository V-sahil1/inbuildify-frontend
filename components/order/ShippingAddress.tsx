import React, { useState } from 'react';
import CustomSelect from '../common/CustomSelect';

const ShippingAddress = () => {
  const [internationalCode, setInternationalCode] = useState('Regular-0');
  const [shippingCarrier, setShippingCarrier] = useState('FedEx');
  const [shippingService, setShippingService] = useState('FedEx');
  const [freightAccount, setFreightAccount] = useState('DCL-00500');
  const [incoterm, setIncoterm] = useState('CIP');
  const [paymentType, setPaymentType] = useState('Cash');
  const [packingList, setPackingList] = useState('Yes');

  return (
    <form action="" className="space-y-4">
      <div className="flex md:space-x-4 w-full flex-col md:flex-row">
        <div className="w-full form-control">
          <label className="form-label">International Code :</label>
          <CustomSelect
            options={[
              { label: 'Regular-0', value: 'Regular-0' },
              { label: 'Regular-1', value: 'Regular-1' },
              { label: 'Regular-2', value: 'Regular-2' },
            ]}
            value={internationalCode}
            onChange={setInternationalCode}
            placeholder="Select international code"
          />
        </div>
      </div>
      <div className="flex md:space-x-4 w-full flex-col md:flex-row">
        <div className="w-full form-control">
          <label className="form-label">Shipping Carrier :</label>
          <CustomSelect
            options={[
              { label: 'FedEx', value: 'FedEx' },
              { label: 'UPS', value: 'UPS' },
              { label: 'DHL', value: 'DHL' },
            ]}
            value={shippingCarrier}
            onChange={setShippingCarrier}
            placeholder="Select shipping carrier"
          />
        </div>
      </div>
      <div className="flex md:space-x-4 w-full flex-col md:flex-row gap-4 md:gap-0">
        <div className="w-full  form-control">
          <label className="form-label">Shipping Service :</label>
          <CustomSelect
            options={[
              { label: 'FedEx', value: 'FedEx' },
              { label: 'UPS', value: 'UPS' },
              { label: 'DHL', value: 'DHL' },
            ]}
            value={shippingService}
            onChange={setShippingService}
            placeholder="Select shipping service"
          />
        </div>
      </div>
      <div className="flex md:space-x-4 w-full flex-col md:flex-row gap-4 md:gap-0">
        <div className="w-full md:w-2/4 form-control">
          <label className="form-label">Freight Account :</label>
          <CustomSelect
            options={[
              { label: 'DCL-00500', value: 'DCL-00500' },
              { label: 'DCL-00501', value: 'DCL-00501' },
              { label: 'DCL-00502', value: 'DCL-00502' },
            ]}
            value={freightAccount}
            onChange={setFreightAccount}
            placeholder="Select freight account"
          />
        </div>
        <div className="w-full md:w-2/4 form-control">
          <label className="form-label">Incoterm :</label>
          <CustomSelect
            options={[
              { label: 'CIP', value: 'CIP' },
              { label: 'CPT', value: 'CPT' },
              { label: 'DAP', value: 'DAP' },
              { label: 'DPU', value: 'DPU' },
              { label: 'DDP', value: 'DDP' },
            ]}
            value={incoterm}
            onChange={setIncoterm}
            placeholder="Select incoterm"
          />
        </div>
      </div>
      <div className="flex md:space-x-4 w-full flex-col md:flex-row gap-4 md:gap-0">
        <div className="w-full md:w-2/4 form-control">
          <label className="form-label">Consignee :</label>
          <input type="text" className="form-input !py-[6px]" />
        </div>
        <div className="w-full md:w-1/2 form-control">
          <label className="form-label">FOB Location :</label>
          <input type="text" className="form-input !py-[6px]" />
        </div>
      </div>
      <div className="flex md:space-x-4 w-full flex-col md:flex-row gap-4 md:gap-0">
        <div className="w-full md:w-1/2 form-control">
          <label className="form-label">Payment Type :</label>
          <CustomSelect
            options={[
              { label: 'Cash', value: 'Cash' },
              { label: 'Credit Card', value: 'Credit Card' },
              { label: 'Bank Transfer', value: 'Bank Transfer' },
            ]}
            value={paymentType}
            onChange={setPaymentType}
            placeholder="Select payment type"
          />
        </div>
        <div className="w-full md:w-1/2 form-control">
          <label className="form-label">Packing List :</label>
          <CustomSelect
            options={[
              { label: 'Yes', value: 'Yes' },
              { label: 'No', value: 'No' },
            ]}
            value={packingList}
            onChange={setPackingList}
            placeholder="Select packing list"
          />
        </div>
      </div>
    </form>
  );
};

export default ShippingAddress;
