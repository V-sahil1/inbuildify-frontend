import { Item } from "../masterPriceList/iMasterPriceListState";

export interface Package {
    packageId: string;         
    name: string;               
    builderId: string;         
    Items: Item[];     
    amount: number;             
    createdAt: string;          
    updatedAt: string;          
}
  