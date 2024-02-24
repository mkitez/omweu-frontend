import { useState } from 'react';
import { Button, Modal } from 'antd';
import styles from './BookingDetails.module.css';
import Link from 'next/link';

type Props = {
  label: string;
  title: string;
  content: string;
};

const CancelRejectReason: React.FC<Props> = ({ label, title, content }) => {
  const [isOpen, setOpen] = useState(false);

  if (!content) {
    return null;
  }

  const closeModal = () => setOpen(false);

  return (
    <>
      <div className={styles.cancelRejectReason}>
        <Link
          href="#"
          className={styles.link}
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          {label}
        </Link>
      </div>
      <Modal
        open={isOpen}
        onCancel={closeModal}
        title={title}
        footer={[
          <Button key="ok" type="primary" onClick={closeModal}>
            OK
          </Button>,
        ]}
      >
        <div className={styles.messageContent}>{content}</div>
      </Modal>
    </>
  );
};

export default CancelRejectReason;
