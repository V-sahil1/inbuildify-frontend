import { Tooltip, Button } from 'antd';
import { TooltipButtonProps } from 'types/common.types';

const TooltipButton: React.FC<TooltipButtonProps> = ({
  title,
  icon,
  type = 'default',
  onClick,
}) => (
  <Tooltip title={title}>
    <Button icon={icon} onClick={onClick} type={type} />
  </Tooltip>
);

export default TooltipButton;
