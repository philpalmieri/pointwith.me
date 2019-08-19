import React, { Component } from 'react';
import * as moment from 'moment'
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

class PokerTable extends Component {
  state = {
    ownerId: this.props.match.params.userId,
    tableId: this.props.match.params.tableId,
    pokerTable: {},
    issues: [],
    currentUser: auth.getAuth().currentUser,
    newIssueName: '',
  };

  componentDidMount() {
    this.loadPokerTable();
  }

  handleCreateIssue = (e) => {
    //const pRef = db.pokerTablesRoot(this.state.currentUser.uid);
    //pRef.child(shortid.generate())
      //.update({
        //tableName: this.state.newPokerTableName,
        //created: new Date(),
      //});
    //this.setState({newPokerTableName: ''});
    //this.loadPokerTables();
  }

  handleNewIssueName = (e) => {
    this.setState({newIssueName: e.target.value});
  }

  loadPokerTable = () => {
    const pokerTableRef = db.pokerTable(this.state.ownerId, this.state.tableId);
    pokerTableRef.on('value', snapshot => {
      this.setState({pokerTable: snapshot.val()});
        //let pokerTables = snapshot.val();
      //let newPokerTablesState = [];
      //for (let table in pokerTables) {
        //newPokerTablesState.push({
          //...pokerTables[table],
          //id: table,
        //});
      //}
      //newPokerTablesState.sort( (t1, t2) => {
        //if(t1.created > t2.created) return -1;
        //if(t2.created > t1.created) return 1;
        //return 0;
      //});
      //this.setState({
        //pokerTables: newPokerTablesState
      //});
    });
  }

  render() {
    return (
      <Layout>
        <Container>
          <Header as='h1'>Viewing Poker Table {this.state.pokerTable.tableName}</Header>
          <Segment raised>
            <Form onSubmit={this.createPokerTable}>
              <Header as='h1'>Create Issue</Header>
                <Form.Field>
                  <label>Issue Name</label>
                  <input
                    placeholder='New Issue Name'
                    value={this.state.newIssueName}
                    onChange={this.handleNewIssueName}
                  />
                </Form.Field>
                <Button primary type='submit'>Create Issue</Button>
              </Form>
            </Segment>
            <Segment stacked>
              <Header as='h1'>Table Issues</Header>
              <List divided relaxed>
                {this.state.issues.map((s) => (
                  <List.Item key={s.id}>
                    <List.Content as='a'>
                      <List.Header>{s.tableName}</List.Header>
                      <List.Description>Table ID: {s.id}</List.Description>
                      <List.Description>
                          Created: {moment(s.created).format('MM/DD/YYYY hh:mma')}
                      </List.Description>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </Segment>
        </Container>
      </Layout>
    );
  }
}

export default PokerTable;
