import React from "react";

const associatedEntities = [
  'Lead',
  'Customer',
  'Contact',
  'Quotation',
  'Property',
  'ColorSelection',
  'Construction',
  'Job',
  'Commision',
  'Payment',
  'Task',
  'Workflow',
];

const AssociatedEntitiesList: React.FC = () => {
  return (
    <ul className="list-disc pl-6 space-y-1 text-primary">
      {associatedEntities.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
};

export default AssociatedEntitiesList;
