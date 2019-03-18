import React from 'react';
import { create } from 'react-test-renderer';

import Main from '../';

describe('<Main />', () => {
  it('should render correctly', () => {
    const tree = create(
      <Main>
        <h1>Hello world</h1>
      </Main>,
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with extra classnames', () => {
    const tree = create(
      <Main className="foobar">
        <h1>Hello world</h1>
      </Main>,
    );
    expect(tree).toMatchSnapshot();
  });
});
