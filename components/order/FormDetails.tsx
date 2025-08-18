import React, { useState } from "react";
import CustomSelect from "../common/CustomSelect";

const FormDetails = () => {
  const [country, setCountry] = useState("");
  const countryOptions = [
    { label: "United States", value: "United States" },
    { label: "United Kingdom", value: "United Kingdom" },
    { label: "Canada", value: "Canada" },
  ];
  return (
    <form action="" className="space-y-4">
      <div className="flex md:space-x-4 w-full flex-col md:flex-row">
        <div className="w-full form-control">
          <label className="form-label">Company :</label>
          <input type="text" className="form-input" />
        </div>
      </div>
      <div className="flex md:space-x-4 w-full flex-col md:flex-row">
        <div className="w-full form-control">
          <label className="form-label">Attention :</label>
          <input type="text" className="form-input" />
        </div>
      </div>
      <div className="flex md:space-x-4 w-full flex-col md:flex-row gap-4 md:gap-0">
        <div className="w-full md:w-2/4 form-control">
          <label className="form-label">Address 1 :</label>
          <input type="text" className="form-input" />
        </div>
        <div className="w-full md:w-2/4 form-control">
          <label className="form-label">Address 2 :</label>
          <input type="text" className="form-input" />
        </div>
      </div>
      <div className="flex md:space-x-4 w-full flex-col md:flex-row gap-4 md:gap-0">
        <div className="w-full md:w-2/4 form-control">
          <label className="form-label">City :</label>
          <input type="text" className="form-input" />
        </div>
        <div className="w-full md:w-2/4 form-control">
          <label className="form-label">Postal Code :</label>
          <input type="text" className="form-input" />
        </div>
      </div>
      <div className="flex md:space-x-4 w-full flex-col md:flex-row gap-4 md:gap-0">
        <div className="w-full md:w-2/4 form-control">
          <label className="form-label">State :</label>
          <input type="text" className="form-input" />
        </div>
        <div className="w-full md:w-2/4 form-control">
          <label className="form-label">Country :</label>
          <CustomSelect
            options={countryOptions}
            value={country}
            onChange={setCountry}
            placeholder="Select Country"
          />  
        </div>
      </div>
      <div className="flex md:space-x-4 w-full flex-col md:flex-row gap-4 md:gap-0">
        <div className="w-full md:w-1/2 form-control">
          <label className="form-label">Phone :</label>
          <input type="tel" className="form-input" />
        </div>
        <div className="w-full md:w-1/2 form-control">
          <label className="form-label">Email Address :</label>
          <input type="email" className="form-input" />
        </div>
      </div>
    </form>
  );
};

export default FormDetails;
