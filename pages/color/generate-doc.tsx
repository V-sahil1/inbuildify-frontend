import { Layout, Row, Col, Select, Button, Table, Typography, Space, Avatar } from 'antd';
import { IconMail, IconPhone } from '@tabler/icons-react';
import { useState } from 'react';
import ColorGeneratedDocumentPdf from '@/components/common/pdf/ColorGeneratedDocumentPdf';
import { usePdf } from '@hooks/usePdf';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const dummyData = [
    {
        key: '1',
        image: 'https://via.placeholder.com/50',
        colorName: '',
        categoryName: 'Premium',
        itemCode: '',
        supplierName: '5AB Painting Services',
        itemPrice: '',
        units: '',
        totalCost: '',
        costType: 'Standard',
    },
    {
        key: '2',
        image: 'https://via.placeholder.com/50/edcfa9/000000?text=Cream',
        colorName: '',
        categoryName: 'Premium',
        itemCode: 'Classic Cream',
        supplierName: '',
        itemPrice: '',
        units: '',
        totalCost: '',
        costType: 'Standard',
    },
    {
        key: '3',
        image: 'https://via.placeholder.com/50/000000/FFFFFF?text=Black',
        colorName: '',
        categoryName: 'Premium',
        itemCode: '#123456',
        supplierName: 'A&L Windows',
        itemPrice: '200.00',
        units: '',
        totalCost: '200.00',
        costType: 'Upgrade',
    },
    {
        key: '4',
        image: 'https://via.placeholder.com/50',
        colorName: '',
        categoryName: 'Deluxe',
        itemCode: '',
        supplierName: '5AB Painting Services',
        itemPrice: '',
        units: '',
        totalCost: '',
        costType: 'Standard',
    },
    {
        key: '5',
        image: '',
        colorName: '',
        categoryName: 'ACCESS RANGE',
        itemCode: '',
        supplierName: '',
        itemPrice: '',
        units: '',
        totalCost: '',
        costType: 'Standard',
    },
    {
        key: '6',
        image: '',
        colorName: 'AB-Bricks-AccessCream230x76-110-240-HiRes-VIC',
        categoryName: 'ACCESS RANGE',
        itemCode: '',
        supplierName: 'ABC Brick Cleaning',
        itemPrice: '',
        units: '',
        totalCost: '',
        costType: 'Standard',
    },
    {
        key: '7',
        image: 'https://via.placeholder.com/50',
        colorName: '',
        categoryName: 'WALL AND FLOOR TILES',
        itemCode: '',
        supplierName: '',
        itemPrice: '5.00',
        units: '',
        totalCost: '',
        costType: 'Standard',
    },
];

const GenerateDoc = () => {
    const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
    const { previewPdf } = usePdf(ColorGeneratedDocumentPdf);

    const handleGenerateDocument = () => {
        // If selection exists, filter by it. Otherwise use all data (or show warning, but using all is friendlier for demo)
        const dataToPrint = selectedRows.length > 0
            ? dummyData.filter(item => selectedRows.includes(item.key))
            : dummyData;

        previewPdf({
            data: dataToPrint,
            address: 'Lot 89, 09 In numquam proident, Ex qui quia aut aute, Victoria, 2075'
        });
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (text: string) => text ? <Avatar shape="square" size={64} src={text} /> : null,
        },
        {
            title: 'Color Name',
            dataIndex: 'colorName',
            key: 'colorName',
        },
        {
            title: 'Category Name',
            dataIndex: 'categoryName',
            key: 'categoryName',
        },
        {
            title: 'Item Code',
            dataIndex: 'itemCode',
            key: 'itemCode',
        },
        {
            title: 'Supplier Name',
            dataIndex: 'supplierName',
            key: 'supplierName',
        },
        {
            title: 'Item Price ($)',
            dataIndex: 'itemPrice',
            key: 'itemPrice',
        },
        {
            title: 'Units',
            dataIndex: 'units',
            key: 'units',
        },
        {
            title: 'Total Cost ($)',
            dataIndex: 'totalCost',
            key: 'totalCost',
        },
        {
            title: 'Cost Type',
            dataIndex: 'costType',
            key: 'costType',
        },
    ];

    const rowSelection = {
        selectedRowKeys: selectedRows,
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRows(selectedRowKeys);
        },
    };

    return (
        <Layout className="bg-white p-6">
            <div className="bg-white mb-6">
                <Title level={4} style={{ marginBottom: 0 }}>Colors Documents for Lot 89, 09 In numquam proident, Ex qui quia aut aute, Victoria, 2075</Title>

                <Row gutter={24} className="mt-4" align="bottom">
                    {/* User Info Column */}
                    <Col span={8}>
                        <Space direction="vertical" size={1}>
                            <Text className="text-blue-500 font-medium">john wick</Text>
                            <Space>
                                <IconPhone size={16} className="text-gray-400" />
                                <Text className="text-gray-500">01234567823</Text>
                            </Space>
                            <Space>
                                <IconMail size={16} className="text-gray-400" />
                                <Text className="text-gray-500">johnwick@gmail.com</Text>
                            </Space>
                        </Space>
                    </Col>

                    {/* Filters Column */}
                    <Col span={16}>
                        <Row gutter={16} align="bottom">
                            <Col span={10}>
                                <Text className="text-xs text-gray-500 block mb-1">Document Name</Text>
                                <Select defaultValue="External Color Schedule" style={{ width: '100%' }}>
                                    <Option value="External Color Schedule">External Color Schedule</Option>
                                    <Option value="Internal Color Schedule">Internal Color Schedule</Option>
                                </Select>
                            </Col>
                            <Col span={10}>
                                <Text className="text-xs text-gray-500 block mb-1">Color Type</Text>
                                <Select defaultValue="Please Select" style={{ width: '100%' }}>
                                    <Option value="Please Select">Please Select</Option>
                                    <Option value="External">External</Option>
                                    <Option value="Internal">Black</Option>
                                    <Option value="Stainless_Steel">Stainless Steel</Option>
                                </Select>
                            </Col>
                            <Col span={4}>
                                <Button
                                    type="primary"
                                    className="bg-green-700 hover:bg-green-600 border-none w-full"
                                    onClick={handleGenerateDocument}
                                >
                                    Generate Document
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>

            <Content className="bg-white">
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={dummyData}
                    pagination={false}
                    className="border-t border-gray-200"
                    size="middle"
                />
            </Content>
        </Layout>
    );
};

export default GenerateDoc;