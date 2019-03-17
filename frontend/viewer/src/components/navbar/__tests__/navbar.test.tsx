import React from 'react';
import { MemoryRouter } from 'react-router';
import { create } from 'react-test-renderer';

import Navbar from '../';

describe('<Navbar />', () => {
  it('should render light mode correctly', () => {
    const tree = create(
      <MemoryRouter>
        <Navbar mode="" toggleMode={jest.fn()} />
      </MemoryRouter>,
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render dark mode correctly', () => {
    const tree = create(
      <MemoryRouter>
        <Navbar mode="DARK_MODE" toggleMode={jest.fn()} />
      </MemoryRouter>,
    );
    expect(tree).toMatchSnapshot();
  });
});
