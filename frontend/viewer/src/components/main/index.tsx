import classNames from 'classnames';
import React, { HTMLProps } from 'react';

import styles from './main.module.scss';

export default function Main({
  children,
  className,
}: HTMLProps<HTMLMainElement>) {
  return (
    <main role="main" className={classNames(className, styles.main)}>
      {children}
    </main>
  );
}
