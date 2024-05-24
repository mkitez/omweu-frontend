import { Button, Form, FormInstance, message } from 'antd';
import { useTranslation } from 'next-i18next';

import { useUserApi } from '../../hooks/api/useUserApi';
import { UserFormData } from '../UserProfileForm';
import DriverPreferencesFormFields, {
  defaultValues,
} from '../UserProfileForm/DriverPreferencesFormFields';

type Props = {
  showSubmitButton?: boolean;
  form?: FormInstance;
  onSubmit?: () => void;
  onError?: () => void;
};

const DriverPreferencesForm: React.FC<Props> = ({
  form,
  showSubmitButton,
  onSubmit,
}) => {
  const userApi = useUserApi();
  const { t } = useTranslation(['dashboard', 'common']);

  const handleSubmit = async (formData: UserFormData) => {
    try {
      await userApi.updateSelf(formData);
      message.success(t('profile.changes_saved'));
      if (onSubmit) {
        onSubmit();
      }
    } catch (e) {
      message.error(t('errors.common', { ns: 'common' }) as string);
    }
  };

  const initialValues = { driver_preferences: defaultValues };
  return (
    <Form form={form} onFinish={handleSubmit} initialValues={initialValues}>
      <DriverPreferencesFormFields />
      {showSubmitButton && (
        <Form.Item>
          <Button key={0} htmlType="submit" type="primary">
            {t('driver_preferences.save_and_continue')}
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default DriverPreferencesForm;
