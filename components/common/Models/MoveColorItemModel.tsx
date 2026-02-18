import { Button, Form, Modal, Select } from 'antd';
import { useAppSelector } from '@hooks/redux';
import { Category, ColorType } from '@redux/feature/color/iColourState';

export const MoveColorItemModel = ({
  open,
  setMoveModel,
  onSubmit,
}: {
  open: boolean;
  setMoveModel: (open: string | null) => void;
  onSubmit: (values: { colorId: string; colorCategoryId: string }) => void;
}) => {
  const [form] = Form.useForm();
  const { color } = useAppSelector(state => state.colour);
  const colorId = Form.useWatch('colorId', form);
  const colorOptions = color?.map((color: ColorType) => ({
    label: color.colorName,
    value: color.colorId,
  }));

  const categoryOptions = !!colorId
    ? color
        ?.find((color: ColorType) => color.colorId === colorId)
        ?.colorCategories?.map((category: Category) => ({
          label: category.categoryName,
          value: category.colorCategoryId,
        }))
    : [];

  return (
    <Modal
      title="Move Color Item"
      open={open}
      onCancel={() => setMoveModel(null)}
      centered
      className="responsive-modal"
      footer={[
        <Button key="cancel" onClick={() => setMoveModel(null)}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item name="colorId" label="Color Name">
          <Select placeholder="Select Color" options={colorOptions} />
        </Form.Item>
        <Form.Item name="colorCategoryId" label="Color Category ">
          <Select placeholder="Select Color Category" options={categoryOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
