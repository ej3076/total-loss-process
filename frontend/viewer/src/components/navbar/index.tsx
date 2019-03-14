import { Alignment, Button, Navbar as Nav } from '@blueprintjs/core';
import React from 'react';

import Container from '../container';
import LinkButton from '../link-button';

interface Props {
  mode: string;
  toggleMode(): void;
}

export default function Navbar({ mode, toggleMode }: Props) {
  const modeIcon = mode ? 'flash' : 'moon';
  const modeTitle = mode ? 'Light mode' : 'Dark mode';
  return (
    <Nav>
      <Container>
        <Nav.Group align={Alignment.LEFT}>
          <LinkButton minimal large to="/">
            <strong>ClaimTrack</strong>
          </LinkButton>
        </Nav.Group>
        <Nav.Group align={Alignment.RIGHT}>
          <LinkButton minimal to="/feed" text="Feed" icon="feed" />
          <LinkButton minimal to="/claims" text="Claims" icon="document" />
          <Nav.Divider />
          <Button
            minimal
            onClick={toggleMode}
            icon={modeIcon}
            title={modeTitle}
          />
        </Nav.Group>
      </Container>
    </Nav>
  );
}
