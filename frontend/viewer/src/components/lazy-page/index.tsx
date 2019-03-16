import React, { LazyExoticComponent, Suspense } from 'react';

export default function LazyPage(Component: LazyExoticComponent<any>) {
  return (props: any) => (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
}
