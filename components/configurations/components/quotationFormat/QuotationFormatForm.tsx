import React, { useEffect } from 'react';
import { Button, Table, Tabs, Typography, message } from 'antd';
import { useRouter } from 'next/router';
import QuotationFormatDetails from './QuotationFormatDetails';
import MasterSections from './MasterSections';
import { useQuotationSectionColumns } from '@/components/table-columns/quotationSectionColumns';
import { useCustomSectionColumns } from '@/components/table-columns/customSectionColumns';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import Loading from '@/components/common/Loading';
import {
  getCreateMasterFields,
  getCustomGroupFields,
  getSectionDetailsFields,
} from '@/components/formFields/quotationFormatFields';
import { useAppDispatch } from '@hooks/redux';
import { getQuotationFormatByIdThunk, createQuotationFormatMasterSectionThunk, createCustomSectionThunk, getCustomSectionByIdThunk } from '@redux/feature/quotation-format/quotationFormatThunk';
import { formDataGenerator } from '@lib/utils/formDataGenerator';

const { TabPane } = Tabs as any;

interface QuotationFormatFormProps {
  id?: string | string[];
}

const QuotationFormatForm: React.FC<QuotationFormatFormProps> = ({ id }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [quotationFormatData, setQuotationFormatData] = React.useState<any>(null);

  const { columns: quoteColumns, data: quoteSections } = useQuotationSectionColumns();

  const isCreate = !id;

  // Fetch quotation format by ID when navigating to detail page
  useEffect(() => {
    if (id) {
      dispatch(getQuotationFormatByIdThunk(id as string))
        .unwrap()
        .then((response) => {
          setQuotationFormatData(response);
        })
        .catch((error) => {
          console.error('Error fetching quotation format:', error);
        });
    }
  }, [id, dispatch]);

  const [activeTab, setActiveTab] = React.useState<'quote' | 'master' | 'custom'>('quote');
  const [activeModal, setActiveModal] = React.useState<
    'sectionDetails' | 'createMaster' | 'customGroup' | null
  >(null);
  const [customGroupLoading, setCustomGroupLoading] = React.useState(false);
  const [customSectionLoading, setCustomSectionLoading] = React.useState(false);
  const [customSectionData, setCustomSectionData] = React.useState<any[] | null>(null);

  const { columns: customColumns, data: customRows } = useCustomSectionColumns({
    data: customSectionData,
    setData: setCustomSectionData,
    quotationFormatId: quotationFormatData?.quotationFormatId ?? null,
  });

  const tabButtonLabel =
    activeTab === 'quote' ? 'Add section' : activeTab === 'master' ? 'Add Master' : 'Add New Group';

  const handleTabButtonClick = () => {
    if (activeTab === 'quote') {
      setActiveModal('sectionDetails');
    } else if (activeTab === 'master') {
      setActiveModal('createMaster');
    } else {
      setActiveModal('customGroup');
    }
  };

  // Fetch custom sections once when the Custom tab is activated
  const fetchAndSetCustomSections = async (qfId: string) => {
    try {
      setCustomSectionLoading(true);
      const res: any = await dispatch(getCustomSectionByIdThunk(qfId)).unwrap();
      const apiPayload = res?.data ?? res;
      const sections = apiPayload?.customSections ?? apiPayload?.data?.customSections ?? apiPayload;
      const arr = Array.isArray(sections) ? sections : sections ? [sections] : [];

      const rows = arr.map((s: any) => ({
        key: s.customSectionId ?? s.id ?? s.key,
        field: s.fieldName ?? '',
        fieldLabel: s.fieldLabel ?? '',
        isApplicable: s.isApplicable ?? false,
        groupField: s.groupField ?? false,
        parentField: s.parentField ?? '',
        sortOrder: s.sortOrder ?? 0,
        ...s,
      }));

      setCustomSectionData(rows);
    } catch (err) {
      console.error('Failed to load custom sections', err);
      message.error('Failed to load custom sections');
    } finally {
      setCustomSectionLoading(false);
    }
  };

  useEffect(() => {
    const shouldFetch = activeTab === 'custom' && quotationFormatData?.quotationFormatId && !customSectionData;
    if (!shouldFetch) return;
    fetchAndSetCustomSections(quotationFormatData.quotationFormatId as string);
  }, [activeTab, quotationFormatData, customSectionData, dispatch]);

  const handleCustomGroupCreate = async (values: any) => {
    try {
      setCustomGroupLoading(true);
      // Ensure quotation format exists
      const id = quotationFormatData?.quotationFormatId;
      if (!id) {
        message.error('Please save the quotation format before adding a custom group');
        setCustomGroupLoading(false);
        return;
      }

      // Build payload with defaults
      const payloadObj = {
        fieldName: values.fieldName,
        fieldLabel: values.fieldLabel,
        isApplicable: values.isApplicable ?? false,
        groupField: values.groupField ?? false,
        sortOrder: values.sortOrder ?? 0,
      };

      const formData = formDataGenerator(payloadObj);

      await dispatch(createCustomSectionThunk({ id, payload: formData })).unwrap();
      message.success('Custom group created successfully');

      // Refresh quotation format data and custom sections
      const refreshed = await dispatch(getQuotationFormatByIdThunk(id as string)).unwrap();
      setQuotationFormatData(refreshed);
      await fetchAndSetCustomSections(id as string);
      setActiveModal(null);
    } catch (error) {
      message.error(error || 'Failed to create custom group');
    } finally {
      setCustomGroupLoading(false);
    }
  }

  return (
    <div className="p-5 mx-4">
      <div className="flex items-center justify-between mb-2">
        <Typography.Title level={4} className="!mb-0">
          Quotation Format
        </Typography.Title>
        <div className="flex justify-between items-center text-danger gap-3">
          <span>
            Please note, digital sign file size can't exceed 10MB, so please compress the PDFs,
            Images before attach.
          </span>
          <div className="flex items-center gap-2">
            <Button onClick={() => router.push('/quotation-format')} type="primary">
              Go to Listing
            </Button>
          </div>
        </div>
      </div>

      <QuotationFormatDetails
        startInEdit={isCreate}
        quotationFormatData={quotationFormatData}
        onSaveSuccess={updatedData => setQuotationFormatData(updatedData)}
      />

      <Tabs
        defaultActiveKey="quote"
        type="card"
        size="large"
        tabBarStyle={{ margin: 0, marginRight: '10px' }}
        tabBarGutter={10}
        activeKey={activeTab}
        onChange={key => setActiveTab(key as 'quote' | 'master' | 'custom')}
        tabBarExtraContent={
          <Button type="primary" onClick={handleTabButtonClick}>
            {tabButtonLabel}
          </Button>
        }
      >
        <TabPane tab="Quote Sections" key="quote">
          <Table
            columns={quoteColumns}
            dataSource={quoteSections}
            pagination={false}
            size="small"
            rowKey="key"
          />
        </TabPane>
        <TabPane tab="Master Sections" key="master">
          <MasterSections />
        </TabPane>
        <TabPane tab="Custom Section" key="custom">
          <Table
            columns={customColumns}
            dataSource={customSectionLoading ? [] : customSectionData ?? customRows}
            pagination={false}
            rowKey="key"
            size="small"
            locale={{
              emptyText: customSectionLoading ? (
                <div className="py-12 flex justify-center">
                  <Loading type="primary" />
                </div>
              ) : 'No custom sections found',
            }}
          />
        </TabPane>
      </Tabs>
      <ActionDialogmodel
        title="Section Details"
        open={activeModal === 'sectionDetails'}
        onCancel={() => setActiveModal(null)}
        onSubmit={values => {
          console.log('Section form values', values);
          setActiveModal(null);
        }}
        submitButtonText="Save"
        fields={getSectionDetailsFields()}
      />

      <ActionDialogmodel
        title="Create Master"
        open={activeModal === 'createMaster'}
        onCancel={() => setActiveModal(null)}
        onSubmit={async values => {
          try {
            const quotationFormatId = Array.isArray(id) ? id[0] : id;
            if (!quotationFormatId) {
              message.error('Quotation Format ID is missing');
              return;
            }

            const payload = {
              masterName: values.masterName,
              status: values.status === 'active',
            };

            await dispatch(createQuotationFormatMasterSectionThunk({ quotationFormatId, payload })).unwrap();
            message.success('Master section created successfully');
          } catch (error: any) {
            message.error(error || 'Failed to create master section');
          } finally {
            setActiveModal(null);
          }
        }}
        submitButtonText="Save"
        fields={getCreateMasterFields()}
      />

      <ActionDialogmodel
        title="Add New Group"
        open={activeModal === 'customGroup'}
        loading={customGroupLoading}
        onCancel={() => setActiveModal(null)}
        onSubmit={handleCustomGroupCreate}
        submitButtonText="Save"
        fields={getCustomGroupFields()}
      />
    </div>
  );
};

export default QuotationFormatForm;
