import { Tooltip, Button } from 'antd';
import { TooltipButtonProps } from 'types/common.types';

const TooltipButton: React.FC<TooltipButtonProps> = ({
  title,
  icon,
  type = 'default',
  className,
  onClick,
}) => (
  <Tooltip title={title}>
    <Button icon={icon} onClick={onClick} type={type} className={className} />
  </Tooltip>
);

export default TooltipButton;
