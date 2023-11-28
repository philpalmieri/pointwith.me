import {Button, Container, Divider, Icon} from 'semantic-ui-react';
import React from 'react';
import {update} from 'firebase/database';
import {db} from '../../firebase';
import {useParams} from 'react-router-dom';

const Controls = ({isLocked, issue, showVotes}) => {
	const {userId, tableId} = useParams();

	const issueRef = db.pokerTableIssue(
		userId,
		tableId,
		issue
	);
	const handleShow = () => {
		update(issueRef, {'showVotes': !showVotes});
	};

	const handleLock = () => {
		update(issueRef, {'isLocked': !isLocked});
	};

	return (
		<Container id="voteControls" textAlign="center">
			<Button
				positive
				toggle
				active={showVotes}
				onClick={handleShow}
			>
				<Icon
					name={(showVotes) ? 'eye slash' : 'eye'}
					size="large"/>
				{`${showVotes ? 'Hide' : 'Show'}`} Votes
			</Button>
			<Button
				negative
				toggle
				active={isLocked}
				onClick={handleLock}
			>
				<Icon
					name={(isLocked) ? 'unlock' : 'lock'}
					size="large"/>
				{`${isLocked ? 'Unlock' : 'Lock'}`} Voting
			</Button>

			<Divider horizontal/>
		</Container>
	);
};

export default Controls;