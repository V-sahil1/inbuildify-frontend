import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { Card, Spin, Result, Button, Divider, Descriptions, Table, Tag } from 'antd';
import { IconFileInvoice, IconDownload, IconCheck } from '@tabler/icons-react';
import CryptoJS from 'crypto-js';

interface QuotationViewProps {
  token: string;
}

export const getServerSideProps: GetServerSideProps<QuotationViewProps> = async (context) => {
  const token = (context.query.token as string) || '';

  return {
    props: {
      token,
    },
  };
};

export default function QuotationView({ token }: QuotationViewProps) {
  const [loading, setLoading] = useState(true);
  const [quotation, setQuotation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuotationDetails();
  }, [token]);

  const fetchQuotationDetails = async () => {
    if (!token) {
      setError('Invalid or missing token.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Generating token for public access like in the external route
      const secretKey = process.env.NEXT_PUBLIC_API_SECRET || '';
      const baseMessage = process.env.NEXT_PUBLIC_API_SECRET_TEXT || '';
      const secretMessage = `${baseMessage}|${Date.now()}`;

      const secureHeaderToken = CryptoJS.AES.encrypt(secretMessage, secretKey).toString();

      // Calling the API endpoint quotation/view/:hash where :hash is the token
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/quotation/view/${token}`,
        {
          method: 'GET',
          headers: {
            'X-Secure-Access': secureHeaderToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load quotation details');
      }

      const responseData = await response.json();
      console.log('Quotation Details:', responseData);

      // The backend returns { data: [{ ... }] }
      const quotationData = Array.isArray(responseData.data) ? responseData.data[0] : responseData.data;
      setQuotation(quotationData || responseData);
    } catch (err: any) {
      console.error('Fetch quotation error:', err);
      setError(err.message || 'An error occurred while fetching the quotation.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" tip="Loading Quotation..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Result
          status="error"
          title="Failed to Load"
          subTitle={error}
          extra={[
            <Button type="primary" key="retry" onClick={fetchQuotationDetails}>
              Retry
            </Button>
          ]}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Head>
        <title>View Quotation | CRMSimplify</title>
      </Head>

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm w-full sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Image
                src="/company-light.webp"
                alt="InBuildify Logo"
                width={150}
                height={40}
                className="object-contain"
                priority
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Card className="shadow-lg rounded-2xl border-0 overflow-hidden">
          <div className="p-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                <IconFileInvoice className="text-primary w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 m-0">Quotation Details</h1>
                <p className="text-gray-500 mt-1 mb-0">Review the details of your quotation below.</p>
              </div>
            </div>

            <Divider />

            {/* General Info */}
            <Descriptions
              title={<span className="text-lg text-gray-800">Information</span>}
              bordered
              column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
              className="mb-8"
            >
              <Descriptions.Item label="Quotation No.">
                {quotation?.referenceNumber || 'N/A'} (v{quotation?.quotationVersionNo || 1})
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <span className="capitalize font-medium text-primary">
                  {quotation?.isApprove ? 'Approved' : 'Pending'}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Customer Name">
                {quotation?.leadContacts?.[0]?.name || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                {quotation?.grandTotalCost ? `$${Number(quotation.grandTotalCost).toLocaleString()}` : 'N/A'}
              </Descriptions.Item>
              {quotation?.createdAt && (
                <Descriptions.Item label="Date Created">
                  {new Date(quotation.createdAt).toLocaleDateString()}
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* Property Info */}
            {quotation?.property && (
              <div className="mb-8">
                <Descriptions
                  title={<span className="text-lg text-gray-800">Property Details</span>}
                  bordered
                  column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                >
                  <Descriptions.Item label="Estate Name">{quotation.property.estateName || 'N/A'}</Descriptions.Item>
                  <Descriptions.Item label="Lot Number">{quotation.property.lotNumber || 'N/A'}</Descriptions.Item>
                  <Descriptions.Item label="Address">
                    {[quotation.property.addressLine1, quotation.property.addressLine2, quotation.property.city, quotation.property.stateName, quotation.property.zipCode].filter(Boolean).join(', ')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Land Size">
                    {quotation.property.totalSizeM2 ? `${quotation.property.totalSizeM2} m²` : 'N/A'}
                    {quotation.property.widthM && quotation.property.depthM ? ` (${quotation.property.widthM}m x ${quotation.property.depthM}m)` : ''}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            )}

            {/* Design & Structure */}
            <div className="mb-8">
              <Descriptions
                title={<span className="text-lg text-gray-800">Design & Structure</span>}
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
              >
                <Descriptions.Item label="Range">{quotation?.rangeName || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Dwelling Type">{quotation?.dwellingTypeName || 'N/A'}</Descriptions.Item>

                {quotation?.floorPlan && (
                  <>
                    <Descriptions.Item label="Floor Plan">{quotation.floorPlan.name}</Descriptions.Item>
                    <Descriptions.Item label="Rooms">
                      {quotation.floorPlan.beds} Beds, {quotation.floorPlan.baths} Baths, {quotation.floorPlan.carpark} Carpark
                    </Descriptions.Item>
                  </>
                )}

                {quotation?.facade && (
                  <Descriptions.Item label="Facade">
                    {quotation.facade.name}
                    {quotation.facadePrice && ` (+$${Number(quotation.facadePrice).toLocaleString()})`}
                  </Descriptions.Item>
                )}

                {quotation?.structureEngineerName && (
                  <Descriptions.Item label="Structural Engineer">
                    {quotation.structureEngineerName}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>

            {/* Package */}
            {quotation?.package && (
              <div className="mb-8">
                <Descriptions
                  title={<span className="text-lg text-gray-800">Selected Package</span>}
                  bordered
                  column={1}
                >
                  <Descriptions.Item label="Package Name">
                    <div className="flex justify-between w-full pr-4">
                      <span>{quotation.package.name}</span>
                      <span className="font-semibold">${Number(quotation.package.cost || 0).toLocaleString()}</span>
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            )}

            {/* Quotation Items */}
            {quotation?.quotationVersionItems && quotation.quotationVersionItems.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Quotation Items</h3>
                <Table
                  dataSource={quotation.quotationVersionItems}
                  rowKey="quotationVersionItemId"
                  pagination={false}
                  bordered
                  scroll={{ x: 600 }}
                  columns={[
                    {
                      title: 'Description',
                      dataIndex: 'priceListItemDescription',
                      key: 'description',
                      render: (text: string, record: any) => {
                        if (text) return text;
                        if (record.packageId && quotation?.package?.packageId === record.packageId) {
                          return quotation.package.name + ' (Package)';
                        }
                        return record.packageId ? 'Package Item' : 'N/A';
                      },
                    },
                    {
                      title: 'Quantity',
                      dataIndex: 'quantity',
                      key: 'quantity',
                      width: 100,
                      align: 'center',
                    },
                    {
                      title: 'Unit Price',
                      dataIndex: 'priceListItemCost',
                      key: 'unitPrice',
                      width: 150,
                      align: 'right',
                      render: (val: any) => val ? `$${Number(val).toLocaleString()}` : '-',
                    },
                    {
                      title: 'Total',
                      dataIndex: 'totalPrice',
                      key: 'total',
                      width: 150,
                      align: 'right',
                      render: (val: any) => <span className="font-semibold">${Number(val || 0).toLocaleString()}</span>,
                    },
                  ]}
                  summary={() => (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={3} className="text-right font-bold text-gray-800">
                        Grand Total
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right" className="font-bold text-primary">
                        ${Number(quotation.grandTotalCost || 0).toLocaleString()}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  )}
                />
              </div>
            )}

            <div className="mt-8 flex justify-center gap-4">
              <Button type="primary" size="large" icon={<IconCheck size={18} />}>
                Acknowledge
              </Button>
              {quotation?.pdf_url && (
                <Button size="large" icon={<IconDownload size={18} />} href={quotation.pdf_url} target="_blank">
                  Download PDF
                </Button>
              )}
            </div>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} CRMSimplify. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
