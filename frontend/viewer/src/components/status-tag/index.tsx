import { Intent, Tag } from '@blueprintjs/core';
import React from 'react';

const intentFromStatus = (status: Protos.Claim['status']) => {
  switch (status) {
    case 1:
      return Intent.PRIMARY;
    case 2:
      return Intent.WARNING;
    case 3:
      return Intent.SUCCESS;
    default:
      return Intent.NONE;
  }
};

interface Props {
  status: number;
}

export default function StatusTag({ status }: Props) {
  return (
    <Tag large minimal intent={intentFromStatus(status)}>
      {status}
    </Tag>
  );
}
