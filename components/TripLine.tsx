import styles from '../styles/TripLine.module.css';

export const TripLine = () => {
  return (
    <div className={styles.tripLine}>
      <div className={styles.circle}></div>
      <div className={styles.box}></div>
      <div className={styles.circleSm}></div>
      <div className={styles.box}></div>
      <div className={styles.circle}></div>
    </div>
  );
};
