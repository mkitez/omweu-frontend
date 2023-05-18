import { useTranslation, Trans } from 'next-i18next';
import { Row, Col } from 'antd';
import PromoBlock from './PromoBlock';
import Money from '../../assets/money.svg';
import Cup from '../../assets/cup.svg';
import ThumbUp from '../../assets/thumbUp.svg';
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
              icon={<Money width={40} height="100%" />}
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
              icon={<ThumbUp width={40} height="100%" />}
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
