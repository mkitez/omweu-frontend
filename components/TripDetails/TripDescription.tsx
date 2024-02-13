import styles from './TripDetails.module.css';

type Props = {
  content: string;
};

const TripDescription: React.FC<Props> = ({ content }) => {
  if (!content) {
    return null;
  }

  return <div className={styles.description}>{content}</div>;
};

export default TripDescription;
