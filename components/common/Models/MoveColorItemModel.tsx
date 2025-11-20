import { Button, Form, message, Modal, Select } from "antd"
import { useAppSelector } from "@hooks/redux"
import { useEffect, useState } from "react"
import { useAppDispatch } from "@hooks/redux"
import { fetchColourSubCategory } from "@redux/feature/color/colorThunk"

export const MoveColorItemModel = ({ open, setMoveModel, onSubmit }: { open: boolean, setMoveModel: (open: boolean) => void, onSubmit: (values: any) => void }) => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const [selectedColorId, setSelectedColorId] = useState('');
    const [subCategoryList, setSubCategoryList] = useState([]);
    const { ColorCategory } = useAppSelector(state => state.colour);
    const categoryList = ColorCategory.map((item: any) => ({
        value: item.colorCategoryId,
        label: item.name,
    }));

    const getSubcategoryList = async (colorCategoryId: string) => {
        try {
            const res = await dispatch(fetchColourSubCategory(colorCategoryId)).unwrap();
            setSubCategoryList(res.data.colorSubCategories.map((item: any) => ({
                value: item.colorSubCategoryId,
                label: item.name,
            })));
        } catch (error) {
            console.error(error);
            message.error("Failed to fetch subcategories");
        }
    }

    useEffect(() => {
        if (open) {
            if (selectedColorId) {
                getSubcategoryList(selectedColorId);
            }
        }
    }, [selectedColorId]);


    return (
        <Modal
            title="Move Color Item"
            open={open}
            onCancel={() => setMoveModel(false)}
            centered
            className="responsive-modal"
            footer={[
                <Button
                    key="cancel"
                    onClick={() => setMoveModel(false)}

                >
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={() => form.submit()}
                >
                    Save
                </Button>
            ]}
        >
            <Form
                form={form}
                onFinish={onSubmit}
                layout="vertical">
                <Form.Item
                    name="colorName"
                    label="Color Name"
                >
                    <Select placeholder="Select Color" options={categoryList} onChange={(value) => setSelectedColorId(value)} />
                </Form.Item>
                <Form.Item
                    name="colorCategoryName"
                    label="Color Category "
                >
                    <Select placeholder="Select Color Category" options={subCategoryList} onChange={(value) => setSelectedColorId(value)} />
                </Form.Item>

            </Form>
        </Modal>
    )
}