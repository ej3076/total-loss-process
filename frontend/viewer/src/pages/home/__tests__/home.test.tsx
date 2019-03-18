import React from 'react';
import { create } from 'react-test-renderer';

import Home from '../';

describe('<Home />', () => {
  it('should render correctly', () => {
    const tree = create(<Home />);
    expect(tree).toMatchSnapshot();
  });
});
