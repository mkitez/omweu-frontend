import { Layout, Row, Col } from 'antd';
import Logo from '../assets/logoWhite.svg';
import styles from '../styles/AppFooter.module.css';
import Link from 'next/link';

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
        <Row className={styles.links} gutter={[10, 10]}>
          <Col xs={24} lg={8}>
            &copy; EUbyCar.com, {new Date().getFullYear()}
          </Col>
          <Col xs={24} lg={4}>
            <Link href="/impressum">Impressum</Link>
          </Col>
          <Col xs={24} lg={6}>
            <Link href="/privacy-policy">Политика конфиденциальности</Link>
          </Col>
          <Col xs={24} lg={6}>
            <Link href="/terms-and-conditions">Условия использования</Link>
          </Col>
        </Row>
      </div>
    </Footer>
  );
};

export default AppFooter;
