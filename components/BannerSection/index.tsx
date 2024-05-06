import TripSearch from '../TripSearch';
import Banner from './Banner';
import styles from './BannerSection.module.css';

const BannerSection = () => {
  return (
    <section className={styles.root}>
      <Banner />
      <div className={styles.container}>
        <TripSearch />
      </div>
    </section>
  );
};

export default BannerSection;
