import React from 'react';
import { Form, Button } from 'antd';
import { SwapOutlined } from '@ant-design/icons';

interface Props {
  onClick: () => void;
  className?: string;
}

const SwapButton = ({ onClick, className }: Props) => {
  return (
    <Form.Item>
      <Button
        onClick={onClick}
        className={className}
        type="text"
        shape="circle"
      >
        <SwapOutlined />
      </Button>
    </Form.Item>
  );
};

export default SwapButton;
