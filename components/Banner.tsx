import Image from 'next/image';
import bannerImg from '../assets/bannerImg.svg';
import styles from '../styles/Banner.module.css';

const Banner = () => (
  <div className="content">
    <div className={styles.banner}>
      <div className={styles.bannerContainer}>
        <Image src={bannerImg} alt="eubycar.com banner" />
      </div>
      <div className={styles.textContainer}>
        <h1>
          <span className={styles.highlight}>Экономьте</span> на поездках в
          Европу
        </h1>
      </div>
    </div>
  </div>
);

export default Banner;
