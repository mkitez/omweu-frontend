import { CheckCircleFilled, UserOutlined } from '@ant-design/icons';
import { Avatar, Col, Row, theme } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useCallback } from 'react';

import { calculateAge } from '../../utils/commonUtils';
import InlineCarComponent from '../InlineCar';
import Amenities from '../TripDetails/Amenities';
import { User } from '../Trips';
import styles from './PublicUserProfile.module.css';

type Props = {
  user: User;
};

const IMAGE_SIZE = 180;

const PublicUserProfile: React.FC<Props> = ({ user }) => {
  const { t, i18n } = useTranslation(['profile', 'common']);
  const { token } = theme.useToken();

  const getYearTranslation = useCallback(
    (value: number) => {
      const lastDigit = value % 10;
      if (lastDigit === 1) {
        return t('years.singular');
      }
      if (lastDigit >= 2 && lastDigit <= 4) {
        return t(['years.plural_2_to_4', 'years.plural']);
      }
      return t('years.plural');
    },
    [t]
  );

  const image = (
    <Image
      src={user.photo}
      width={IMAGE_SIZE}
      height={IMAGE_SIZE}
      alt={`${t('avatar_alt_text')} ${user.first_name}`}
    />
  );

  const fullName = user.last_name
    ? `${user.first_name} ${user.last_name}`
    : user.first_name;

  let age;
  if (user.birth_date) {
    const birthDate = dayjs(user.birth_date, 'YYYY-MM-DD');
    age = calculateAge(birthDate);
  }

  return (
    <div className={styles.root}>
      <h1>{t('title')}</h1>
      <Row gutter={[20, 20]} className={styles.row}>
        <Col xs={24} md={6} className={styles.avatarCol}>
          <Avatar
            icon={<UserOutlined />}
            size={IMAGE_SIZE}
            src={user.photo && image}
          />
        </Col>
        <Col>
          <div className={styles.name}>{fullName}</div>
          {age && (
            <div className={styles.age}>
              {age} {getYearTranslation(age)}
            </div>
          )}
          <div className={styles.joinDate}>
            {t('joined_since')}{' '}
            {dayjs(user.date_joined).locale(i18n.language).format('MMM YYYY')}
          </div>
          {user.is_email_confirmed && (
            <div className={styles.emailConfirmed}>
              <CheckCircleFilled style={{ color: token.colorSuccess }} />{' '}
              {t('email_confirmed')}
            </div>
          )}
        </Col>
      </Row>
      {(user.about || user.driver_preferences) && (
        <div className={styles.profileSection}>
          <Col xs={24}>
            <h2>{t('about')}</h2>
            {user?.about && <div className={styles.about}>{user.about}</div>}
            <Amenities amenities={user.driver_preferences} />
          </Col>
        </div>
      )}
      {user.cars.length > 0 && (
        <div className={styles.profileSection}>
          <h2>{t('cars')}</h2>
          <Row gutter={[10, 10]}>
            {user.cars
              .sort((a) => (a.is_primary ? -1 : 0))
              .map((car) => (
                <Col key={car.id} xs={12} md={6}>
                  <InlineCarComponent car={car} showYear />
                </Col>
              ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default PublicUserProfile;
