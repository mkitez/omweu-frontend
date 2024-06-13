import { Alert } from 'antd';
import { signIn, useSession } from 'next-auth/react';
import { Trans, useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';

import type { Trip } from '../Trips';
import Amenities from './Amenities';
import CarDetails from './CarDetails';
import TripData from './TripData';
import TripDescription from './TripDescription';
import styles from './TripDetails.module.css';
import UserData from './UserData';

type Props = {
  trip: Trip;
};

const TripDetails: React.FC<Props> = ({ trip }) => {
  const session = useSession();
  const { asPath } = useRouter();
  const { t } = useTranslation('trip');

  return (
    <div className={styles.root}>
      <TripData trip={trip} />
      <div className={styles.userAndAmenitiesContainer}>
        <UserData user={trip.driver} />
        <Amenities amenities={trip.amenities} />
      </div>
      <TripDescription content={trip.description} />
      <CarDetails car={trip.car} />
      {session.status === 'unauthenticated' && (
        <Alert
          type="info"
          className={styles.loginMessage}
          message={
            <Trans
              components={[
                <Link
                  key={0}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    signIn(undefined, { callbackUrl: asPath });
                  }}
                >
                  x
                </Link>,
                <Link key={1} href="/auth/signup">
                  x
                </Link>,
              ]}
            >
              {t('loginForDetails')}
            </Trans>
          }
        />
      )}
    </div>
  );
};

export default TripDetails;
