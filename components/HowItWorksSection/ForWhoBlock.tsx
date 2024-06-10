import { FC, PropsWithChildren } from 'react';

import styles from './HowItWorksSection.module.css';

interface Props extends PropsWithChildren {
  title: string;
}

const PromoBlock: FC<Props> = ({ title, children }) => {
  return (
    <div className={styles.step}>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default PromoBlock;
