import { exportToExcel } from '@lib/utils/exportToExcel';

export const CommissionReport = () => {
    const data = [
        {
            ReferenceID: "MYH00665",
            CustomerName: "Joshua Ewinggg",
            JobAddress: "91 Hague L In numquam proident, Ex qui quia aut aute, VIC, 2075",
            Assignee: "Kishan",
            ReferralPartner: "",
            SalesPerson: "",

            OtherComm: "",
            Total: "20000",
            NetComm: "20000",

            Name1: "Kishan",
            ToBePaid1: "20000",
            ExpectedDate1: "02-10-2025",
            Paid1: "",
            PaidDate1: "",

            Name2: "",
            ToBePaid2: "",
            ExpectedDate2: "",
            Paid2: "",
            PaidDate2: "",

            ToBeReceived: "20000",
            Received: "0",
            ToBePaidFinal: "20000",
            PaidFinal: "",
            Balance: "0",
            Actual: "",
            ReceivedFinal: "0"
        },

        {
            ReferenceID: "MYH00656",
            CustomerName: "Jacob",
            JobAddress: "Lot 28 Ballarat Street, Epping, VIC, 3039",
            Assignee: "Murthy Muthuswamy",
            ReferralPartner: "",
            SalesPerson: "",

            OtherComm: "15000",
            Total: "35000",
            NetComm: "28000",

            Name1: "Murthy Muthuswamy",
            ToBePaid1: "15000",
            ExpectedDate1: "30-09-2025",
            Paid1: "",
            PaidDate1: "",

            Name2: "Murthy Muthuswamy",
            ToBePaid2: "20000",
            ExpectedDate2: "",
            Paid2: "7000",
            PaidDate2: "30-09-2025",

            ToBeReceived: "35000",
            Received: "7000",
            ToBePaidFinal: "28000",
            PaidFinal: "",
            Balance: "-7000",
            Actual: "",
            ReceivedFinal: "7000"
        },

        {
            ReferenceID: "MYH00654",
            CustomerName: "Vamshi",
            JobAddress: "Lot 987, 1 KINGS AVENUE, FRANKSTON, VIC, 7890",
            Assignee: "Vamshi",
            ReferralPartner: "",
            SalesPerson: "",

            OtherComm: "15000",
            Total: "35000",
            NetComm: "35000",

            Name1: "Vamshi",
            ToBePaid1: "15000",
            ExpectedDate1: "",
            Paid1: "",
            PaidDate1: "",

            Name2: "Vamshi",
            ToBePaid2: "20000",
            ExpectedDate2: "",
            Paid2: "",
            PaidDate2: "",

            ToBeReceived: "35000",
            Received: "0",
            ToBePaidFinal: "35000",
            PaidFinal: "",
            Balance: "0",
            Actual: "",
            ReceivedFinal: "0"
        },

        {
            ReferenceID: "MYH00637",
            CustomerName: "John Wick",
            JobAddress: "Suite 10, 45 Tallis Circuit, Truganina, VIC, 3029",
            Assignee: "Murthy Muthuswamy",
            ReferralPartner: "Adam",
            SalesPerson: "",

            OtherComm: "15000",
            Total: "35000",
            NetComm: "30000",

            Name1: "Adam",
            ToBePaid1: "15000",
            ExpectedDate1: "",
            Paid1: "5000",
            PaidDate1: "24-09-2025",

            Name2: "Murthy Muthuswamy",
            ToBePaid2: "20000",
            ExpectedDate2: "",
            Paid2: "",
            PaidDate2: "",

            ToBeReceived: "35000",
            Received: "5000",
            ToBePaidFinal: "30000",
            PaidFinal: "",
            Balance: "-5000",
            Actual: "",
            ReceivedFinal: "5000"
        },

        {
            ReferenceID: "MYH00657",
            CustomerName: "Mat",
            JobAddress: "Lot 67 Melbourne Rd, Epping, VIC, 3030",
            Assignee: "Murthy Muthuswamy",
            ReferralPartner: "",
            SalesPerson: "",

            OtherComm: "",
            Total: "20000",
            NetComm: "20000",

            Name1: "Murthy Muthuswamy",
            ToBePaid1: "20000",
            ExpectedDate1: "",
            Paid1: "",
            PaidDate1: "",

            Name2: "",
            ToBePaid2: "",
            ExpectedDate2: "",
            Paid2: "",
            PaidDate2: "",

            ToBeReceived: "20000",
            Received: "0",
            ToBePaidFinal: "20000",
            PaidFinal: "",
            Balance: "0",
            Actual: "",
            ReceivedFinal: "0"
        }
    ];


    const column = {
        LeadInfo: {
            label: 'Lead Info',
            color: 'FF0023BD',
            children: [
                { key: 'ReferenceID', label: 'Reference ID' },
                { key: 'CustomerName', label: 'Customer Name' },
                { key: 'JobAddress', label: 'Job Address' },
                { key: 'Assignee', label: 'Assignee' },
                { key: 'ReferralPartner', label: 'Referral Partner' },
                { key: 'SalesPerson', label: 'Sales Person' },
            ],
        },

        CommissionSummary: {
            label: 'Commission Summary',
            color: 'FF0023BD',
            children: [
                { key: 'OtherComm', label: 'Other Comm' },
                { key: 'Total', label: 'Total' },
                { key: 'NetComm', label: 'Net Comm' },
            ],
        },

        Payment1: {
            label: 'Payment 1',
            color: 'FF0023BD',
            children: [
                { key: 'Name1', label: 'Name' },
                { key: 'ToBePaid1', label: 'To be Paid' },
                { key: 'ExpectedDate1', label: 'Expected Date' },
                { key: 'Paid1', label: 'Paid' },
                { key: 'PaidDate1', label: 'Paid Date' },
            ],
        },

        Payment2: {
            label: 'Payment 2',
            color: 'FF0023BD',
            children: [
                { key: 'Name2', label: 'Name' },
                { key: 'ToBePaid2', label: 'To be Paid' },
                { key: 'ExpectedDate2', label: 'Expected Date' },
                { key: 'Paid2', label: 'Paid' },
                { key: 'PaidDate2', label: 'Paid Date' },
            ],
        },

        Summary: {
            label: 'Summary',
            color: 'FF0023BD',
            children: [
                { key: 'ToBeReceived', label: 'To be Received' },
                { key: 'Received', label: 'Received' },
                { key: 'ToBePaidFinal', label: 'To be Paid' },
                { key: 'PaidFinal', label: 'Paid' },
                { key: 'Balance', label: 'Balance' },
                { key: 'Actual', label: 'Actual' },
                { key: 'ReceivedFinal', label: 'Received' },
            ],
        },
    };

    exportToExcel({
        data: data,
        fileName: 'My Home - Commission Report',
        sheetName: 'My Home - Commission Report',
        columnHeaders: column,
        title: "Commission Report - My Home"
    });
};
