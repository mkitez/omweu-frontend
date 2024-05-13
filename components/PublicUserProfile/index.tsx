import { CheckCircleFilled, UserOutlined } from '@ant-design/icons';
import { Avatar, Col, Row, theme } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import Amenities from '../TripDetails/Amenities';
import { User } from '../Trips';
import styles from './PublicUserProfile.module.css';

type Props = {
  user: User;
};

const imageSize = 180;

const PublicUserProfile: React.FC<Props> = ({ user }) => {
  const { t } = useTranslation(['profile', 'common']);
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
          <Avatar icon={<UserOutlined />} size={imageSize} src={image} />
        </Col>
        <Col>
          <div className={styles.name}>{fullName}</div>
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
    </div>
  );
};

export default PublicUserProfile;
