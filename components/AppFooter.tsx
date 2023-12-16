import { Layout, Row, Col } from 'antd';
import Logo from '../assets/logoWhite.svg';
import styles from '../styles/AppFooter.module.css';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const { Footer } = Layout;

const AppFooter = () => {
  const { t } = useTranslation('common');
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
        <Row className={styles.links} gutter={[10, 16]}>
          <Col xs={24} lg={8}>
            &copy; {new Date().getFullYear()} EUbyCar.com
          </Col>
          <Col xs={24} lg={4}>
            <Link href="/contacts">{t('footer.contacts')}</Link>
          </Col>
          <Col xs={24} lg={6}>
            <Link href="/privacy-policy">{t('footer.privacy')}</Link>
          </Col>
          <Col xs={24} lg={6}>
            <Link href="/terms-and-conditions">{t('footer.terms')}</Link>
          </Col>
        </Row>
      </div>
    </Footer>
  );
};

export default AppFooter;
