import React, { Component } from 'react';
import * as moment from 'moment'
import { 
  Button,
  Container,
  Form,
  Header,
  Icon,
  List,
  Modal,
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
    currentUser: auth.getAuth().currentUser,
    newIssueName: '',
    pokerTable: {},
    issues: [],
    issueModal: false,
    currentIssue: {}
  };

  componentDidMount() {
    this.loadPokerTable();
  }

  handleCreateIssue = (e) => {
    const ptRef = db.pokerTableIssuesRoot(this.state.currentUser.uid, this.state.tableId);
    ptRef.child(shortid.generate())
      .update({
        title: this.state.newIssueName,
        created: new Date(),
        score: 0,
        votes: {}
      });
  }

  handleNewIssueName = (e) => {
    this.setState({newIssueName: e.target.value});
  }

  handleViewIssue = (issue) => {
    this.setState({issueModal: true});
  }

  handleCloseIssue = () => {
    this.setState({issueModal: false});
  }

  loadPokerTable = () => {
    const pokerTableRef = db.pokerTable(this.state.ownerId, this.state.tableId);
    pokerTableRef.on('value', snapshot => {
      const table = snapshot.val();
      const newIssuesList = [];
      for (let issue in table.issues) {
        newIssuesList.push({
          ...table.issues[issue],
          id: issue,
        });
      }
      this.setState({
        pokerTable: table,
        issues: newIssuesList, 
      });
    });
  }

  render() {
    return (
      <Layout>
        <Container>
          <Header as='h1'>Viewing Poker Table {this.state.pokerTable.tableName}</Header>
          <Segment raised>
            <Form onSubmit={this.handleCreateIssue}>
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
                  <List.Item key={s.id} onClick={() => this.handleViewIssue(s.id)}>
                    <List.Content>
                      <List.Header>{s.title}</List.Header>
                      <List.Description>
                          Created: {moment(s.created).format('MM/DD/YYYY hh:mma')}
                      </List.Description>
                      <List.Description>
                          Score: {s.score}
                      </List.Description>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </Segment>
          </Container>
          <Modal open={this.state.issueModal} centered={false}>
            <Modal.Content>Yo!</Modal.Content>
            <Modal.Actions>
              <Button color='red' onClick={() => this.handleCloseIssue() } inverted>
                <Icon name='close' /> Close
              </Button>
            </Modal.Actions>
          </Modal>
      </Layout>
    );
  }
}

export default PokerTable;
