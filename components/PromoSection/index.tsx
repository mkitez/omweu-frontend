import { Col, Row } from 'antd';
import { Trans, useTranslation } from 'next-i18next';

import Checkmark from '../../assets/checkmark-circle-svgrepo-com.svg';
import Safety from '../../assets/shield-alt-1-svgrepo-com.svg';
import Wallet from '../../assets/wallet-svgrepo-com.svg';
import PromoBlock from './PromoBlock';
import styles from './PromoSection.module.css';

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
        <Row gutter={[30, 30]}>
          <Col md={8}>
            <PromoBlock
              title={t('sectionOne.blocks.0.title')}
              icon={<Checkmark />}
            >
              {t('sectionOne.blocks.0.content')}
            </PromoBlock>
          </Col>
          <Col md={8}>
            <PromoBlock
              title={t('sectionOne.blocks.1.title')}
              icon={<Safety />}
            >
              {t('sectionOne.blocks.1.content')}
            </PromoBlock>
          </Col>
          <Col md={8}>
            <PromoBlock
              title={t('sectionOne.blocks.2.title')}
              icon={<Wallet />}
            >
              {t('sectionOne.blocks.2.content')}
            </PromoBlock>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default PromoSection;
