import { Layout, Row, Col } from 'antd';
import Logo from '../assets/logoWhite.svg';
import styles from '../styles/AppFooter.module.css';

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer className={styles.root}>
      <div className={styles.content}>
        <Row>
          <Col>
            <div className={styles.logoContainer}>
              <Logo />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className={styles.copyright}>
              &copy; EUbyCar.com, {new Date().getFullYear()}
            </div>
          </Col>
        </Row>
      </div>
    </Footer>
  );
};

export default AppFooter;
