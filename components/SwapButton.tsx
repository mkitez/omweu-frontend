import { Button } from 'antd';
import { SwapOutlined } from '@ant-design/icons';

interface Props {
  onClick: () => void;
  className?: string;
}

const SwapButton: React.FC<Props> = ({ onClick, className }) => {
  return (
    <Button onClick={onClick} className={className} type="text" shape="circle">
      <SwapOutlined />
    </Button>
  );
};

export default SwapButton;
