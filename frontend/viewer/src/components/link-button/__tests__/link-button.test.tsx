import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter, Router, RouterProps } from 'react-router';
import { create } from 'react-test-renderer';

import LinkButton from '../';

describe('<LinkButton />', () => {
  it('should render correctly', () => {
    const tree = create(
      <MemoryRouter>
        <LinkButton to="/foo" />
      </MemoryRouter>,
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render with additional props', () => {
    const tree = create(
      <MemoryRouter>
        <LinkButton
          to="/foo"
          // blueprint prop
          intent="primary"
          // html props
          aria-label="hello"
          data-my-custom-data-attribute="foobar"
        />
      </MemoryRouter>,
    );
    expect(tree).toMatchSnapshot();
  });

  it('should navigate on click', () => {
    const wrapper = mount(
      <MemoryRouter>
        <LinkButton to="/foo" />
      </MemoryRouter>,
    );
    const button = wrapper.find(LinkButton);
    const { history } = wrapper.find<RouterProps>(Router).props();

    expect(history.length).toBe(1);
    expect(history.location.pathname).toBe('/');

    button.simulate('click');

    expect(history.length).toBe(2);
    expect(history.location.pathname).toBe('/foo');
  });
});
