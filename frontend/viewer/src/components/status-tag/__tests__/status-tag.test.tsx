import React from 'react';
import { create } from 'react-test-renderer';

import StatusTag from '../';

describe('<StatusTag />', () => {
  it('should render appropriately', () => {
    expect(create(<StatusTag status={1} />)).toMatchSnapshot();
    expect(create(<StatusTag status={2} />)).toMatchSnapshot();
    expect(create(<StatusTag status={3} />)).toMatchSnapshot();
    expect(create(<StatusTag status={4} />)).toMatchSnapshot();
    expect(create(<StatusTag status={23453} />)).toMatchSnapshot();
    expect(create(<StatusTag status={0} />)).toMatchSnapshot();
    expect(create(<StatusTag status={-123} />)).toMatchSnapshot();
  });
});
