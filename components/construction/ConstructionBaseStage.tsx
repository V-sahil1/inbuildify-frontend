import { IconPlus, IconSearch } from '@tabler/icons-react';
import { Button, Checkbox, DatePicker, Form, Input, MenuProps, Switch, Upload } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import InspectionCheckListDrawer from './InspectionCheckListDrawer';
import MailSendModal from '../common/Models/MailSendModal';
import BulkBookModel from './BulkBookModel';
import CostManageModal from './CostManageModal';
import ConstructionChecklistModal from './ConstructionChecklistModal';
import ConstructionChecklistItem from './ConstructionChecklistItem';
import EmailContent from './EmailContent';
import { UpdateStatusDrawer } from './UpdateStatusDrawer';
import { OHShistoryDrawer } from './OHShistoryDrawer';
import { useRouter } from 'next/router';
import { usePathname, useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';
import { ConfirmationContentModal } from '../common/ConfirmationContentModal';

const ConstructionBaseStage = ({ setCurrent }) => {
  const [inspectionOpen, setIsInspectionOpen] = useState(false);
  const [sendEmailOpen, setsendEmailOpen] = useState(false);
  const [bulkModelOpen, setBulkModelOpen] = useState(false);
  const [costManageOpen, setCostManageOpen] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);
  const [checkOpen, setCheckOpen] = useState(false);
  const [defectOpen, setDefectOpen] = useState(false);
  const [ohsHistoryOpen, setOHShistoryOpen] = useState(false);
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const [finalConfirmationOpen, setfinalConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [checkItems, setcheckItems] = useState<{ values: any; isDefect: Boolean }[]>([]);
  const [checkSupplierItems, setSuppliercheckItems] = useState([]);
  const [form] = Form.useForm();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<{
    checklistFilter: string;
    checklist: string;
  }>({
    checklistFilter: searchParams.get('checklistFilter') || '',
    checklist: searchParams.get('checklist') || '',
  });
  const debouncedUpdateURL = useMemo(
    () =>
      debounce((newFilters: typeof filters) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newFilters).forEach(([key, value]) => {
          if (value) {
            params.set(key, value.toString());
          } else {
            params.delete(key);
          }
        });
        router.replace(`${pathname}?${params.toString()}`);
      }, 500), // 500ms debounce delay
    [pathname, router, searchParams]
  );

  const handleFilterChange = useCallback(
    (updates: Partial<typeof filters>) => {
      setFilters(prev => {
        const newFilters = { ...prev, ...updates };
        debouncedUpdateURL(newFilters);
        return newFilters;
      });
    },
    [debouncedUpdateURL]
  );

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  useEffect(() => {
    const fetchConstructionBaseStageData = () => {
      //   call fetch api for fetchConsrructionbase stage data
    };
    fetchConstructionBaseStageData();
  }, []);
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '1st menu item',
    },
    {
      key: '2',
      label: '2nd menu item',
    },
  ];

  const filterButtons = ['All', 'Pending', 'Completed', 'Not Applicable'];
  function handleEditChecklist(index, editedValues) {
    setcheckItems(prev =>
      prev.map((item, i) => (i === index ? { ...item, values: editedValues } : item))
    );

    const formValues = form.getFieldsValue();
    if (formValues.checklist) {
      formValues.checklist[index] = {
        ...formValues.checklist[index],
        ...editedValues,
      };
      form.setFieldsValue({ checklist: formValues.checklist });
    }
  }
  function handleEditCheckStatus(checklist) {}

  function handleAddChecklist(values) {
    setcheckItems(prev => [...prev, { values: values, isDefect: false }]);
    setCheckOpen(false);
    // console.log('checklist submit', values);
  }

  function handleAddDefectChecklist(values) {
    setcheckItems(prev => [...prev, { values: values, isDefect: true }]);
    setDefectOpen(false);
    // console.log('defect checklist submit', values);
  }

  function handleSubmit(values) {
    setSuppliercheckItems(values);
    console.log('submitttt', values);
  }
  console.log('suppliercheck', checkSupplierItems);
  console.log('checklist', checkItems);
  const finalConfirmationContent = (
    <div>
      <p>Are you sure you want to mark this construction job as completed?</p>
      <p className="text-red-500">Please provide handover date to complete the construction</p>
      <div>
        <p>PCI Date</p>
        <DatePicker className="!pl-0 text-blue" suffixIcon={null} allowClear={true} />
      </div>
      <div className="flex justify-between">
        <div>
          <p>Occupancy Permit Date</p>
          <DatePicker className="!pl-0 text-blue" suffixIcon={null} allowClear={true} />
        </div>
        <div>
          <p>Occupancy Permit Document</p>
          <Upload>
            <Button>Upload</Button>
          </Upload>
        </div>
      </div>
      <div>
        <p>Handover Date</p>
        <DatePicker className="!pl-0 text-blue" suffixIcon={null} allowClear={true} />
      </div>
    </div>
  );

  function handleClaimSubmit(values) {
    console.log('claim', values);
  }
  return (
    <div className="bg-card-color !mt-0 p-3">
      <Form form={form} onFinish={handleSubmit}>
        <div>
          Private Inspector : Murthy{' '}
          <Button
            type="primary"
            size="small"
            className="text-xs"
            onClick={() => {
              setsendEmailOpen(true);
            }}
          >
            Notify me
          </Button>
        </div>
        <div className="flex justify-between mt-2">
          <div className="flex gap-3 items-center">
            <Switch size="small" />
            Simple View
          </div>
          <div className="rounded-2xl flex gap-2 p-1 border border-primary">
            {filterButtons.map(btn => (
              <Button
                className={`rounded-xl text-xs ${
                  activeTab === btn ? 'bg-primary' : 'bg-card-color text-primary'
                } `}
                type="primary"
                size="small"
                onClick={() => {
                  setActiveTab(btn);
                  handleFilterChange({ ...filters, checklistFilter: btn });
                }}
              >
                {btn}
              </Button>
            ))}
          </div>
          <div className="flex items-center justify-end gap-1">
            {/* <p className="text-xs">(Last Claim on:24-03-2022)</p> */}
            <Button
              size="small"
              type="primary"
              className="text-xs"
              onClick={() => setClaimOpen(true)}
            >
              Claim
            </Button>
            <Button
              size="small"
              type="primary"
              className="text-xs"
              onClick={() => setBulkModelOpen(true)}
            >
              Bulk Book
            </Button>
            <Button
              size="small"
              type="primary"
              className="text-xs"
              onClick={() => setCostManageOpen(true)}
            >
              Manage Cost
            </Button>
            <Button
              size="small"
              type="primary"
              className="text-xs"
              onClick={() => setUpdateStatusOpen(true)}
            >
              Update Status
            </Button>
            {/* <Button size="small" type="primary" className="text-xs" onClick={() => { setIsInspectionOpen(true) }}>Inspection</Button> */}
            <Button
              size="small"
              type="primary"
              className="text-xs"
              onClick={() => setOHShistoryOpen(true)}
            >
              OH&S
            </Button>
            <Button
              size="small"
              type="primary"
              className="text-xs"
              onClick={() => {
                // setCurrent(prev => prev + 1);
                setfinalConfirmation(true);
              }}
            >
              Move to Next Page
            </Button>
          </div>
        </div>

        <div>
          {/* table */}
          <div className="w-full overflow-y-auto mt-2 " style={{ scrollbarWidth: 'none' }}>
            <div className="table w-full border-collapse">
              {/* Table Head */}
              <div className="table-header-group bg-card-color text-sm font-medium text-font-color border-b border-gray-200">
                <div className="table-row">
                  <div className="table-cell text-center p-3 w-[130px]">
                    <Input
                      addonBefore={<IconSearch size={15} />}
                      onChange={e =>
                        handleFilterChange({
                          ...filters,
                          checklist: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="table-cell text-left p-3 w-[130px] ">Supplier</div>
                  <div className="table-cell text-left p-3 w-[130px] ">Start</div>
                  <div className="table-cell text-left p-3 w-[130px] ">Finish</div>
                  <div className="table-cell text-center p-3 w-[130px] ">
                    <div className="flex gap-2">
                      <Checkbox /> <p>Complete</p>
                    </div>
                  </div>
                  <div className="table-cell text-center p-3 w-[130px] ">
                    <div
                      className="flex items-center gap-1 text-blue cursor-pointer"
                      onClick={() => setCheckOpen(true)}
                    >
                      <div className="rounded-full w-3 h-3 bg-blue text-white ">
                        <IconPlus size={12} />
                      </div>
                      Checklist
                    </div>
                  </div>
                  <div
                    className="table-cell text-center p-3 w-[130px] "
                    onClick={() => setDefectOpen(true)}
                  >
                    <div className="flex items-center gap-1 text-blue cursor-pointer">
                      <div className="rounded-full w-3 h-3 bg-blue text-white ">
                        <IconPlus size={12} />
                      </div>
                      Defect
                    </div>
                  </div>
                </div>
              </div>
              {/* Table Body */}
              {checkItems.length > 0 &&
                checkItems.map((item, index) => (
                  <ConstructionChecklistItem
                    key={index}
                    values={item.values}
                    index={index}
                    form={form}
                    isDefect={item.isDefect}
                    onSubmit={handleSubmit}
                    onEditChecklist={handleEditChecklist}
                  />
                ))}
            </div>
          </div>
        </div>
      </Form>
      <InspectionCheckListDrawer open={inspectionOpen} onClose={() => setIsInspectionOpen(false)} />
      <MailSendModal
        open={sendEmailOpen}
        onCancel={() => setsendEmailOpen(false)}
        onSend={() => {}}
      />
      <BulkBookModel
        title="Bulk Book"
        open={bulkModelOpen}
        onCancel={() => setBulkModelOpen(false)}
        checkItems={checkItems}
        checkSupplierItems={checkSupplierItems}
        editCheckStatus={handleEditCheckStatus}
      />
      <CostManageModal
        title="Manage Cost"
        open={costManageOpen}
        onCancel={() => setCostManageOpen(false)}
      />
      <ConstructionChecklistModal
        title={defectOpen ? 'New Defect Checklist' : 'New Checklist'}
        open={checkOpen || defectOpen}
        onCancel={() => {
          defectOpen ? setDefectOpen(false) : setCheckOpen(false);
        }}
        onSubmit={defectOpen ? handleAddDefectChecklist : handleAddChecklist}
        isDefect={defectOpen}
        initialValues={{
          checklist: '',
          daterequired: false,
          noOfDays: '',
          sort: '',
          supplier: false,
          notify: false,
          claim: false,
          milestone: false,
        }}
      />
      {/* <ConstructionChecklistModal title='New Defect Checklist' open={defectOpen} onCancel={()=>setDefectOpen(false)} onSubmit={handleAddDefectChecklist} isDefect={true}/> */}
      <EmailContent
        title="Claim Stage Notification"
        open={claimOpen}
        onCancel={() => setClaimOpen(false)}
        onSubmit={handleClaimSubmit}
        initialValues={{
          to: ['abc', 'bhb'],
          subject: 'hello',
          message: 'hellooooo',
        }}
      />
      <UpdateStatusDrawer
        open={updateStatusOpen}
        onCancel={() => setUpdateStatusOpen(false)}
        checkItems={checkItems}
      />
      <OHShistoryDrawer open={ohsHistoryOpen} onCancel={() => setOHShistoryOpen(false)} />
      <ConfirmationContentModal
        title="Confirmation"
        open={finalConfirmationOpen}
        onClose={() => setfinalConfirmation(false)}
        onSubmit={() => {}}
        okText="Complete Job"
        content={finalConfirmationContent}
      />
    </div>
  );
};

export default ConstructionBaseStage;
