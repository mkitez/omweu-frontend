import { Alert } from 'antd';
import { Trans, useTranslation } from 'next-i18next';
import Link from 'next/link';

import styles from '../../styles/AddContacts.module.css';
import ContactDetailsForm from '../ContactDetailsForm';
import { User } from '../Trips';

type Props = {
  user?: User;
  onSubmit?: () => void;
};

const AddContactsForm: React.FC<Props> = ({ user, onSubmit }) => {
  const { t } = useTranslation(['dashboard', 'common']);

  const shouldUpdateEmail = user?.email === '';
  const awaitingEmailConfirmation = user?.email && !user.is_email_confirmed;
  return (
    <>
      <div className={styles.root}>
        <h1>{t('addContacts.title')}</h1>
        {(() => {
          if (awaitingEmailConfirmation) {
            return (
              <Alert
                type="info"
                message={t('addContacts.emailNotConfirmedTitle')}
                description={t('addContacts.emailNotConfirmedBody')}
                showIcon
              />
            );
          }
          return (
            <>
              <div className={styles.info}>
                <p>
                  <Trans
                    components={[
                      <Link key={0} href="/dashboard/profile">
                        x
                      </Link>,
                    ]}
                  >
                    {t('addContacts.infoTextOne')}
                  </Trans>
                </p>
                {shouldUpdateEmail && <p>{t('addContacts.infoTextTwo')}</p>}
              </div>
              <ContactDetailsForm
                updateEmail={shouldUpdateEmail}
                onSubmit={onSubmit}
              />
            </>
          );
        })()}
      </div>
    </>
  );
};

export default AddContactsForm;
