import React, {Component} from 'react';
import * as moment from 'moment'
import { 
  Card,
  Container,
  Grid,
  Header,
  Icon,
  Segment,
} from 'semantic-ui-react';
import { db, auth } from '../../firebase';
import './issue.css';

const availablePoints = [0,1,2,3,5,8,13,21,34,68];

class Issue extends Component {
  state = {
    ownerId: this.props.ownerId,
    tableId: this.props.tableId,
    currentUser: auth.getAuth().currentUser,
    currentIssueId: this.props.issue,
    title: '',
    votes: [],
    isLocked: false,
    showVotes: false,
    userVote: null
  };

  componentDidMount() {
    this.issueRef = db.pokerTableIssue(
      this.state.ownerId,
      this.state.tableId,
      this.state.currentIssueId
    );
    this.votesRef = db.votesRoot(
      this.state.tableId
    );
    this.loadIssue();
    this.loadVotes();
  }

  loadIssue() {
    this.issueRef.on('value', snapshot => {
      const issue = snapshot.val();
           
      this.setState({
        title: issue.title,
        isLocked: issue.isLocked || false,
        showVotes: issue.showVotes || false,
      });
    });
  }

  loadVotes() {
    this.votesRef.on('value', snapshot => {
      const newVotesList = [];
      const votes = snapshot.val() || {};
      for (let vote in votes) {
        newVotesList.push({
          ...votes[vote],
          userId: vote,
        });
      }
      newVotesList.sort( (v1, v2) => {
        if(v1.vote > v2.vote) return 1;
        if(v2.vote > v1.vote) return -1;
        return 0;
      });
      
      const myVote = 
        newVotesList.find( v => v.userId === this.state.currentUser.uid);

      this.setState({
        userVote: (myVote) ? myVote.vote : null,
        votes: newVotesList,
      });
    });
  }
  
  handleSelectVote(userVote) {
    if(userVote === this.state.userVote) {
      userVote = null;
    }
    this.setState({userVote});
    this.votesRef.child(this.state.currentUser.uid)
      .update({vote: userVote});
  }

  handleShow() {
    this.issueRef.child('showVotes').set(!this.state.showVotes);
  }

  handleLock() { 
    this.issueRef.child('isLocked').set(!this.state.isLocked);
  }

  votingBlock() {
    if(this.state.isLocked) {
      return;
    }
    return(
      <Segment raised textAlign='center'>
        <Card.Group
          itemsPerRow={2}
          id="voteCards"
          className={(this.state.isLocked) ? 'locked' : 'unlocked'}
        >
          {availablePoints.map( p => (
            <Card
              key={p}
              onClick={() => this.handleSelectVote(p)}
              color='blue'
              className={(this.state.userVote === p) ? 'selected' : ''}>
              {p}
            </Card>
          ))}
        </Card.Group>
      </Segment>
    );
  }

  suggestion() {
    let suggestion = '??';
    if(this.state.showVotes) {
      const total = this.state.votes.reduce((t, v) => t + v.vote, 0);
      const suggestionAvg = (total / this.state.votes.length);
      suggestion = availablePoints.find( p => p >= suggestionAvg);
    }
    return(
      <Header sub>Average: {suggestion} pts</Header>
    );
  }

  controls() {
    if(this.state.ownerId !== this.state.currentUser.uid) {
      return;
    }

    return(
      <Grid.Column floated='right' textAlign='right' width={5}>
        <Icon
          name={(this.state.showVotes) ? 'eye slash' : 'eye'}
          size='large'
          onClick={()=>this.handleShow()}/>
        <Icon
          name={(this.state.isLocked) ? 'unlock' : 'lock'}
          size='large'
          onClick={()=>this.handleLock()}/>
      </Grid.Column>      
    );
  }

  render() {
    return (
      <Container textAlign='center' id="issue">
        <Header as='h1'>{this.state.title}</Header>
        {this.votingBlock()}
        <Segment stacked>
          <Grid>
            <Grid.Column floated='left' width={8}>
              <Header as='h1' textAlign='left'>
                Votes
                {this.suggestion()}
              </Header>
            </Grid.Column>
            {this.controls()}
          </Grid>
            <Card.Group
              itemsPerRow={4}
              id="voteCards"
            >
              {this.state.votes.map((v) => (
                <Card color='blue' key={v.userId}>
                  {(this.state.showVotes) ? v.vote : '?'}
                </Card>
              ))}
            </Card.Group>
        </Segment>
        </Container>
    );
  }
}

export default Issue;
