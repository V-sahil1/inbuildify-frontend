'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Tabs, Empty, Typography, Upload, Image } from 'antd';
import { Tag } from 'antd';
import { IconLayoutBoardSplit, IconMapPin, IconUpload, IconTrash } from '@tabler/icons-react';
import TabPane from 'antd/es/tabs/TabPane';
import { initialData } from 'components/table-columns/EstateColumns';
import EstateStages from '@/components/estate/EstateStages';
import EstateFeatures from '@/components/estate/EstateFeatures';
import EstateDocuments from '@/components/estate/EstateDocuments';

export default function EstateDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const estate = initialData.find(e => e.key === String(id));

  const [images, setImages] = useState<{ key: string; name: string; url: string }[]>([]);
  const removeImage = (key: string) => {
    setImages(prev => {
      const img = prev.find(i => i.key === key);
      if (img) URL.revokeObjectURL(img.url);
      return prev.filter(i => i.key !== key);
    });
  };

  if (!estate) {
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
                {estate.logo ? (
                  <img
                    src={estate.logo}
                    alt={estate.name}
                    className="w-full h-full object-contain rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded" />
                )}
              </div>
              <div className="flex flex-col space-y-2 mx-16">
                <div className="flex items-center gap-2">
                  <div className="text-base font-semibold">{estate.name}</div>
                  <Tag color={estate.isActive ? 'green' : 'red'}>
                    {estate.isActive ? 'Active' : 'Inactive'}
                  </Tag>
                </div>
                <div className="text-gray-600 text-sm overflow-auto pr-2 max-h-32 custom-scrollbar">
                  {estate.description}
                </div>
              </div>
            </div>
            <div className="border-t px-4 py-2 text-sm text-font-color bg-gray-100 flex items-center gap-2">
              <IconMapPin size={16} />
              <span>{estate.location}</span>
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
              <EstateDocuments />
            </TabPane>
            <TabPane tab="Features" key="features">
              <EstateFeatures />
            </TabPane>
            <TabPane tab="Stages" key="stages">
              <EstateStages estateName={estate.name} />
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
                  const url = URL.createObjectURL(file);
                  setImages(prev => [
                    { key: `${Date.now()}-${file.name}`, name: file.name, url },
                    ...prev,
                  ]);
                  return false;
                }}
              >
                <Button type="primary" className="m-auto">
                  <IconUpload size={16} />
                </Button>
              </Upload>
            </div>
            {images.length === 0 ? (
              <div className="p-6 flex-1 flex flex-col items-center justify-center text-gray-500">
                <img
                  src="/illustrations/empty-images.png"
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
                {images.map(img => (
                  <div
                    key={img.key}
                    className="border rounded-md bg-white p-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={img.url}
                        alt={img.name}
                        width={48}
                        height={48}
                        className="object-cover rounded"
                        preview={{ src: img.url }}
                      />
                      <span className="text-sm text-font-color">{img.name}</span>
                    </div>
                    <Button
                      type="text"
                      danger
                      icon={<IconTrash size={16} />}
                      onClick={() => removeImage(img.key)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
