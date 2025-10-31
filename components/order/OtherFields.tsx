import React from 'react';

const OtherFields = () => {
  return (
    <form action="" className="space-y-4">
      <div className="flex md:space-x-4 w-full flex-col md:flex-row">
        <div className="w-full form-control">
          <label className="form-label">Original Order :</label>
          <input type="text" className="form-input" />
        </div>
      </div>
      <div className="flex md:space-x-4 w-full flex-col md:flex-row">
        <div className="w-full form-control">
          <label className="form-label">Customer Number :</label>
          <input type="text" className="form-input" />
        </div>
      </div>
      <div className="flex md:space-x-4 w-full flex-col md:flex-row">
        <div className="w-full form-control">
          <label className="form-label">Est. Weight for RS Label (lb) :</label>
          <input type="text" className="form-input" />
        </div>
      </div>
      <div className="flex md:space-x-4 w-full flex-col md:flex-row">
        <div className="w-full form-control">
          <label className="form-label">Shipping Instructions:</label>
          <textarea className="w-full h-16 border border-border-color rounded-[8px] p-2 resize-none"></textarea>
        </div>
      </div>
      <div className="flex md:space-x-4 w-full flex-col md:flex-row">
        <div className="w-full form-control">
          <label className="form-label">Comments :</label>
          <textarea className="w-full h-16 border border-border-color rounded-[8px] p-2 resize-none"></textarea>
        </div>
      </div>
    </form>
  );
};

export default OtherFields;
