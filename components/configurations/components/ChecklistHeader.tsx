import { useBuildersHook } from '@hooks/useBuildersHook';
import { useConstructionTypeHook } from '@hooks/useConstructionTypeHook';
import { useConstructionStageHook } from '@hooks/useConstrutcionStageHook';
import { Col, Form, Row, Select } from 'antd';
import { useEffect } from 'react';

export const ChecklistHeader = ({ onChange, data }) => {
  const { builderOptions } = useBuildersHook();
  const { typeOptions } = useConstructionTypeHook();
  const { stageOptions } = useConstructionStageHook();

  useEffect(() => {
    if (
      builderOptions &&
      typeOptions &&
      stageOptions &&
      !data.builder &&
      !data.constructionType &&
      !data.constructionStage
    ) {
      onChange({
        builder: builderOptions[0].value,
        constructionType: typeOptions[0].value,
        constructionStage: stageOptions[0].value,
      });
    }
  }, [
    builderOptions,
    typeOptions,
    stageOptions,
    data.builder,
    data.constructionType,
    data.constructionStage,
    onChange,
  ]);
  return (
    <Form layout="vertical" className="mb-6">
      <Row gutter={16}>
        <Col span={8}>
          <div className="flex flex-col gap-2 justify-start text-font-color">
            <p>Builder</p>
            <Select
              value={data.builder}
              placeholder="Select Builder"
              options={builderOptions}
              onChange={val => onChange(prev => ({ ...prev, builder: val }))}
            />
          </div>
        </Col>
        <Col span={8}>
          <div className="flex flex-col gap-2 justify-start text-font-color ">
            <p>Construction Type </p>
            <Select
              value={data.constructionType}
              placeholder="Select Construction Type"
              options={typeOptions}
              onChange={val => onChange(prev => ({ ...prev, constructionType: val }))}
            />
          </div>
        </Col>
        <Col span={8}>
          <div className="flex flex-col gap-2 justify-start text-font-color">
            <p>Construction Stage </p>
            <Select
              value={data.constructionStage}
              placeholder="Select Stage"
              options={stageOptions}
              onChange={val => onChange(prev => ({ ...prev, constructionStage: val }))}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};
