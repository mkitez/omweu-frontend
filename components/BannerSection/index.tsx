import TripSearch from '../TripSearch';
import Banner from './Banner';
import styles from './BannerSection.module.css';

const BannerSection = () => {
  return (
    <section className={styles.root}>
      <Banner />
      <TripSearch />
    </section>
  );
};

export default BannerSection;
