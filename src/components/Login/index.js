import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Layout from '../../containers/Layout';
import SocialButtonList from '../SocialButtonList';
import { auth } from '../../firebase';
import { Divider, Grid, Header, Segment } from 'semantic-ui-react';

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
  microsoft: {
    visible: true,
    provider: () => auth.azureOAuth()
  },
  anonymous: {
    visible: false,
    provider: () => auth.anonymousOAuth()
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
        <Grid textAlign='center' style={{ height: '80vh' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Segment>
              <Header as='h2'>What is it?</Header>
              <p>PointWith.me is a way for remote teams to story point quickly and easily. Someone 'Drives' your session and all the players open the link on their phone/desktop and just point issues as they cycle through</p>
            </Segment>
            <Segment>
              <Header as='h1'>Sign Up/In - It's FREE</Header>
              <Header sub>
                  Login with a social account, we dont use/store anything other
                  than your account ID for OAuth
              </Header>
              <Divider horizontal />
              <SocialButtonList buttonList={buttonList} auth={auth.getAuth} />
              <Link to="/about"></Link>
            </Segment>
          </Grid.Column>
        </Grid>
     </Layout>
    );
  }
}

export default Login;
