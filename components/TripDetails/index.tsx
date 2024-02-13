import type { Trip } from '../Trips';
import { Trans, useTranslation } from 'next-i18next';
import { signIn, useSession } from 'next-auth/react';
import { Alert } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import TripData from './TripData';
import styles from './TripDetails.module.css';
import UserData from './UserData';
import TripDescription from './TripDescription';

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
      <UserData user={trip.driver} />
      <TripDescription content={trip.description} />
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
