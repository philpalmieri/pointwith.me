import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { 
  Button,
  Container,
  Divider,
  Form,
  Header,
  List,
  Segment,
} from 'semantic-ui-react';
import { db, auth } from '../../firebase';
import Layout from '../../containers/Layout';
//const uuid = require('uuid/v1');
const shortid = require('shortid');

class Dashboard extends Component {
  state = {
    pokerTables: [],
    newPokerTableName: '',
    currentUser: auth.getAuth().currentUser,
  };

  componentDidMount() {
    this.loadPokerTables();
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

  render() {
    return (
      <Layout>
        <Container>
          <Segment raised>
            <Form onSubmit={this.createPokerTable}>
              <Header as='h1'>Create Poker Table</Header>
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
            </Segment>
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
