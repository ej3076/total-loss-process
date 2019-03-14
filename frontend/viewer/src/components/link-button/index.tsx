import { AnchorButton, IButtonProps } from '@blueprintjs/core';
import React, { MouseEvent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

interface Props extends RouteComponentProps, IButtonProps {
  to: string;
}

function LinkButton({ to, history, ...rest }: Props) {
  const { location, match, staticContext, ...props } = rest;
  const onClick = props.onClick || (() => void 0);
  return (
    <AnchorButton
      {...props}
      onClick={(e: MouseEvent<HTMLElement>) => {
        onClick(e);
        history.push(to);
      }}
    />
  );
}

export default withRouter(LinkButton);
