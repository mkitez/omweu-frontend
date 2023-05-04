import Image from 'next/image';
import { Montserrat } from 'next/font/google';
import bannerImg from '../assets/bannerImg.svg';
import styles from '../styles/Banner.module.css';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
});

const Banner = () => (
  <div className={styles.banner}>
    <div className={styles.bannerContainer}>
      <Image src={bannerImg} alt="eubycar.com banner" />
    </div>
    <div className={styles.textContainer}>
      <h1 className={montserrat.className}>
        <span className={styles.highlight}>Экономьте</span> на поездках в Европу
      </h1>
    </div>
  </div>
);

export default Banner;
