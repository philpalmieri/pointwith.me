import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Button, Divider } from 'semantic-ui-react';

import Layout from '../../containers/Layout';
import SocialButtonList from '../SocialButtonList';
import SocialProfileList from '../SocialProfileList';
import { auth } from '../../firebase';

class Dashboard extends Component {
  static propTypes = {
    providerData: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  static defaultProps = {
    providerData: []
  };

  state = {
    buttonList: {
      github: {
        visible: true,
        provider: () => {
          const provider = auth.githubOAuth();
          provider.addScope('user');
          return provider;
        }
      },
      google: {
        visible: true,
        provider: () => auth.googleOAuth()
      },
      //twitter: {
        //visible: true,
        //provider: () => auth.twitterOAuth()
      //},
      //facebook: {
        //visible: true,
        //provider: () => auth.facebookOAuth()
      //}
    },
    providerData: this.props.providerData
  };

  componentDidMount() {
    this.updateProviders(this.state.providerData);
  }

  handleCurrentProviders = providerData => {
    this.updateProviders(providerData);
  };

  updateProviders = providerData => {
    let buttonList = { ...this.state.buttonList };

    providerData.forEach(provider => {
      const providerName = provider.providerId.split('.')[0];
      buttonList = this.updateButtonList(buttonList, providerName, false);
    });

    this.setState({ buttonList, providerData });
  };

  handleUnliknedProvider = (providerName, providerData) => {
    if (providerData.length < 1) {
      auth
        .getAuth()
        .currentUser.delete()
        .then(() => console.log('User Deleted'))
        .catch(() => console.error('Error deleting user'));
    }

    let buttonList = { ...this.state.buttonList };
    buttonList = this.updateButtonList(buttonList, providerName, true);

    this.setState({ buttonList, providerData });
  };

  updateButtonList = (buttonList, providerName, visible) => ({
    ...buttonList,
    [providerName]: {
      ...buttonList[providerName],
      visible
    }
  });

  render() {
    return (
      <Layout>
        <Container>
          <h1>Secure Area</h1>
          <SocialProfileList
            auth={auth.getAuth}
            providerData={this.state.providerData}
            unlinkedProvider={this.handleUnliknedProvider}
          />
          <p style={{ textAlign: 'center' }}>
            <strong>Connect Other Social Accounts</strong>
          </p>
          <SocialButtonList
            buttonList={this.state.buttonList}
            auth={auth.getAuth}
            currentProviders={this.handleCurrentProviders}
          />
        </Container>
        <Divider horizontal></Divider>
        <Container>
          <Button
            negative
            onClick={() => auth.getAuth().signOut()}
          >
            Logout
          </Button>
        </Container>
      </Layout>
    );
  }
}

export default Dashboard;
