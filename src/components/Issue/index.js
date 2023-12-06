import React, {useEffect, useState} from 'react';
import {Card, Container, Header, Loader, Segment,} from 'semantic-ui-react';
import {auth, db} from '../../firebase';
import './issue.css';
import {useParams} from 'react-router-dom';
import {child, onValue, update} from 'firebase/database';
import VotingBlock from './VotingBlock';
import Controls from './Controls';

const Issue = ({issue}) => {
	const {userId, tableId} = useParams();
	const currentUser = auth.auth.currentUser;
	const isTableOwner = userId === currentUser.uid;
	const [issueState, setIssueState] = useState({
		isLoaded: false,
		isLocked: false,
		showVotes: false,
		title: '',
	});
	const [votesState, setVotesState] = useState({
		isLoaded: false,
		mostVotes: -1,
		userVote: null,
		votes: [],
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
		return loadIssue();
	}, []);

	useEffect(() => {
		return loadVotes();
	}, []);

	const loadIssue = () => onValue(issueRef, snapshot => {
		if (snapshot.exists()) {
			const issue = snapshot.val();
			const newState = {
				...issueState,
				title: issue.title,
				isLocked: issue.isLocked || false,
				showVotes: issue.showVotes || false,
				isLoaded: true,
			};
			setIssueState(newState);
		}
	});

	const loadVotes = () => onValue(votesRef, snapshot => {
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
			const newState = {
				...votesState,
				userVote: (myVote) ? myVote.vote : null,
				votes: newVotesList.length ? newVotesList : [],
				mostVotes
			};
			// setState(newState);
			setVotesState(newState);
		} else {
			console.warn('No votes found');
		}
	});

	const handleSelectVote = (userVote) => {
		if (userVote === votesState.userVote) {
			userVote = null;
		}
		setVotesState({
			...votesState,
			userVote
		});
		update(child(votesRef, currentUser.uid), {vote: userVote});
	};

	//suggestion() {
	//let suggestion = '??';
	//let mode = '??';
	//if(issueState.showVotes) {
	//const total = votesState.votes.reduce((t, v) => t + v.vote, 0);
	//const suggestionAvg = (total / votesState.votes.length);
	//suggestion = availablePoints.find( p => p >= suggestionAvg);
	//mode = (votesState.mostVotes > -1) ? votesState.mostVotes : '--';
	//}
	//return(
	//<Header sub>Mode/Mean ({mode}/{suggestion})</Header>
	//);
	//}

	if (!issueState.isLoaded) {
		return (<Loader size="large">Loading</Loader>);
	}

	return (
		<Container textAlign="center" id="issue">
			<Header as="h1">{issueState.title}</Header>
			<Segment stacked>
				{(isTableOwner) ?
					<Controls
						isLocked={issueState.isLocked}
						issue={issue}
						showVotes={issueState.showVotes}
					/> : null}
				<Card.Group
					itemsPerRow={4}
					id="voteCards"
				>
					{votesState.votes?.map((v) => (
						<Card color={(votesState.mostVotes === v.vote && issueState.showVotes) ? 'green' : 'blue'}
							  className={(votesState.mostVotes === v.vote && issueState.showVotes) ? 'mode' : ''}
							  key={v.userId}>
							{(issueState.showVotes) ? v.vote : '?'}
						</Card>
					))}
				</Card.Group>
			</Segment>
			{!issueState.isLocked ?
				<VotingBlock
					isLocked={issueState.isLocked}
					onClick={handleSelectVote}
					userVote={votesState.userVote}
				/> : null}
		</Container>
	);
};

export default Issue;
