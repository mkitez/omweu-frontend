import { Trans, useTranslation } from 'next-i18next';

import styles from './SearchFooter.module.css';

type Props = {
  route: string;
  date: string;
};

const SearchFooter: React.FC<Props> = ({ route, date }) => {
  const { t } = useTranslation('common');
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Trans values={{ route, date }}>{t('search_footer')}</Trans>
      </div>
    </div>
  );
};

export default SearchFooter;
