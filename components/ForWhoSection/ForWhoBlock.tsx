import { FC, PropsWithChildren } from 'react';
import styles from '../../styles/ForWhoBlock.module.css';

interface Props extends PropsWithChildren {
  title: string;
}

const PromoBlock: FC<Props> = ({ title, children }) => {
  return (
    <div className={styles.root}>
      <h3>{title}</h3>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default PromoBlock;
