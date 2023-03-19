import { Form, Button } from 'antd';
import { SwapOutlined } from '@ant-design/icons';

const SwapButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Form.Item>
      <Button onClick={onClick} type="text">
        <SwapOutlined />
      </Button>
    </Form.Item>
  );
};

export default SwapButton;
