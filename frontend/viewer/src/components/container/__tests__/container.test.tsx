import React from 'react';
import { create } from 'react-test-renderer';

import Container from '../';

describe('<Container />', () => {
  it('should render correctly', () => {
    const tree = create(
      <Container>
        <h1>Hello world</h1>
      </Container>,
    );
    expect(tree).toMatchSnapshot();
  });
});
