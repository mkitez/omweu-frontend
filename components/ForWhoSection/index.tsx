import { useTranslation, Trans } from 'next-i18next';
import { Row, Col } from 'antd';
import ForWhoBlock from './ForWhoBlock';
import styles from '../../styles/ForWhoSection.module.css';

const ForWhoSection = () => {
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
        <Row>
          <Col md={6}>
            <ForWhoBlock title="01">
              {t('sectionTwo.blocks.stepOne')}
            </ForWhoBlock>
          </Col>
          <Col md={6}>
            <ForWhoBlock title="02">
              {t('sectionTwo.blocks.stepTwo')}
            </ForWhoBlock>
          </Col>
          <Col md={6}>
            <ForWhoBlock title="03">
              {t('sectionTwo.blocks.stepThree')}
            </ForWhoBlock>
          </Col>
          <Col md={6}>
            <ForWhoBlock title="04">
              {t('sectionTwo.blocks.stepFour')}
            </ForWhoBlock>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default ForWhoSection;
