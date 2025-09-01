import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { Status } from "@lib/constants/enum";
import { createFacade, getFacades } from "@redux/feature/facade/facadeThunk";
import { Button, Modal, Tabs, Typography, message } from "antd";
import { useEffect, useState } from "react";
import AvailableFacadesTab from "./AvailableFacadesTab";
import CustomFacadeForm from "./forms/CustomFacadeForm";
import { setQuotationFacade } from "@redux/feature/quotation/quotationSlice";

const { Title } = Typography;

interface FacadeModalProps {
    visible: boolean;
    onCancel: () => void;
    onSave: (data: any) => void;
    selectedFacade?: any;
}

const FacadeModal: React.FC<FacadeModalProps> = ({
    visible,
    onCancel,
    onSave,
    selectedFacade,
}) => {
    const dispatch = useAppDispatch();
    const { facades, status } = useAppSelector((state) => state.facade);

    const [activeTab, setActiveTab] = useState<"available" | "custom">("available");
    const [selected, setSelected] = useState<any>(selectedFacade || null);
    const [formValues, setFormValues] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === Status.IDLE) {
            dispatch(getFacades(undefined)).unwrap().catch(console.error);
        }
    }, [dispatch, status]);

    const handleSave = async () => {
        if (activeTab === "available") {
            if (!selected) {
                message.warning("Please select a facade before saving.");
                return;
            }
            onSave(selected);
            dispatch(setQuotationFacade(selected));
            onCancel();
        } else {
            if (!formValues) {
                message.warning("Please fill the form before saving.");
                return;
            }
            try {
                const formData = new FormData();
                formData.append("name", formValues.name);
                formData.append("dwelling_type", formValues.dwelling_type);
                formData.append("image", formValues.image.file.originFileObj);
                formData.append("standard", formValues.standard || true);
                formData.append("upgrade", formValues.upgrade || true);
                setLoading(true);
                const response = await dispatch(createFacade(formData)).unwrap();
                dispatch(setQuotationFacade(response));
                setFormValues(null);
                message.success("Facade created successfully");
                onSave({ type: "new", facade: formValues });
                onCancel();
            } catch (error) {
                message.error(`${error}` || "Failed to create facade");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Modal
            title={
                <div className="bg-blue-500 text-white p-2 rounded">
                    <Title level={4} className="text-white mb-0">
                        Facade
                    </Title>
                </div>
            }
            centered
            open={visible}
            onCancel={onCancel}
            width={900}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={handleSave} loading={loading}>
                    Save
                </Button>,
            ]}
            className="facade-modal"
        >
            <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as "available" | "custom")}
                items={[
                    {
                        key: "available",
                        label: "Available",
                        children: (
                            <AvailableFacadesTab
                                facades={facades}
                                selectedFacade={selected}
                                onSelect={setSelected}
                            />
                        ),
                    },
                    {
                        key: "custom",
                        label: "Custom",
                        children: (
                            <CustomFacadeForm
                                initialValues={formValues}
                                onFormChange={setFormValues}
                            />
                        ),
                    },
                ]}
            />
        </Modal>
    );
};

export default FacadeModal;
