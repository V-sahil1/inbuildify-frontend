import { Tooltip, Button } from 'antd';
import { TooltipButtonProps } from 'types/common.types';

const TooltipButton: React.FC<TooltipButtonProps> = ({ title, icon, onClick }) => (
  <Tooltip title={title}>
    <Button icon={icon} onClick={onClick} />
  </Tooltip>
);

export default TooltipButton;
