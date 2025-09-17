export type Package = {
  packageId: string;
  name: string;
  builderId: string;
  categoryItems: {
    id: string;
    desc: string;
    price: string;
  }[];
  amount: string;
  dwellingTypeId: string;
  rangeId: string;
  range: string;
  dwelling: string;
  createdAt: string;
  updatedAt: string;
};
