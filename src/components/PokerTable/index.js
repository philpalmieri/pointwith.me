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
    nextIssue: false,
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
    this.setState({newIssueName: ''});
  }

  handleNewIssueName = (e) => {
    this.setState({newIssueName: e.target.value});
  }

  handleViewIssue = async (currentIssue) => {
    await this.pokerTableRef.update({currentIssue: false});
    if(this.state.ownerId !== this.state.currentUser.uid) {
      return;
    }
    this.pokerTableRef.update({currentIssue});
  }


  getNextIssue = (currentIssue, issuesList) => {
    let nextIssue = false;
    issuesList.forEach( (issue, i) => {
      if(issue.id === currentIssue) {
        nextIssue = issuesList[i+1];
      }
    });

    return (nextIssue) ? nextIssue.id : false;
  }

  handleCloseIssue = async () => {
    return await this.pokerTableRef.update({currentIssue: false});
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
      newIssuesList.sort( (i1,i2) => {
        if(i1.created > i2.created) return 1;
        if(i2.created > i1.created) return -1;
        return 0;
      });

      const nextIssue = this.getNextIssue(table.currentIssue, newIssuesList);
      this.setState({
        pokerTable: table,
        issues: newIssuesList,
        issueModal: table.issueModal || false,
        currentIssue: table.currentIssue || false,
        nextIssue
      });
    });
  }

  showModalActions() {
    if(this.state.ownerId !== this.state.currentUser.uid) {
      return;
    }
    return(
      <Modal.Actions id="modalControl">
        <Button.Group>
          <Button color='red' onClick={() => this.handleCloseIssue() }>
            <Icon name='close' /> Close
          </Button>
          <Button.Or />
          <Button
            color='green'
            onClick={() => this.handleViewIssue(this.state.nextIssue)}
            disabled={(this.state.nextIssue) ? false : true}
          >
            <Icon name='chevron right' /> Next
          </Button>
        </Button.Group>
      </Modal.Actions>
    );
  }
  showIssueCreator() {
    if(this.state.ownerId !== this.state.currentUser.uid) {
      return(
        <div>
          <Header as='h1'>{this.state.pokerTable.tableName}</Header>
          <Header sub
            as='a'
            onClick={() => this.props.history.push('/dashboard')}
          >
            <Icon name='home' />
              Return to Lobby
          </Header>
        </div>
      );
    }
    return(
      <Form onSubmit={this.handleCreateIssue}>
        <Header as='h1'>{this.state.pokerTable.tableName}</Header>
        <Header sub
          as='a'
          onClick={() => this.props.history.push('/dashboard')}
        >
          <Icon name='home' />
            Return to Lobby
        </Header>
        <p>Copy this table's URL to share with your team for a pointing session</p>
        <Header as='h2'>Create Issue</Header>
          <Form.Field>
            <label>Open Issues</label>
            <input
              placeholder='New Issue Name'
              value={this.state.newIssueName}
              onChange={this.handleNewIssueName}
            />
          </Form.Field>
          <Button primary type='submit'>Create Issue</Button>
      </Form>
    );
  }

  render() {
    return (
      <Layout>
        <Container>
          <Segment raised>
            {this.showIssueCreator()}
          </Segment>
          <Segment stacked>
            <Header as='h1'>Table Issues</Header>
            <List divided relaxed>
              {this.state.issues.map((s) => (
                <List.Item
                  className="issueLink"
                  key={s.id}
                  onClick={() => this.handleViewIssue(s.id)}>
                  <List.Content>
                    <List.Header>
                      <Icon name={(s.isLocked) ? 'lock' : 'unlock'}/>
                      {s.title}
                    </List.Header>
                    <List.Description>
                        Created: {moment(s.created).format('MM/DD/YYYY hh:mma')}
                    </List.Description>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </Segment>
          </Container>
          <Modal open={(this.state.currentIssue) ? true : false} centered={false}>
            <Modal.Content>
              <Issue
                issue={this.state.currentIssue}
                ownerId={this.state.ownerId}
                tableId={this.state.tableId}
              />
            </Modal.Content>
            {this.showModalActions()}
          </Modal>
      </Layout>
    );
  }
}

export default PokerTable;
