import StageProgress from '@/components/common/StageProgress';
import ColorFilter from '@/components/job/jobDetail/ColorFilter';
import { ColorItemCard } from '@/components/job/jobDetail/ColorItemCard';
import ColorSideMenu from '@/components/job/jobDetail/ColorSideMenu';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchColourSubCategoryItems } from '@redux/feature/color/colorThunk';
import { toggleExpandColourCategoryItem } from '@redux/feature/color/ColourSlice';
import { Button, Dropdown, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { usePdf } from '@hooks/usePdf';
import ColorPdf from '@/components/common/ColorPdf';
import NoDataMessage from '@/components/common/NoDataMessage';
import SystemRoutes from '@lib/constants/Routes';
import { useRouter } from 'next/navigation';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { createTemplateFields } from '@/components/formFields/createTemplateFIelds';
import MailSendModal from '@/components/common/Models/MailSendModal';
import { getRanges } from '@redux/feature/types/typesThunk';
import { Status } from '@lib/constants/enum';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { TemplateColorItemCard } from '@/components/job/jobDetail/TemplateColorItemCard';
import { TemplateDummyOptions } from 'data/options';

const Index = () => {
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [modelOpen, setModelOpen] = useState({
    approve: false,
    createTemplate: false,
    email: false,
  });
  const [isGridView, setIsGridView] = useState(true);
  const { ColorCategory } = useAppSelector(state => state.colour);
  const { range, status } = useAppSelector(state => state.types);
  const [subCategoryItem, setSubCategoryItem] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { previewPdf } = usePdf(ColorPdf);
  const dispatch = useAppDispatch();
  const fetchRange = async () => {
    try {
      await dispatch(getRanges()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch ranges');
    }
  };

  useEffect(() => {
    if (status.range === Status.IDLE) {
      fetchRange();
    }
  }, [status.range]);

  const handleSubCategoryExpand = async (selectedSubCategory: {
    categoryId: string;
    subCategoryId: string;
  }) => {
    setSelectedSubCategory(selectedSubCategory.subCategoryId);
    setLoading(true);
    const category = ColorCategory.find(
      item => item.colorCategoryId === selectedSubCategory.categoryId
    );
    const subCategory = category?.subCategories.find(
      item => item.colorSubCategoryId === selectedSubCategory.subCategoryId
    );

    if (!subCategory) return;

    if (!subCategory?.isExpanded) {
      try {
        dispatch(
          toggleExpandColourCategoryItem({
            colorSubCategoryId: subCategory.colorSubCategoryId,
            colorCategoryId: subCategory.colorCategoryId,
          })
        );

        const response = await dispatch(
          fetchColourSubCategoryItems({
            colorSubCategoryId: subCategory.colorSubCategoryId,
            colorCategoryId: subCategory.colorCategoryId,
          })
        ).unwrap();
        setSubCategoryItem(response?.data?.colorItems || []);
      } catch (error) {
        message.error(error || 'Failed to fetch colour sub category');
      }
    } else {
      setSubCategoryItem(subCategory?.items);
    }
    setLoading(false);
  };

  const handleTemplateSelect = () => {
    setConfirmationModal(false);
    console.log('Selected template:', selectedTemplate);
  };
  const addedCount = ColorCategory?.reduce((total, category) => {
    if (!category.subCategories) return total;
    return (
      total +
      category.subCategories.reduce((subTotal, subCategory) => {
        if (!subCategory.items) return subTotal;
        return subTotal + subCategory.items.filter(item => item).length;
      }, 0)
    );
  }, 0);

  return (
    <div className="overflow-hidden h-screen flex flex-col">
      <div className="grid grid-cols-[250px_1fr]">
        <div className="p-3">
          <StageProgress id="MH-001" title="Colors" status="In Progress" steps={[]} />
        </div>

        <div className="grid grid-cols-3 gap-4 items-center justify-center">
          <div className="p-3">
            <h6>Murthy</h6>
            <p>Lot 300 Tallis Road, VIC , 3030</p>
          </div>
          <div className="p-3">
            {/* Chose Range */}
            <Select
              placeholder="Select Range"
              allowClear
              options={range?.map(item => ({
                value: item.rangeId,
                label: item.name,
              }))}
            />
          </div>
          <div className="p-3">
            <Dropdown
              menu={{
                items: TemplateDummyOptions,
                onClick: info => {
                  if (info.key === 'manage') {
                    console.log('Manage template clicked');
                  } else {
                    setConfirmationModal(true);
                    setSelectedTemplate(info.key);
                  }
                },
              }}
              placement="bottom"
              trigger={['click']}
              className="w-[200px]"
            >
              <p className="text-center text-lg font-semibold cursor-pointer">Choose Template</p>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Colors Filter */}
      <div className="py-3">
        <ColorFilter
          selectedCount={Number(addedCount)}
          onSearch={val => console.log('Search:', val)}
          imageInPdf={true}
          onImageInPdfChange={val => console.log('Image in pdf:', val)}
          price={true}
          onPriceChange={val => console.log('Price:', val)}
          activeTab="all"
          onTabChange={tab => console.log('Tab changed:', tab)}
          suppliers={[
            { key: '1', label: 'Supplier 1' },
            { key: '2', label: 'Supplier 2' },
          ]}
          onSupplierSelect={key => console.log('Supplier selected:', key)}
          isGridView={isGridView}
          onToggleLayout={() => setIsGridView(!isGridView)}
        />
      </div>

      {/* side menu and items list */}
      <div className="grid grid-cols-[250px_1fr] h-screen overflow-auto">
        <div className="h-full overflow-y-auto bg-card-color custom-scrollbar">
          <ColorSideMenu
            selectedKey={selectedSubCategory}
            onSelect={key => handleSubCategoryExpand(key)}
          />
        </div>
        <div className="p-3 h-full overflow-y-auto custom-scrollbar">
          {selectedTemplate && !confirmationModal && subCategoryItem.length > 0 ? (
            <TemplateColorItemCard
              templateName={`Template ${selectedTemplate}`}
              onEdit={() => {
                console.log('Edit template:', selectedTemplate);
              }}
              onAddNew={() => {
                const newItem = {
                  id: `item-${Date.now()}`,
                  name: '',
                  code: '',
                  image: '/images/placeholder.png',
                  quantity: 1,
                  unit: 'pcs',
                  description: '',
                };
              }}
              onRemove={() => {}}
              onUpdateItem={() => {}}
              items={subCategoryItem.map(item => ({
                id: item.colorItemId,
                name: item.name,

                image: item.image,

                isAdded: (item as any).isAdded,
              }))}
            />
          ) : subCategoryItem.length > 0 ? (
            <ColorItemCard loading={loading} data={subCategoryItem || []} isGridView={isGridView} />
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <NoDataMessage label="Color Sub Category Item" link={SystemRoutes.SETTINGS_COLOUR} />
            </div>
          )}
        </div>
      </div>
      <div className="sticky bottom-0 left-0 w-full bg-[var(--card-color)] border-t p-3 z-50">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          {/* Left side buttons */}
          <div className="flex gap-3">
            <Button type="primary" onClick={() => setModelOpen({ ...modelOpen, approve: true })}>
              Approve
            </Button>
            <Button onClick={previewPdf}>Preview</Button>
            <Button onClick={() => setModelOpen({ ...modelOpen, createTemplate: true })}>
              Create Template
            </Button>
            <Button onClick={() => setModelOpen({ ...modelOpen, email: true })}>Email</Button>
            <Button onClick={() => router.back()}>View Job</Button>
          </div>

          {/* Right side total amount */}
          <div className="text-lg font-semibold">Total Amount: $1234.56</div>
        </div>
      </div>

      {confirmationModal && (
        <ConfirmationModal
          open={confirmationModal}
          onClose={() => setConfirmationModal(false)}
          onConfirm={handleTemplateSelect}
          type="info"
          message="Are you sure you want to choose this template?"
        />
      )}

      {modelOpen.approve && (
        <ActionDialogmodel
          open={modelOpen.approve}
          onCancel={() => setModelOpen({ ...modelOpen, approve: false })}
          title={
            <div className="space-y-2  text-sm">
              <div className="max-h-64 overflow-y-auto py-2 mb-2 custom-scrollbar">
                <div className="space-y-4">
                  <div>
                    <div className="font-bold text-font-color mb-1 text-2xl ">Confirmation</div>
                    <p className="text-sm mt-2">
                      Has the customer finished choosing the colors? please verfifythe color items
                      price and units prior to approval
                    </p>
                  </div>
                </div>
              </div>
            </div>
          }
          isEditing={true}
          fields={[
            {
              name: 'comments',
              label: 'Are you sure you want to approve the selected colors?',
              type: 'switch',
            },
          ]}
          onSubmit={() => setModelOpen({ ...modelOpen, approve: false })}
          submitButtonText="Confirm"
        />
      )}

      {modelOpen.createTemplate && (
        <ActionDialogmodel
          open={modelOpen.createTemplate}
          onCancel={() => setModelOpen({ ...modelOpen, createTemplate: false })}
          title="Create Template"
          isEditing={true}
          fields={createTemplateFields()}
          onSubmit={() => setModelOpen({ ...modelOpen, createTemplate: false })}
          submitButtonText="Confirm"
        />
      )}

      {modelOpen.email && (
        <MailSendModal
          open={modelOpen.email}
          onCancel={() => setModelOpen({ ...modelOpen, email: false })}
          onSend={() => {}}
        />
      )}
    </div>
  );
};

export default Index;
