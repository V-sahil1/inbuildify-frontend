import React, { useEffect } from 'react';
import { Button, Table, Tabs, Typography } from 'antd';
import { useRouter } from 'next/router';
import QuotationFormatDetails from './QuotationFormatDetails';
import MasterSections from './MasterSections';
import { useQuotationSectionColumns } from '@/components/table-columns/quotationSectionColumns';
import { useCustomSectionColumns } from '@/components/table-columns/customSectionColumns';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import {
  getCreateMasterFields,
  getCustomGroupFields,
  getSectionDetailsFields,
} from '@/components/formFields/quotationFormatFields';
import { useAppDispatch } from '@hooks/redux';
import { getQuotationFormatByIdThunk } from '@redux/feature/quotation-format/quotationFormatThunk';

const { TabPane } = Tabs as any;

interface QuotationFormatFormProps {
  id?: string | string[];
}

const QuotationFormatForm: React.FC<QuotationFormatFormProps> = ({ id }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [quotationFormatData, setQuotationFormatData] = React.useState<any>(null);

  const { columns: quoteColumns, data: quoteSections } = useQuotationSectionColumns();
  const { columns: customColumns, data: customRows } = useCustomSectionColumns();

  const isCreate = !id;

  // Fetch quotation format by ID when navigating to detail page
  useEffect(() => {
    if (id) {
      dispatch(getQuotationFormatByIdThunk(id as string))
        .unwrap()
        .then((response) => {
          console.log('Quotation format details:', response);
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

      <QuotationFormatDetails startInEdit={isCreate} quotationFormatData={quotationFormatData} />

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
            dataSource={customRows}
            pagination={false}
            rowKey="key"
            size="small"
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
        onSubmit={values => {
          console.log('Master form values', values);
          setActiveModal(null);
        }}
        submitButtonText="Save"
        fields={getCreateMasterFields()}
      />

      <ActionDialogmodel
        title="Add New Group"
        open={activeModal === 'customGroup'}
        onCancel={() => setActiveModal(null)}
        onSubmit={values => {
          console.log('Custom group form values', values);
          setActiveModal(null);
        }}
        submitButtonText="Save"
        fields={getCustomGroupFields()}
      />
    </div>
  );
};

export default QuotationFormatForm;
