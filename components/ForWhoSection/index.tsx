import { Row, Col } from 'antd';
import ForWhoBlock from './ForWhoBlock';
import styles from '../../styles/ForWhoSection.module.css';

const ForWhoSection = () => {
  return (
    <section className={styles.root}>
      <div className="content">
        <h2>
          <span className="highlight">Для кого</span> этот сервис
        </h2>
        <Row gutter={10}>
          {[1, 2, 3, 4].map((index) => (
            <Col md={6} key={index}>
              <ForWhoBlock title={`0${index}`}>
                Lorem ipsum dolor sit amet consectetur. Neque quam pellentesque
                malesuada elit nunc mattis. In quis ipsum purus risus in
                lobortis neque bibendum. Eget quis a a non mauris mollis.
              </ForWhoBlock>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default ForWhoSection;
