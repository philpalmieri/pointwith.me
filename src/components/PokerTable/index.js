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
import Issue from '../Issue';
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
    currentIssue: false,
  };

  componentDidMount() {
    this.pokerTableRef = db.pokerTable(this.state.ownerId, this.state.tableId);
    this.ptIssuesRef = db.pokerTableIssuesRoot(this.state.currentUser.uid, this.state.tableId);
    this.loadPokerTable();
  }

  handleCreateIssue = (e) => {
    this.ptIssuesRef.child(shortid.generate())
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

  handleViewIssue = (currentIssue) => {
    this.pokerTableRef.update({currentIssue});
  }

  handleCloseIssue = () => {
    this.pokerTableRef.update({currentIssue: false});
  }

  loadPokerTable = () => {
    this.pokerTableRef.on('value', snapshot => {
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
        issueModal: table.issueModal || false,
        currentIssue: table.currentIssue || false
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
                  <List.Item key={s.id} onClick={() => this.handleViewIssue(s)}>
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
          <Modal open={(this.state.currentIssue)} centered={false}>
            <Modal.Content>
              <Issue
                issue={this.state.currentIssue}
                ownerId={this.state.ownerId}
                tableId={this.state.tableId}
              />
            </Modal.Content>
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
