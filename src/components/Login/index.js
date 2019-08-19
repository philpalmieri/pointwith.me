import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Layout from '../../containers/Layout';
import SocialButtonList from '../SocialButtonList';
import { auth } from '../../firebase';
import { Segment } from 'semantic-ui-react';

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
      } else {
        this.props.history.push('/');
      }  
    });
  }

  render() {
    return (
     <Layout>
      <Segment relaxed>
        <p>Connect With</p>
        <SocialButtonList buttonList={buttonList} auth={auth.getAuth} />
        <Link to="/about"></Link>
      </Segment>
     </Layout>
    );
  }
}

export default Login;
