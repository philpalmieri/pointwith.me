import React, {Component} from 'react';
import * as moment from 'moment'
import { 
  Button,
  Card,
  Container,
  Divider,
  Header,
  Icon,
  Loader,
  Segment,
} from 'semantic-ui-react';
import { db, auth } from '../../firebase';
import './issue.css';

const availablePoints = [0,1,2,3,5,8,13,21];

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
    userVote: null,
    mostVotes: null,
    isLoaded: false,
    isTableOwner: false,
  };

  componentDidMount() {
    this.issueRef = db.pokerTableIssue(
      this.state.ownerId,
      this.state.tableId,
      this.state.currentIssueId
    );
    this.votesRef = db.votesRoot(
      this.state.currentIssueId
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
        isLoaded: true,
        isTableOwner: this.state.ownerId === this.state.currentUser.uid,
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

      //Get most votes
      const calcMostVotes = newVotesList.reduce((acc, curr) => { 
        if (curr.vote in acc) {
            acc[curr.vote]++;
        } else {
            acc[curr.vote] = 1;
        }
        return acc;
      }, {});
      
      const topVote = Object.keys(calcMostVotes)[0] || -1;
      const mostVotes =
        (topVote > -1 && calcMostVotes[topVote] > 1) ? topVote : -1;
      const myVote = 
        newVotesList.find( v => v.userId === this.state.currentUser.uid);
      this.setState({
        userVote: (myVote) ? myVote.vote : null,
        votes: newVotesList,
        mostVotes 
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

  //suggestion() {
    //let suggestion = '??';
    //let mode = '??';
    //if(this.state.showVotes) {
      //const total = this.state.votes.reduce((t, v) => t + v.vote, 0);
      //const suggestionAvg = (total / this.state.votes.length);
      //suggestion = availablePoints.find( p => p >= suggestionAvg);
      //mode = (this.state.mostVotes > -1) ? this.state.mostVotes : '--';
    //}
    //return(
      //<Header sub>Mode/Mean ({mode}/{suggestion})</Header>
    //);
  //}

  controls() {
    if(this.state.ownerId !== this.state.currentUser.uid) {
      return;
    }

    return(
      <Container id='voteControls' textAlign='center'>
        <Button
          positive
          toggle
          active={this.state.showVotes}
          onClick={() => this.handleShow()}
        >
          <Icon
            name={(this.state.showVotes) ? 'eye slash' : 'eye'}
            size='large'/>
            { ( () => (this.state.showVotes) ? 'Hide' : 'Show' )()} Votes
        </Button>
        <Button
          negative
          toggle
          active={this.state.isLocked}
          onClick={() => this.handleLock()}
        >
          <Icon
            name={(this.state.isLocked) ? 'unlock' : 'lock'}
            size='large' />
            { ( () => (this.state.isLocked) ? 'Unlock' : 'Lock' )()} Voting
        </Button>

        <Divider horizontal />
      </Container>
    );
  }

  render() {
    if(!this.state.isLoaded) {
        return(<Loader size='large'>Loading</Loader>);
    }

    return (
      <Container textAlign='center' id="issue">
        <Header as='h1'>{this.state.title}</Header>
        <Segment stacked>
          {this.controls()}
          <Card.Group
            itemsPerRow={4}
            id="voteCards"
          >
            {this.state.votes.map((v) => (
              <Card color='blue'
                className={(this.state.mostVotes == v.vote && this.state.showVotes) ? 'mode' : ''}
                key={v.userId}>
                {(this.state.showVotes) ? v.vote : '?'}
              </Card>
            ))}
          </Card.Group>
        </Segment>
        {this.votingBlock()}
        </Container>
    );
  }
}

export default Issue;
