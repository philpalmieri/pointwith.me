import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react'

const propTypes = {
  children: PropTypes.node.isRequired,
  contentCenter: PropTypes.bool
};

const defaultProps = {
  contentCenter: false
};

const Layout = ({ children, contentCenter }) => {
  return (
    <Container text style={{ marginTim: '7em' }}>
      <header>
        <h1>PointWith.me: Planning Poker for Remote Teams!</h1>
      </header>
      <main className={contentCenter ? 'content-center' : ''}>{children}</main>
      <Container>
        <footer>
          <p>
            &copy; 2019 Phillip Palmieri
          </p>
        </footer>
      </Container>
    </Container>
  );
};

Layout.propTypes = propTypes;
Layout.defaultProps = defaultProps;

export default Layout;
