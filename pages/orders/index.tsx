import React from "react";
import OrderGrid from "@/components/common/OrderGrid";
import Breadcrumb from "@/components/common/Breadcrumb";

const index = () => {
  const breadcrumbItem = [
    {
      name: "Orders",
    },
    {
      name: "All Order",
    },
  ];
  return (
    <div className="md:px-6 sm:px-3 pt-4">
      <div className="container-fluid">
        <Breadcrumb breadcrumbItem={breadcrumbItem} />
        <OrderGrid />
      </div>
    </div>
  );
};

export default index;
