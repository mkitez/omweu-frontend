import { Col, Row } from 'antd';
import { Trans, useTranslation } from 'next-i18next';
import Link from 'next/link';

import ForWhoBlock from './ForWhoBlock';
import styles from './HowItWorksSection.module.css';

const HowItWorksSection = () => {
  const { t } = useTranslation('home');
  return (
    <section className={styles.root}>
      <div className="content">
        <h2>
          <Trans
            components={{
              mark: <span className="highlight" />,
            }}
          >
            {t('sectionTwo.title')}
          </Trans>
        </h2>
        <Row gutter={[30, 30]} className={styles.steps}>
          <Col md={12} lg={6}>
            <ForWhoBlock title="01">
              {t('sectionTwo.blocks.stepOne')}
            </ForWhoBlock>
          </Col>
          <Col md={12} lg={6}>
            <ForWhoBlock title="02">
              {t('sectionTwo.blocks.stepTwo')}
            </ForWhoBlock>
          </Col>
          <Col md={12} lg={6}>
            <ForWhoBlock title="03">
              <Trans
                components={[
                  <Link key={0} href="/faq" className={styles.link}>
                    x
                  </Link>,
                ]}
              >
                {t('sectionTwo.blocks.stepThree')}
              </Trans>
            </ForWhoBlock>
          </Col>
          <Col md={12} lg={6}>
            <ForWhoBlock title="04">
              {t('sectionTwo.blocks.stepFour')}
            </ForWhoBlock>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default HowItWorksSection;
