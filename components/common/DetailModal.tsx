import { Modal, Spin, Card, Descriptions, Tooltip } from "antd";

export type DetailField = {
  label: string;
  key: string;
  isLink?: "email" | "phone";
  type?: string;
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
      title={<div className="text-xl">{title}</div>}
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
        <Card  className="shadow-md mt-3 border-none ">
          <Descriptions
            bordered
            column={1}
            labelStyle={{ fontWeight: 600, width: "150px" }}
            style={{ borderRadius: '12px', overflow: 'hidden' }}
          >
            {fields.map((field) => {
              const value = data[field.key];
              if (!value) return null;

              let content = value;
              if (field.type === 'date') {
                content = new Date(content).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                })
              }
              else if (field.type === 'boolean') {
                content = (content === true ? "Yes" : "No")
              }
              if (field.isLink === "email") {
                content = <a href={`mailto:${value}`}>{value}</a>;
              } else if (field.isLink === "phone") {
                content = <a href={`tel:${value}`}>{value}</a>;
              }

              return (
                <Descriptions.Item key={field.key} label={field.label} 
                style={{backgroundColor:'var(--body-color)', color:'var(--font-color)'}}
                className="break-all">
                  <Tooltip title={content}><p className="line-clamp-2">{content}</p></Tooltip>
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