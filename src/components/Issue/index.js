import React, {useEffect, useState} from 'react';
import {Button, Card, Container, Divider, Header, Icon, Loader, Segment,} from 'semantic-ui-react';
import {auth, db} from '../../firebase';
import './issue.css';
import {useParams} from 'react-router-dom';
import {child, onValue, set, update} from 'firebase/database';
import fibonacci from '../../utils/fibonacci';
import VotingBlock from './VotingBlock';
import Controls from './Controls';

const Issue = ({issue}) => {
    const {userId, tableId} = useParams();
    const currentUser = auth.auth.currentUser;
    const [state, setState] = useState({
        title: '',
        votes: [],
        isLocked: false,
        showVotes: false,
        userVote: null,
        mostVotes: null,
        isLoaded: false,
        isTableOwner: false,
    });
    const issueRef = db.pokerTableIssue(
        userId,
        tableId,
        issue
    );
    const votesRef = db.votesRoot(
        issue
    );

    useEffect(() => {
        loadIssue();
        loadVotes();
    }, []);

    const loadIssue = () => {
        onValue(issueRef, snapshot => {
            if (snapshot.exists()) {
                const issue = snapshot.val();

                setState({
                    title: issue.title,
                    isLocked: issue.isLocked || false,
                    showVotes: issue.showVotes || false,
                    isLoaded: true,
                    isTableOwner: userId === currentUser.uid,
                });
            }
        });
    };

    const loadVotes = () => {
        onValue(votesRef, snapshot => {
            if (snapshot.exists()) {
                const newVotesList = [];
                const votes = snapshot.val() || {};
                for (let vote in votes) {
                    newVotesList.push({
                        ...votes[vote],
                        userId: vote,
                    });
                }
                newVotesList.sort((v1, v2) => {
                    if (v1.vote > v2.vote) return 1;
                    if (v2.vote > v1.vote) return -1;
                    return 0;
                });

                // Get most votes
                const voteTally = newVotesList.reduce((acc, curr) => {
                    if (curr.vote in acc) {
                        acc[curr.vote]++;
                    } else {
                        acc[curr.vote] = 1;
                    }
                    return acc;
                }, {});

                let mostVotes = -1;
                let multipleModes = false;
                for (let points in voteTally) {
                    let currentMostVotes = voteTally[mostVotes] || 0;
                    if (voteTally[points] === currentMostVotes) {
                        multipleModes = true;
                    } else if (voteTally[points] >= currentMostVotes) {
                        mostVotes = parseInt(points, 10);
                        multipleModes = false;
                    }
                }
                if (multipleModes) {
                    // don't highlight any point values
                    mostVotes = -1;
                }

                const myVote =
                    newVotesList.find(v => v.userId === currentUser.uid);
                setState({
                    userVote: (myVote) ? myVote.vote : null,
                    votes: newVotesList.length ? newVotesList : [],
                    mostVotes
                });
            }
        });
    };

    const handleSelectVote = (userVote) => {
        if (userVote === state.userVote) {
            userVote = null;
        }
        setState({userVote});
        update(child(votesRef, currentUser.uid), {vote: userVote});
    };

    const handleShow = () => {
        set(issueRef, {'showVotes': !state.showVotes});
    };

    const handleLock = () => {
        set(issueRef, {'isLocked': !state.isLocked});
    };

    //suggestion() {
    //let suggestion = '??';
    //let mode = '??';
    //if(state.showVotes) {
    //const total = state.votes.reduce((t, v) => t + v.vote, 0);
    //const suggestionAvg = (total / state.votes.length);
    //suggestion = availablePoints.find( p => p >= suggestionAvg);
    //mode = (state.mostVotes > -1) ? state.mostVotes : '--';
    //}
    //return(
    //<Header sub>Mode/Mean ({mode}/{suggestion})</Header>
    //);
    //}

    const controls = () => {
        if (userId !== currentUser.uid) {
            return;
        }

        return (
            <Container id="voteControls" textAlign="center">
                <Button
                    positive
                    toggle
                    active={state.showVotes}
                    onClick={handleShow}
                >
                    <Icon
                        name={(state.showVotes) ? 'eye slash' : 'eye'}
                        size="large"/>
                    {`${state.showVotes ? 'Hide' : 'Show'}`} Votes
                </Button>
                <Button
                    negative
                    toggle
                    active={state.isLocked}
                    onClick={handleLock}
                >
                    <Icon
                        name={(state.isLocked) ? 'unlock' : 'lock'}
                        size="large"/>
                    {`${state.isLocked ? 'Unlock' : 'Lock'}`} Voting
                </Button>

                <Divider horizontal/>
            </Container>
        );
    };

    if (!state.isLoaded) {
        return (<Loader size="large">Loading</Loader>);
    }

    return (
        <Container textAlign="center" id="issue">
            <Header as="h1">{state.title}</Header>
            <Segment stacked>
                {(userId !== currentUser.uid) ?
                    <Controls
                        onClick={handleShow}
                        isLocked={state.isLocked}
                        showVotes={state.showVotes}
                    /> : null}
                <Card.Group
                    itemsPerRow={4}
                    id="voteCards"
                >
                    {state.votes && state.votes.map((v) => (
                        <Card color={(state.mostVotes === v.vote && state.showVotes) ? 'green' : 'blue'}
                              className={(state.mostVotes === v.vote && state.showVotes) ? 'mode' : ''}
                              key={v.userId}>
                            {(state.showVotes) ? v.vote : '?'}
                        </Card>
                    ))}
                </Card.Group>
            </Segment>
            {state.isLocked ?
                <VotingBlock
                    isLocked={state.isLocked}
                    onClick={handleSelectVote}
                    userVote={state.userVote}
                /> : null}
        </Container>
    );
};

export default Issue;
