import React from 'react';
import PropTypes from 'prop-types';
import { Container, Image, Menu } from 'semantic-ui-react'

const propTypes = {
  children: PropTypes.node.isRequired,
  contentCenter: PropTypes.bool
};

const defaultProps = {
  contentCenter: false
};

const Layout = ({ children, contentCenter }) => {
  return (
    <Container text style={{ marginTim: '1em' }}>
      <Menu fixed='top' inverted>
        <Container text id="topBranding">
          <Image size='mini' src='/favicon-32x32.png' style={{ marginRight: '1.5em' }} />
          <p>PointWith.me: Planning Poker for Remote Teams!</p>
        </Container>
      </Menu>
      <main className={contentCenter ? 'content-center' : ''}>{children}</main>
      <Container>
        <footer>
          <p>
            <a href="https://twitter.com/philpalmieri">&copy; 2019 Phillip Palmieri</a>
          </p>
        </footer>
      </Container>
    </Container>
  );
};

Layout.propTypes = propTypes;
Layout.defaultProps = defaultProps;

export default Layout;
