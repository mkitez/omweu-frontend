import { useTranslation } from 'next-i18next';
import styles from './TripDetails.module.css';

type Props = {
  date: string;
};

const getTripTime = (date: string, locale: string) => {
  const tripDateTime = new Date(date);

  // we have to adjust the date object because by default the date is shown in user local timezone
  const userTimezoneOffset = tripDateTime.getTimezoneOffset() * 60_000;
  const tripDateTimeToDisplay = new Date(
    tripDateTime.getTime() - userTimezoneOffset
  );
  return tripDateTimeToDisplay.toLocaleTimeString(locale, {
    timeStyle: 'short',
  });
};

const TripTime: React.FC<Props> = ({ date }) => {
  const { i18n } = useTranslation();

  const tripTime = getTripTime(date, i18n.language);
  return <div className={styles.time}>{tripTime}</div>;
};

export default TripTime;
