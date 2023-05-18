import { useTranslation, Trans } from 'next-i18next';
import { Row, Col } from 'antd';
import PromoBlock from './PromoBlock';
import Cup from '../../assets/cup.svg';
import styles from '../../styles/PromoSection.module.css';

const PromoSection = () => {
  const { t } = useTranslation('home');
  return (
    <section className={styles.container}>
      <div className="content">
        <h2>
          <Trans
            components={{
              mark: <span className="highlight highlight-contrast" />,
            }}
          >
            {t('sectionOne.title')}
          </Trans>
        </h2>
        <Row gutter={[40, 40]}>
          <Col md={8}>
            <PromoBlock
              title={t('sectionOne.blocks.0.title')}
              icon={<Cup width={40} height="100%" />}
            >
              {t('sectionOne.blocks.0.text')}
            </PromoBlock>
          </Col>
          <Col md={8}>
            <PromoBlock
              title={t('sectionOne.blocks.1.title')}
              icon={<Cup width={40} height="100%" />}
            >
              {t('sectionOne.blocks.1.text')}
            </PromoBlock>
          </Col>
          <Col md={8}>
            <PromoBlock
              title={t('sectionOne.blocks.2.title')}
              icon={<Cup width={40} height="100%" />}
            >
              {t('sectionOne.blocks.2.text')}
            </PromoBlock>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default PromoSection;
