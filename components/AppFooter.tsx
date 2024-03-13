import Link from 'next/link';
import { Layout, Row, Col } from 'antd';
import { useTranslation } from 'next-i18next';
import Logo from '../assets/logoWhite.svg';
import styles from '../styles/AppFooter.module.css';

type FooterLink = {
  path: string;
  translationKey: string;
};

const legalFooterLinks: FooterLink[] = [
  {
    path: '/terms-and-conditions',
    translationKey: 'footer.terms',
  },
  {
    path: '/privacy-policy',
    translationKey: 'footer.privacy',
  },
  {
    path: '/contacts',
    translationKey: 'footer.contacts',
  },
];

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <Footer className={styles.root}>
      <div className={styles.content}>
        <Row className={styles.links} gutter={[10, 16]}>
          <Col xs={{ order: 3 }} lg={{ span: 12, order: 1 }}>
            <div className={styles.logoContainer}>
              <Logo />
            </div>
            <div className={styles.copy}>
              &copy; {new Date().getFullYear()} EUbyCar.com
            </div>
          </Col>
          <Col xs={{ order: 1 }} lg={{ span: 6, order: 2 }}>
            <h4>{t('footer.infoColumn')}</h4>
            <div className={styles.linkContainer}>
              <Link href="/faq">{t('footer.faq')}</Link>
            </div>
          </Col>
          <Col xs={{ order: 2 }} lg={{ span: 6, order: 3 }}>
            <h4>{t('footer.legalColumn')}</h4>
            {legalFooterLinks.map((link) => (
              <div key={link.path} className={styles.linkContainer}>
                <Link href={link.path}>{t(link.translationKey)}</Link>
              </div>
            ))}
          </Col>
        </Row>
      </div>
    </Footer>
  );
};

export default AppFooter;
