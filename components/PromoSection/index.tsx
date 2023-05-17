import { Row, Col } from 'antd';
import PromoBlock from './PromoBlock';
import Cup from '../../assets/cup.svg';
import styles from '../../styles/PromoSection.module.css';

const PromoSection = () => {
  return (
    <section className={styles.container}>
      <div className="content">
        <h2>
          <span className="highlight highlight-contrast">Экономьте</span> на
          поездках в Европу
        </h2>
        <Row gutter={[40, 40]}>
          <Col md={8}>
            <PromoBlock
              title="Lorem ipsum dolor sit"
              icon={<Cup width={48} height="100%" />}
            >
              Lorem ipsum dolor sit amet consectetur. Neque quam pellentesque
              malesuada elit nunc mattis. In quis ipsum purus risus in lobortis
              neque bibendum. Eget quis a a non mauris mollis. Mauris fringilla
              odio luctus maecenas lacus pulvinar. Luctus fringilla diam mi enim
              at lacinia quisque.
            </PromoBlock>
          </Col>
          <Col md={8}>
            <PromoBlock
              title="Lorem ipsum dolor sit"
              icon={<Cup width={48} height="100%" />}
            >
              Lorem ipsum dolor sit amet consectetur. Neque quam pellentesque
              malesuada elit nunc mattis. In quis ipsum purus risus in lobortis
              neque bibendum. Eget quis a a non mauris mollis. Mauris fringilla
              odio luctus maecenas lacus pulvinar. Luctus fringilla diam mi enim
              at lacinia quisque.
            </PromoBlock>
          </Col>
          <Col md={8}>
            <PromoBlock
              title="Lorem ipsum dolor sit"
              icon={<Cup width={48} height="100%" />}
            >
              Lorem ipsum dolor sit amet consectetur. Neque quam pellentesque
              malesuada elit nunc mattis. In quis ipsum purus risus in lobortis
              neque bibendum. Eget quis a a non mauris mollis. Mauris fringilla
              odio luctus maecenas lacus pulvinar. Luctus fringilla diam mi enim
              at lacinia quisque.
            </PromoBlock>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default PromoSection;
