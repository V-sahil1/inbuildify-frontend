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
            onSave({ type: "existing", facade: selected });
            dispatch(setQuotationFacade(selected));
            onCancel();
        } else {
            if (!formValues) {
                message.warning("Please fill the form before saving.");
                return;
            }
            try {
                await dispatch(createFacade(formValues)).unwrap();
                message.success("Facade created successfully");
                onSave({ type: "new", facade: formValues });
                onCancel();
            } catch (error) {
                message.error(`Failed to create facade ${error}`);
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
                <Button key="save" type="primary" onClick={handleSave}>
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
