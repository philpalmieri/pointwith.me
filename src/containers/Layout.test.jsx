// Theirs
import React from 'react';
import { render } from '@testing-library/react';

// Ours
import Layout from './Layout';

describe('layout', () => {
  it('should render', () => {
    expect.hasAssertions();

    const { baseElement } = render(
      <Layout>
        <p>Content goes here.</p>
      </Layout>
    );

    expect(baseElement).toHaveTextContent('Content goes here.');
    expect(baseElement).toMatchSnapshot();
  });
});
