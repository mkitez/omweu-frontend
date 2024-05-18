import { CheckCircleFilled, UserOutlined } from '@ant-design/icons';
import { Avatar, Col, Row, theme } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import InlineCar from '../InlineCar';
import Amenities from '../TripDetails/Amenities';
import { User } from '../Trips';
import styles from './PublicUserProfile.module.css';

type Props = {
  user: User;
};

const imageSize = 180;

const PublicUserProfile: React.FC<Props> = ({ user }) => {
  const { t, i18n } = useTranslation(['profile', 'common']);
  const { token } = theme.useToken();

  const image = (
    <Image
      src={user.photo}
      width={imageSize}
      height={imageSize}
      alt={`${t('avatar_alt_text')} ${user.first_name}`}
    />
  );

  let fullName = user.last_name
    ? `${user.first_name} ${user.last_name}`
    : user.first_name;

  return (
    <div className={styles.root}>
      <h1>{t('title')}</h1>
      <Row gutter={[20, 20]} className={styles.row}>
        <Col xs={24} md={6} className={styles.avatarCol}>
          <Avatar
            icon={<UserOutlined />}
            size={imageSize}
            src={user.photo && image}
          />
        </Col>
        <Col>
          <div className={styles.name}>{fullName}</div>
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
        <Row>
          <Col xs={24}>
            <h2>{t('about')}</h2>
            {user?.about && <div className={styles.about}>{user.about}</div>}
            <Amenities amenities={user.driver_preferences} />
          </Col>
        </Row>
      )}
      {user.cars.length > 0 && (
        <Row>
          <h2>{t('cars')}</h2>
          {user.cars.map((car) => (
            <Col key={car.id} xs={24}>
              <InlineCar car={car} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default PublicUserProfile;
