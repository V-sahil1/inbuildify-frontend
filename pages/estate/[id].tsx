'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Tabs, Empty, Typography, Upload, Image, message } from 'antd';
import { Tag } from 'antd';
import { IconLayoutBoardSplit, IconMapPin, IconUpload } from '@tabler/icons-react';
import TabPane from 'antd/es/tabs/TabPane';
import EstateStages from '@/components/estate/EstateStages';
import EstateFeatures from '@/components/estate/EstateFeatures';
import EstateDocuments from '@/components/estate/EstateDocuments';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  fetchAllEStateDocument,
  fetchAllEStateFeature,
  fetchAllEState,
  fetchAllEStateStage,
  fetchAllEStateImages,
  updateEStateImages,
} from '@redux/feature/estate/estateThunk';
import { Status } from '@lib/constants/enum';
import { toggleEstateExpand } from '@redux/feature/estate/estateSlice';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
//todo : manage location
export default function EstateDetailsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { estate, status } = useAppSelector(state => state.estate);
  const eState = estate.find(i => i.estateId === id);
  const [images, setImages] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (status.estate.fetch === Status.IDLE) {
      dispatch(fetchAllEState({}));
    }
  }, [status.estate.fetch]);

  useEffect(() => {
    if (eState) {
      fetchDocument();
      fetchFeature();
      fetchStage();
      fetchImage();
    }
  }, [id, eState]);

  const fetchDocument = async () => {
    try {
      if (!eState?.isExpanded?.document) {
        dispatch(toggleEstateExpand({ estateId: eState.estateId, type: 'document' }));
        await dispatch(fetchAllEStateDocument({ estate_id: eState?.estateId })).unwrap();
      }
    } catch (error) {
      message.error(error || 'Failed to fetch document');
    }
  };

  const fetchFeature = async () => {
    try {
      if (!eState?.isExpanded?.feature) {
        dispatch(toggleEstateExpand({ estateId: eState.estateId, type: 'feature' }));
        await dispatch(fetchAllEStateFeature(eState?.estateId)).unwrap();
      }
    } catch (error) {
      message.error(error || 'Failed to fetch feature');
    }
  };
  const fetchStage = async () => {
    try {
      if (!eState?.isExpanded?.stage) {
        dispatch(toggleEstateExpand({ estateId: eState.estateId, type: 'stage' }));
        await dispatch(fetchAllEStateStage(eState?.estateId)).unwrap();
      }
    } catch (error) {
      message.error(error || 'Failed to fetch stage');
    }
  };
  const fetchImage = async () => {
    try {
      if (!eState?.isExpanded?.image) {
        dispatch(toggleEstateExpand({ estateId: eState.estateId, type: 'image' }));
        await dispatch(fetchAllEStateImages(eState?.estateId)).unwrap();
      }
    } catch (error) {
      message.error(error || 'Failed to fetch image');
    }
  };

  const handleEstateImage = (file: File) => {
    setImages(file);
    setPreviewImage(URL.createObjectURL(file));
    setIsEditing(true);
  };

  const handleSaveImage = async () => {
    if (!images) return;
    try {
      await dispatch(
        updateEStateImages({
          data: formDataGenerator({ imageUrl: images }),
          id: eState?.image?.estateImageId || '',
        })
      ).unwrap();
      message.success('Estate image updated successfully');
      setIsEditing(false);
      setImages(null);
      setPreviewImage(null);
    } catch (error) {
      message.error(error || 'Failed to update image');
    }
  };

  const handleCancelImage = () => {
    setImages(null);
    setPreviewImage(null);
    setIsEditing(false);
  };
  if (!eState) {
    return (
      <div className="p-5">
        <Empty description="Estate not found" />
      </div>
    );
  }

  return (
    <div className="p-5 mx-4">
      <div className="flex items-center justify-between">
        <Typography.Title level={4}>Estate Info</Typography.Title>
        <Button className="mr-2" onClick={() => router.push('/estate')}>
          <IconLayoutBoardSplit size={24} />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="border rounded-md bg-card-color">
            <div className="flex gap-4 p-4 items-center ">
              <div className="shrink-0 w-56 h-52 ">
                {eState.estateLogo ? (
                  <img
                    src={eState.estateLogo}
                    alt={eState.name}
                    className="w-full h-full object-contain rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded" />
                )}
              </div>
              <div className="flex flex-col space-y-2 mx-16">
                <div className="flex items-center gap-2">
                  <div className="text-base font-semibold">{eState.name}</div>
                  <Tag color={eState.status ? 'green' : 'red'}>
                    {eState.status ? 'Active' : 'Inactive'}
                  </Tag>
                </div>
                <div className="text-gray-600 text-sm overflow-auto pr-2 max-h-32 custom-scrollbar">
                  {eState.description}
                </div>
              </div>
            </div>
            <div className="border-t px-4 py-2 text-sm text-font-color bg-gray-100 flex items-center gap-2">
              <IconMapPin size={16} />
              {/* <span>{estate.location}</span> */}
            </div>
          </div>

          <Tabs
            defaultActiveKey="documents"
            type="card"
            size="large"
            tabBarStyle={{ margin: 0, marginRight: '10px' }}
            tabBarGutter={10}
          >
            <TabPane tab="Documents" key="documents">
              <EstateDocuments estate={eState} />
            </TabPane>
            <TabPane tab="Features" key="features">
              <EstateFeatures estate={eState} />
            </TabPane>
            <TabPane tab="Stages" key="stages">
              <EstateStages estate={eState} />
            </TabPane>
          </Tabs>
        </div>

        <div>
          <div className="border rounded-md bg-card-color flex flex-col">
            <div className="flex p-3 border-b justify-between items-center">
              <div className="flex items-start justify-between flex-col">
                <div className="font-medium">Estate Images</div>
                <div className="pt-2 text-xs text-primary">
                  For a better image view in Agent portal, Please upload the dimensions above
                  1920*1080
                </div>
              </div>
              <Upload
                multiple
                accept="image/*"
                showUploadList={false}
                beforeUpload={file => {
                  handleEstateImage(file);
                  return false;
                }}
              >
                <Button type="primary" className="m-auto">
                  <IconUpload size={16} />
                </Button>
              </Upload>
            </div>

            {!eState?.image?.imageUrl && !isEditing ? (
              <div className="p-6 flex-1 flex flex-col items-center justify-center text-gray-500">
                <img
                  src="/images/no_image_found.png"
                  alt="No images"
                  className="w-40 h-40 object-contain"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="text-center">No images found.</div>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                <div className="border rounded-md bg-white p-3">
                  <Image
                    src={isEditing ? previewImage! : (eState.image?.imageUrl as string)}
                    className="object-cover rounded mb-3"
                  />
                  {isEditing && (
                    <div className="flex gap-2">
                      <Button type="primary" size="small" onClick={handleSaveImage}>
                        Save
                      </Button>
                      <Button size="small" onClick={handleCancelImage}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
