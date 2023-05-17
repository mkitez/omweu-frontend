import BannerImg from '../assets/bannerImg.svg';
import styles from '../styles/Banner.module.css';

const Banner = () => (
  <div className="content">
    <div className={styles.banner}>
      <div className={styles.bannerContainer}>
        <BannerImg />
      </div>
      <div className={styles.textContainer}>
        <h1>
          <span className="highlight">Экономьте</span> на поездках в Европу
        </h1>
      </div>
    </div>
  </div>
);

export default Banner;
