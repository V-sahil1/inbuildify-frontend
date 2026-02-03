import { Button, Row, Col } from 'antd';
import { IconPlus } from '@tabler/icons-react';

export const ChecklistTableHeader = ({
  setModalOpen,
}: {
  setModalOpen: (modalOpen: 'create' | 'delete' | null) => void;
}) => {
  return (
    <Row
      gutter={8}
      align="middle"
      className="border-b border-border-color pb-2 mb-4 text-sm font-semibold text-font-color w-full"
    >
      <Col flex="1" className="text-center" />
      <Col flex="7">
        <Row gutter={8} align="middle">
          <Col flex="3">Checklist</Col>

          <Col flex="1" className="text-center">
            Supplier Type
          </Col>
          <Col flex="1" className="text-center">
            Sort
          </Col>
          <Col flex="1" className="text-center">
            <Button
              type="primary"
              size="small"
              icon={<IconPlus size={14} />}
              className="!text-xs !h-6"
              onClick={() => {
                setModalOpen('create');
              }}
            >
              New
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
