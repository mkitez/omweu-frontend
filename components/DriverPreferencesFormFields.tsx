import { useState } from 'react';
import { Button, Form, Row, Switch, Radio, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'next-i18next';
import { User, DriverPreferences } from './Trips';
import styles from '../styles/UserProfileForm.module.css';

const { Item } = Form;

type Props = {
  data: User['driver_preferences'];
};

const DriverPreferencesFormFields: React.FC<Props> = ({ data }) => {
  const { t } = useTranslation(['dashboard', 'common']);
  const [showFields, setShowFields] = useState(false);

  return (
    <div className={styles.driverPreferences}>
      <div className={styles.helpText}>{t('driver_preferences.help_text')}</div>
      {(() => {
        if (data === null && !showFields) {
          return (
            <Row>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => setShowFields(true)}
              >
                {t('driver_preferences.add_button_label')}
              </Button>
            </Row>
          );
        }

        const parentField = 'driver_preferences';
        const booleanFields: (keyof DriverPreferences)[] = [
          'smoking_allowed',
          'can_deliver',
          'food_allowed',
          'max_two_on_backseat',
          'music_allowed',
          'pets_allowed',
        ];
        return (
          <>
            <Row gutter={20}>
              {booleanFields.map((fieldName) => (
                <Col key={fieldName} md={12}>
                  <Item
                    label={t(`driver_preferences.labels.${fieldName}`)}
                    name={[parentField, fieldName]}
                    valuePropName="checked"
                    labelCol={{ span: 20 }}
                    wrapperCol={{ span: 4 }}
                    labelAlign="left"
                  >
                    <Switch />
                  </Item>
                </Col>
              ))}
            </Row>
            <Item
              name={[parentField, 'gender']}
              label={t('driver_preferences.labels.gender')}
              labelAlign="left"
            >
              <Radio.Group>
                <Radio value={null}>
                  {t('driver_preferences.gender_values.irrelevant')}
                </Radio>
                <Radio value={false}>
                  {t('driver_preferences.gender_values.female')}
                </Radio>
                <Radio value={true}>
                  {t('driver_preferences.gender_values.male')}
                </Radio>
              </Radio.Group>
            </Item>
          </>
        );
      })()}
    </div>
  );
};

export default DriverPreferencesFormFields;
