import { Button } from 'antd';

import SwapIcon from '../../assets/swap-horizontal-svgrepo-com.svg';

interface Props {
  onClick: () => void;
  className?: string;
}

const SwapButton: React.FC<Props> = ({ onClick, className }) => {
  return (
    <Button onClick={onClick} className={className} type="text" shape="circle">
      <SwapIcon width="100%" height="100%" />
    </Button>
  );
};

export default SwapButton;
