import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule, PaginationModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useMemo, useState } from 'react';
import { IconCaretDownFilled } from '@tabler/icons-react';
import { themeBalham } from 'ag-grid-community';

// Register required module
ModuleRegistry.registerModules([PaginationModule, ClientSideRowModelModule]);

type OrderRow = {
  index: number;
  accountNumber: string;
  orderId: string;
  receiptDate: string;
  orderStage: string;
  shipTo: string;
  carrierService: string;
  poNumber: string;
};

const OrderGrid = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };
  const [rowData] = useState<OrderRow[]>([
    {
      index: 471,
      accountNumber: '10501',
      orderId: 'QUDVSEGWQ0IHUZS...',
      receiptDate: '05/23/2025 4:27PM',
      orderStage: 'Order Received',
      shipTo: 'Company1 | Jane Doe, San Francisco, CA 94105 - US',
      carrierService: 'UPS - GROUND',
      poNumber: '',
    },
    {
      index: 472,
      accountNumber: '10502',
      orderId: 'ZXCASDQWE123456...',
      receiptDate: '05/23/2025 5:15PM',
      orderStage: 'Processing',
      shipTo: 'Company2 | John Smith, Austin, TX 73301 - US',
      carrierService: 'FedEx - 2DAY',
      poNumber: 'PO1001',
    },
    {
      index: 473,
      accountNumber: '10503',
      orderId: 'LKJHGFDSA908765...',
      receiptDate: '05/24/2025 9:30AM',
      orderStage: 'Shipped',
      shipTo: 'Company3 | Alice Johnson, Denver, CO 80203 - US',
      carrierService: 'UPS - NEXT DAY',
      poNumber: 'PO1002',
    },
    {
      index: 474,
      accountNumber: '10504',
      orderId: 'MNBVCXZLKJ123456...',
      receiptDate: '05/24/2025 10:45AM',
      orderStage: 'Delivered',
      shipTo: 'Company4 | Bob Brown, Miami, FL 33101 - US',
      carrierService: 'FedEx - GROUND',
      poNumber: 'PO1003',
    },
    {
      index: 475,
      accountNumber: '10505',
      orderId: 'QAZWSXEDC123456...',
      receiptDate: '05/25/2025 2:00PM',
      orderStage: 'Cancelled',
      shipTo: 'Company5 | Carol White, Seattle, WA 98101 - US',
      carrierService: 'USPS - PRIORITY',
      poNumber: 'PO1004',
    },
    {
      index: 476,
      accountNumber: '10506',
      orderId: 'PLMOKNJIU987654...',
      receiptDate: '05/25/2025 4:20PM',
      orderStage: 'Returned',
      shipTo: 'Company6 | David Black, Boston, MA 02101 - US',
      carrierService: 'UPS - GROUND',
      poNumber: 'PO1005',
    },
    {
      index: 477,
      accountNumber: '10507',
      orderId: 'UYTREWQASDF0987...',
      receiptDate: '05/26/2025 8:10AM',
      orderStage: 'Order Received',
      shipTo: 'Company7 | Eve Green, Chicago, IL 60601 - US',
      carrierService: 'FedEx - OVERNIGHT',
      poNumber: '',
    },
    {
      index: 478,
      accountNumber: '10508',
      orderId: 'GHJKLZXCVB123456...',
      receiptDate: '05/26/2025 9:00AM',
      orderStage: 'Processing',
      shipTo: 'Company8 | Frank Grey, Dallas, TX 75201 - US',
      carrierService: 'UPS - NEXT DAY',
      poNumber: 'PO1006',
    },
    {
      index: 479,
      accountNumber: '10509',
      orderId: 'BNMASDFGHJ098765...',
      receiptDate: '05/26/2025 11:15AM',
      orderStage: 'Shipped',
      shipTo: 'Company9 | Grace Blue, Portland, OR 97201 - US',
      carrierService: 'FedEx - 2DAY',
      poNumber: 'PO1007',
    },
    {
      index: 480,
      accountNumber: '10510',
      orderId: 'CVBNMKLOIUY12345...',
      receiptDate: '05/26/2025 12:30PM',
      orderStage: 'Delivered',
      shipTo: 'Company10 | Henry Silver, Atlanta, GA 30301 - US',
      carrierService: 'USPS - PRIORITY',
      poNumber: 'PO1008',
    },
    {
      index: 481,
      accountNumber: '10511',
      orderId: 'ZXCVBNMASD123456...',
      receiptDate: '05/27/2025 9:00AM',
      orderStage: 'Order Received',
      shipTo: 'Company11 | Ivy Brown, New York, NY 10001 - US',
      carrierService: 'UPS - GROUND',
      poNumber: 'PO1009',
    },
    {
      index: 482,
      accountNumber: '10512',
      orderId: 'MKOIJUHYGT987654...',
      receiptDate: '05/27/2025 10:15AM',
      orderStage: 'Processing',
      shipTo: 'Company12 | Jack White, Phoenix, AZ 85001 - US',
      carrierService: 'FedEx - 2DAY',
      poNumber: 'PO1010',
    },
    {
      index: 483,
      accountNumber: '10513',
      orderId: 'PLKJHGFDSA876543...',
      receiptDate: '05/27/2025 11:30AM',
      orderStage: 'Shipped',
      shipTo: 'Company13 | Karen Grey, Houston, TX 77001 - US',
      carrierService: 'USPS - PRIORITY',
      poNumber: 'PO1011',
    },
    {
      index: 484,
      accountNumber: '10514',
      orderId: 'QWERTYUIOP123456...',
      receiptDate: '05/27/2025 1:45PM',
      orderStage: 'Delivered',
      shipTo: 'Company14 | Leo Black, Philadelphia, PA 19019 - US',
      carrierService: 'FedEx - OVERNIGHT',
      poNumber: 'PO1012',
    },
    {
      index: 485,
      accountNumber: '10515',
      orderId: 'ASDFGHJKL098765...',
      receiptDate: '05/27/2025 3:00PM',
      orderStage: 'Cancelled',
      shipTo: 'Company15 | Maya Rose, Detroit, MI 48201 - US',
      carrierService: 'UPS - NEXT DAY',
      poNumber: '',
    },
    {
      index: 486,
      accountNumber: '10516',
      orderId: 'ZXCASDQWE789123...',
      receiptDate: '05/27/2025 4:20PM',
      orderStage: 'Returned',
      shipTo: 'Company16 | Neil Scott, Charlotte, NC 28201 - US',
      carrierService: 'USPS - PRIORITY',
      poNumber: 'PO1013',
    },
    {
      index: 487,
      accountNumber: '10517',
      orderId: 'QAZWSXEDC147258...',
      receiptDate: '05/27/2025 5:10PM',
      orderStage: 'Processing',
      shipTo: 'Company17 | Olivia Adams, Columbus, OH 43004 - US',
      carrierService: 'FedEx - GROUND',
      poNumber: '',
    },
    {
      index: 488,
      accountNumber: '10518',
      orderId: 'LKJHGFDSAQAZ123...',
      receiptDate: '05/28/2025 8:00AM',
      orderStage: 'Order Received',
      shipTo: 'Company18 | Peter Clark, Indianapolis, IN 46201 - US',
      carrierService: 'UPS - GROUND',
      poNumber: 'PO1014',
    },
    {
      index: 489,
      accountNumber: '10519',
      orderId: 'MNBVCXZLKJ456789...',
      receiptDate: '05/28/2025 9:30AM',
      orderStage: 'Shipped',
      shipTo: 'Company19 | Quinn Brown, San Diego, CA 92101 - US',
      carrierService: 'FedEx - 2DAY',
      poNumber: 'PO1015',
    },
    {
      index: 490,
      accountNumber: '10520',
      orderId: 'UYTREWQASDFQWE...',
      receiptDate: '05/28/2025 11:00AM',
      orderStage: 'Delivered',
      shipTo: 'Company20 | Rachel Smith, Jacksonville, FL 32099 - US',
      carrierService: 'USPS - PRIORITY',
      poNumber: 'PO1016',
    },
    {
      index: 491,
      accountNumber: '10521',
      orderId: 'GHJKLZXCVB321654...',
      receiptDate: '05/28/2025 1:00PM',
      orderStage: 'Order Received',
      shipTo: 'Company21 | Steve Martin, San Jose, CA 95101 - US',
      carrierService: 'FedEx - OVERNIGHT',
      poNumber: '',
    },
    {
      index: 492,
      accountNumber: '10522',
      orderId: 'BNMASDFGHJ654321...',
      receiptDate: '05/28/2025 2:30PM',
      orderStage: 'Processing',
      shipTo: 'Company22 | Tina Harris, Nashville, TN 37201 - US',
      carrierService: 'UPS - NEXT DAY',
      poNumber: 'PO1017',
    },
    {
      index: 493,
      accountNumber: '10523',
      orderId: 'CVBNMKLOIUY09876...',
      receiptDate: '05/28/2025 4:15PM',
      orderStage: 'Cancelled',
      shipTo: 'Company23 | Uma Stone, Milwaukee, WI 53201 - US',
      carrierService: 'FedEx - GROUND',
      poNumber: 'PO1018',
    },
    {
      index: 494,
      accountNumber: '10524',
      orderId: 'XCVBNMASDF987654...',
      receiptDate: '05/28/2025 5:45PM',
      orderStage: 'Returned',
      shipTo: 'Company24 | Victor Long, Kansas City, MO 64101 - US',
      carrierService: 'USPS - PRIORITY',
      poNumber: 'PO1019',
    },
    {
      index: 495,
      accountNumber: '10525',
      orderId: 'LOKIUJMHGTRE234...',
      receiptDate: '05/29/2025 9:30AM',
      orderStage: 'Shipped',
      shipTo: 'Company25 | Wendy Turner, Las Vegas, NV 88901 - US',
      carrierService: 'FedEx - OVERNIGHT',
      poNumber: 'PO1020',
    },
  ]);

  const columnDefs: ColDef<OrderRow>[] = useMemo(
    () => [
      { headerName: '#', field: 'index', width: 70, sortable: false },
      {
        headerName: 'ACCT #',
        field: 'accountNumber',
        width: 100,
        sortable: false,
      },
      {
        headerName: 'ORDER #',
        field: 'orderId',
        width: 180,
        cellRendererFramework: params => (
          <a href="#" className="text-blue-600 hover:underline">
            {params.value}
          </a>
        ),
        sortable: true,
        floatingFilter: true,
      },
      {
        headerName: 'RECEIPT DATE',
        field: 'receiptDate',
        width: 160,
        sortable: false,
      },
      {
        headerName: 'ORDER STAGE',
        field: 'orderStage',
        width: 140,
        cellClass: 'text-red-600 font-bold',
        sortable: true,
      },
      { headerName: 'SHIP TO', field: 'shipTo', flex: 1, sortable: false },
      {
        headerName: 'CARRIER & SERVICE',
        field: 'carrierService',
        width: 150,
        sortable: false,
      },
      { headerName: 'PO #', field: 'poNumber', width: 120, sortable: false },
    ],
    []
  );

  const buttons = [
    { label: 'Warehouse', showOnMobile: true },
    { label: 'Account', showOnMobile: true },
    { label: 'Receipt Date', showOnMobile: true },
    { label: 'Channel', showOnMobile: true },
    { label: 'Destination', showOnMobile: true },
    { label: 'Order Date', showOnMobile: true },
  ];
  return (
    <div className="relative mt-4 mb-12 p-4 border border-dashed border-border-color rounded-xl">
      <span className="bg-body-color text-font-color-100 px-5 font-semibold absolute top-[-14px]">
        Orders :
      </span>
      <div className="flex flex-col gap-4">
        <div className="relative flex items-stretch gap-5 flex-wrap">
          {buttons.map(({ label, showOnMobile }) => (
            <div key={label} className="relative">
              <button
                onClick={() => toggleDropdown(label)}
                className={`ps-2 p-5 flex items-center gap-2 text-[14px]/[1] border border-grey rounded-md text-font-color transition-all hover:bg-grey hover:text-white ${
                  !showOnMobile ? 'md:flex hidden' : ''
                }`}
              >
                {label}
                <IconCaretDownFilled className="w-[16px] h-[16px]" />
              </button>

              {openDropdown === label && (
                <div className="absolute z-10 mt-2 w-[160px] bg-card-color border border-border-color rounded-md shadow-lg p-3">
                  {openDropdown === 'Receipt Date' || openDropdown === 'Order Date' ? (
                    <ul className="text-sm text-font-color">
                      <li className="hover:bg-gray-100 hover:text-primary px-2 py-1 rounded">
                        1 jan 2025
                      </li>
                      <li className="hover:bg-gray-100 hover:text-primary px-2 py-1 rounded">
                        2 jan 2025
                      </li>
                      <li className="hover:bg-gray-100 hover:text-primary px-2 py-1 rounded">
                        3 jan 2025
                      </li>
                    </ul>
                  ) : (
                    <ul className="text-sm text-font-color">
                      <li className="hover:bg-gray-100 hover:text-primary px-2 py-1 rounded">
                        {label} 1
                      </li>
                      <li className="hover:bg-gray-100 hover:text-primary px-2 py-1 rounded">
                        {label} 2
                      </li>
                      <li className="hover:bg-gray-100 hover:text-primary px-2 py-1 rounded">
                        {label} 3
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="ag-theme-alpine card bg-card-color rounded-xl overflow-hidden  border border-dashed border-border-color md:h-[calc(100dvh-348px)] h-[calc(100dvh-407px)]">
          <AgGridReact<OrderRow>
            theme={themeBalham}
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            rowHeight={50}
            headerHeight={50}
            defaultColDef={{
              cellClass: 'ag-cell-center',
            }}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            paginationPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderGrid;
