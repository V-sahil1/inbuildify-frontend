import { IconPlus, IconSearch } from '@tabler/icons-react';
import { Button, Checkbox, DatePicker, Form, Input, Switch, Upload } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MailSendModal from '../common/Models/MailSendModal';
import BulkBookModel from './BulkBookModel';
import CostManageModal from './CostManageModal';
import ConstructionChecklistModal from './ConstructionChecklistModal';
import ConstructionChecklistItem from './ConstructionChecklistItem';
import { UpdateStatusDrawer } from './UpdateStatusDrawer';
import { OHShistoryDrawer } from './OHShistoryDrawer';
import { useRouter } from 'next/router';
import { usePathname, useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';
import { ConfirmationContentModal } from '../common/ConfirmationContentModal';
import TimelineActionsBar from '../common/TimeLineComponents/TimelineActionsBar';
import InspectionCheckListDrawer from './InspectionCheckListDrawer';

const ConstructionBaseStage = ({ setCurrent, id }) => {
  const [actionType, setActionType] = useState('');
  const [inspectionOpen, setIsInspectionOpen] = useState(false);
  const [sendEmailOpen, setsendEmailOpen] = useState(false);
  const [checkOpen, setCheckOpen] = useState(false);
  const [defectOpen, setDefectOpen] = useState(false);
  const [finalConfirmationOpen, setfinalConfirmation] = useState(false);
  const [checkItems, setcheckItems] = useState<{ values: any; isDefect: Boolean }[]>([]);
  const [checkSupplierItems, setSuppliercheckItems] = useState([]);
  const [form] = Form.useForm();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const actionButton = [
    'Claim',
    'Bulk Book',
    'Manage Cost',
    'Update Status',
    'OH&S',
    'Inspection',
    'Move to Next Page',
  ];

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

  type FilterType = 'all' | 'pending' | 'completed' | 'notApplicable';
  const [activeFilter, setActiveFilter] = useState<{
    type: FilterType;
    label: string;
    count?: number;
  }>({ type: 'all', label: 'All' });

  const filterOptions: Array<{
    type: FilterType;
    label: string;
  }> = [
      { type: 'all', label: 'All' },
      { type: 'pending', label: 'Pending' },
      { type: 'completed', label: 'Completed' },
      { type: 'notApplicable', label: 'Not Applicable' },
    ];
  const handleFilterTabChange = (selectedType: string) => {
    console.log('Selected filter:', selectedType);
    setActiveFilter(filterOptions.find(f => f.type === selectedType) || activeFilter);
    handleFilterChange({ ...filters, checklistFilter: selectedType });
  };
  useEffect(() => {
    const fetchConstructionBaseStageData = () => {
      //   call fetch api for fetchConsrructionbase stage data
    };
    fetchConstructionBaseStageData();
  }, []);

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
  function handleEditCheckStatus(checklist) { }

  function handleAddChecklist(values) {
    setcheckItems(prev => [...prev, { values: values, isDefect: false }]);
    setCheckOpen(false);
  }

  function handleAddDefectChecklist(values) {
    setcheckItems(prev => [...prev, { values: values, isDefect: true }]);
    setDefectOpen(false);
  }

  function handleSubmit(values) {
    setSuppliercheckItems(values);
  }

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
    console.log(values);
    setActionType(null);
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
          <div>
            <TimelineActionsBar
              tabs={filterOptions.map(f => ({ type: f.type, label: f.label }))}
              activeTab={activeFilter.type}
              onTabChange={handleFilterTabChange}
              isActionShow={false}
            />
          </div>
          <div className="flex items-center justify-end gap-1">
            {actionButton.map(btn => (
              <Button
                size="small"
                type="primary"
                className="text-xs"
                onClick={() => setActionType(btn)}
              >
                {btn}
              </Button>
            ))}
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
      {/* in previous youtube video this drawer is present but in current video this doesn't */}
      <InspectionCheckListDrawer
        open={actionType === 'Inspection'}
        onClose={() => setActionType(null)}
      />
      <MailSendModal
        open={sendEmailOpen}
        onCancel={() => setsendEmailOpen(false)}
        onSend={() => {
          setsendEmailOpen(false);
        }}
      />
      <BulkBookModel
        title="Bulk Book"
        open={actionType === 'Bulk Book'}
        onCancel={() => setActionType(null)}
        checkItems={checkItems}
        checkSupplierItems={checkSupplierItems}
        editCheckStatus={handleEditCheckStatus}
      />
      <CostManageModal
        title="Manage Cost"
        open={actionType === 'Manage Cost'}
        onCancel={() => setActionType(null)}
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
      <MailSendModal
        title="Claim Stage Notification"
        open={actionType === 'Claim'}
        onCancel={() => setActionType(null)}
        onSend={handleClaimSubmit}
        attachFile={true}
        initialValue={{
          to: ['abc', 'bhb'],
          subject: 'hello',
          content: 'hellooooo',
        }} />
      <UpdateStatusDrawer
        open={actionType === 'Update Status'}
        onCancel={() => setActionType(null)}
        checkItems={checkItems}
      />
      <OHShistoryDrawer open={actionType === 'OH&S'} onCancel={() => setActionType(null)} />
      <ConfirmationContentModal
        title="Confirmation"
        open={finalConfirmationOpen}
        onClose={() => setActionType(null)}
        onSubmit={() => {
          setfinalConfirmation(false);
        }}
        okText="Complete Job"
        content={finalConfirmationContent}
      />
    </div>
  );
};

export default ConstructionBaseStage;
