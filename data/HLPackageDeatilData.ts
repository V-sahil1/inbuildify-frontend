import { FormField } from "@/components/common/Models/ActionDialogModel";
import { Partner } from "@/components/job/jobDetail/comission/commissionDrawer";

export const lotdata = {
    address: 'LOT 507 Stirling, Tarneit, 3002',
    estate: 'Ambervue',
    stage: 'Stage 1',
    type: 'Regular',
    width: '16.00',
    depth: '28.00',
    total: '448.00'
}

export const initialValues = {
    range: 'Deluxe',
    dwellingType: 'Single Storey',
    template: 'template 1',
    contactName: 'rahul'
}

export const initialPartners: Partner[] = [
    {
        id: "1", type: "Sales Person", name: "Murthy Muthuswamy", stages: [
            { name: "5% Deposit", total: 5000, toBePaid: 5000, paid: 5000 },
            { name: "Base Stage", total: 5000, toBePaid: 3000, paid: 2000 },
            { name: "Lockup", total: 10000, toBePaid: 10000, paid: 0 },
        ]
    },
    {
        id: "2", type: "Referral Partner", name: "Referral Partner", stages: [
            { name: "5% Deposit", total: 5000, toBePaid: 5000, paid: 2000 },
            { name: "Base Stage", total: 5000, toBePaid: 5000, paid: 0 },
            { name: "Lockup Stage", total: 5000, toBePaid: 5000, paid: 0 },
        ]
    },
];

export const InclusinList = [
    { title: 'Tiles/Laminate flooring in living areas', group: 'Turnkey Inclusion' },
    { title: 'Tiles/Laminate flooring in living areas', group: 'Turnkey Inclusion' },
    { title: 'Tiles/Laminate flooring in living areas', group: 'Turnkey Inclusion' }
]

export const CustomSectionField: FormField[] = [
    { label: 'Attachment', name: 'attachment', type: 'image', extra: 'Custom Section Attachment will be attached along with HLPackage Pdf' }
]

export const templateOptions= [{ label: 'Template 1', value: 'template1' }, { label: 'Template 2', value: 'template2' }]