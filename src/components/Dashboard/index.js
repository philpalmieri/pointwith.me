import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { 
  Button,
  Container,
  Divider,
  Form,
  Grid,
  Header,
  List,
} from 'semantic-ui-react';
import { db, auth } from '../../firebase';
import Layout from '../../containers/Layout';
import SocialButtonList from '../SocialButtonList';
import SocialProfileList from '../SocialProfileList';
const uuid = require('uuid/v1');

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
    providerData: this.props.providerData,
    pokerSessions: [
      { id: 'abc', description: 'foobar', meta: 'baz' },
    ],
    newSessionName: '',
  };

  componentDidMount() {
    this.updateProviders(this.state.providerData);
    this.loadSessions();
  }

  createSession = (e) => {
    const pRef = db.pokerSessionsRoot();
    pRef.child(uuid())
      .update({description: this.state.newSessionName, foo: 'bar'});
    this.setState({newSessionName: ''});
    this.loadSessions();
  }

  handleNewSessionName = (e) => {
    this.setState({newSessionName: e.target.value});
  }

  loadSessions = async () => {
    const pokerSessionsRef = await db.pokerSessions();
    console.log(pokerSessionsRef);
    pokerSessionsRef.on('value', snapshot => {
      let sessions = snapshot.val();
      let newSessionState = [];
      for (let session in sessions) {
        console.log(session);
        newSessionState.push({
          id: session,
          description: sessions[session].description,
          meta: '10 points'
        });
      }
      this.setState({
        pokerSessions: newSessionState
      });
    });
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
          <Grid>
            <Grid.Column width={4}>
              <Form onSubmit={this.createSession}>
                <Header as='h1'>Create Session</Header>
                <Form.Field>
                  <label>Session Title</label>
                  <input
                    placeholder='New Poker Session'
                    value={this.state.newSessionName}
                    onChange={this.handleNewSessionName}
                  />
                </Form.Field>
                <Button primary type='submit'>Create Session</Button>
              </Form>
            </Grid.Column>
            <Grid.Column width={12}>
              <List divided relaxed>
                  {this.state.pokerSessions.map((s) => (
                    <List.Item>
                      <List.Content>
                        <List.Header as='a'>{s.id}</List.Header>
                        <List.Description as='a'>{s.description}</List.Description>
                      </List.Content>
                    </List.Item>
                  ))}
              </List>
            </Grid.Column>
          </Grid>
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
