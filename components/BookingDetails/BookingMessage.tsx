import styles from './BookingDetails.module.css';

type Props = {
  content: string;
};

const BookingMessage: React.FC<Props> = ({ content }) => {
  if (!content) {
    return null;
  }

  return <div className={styles.messageContent}>{content}</div>;
};

export default BookingMessage;
