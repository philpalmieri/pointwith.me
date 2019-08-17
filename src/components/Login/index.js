import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Layout from '../../containers/Layout';
import SocialButtonList from '../SocialButtonList';
import { auth } from '../../firebase';

const buttonList = {
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
};

class Login extends Component {
  componentDidMount() {
    auth.getAuth().onAuthStateChanged(user => {
      if (user) {
        this.props.history.push('/dashboard');
      }
    });
  }

  render() {
    return (
      <Layout contentCenter={true}>
        <p>Connect With</p>
        <SocialButtonList buttonList={buttonList} auth={auth.getAuth} />
        <Link to="/about"></Link>
      </Layout>
    );
  }
}

export default Login;
