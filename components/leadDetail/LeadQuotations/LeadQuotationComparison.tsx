// LeadQuotationComparison.tsx
import React, { useState } from "react";
import { Modal, Checkbox, Button, Table } from "antd";
import { Quotation } from "data/types";

const { Column } = Table;

interface Props {
    open: boolean;
    onClose: () => void;
    quotation: Quotation;
}

const LeadQuotationComparison: React.FC<Props> = ({ open, onClose, quotation }) => {
    const [selectedVersions, setSelectedVersions] = useState<typeof quotation.versions>([]);
    const [showAll, setShowAll] = useState(false);

    const handleCheckboxChange = (versionId: string) => {
        const version = quotation.versions.find((v) => v.version === versionId);
        if (!version) return;

        setSelectedVersions((prev) => {
            if (prev.some((v) => v.version === versionId)) {
                // Remove if already selected
                return prev.filter((v) => v.version !== versionId);
            }
            // Allow only 2 versions
            return prev.length < 2 ? [...prev, version] : prev;
        });
    };

    const handleCancel = () => {
        onClose();
        setSelectedVersions([]);
        setShowAll(false);
    };

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={900}
            title={`Quotation Version Comparison - ${quotation.quotationId}`}
        >
            {/* Select versions */}
            <div className="flex items-center gap-4 mb-4">
                <span>Select two versions:</span>
                <div className="flex flex-wrap gap-2">
                    {quotation.versions.map((v) => (
                        <Checkbox
                            key={v.id}
                            checked={selectedVersions.some((sv) => sv.version === v.version)}
                            onChange={() => handleCheckboxChange(v.version)}
                        >
                            {v.version}
                        </Checkbox>
                    ))}
                </div>
                <Button type="primary">Compare</Button>
                <Button>Print</Button>
                <Checkbox checked={showAll} onChange={(e) => setShowAll(e.target.checked)}>
                    Show All
                </Checkbox>
            </div>

            {/* Comparison Table */}
            <div className="mt-4 flex flex-wrap gap-2 mb-3">
                <span className="font-semibold">Property Address:</span>
                <span> {quotation.property}</span>
            </div>
            <Table
                dataSource={[]}
                pagination={false}
                bordered
                size="small"
                rowKey="id"
            >
                <Column title={
                    <div className="flex flex-col justify-center items-center">
                        <span>Items</span>
                    </div>
                } dataIndex="property" key="property" width="60%" />
                {selectedVersions[0] && (
                    <Column
                        title={
                            <div className="flex flex-col justify-center items-center">
                                <span>{selectedVersions[0].version}</span>
                                <span>${Number(selectedVersions[0].totalCost).toFixed(2)}</span>
                            </div>
                        }
                        dataIndex="version1"
                        key="version1"
                        width="20%"
                    />
                )}
                {selectedVersions[1] && (
                    <Column
                        title={
                            <div className="flex flex-col justify-center items-center">
                                <span>{selectedVersions[1].version}</span>
                                <span>${Number(selectedVersions[1].totalCost).toFixed(2)}</span>
                            </div>
                        }
                        dataIndex="version2"
                        key="version2"
                        width="20%"
                    />
                )}
            </Table>
        </Modal>
    );
};

export default LeadQuotationComparison;
