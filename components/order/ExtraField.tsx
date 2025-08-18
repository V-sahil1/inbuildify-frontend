import React from "react";

const ExtraField = () => {
  return (
    <form action="" className="space-y-4">
      <div className="flex md:space-x-4 w-full flex-col md:flex-row">
        <div className="w-full form-control">
          <label className="form-label">AGENT NAME :</label>
          <input type="text" className="form-input" />
        </div>
      </div>
      <div className="flex md:space-x-4 w-full flex-col md:flex-row">
        <div className="w-full form-control">
          <label className="form-label">CUSTOMER FIELD 1 :</label>
          <input type="text" className="form-input" />
        </div>
      </div>
      <div className="flex md:space-x-4 w-full flex-col md:flex-row gap-4 md:gap-0">
        <div className="w-full md:w-2/4 form-control">
          <label className="form-label">CUSTOMER FIELD 2 :</label>
          <input type="text" className="form-input" />
        </div>
        <div className="w-full md:w-2/4 form-control">
          <label className="form-label">CUSTOMER FIELD 3 :</label>
          <input type="text" className="form-input" />
        </div>
      </div>
      <div className="flex md:space-x-4 w-full flex-col md:flex-row gap-4 md:gap-0">
        <div className="w-full md:w-2/4 form-control">
          <label className="form-label">CUSTOMER FIELD 4 :</label>
          <input type="text" className="form-input" />
        </div>
        <div className="w-full md:w-2/4 form-control">
          <label className="form-label">CUSTOMER FIELD 5 :</label>
          <input type="text" className="form-input" />
        </div>
      </div>
    </form>
  );
};

export default ExtraField;
