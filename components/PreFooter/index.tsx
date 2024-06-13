import { useTranslation } from 'next-i18next';
import { PropsWithChildren } from 'react';

import styles from './SearchFooter.module.css';

const PreFooter: React.FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation('common');
  return (
    <div className={styles.root}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default PreFooter;
