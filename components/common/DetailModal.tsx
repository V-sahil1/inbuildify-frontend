import { Modal, Spin, Card, Descriptions } from "antd";

type DetailField = {
  label: string;
  key: string;
  isLink?: "email" | "phone"; 
};

interface DetailModalProps {
  title: string;
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  data?: Record<string, any> | null;
  fields: DetailField[];
}

export const DetailModal: React.FC<DetailModalProps> = ({
  title,
  open,
  loading = false,
  onCancel,
  data,
  fields,
}) => {
  return (
    <Modal
      title={title}
      open={open}
      footer={null}
      onCancel={onCancel}
      centered
    >
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : data ? (
        <Card bordered={false} className="shadow-md mt-3 rounded-xl">
          <Descriptions
            bordered
            column={1}
            labelStyle={{ fontWeight: 600, width: "150px" }}
            contentStyle={{ backgroundColor: "#fff" }}
          >
            {fields.map((field) => {
              const value = data[field.key];
              if (!value) return null;

              let content = value;
              if (field.isLink === "email") {
                content = <a href={`mailto:${value}`}>{value}</a>;
              } else if (field.isLink === "phone") {
                content = <a href={`tel:${value}`}>{value}</a>;
              }

              return (
                <Descriptions.Item key={field.key} label={field.label}>
                  {content}
                </Descriptions.Item>
              );
            })}
          </Descriptions>
        </Card>
      ) : (
        <p className="text-center text-gray-500">No details found.</p>
      )}
    </Modal>
  );
};