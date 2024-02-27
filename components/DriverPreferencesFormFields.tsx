import { Button, Form, Row, Switch, Radio, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'next-i18next';
import { DriverPreferences } from './Trips';
import styles from '../styles/UserProfileForm.module.css';

const { Item } = Form;

const defaultValues: DriverPreferences = {
  smoking_allowed: false,
  pets_allowed: false,
  music_allowed: false,
  can_deliver: false,
  food_allowed: false,
  max_two_on_backseat: false,
  gender: null,
};

const DriverPreferencesFormFields: React.FC<{}> = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const form = Form.useFormInstance();

  const fieldName = 'driver_preferences';
  const driverPreferences = Form.useWatch(fieldName);

  return (
    <div className={styles.driverPreferences}>
      <div className={styles.helpText}>{t('driver_preferences.help_text')}</div>
      <Item name={fieldName} noStyle>
        {(() => {
          if (driverPreferences === null) {
            return (
              <Row>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => form.setFieldValue(fieldName, defaultValues)}
                >
                  {t('driver_preferences.add_button_label')}
                </Button>
              </Row>
            );
          }

          const booleanFields: (keyof DriverPreferences)[] = [
            'can_deliver',
            'pets_allowed',
            'max_two_on_backseat',
            'music_allowed',
            'food_allowed',
            'smoking_allowed',
          ];
          return (
            <>
              <Row gutter={20}>
                {booleanFields.map((subField) => (
                  <Col key={subField} md={12}>
                    <Item
                      label={t(`driver_preferences.labels.${subField}`)}
                      name={[fieldName, subField]}
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
                name={[fieldName, 'gender']}
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
      </Item>
    </div>
  );
};

export default DriverPreferencesFormFields;
