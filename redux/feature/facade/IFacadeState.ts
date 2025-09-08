export interface IFacadeState {
    facadeId: string;
    builderId: string;
    name: string;
    image: string;
    cost: number;
    dwellingTypeId: string;
    standard: boolean;
    upgrade: boolean;
    createdAt: string;
    updatedAt: string;
    dwellingTypeName: string;
}

export interface CreateFacadeState {
    name: string;
    image: string;
    dwelling_type: string;
    standard: boolean;
    upgrade: boolean;
}
