import { Tooltip, Button } from 'antd';
import { TooltipButtonProps } from 'types/common.types';

const TooltipButton: React.FC<TooltipButtonProps> = ({
  title,
  icon,
  type = 'default',
  className,
  disabled=false,
  size='middle',
  onClick,
}) => (
  <Tooltip title={title}>
    <Button size={size} icon={icon} onClick={onClick} type={type} className={className} disabled={disabled} />
  </Tooltip>
);

export default TooltipButton;
