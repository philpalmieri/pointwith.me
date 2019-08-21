import React, {Component} from 'react';
import * as moment from 'moment'
import { 
  Button,
  Container,
  Header,
  Icon,
  List,
  Segment,
} from 'semantic-ui-react';
import { db, auth } from '../../firebase';

class Issue extends Component {
  state = {
    ownerId: this.props.ownerId,
    tableId: this.props.tableId,
    currentUser: auth.getAuth().currentUser,
    currentIssue: this.props.issue,
    votes: [],
    isLocked: false,
    votingEnabled: false,
    userIsVoting: false,
    userVote: 0,
  };

  componentDidMount() {
    //this.loadVotesTable();
  }

  //handleCreateIssue = (e) => {
    //const ptRef = db.pokerTableIssuesRoot(this.state.currentUser.uid, this.state.tableId);
    //ptRef.child(shortid.generate())
      //.update({
        //title: this.state.newIssueName,
        //created: new Date(),
        //score: 0,
        //votes: {}
      //});
  //}

  //loadPokerTable = () => {
    //const pokerTableRef = db.pokerTable(this.state.ownerId, this.state.tableId);
    //pokerTableRef.on('value', snapshot => {
      //const table = snapshot.val();
      //const newIssuesList = [];
      //for (let issue in table.issues) {
        //newIssuesList.push({
          //...table.issues[issue],
          //id: issue,
        //});
      //}
      //this.setState({
        //pokerTable: table,
        //issues: newIssuesList, 
      //});
    //});
  //}

  render() {
    return (
      <Container>
        <Header as='h1'>Voting On: {this.state.currentIssue.title}</Header>
        <Segment raised>
          Your Vote 
        </Segment>
        <Segment stacked>
         The Votes
        </Segment>
        </Container>
    );
  }
}

export default Issue;
