import { useTranslation, Trans } from 'next-i18next';
import BannerImg from '../assets/bannerImg.svg';
import styles from '../styles/Banner.module.css';

const Banner = () => {
  const { t } = useTranslation('home');
  return (
    <div className="content">
      <div className={styles.banner}>
        <div className={styles.bannerContainer}>
          <BannerImg />
        </div>
        <div className={styles.textContainer}>
          <h1>
            <Trans components={{ mark: <span className="highlight" /> }}>
              {t('banner.title')}
            </Trans>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Banner;
