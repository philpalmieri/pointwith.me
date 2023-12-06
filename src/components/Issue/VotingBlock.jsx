import {Card, Segment} from 'semantic-ui-react';
import React from 'react';
import fibonacci from '../../utils/fibonacci';

const availablePoints = [...new Set(fibonacci(8))];
const VotingBlock = ({onClick, isLocked, userVote}) => (
	<Segment raised textAlign="center">
		<Card.Group
			itemsPerRow={2}
			id="voteCards"
			className={(isLocked) ? 'locked' : 'unlocked'}
		>
			{availablePoints.map(p => (
				<Card
					key={p}
					onClick={() => onClick(p)}
					color="blue"
					className={(userVote === p) ? 'selected' : ''}>
					{p}
				</Card>
			))}
		</Card.Group>
	</Segment>
);

export default VotingBlock;