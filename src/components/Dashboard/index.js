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
//const uuid = require('uuid/v1');
const shortid = require('shortid');

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
    pokerTables: [],
    newPokerTableName: '',
    currentUser: {},
  };

  componentWillMount() {
    this.loadCurrentUser();
  }
  componentDidMount() {
    this.updateProviders(this.state.providerData);
    this.loadPokerTables();
  }

  loadCurrentUser = () => {
    const getAuth = auth.getAuth();
    this.setState({currentUser: getAuth.currentUser});
  }
  createPokerTable = (e) => {
    const pRef = db.pokerTablesRoot(this.state.currentUser.uid);
    pRef.child(shortid.generate())
      .update({tableName: this.state.newPokerTableName});
    this.setState({newPokerTableName: ''});
    this.loadPokerTables();
  }

  handleNewPokerTableName = (e) => {
    this.setState({newPokerTableName: e.target.value});
  }

  loadPokerTables = () => {
    const pokerTablesRef = db.pokerTables(this.state.currentUser.uid);
    pokerTablesRef.on('value', snapshot => {
      let pokerTables = snapshot.val();
      let newPokerTablesState = [];
      for (let table in pokerTables) {
        newPokerTablesState.push({
          id: table,
          tableName: pokerTables[table].tableName,
          meta: '10 points'
        });
      }
      this.setState({
        pokerTables: newPokerTablesState
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
              <Form onSubmit={this.createPokerTable}>
                <Header as='h1'>Create PokerTable</Header>
                <Form.Field>
                  <label>Poker Table Name</label>
                  <input
                    placeholder='New Poker Table Name'
                    value={this.state.newPokerTableName}
                    onChange={this.handleNewPokerTableName}
                  />
                </Form.Field>
                <Button primary type='submit'>Create Poker Table</Button>
              </Form>
            </Grid.Column>
            <Grid.Column width={12}>
              <List divided relaxed>
                {this.state.pokerTables.map((s) => (
                  <List.Item>
                    <List.Content>
                      <List.Header as='a'>{s.tableName}</List.Header>
                      <List.Description as='a'>Table Id: {s.id}</List.Description>
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
