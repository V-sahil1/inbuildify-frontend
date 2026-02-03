import { Tooltip, Button } from 'antd';
import { TooltipButtonProps } from 'types/common.types';

const TooltipButton: React.FC<TooltipButtonProps> = ({
  title,
  icon,
  type = 'default',
  className,
  disabled = false,
  size = 'middle',
  htmlType = 'button',
  loading = false,
  onClick,
}) => (
  <Tooltip title={title}>
    <Button
      size={size}
      icon={icon}
      onClick={onClick}
      htmlType={htmlType}
      type={type}
      className={className}
      disabled={disabled}
      loading={loading}
    />
  </Tooltip>
);

export default TooltipButton;
