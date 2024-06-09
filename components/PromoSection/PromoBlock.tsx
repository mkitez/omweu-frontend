import { FC, PropsWithChildren, ReactElement } from 'react';

import styles from './PromoBlock.module.css';

interface Props extends PropsWithChildren {
  title: string;
  icon?: ReactElement;
}

const PromoBlock: FC<Props> = ({ title, icon, children }) => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.icon}>{icon}</div>
        <h4>{title}</h4>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default PromoBlock;
