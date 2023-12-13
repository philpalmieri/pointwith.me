import {Card, Segment} from 'semantic-ui-react';
import React, {useState} from 'react';
import fibonacci from '../../utils/fibonacci';

const availablePoints = [...new Set(fibonacci(8))];
const VotingBlock = ({onClick, isLocked, userVote}) => {
	const [selectedValue, setSelectedValue] = useState(null);

	const handleSelect = (p) => {
		setSelectedValue(p);
		onClick(p);
	}

	return (
		<Segment raised textAlign="center">
			<Card.Group
				className={(isLocked) ? 'locked' : 'unlocked'}
				data-testid="voteCards"
				id="voteCards"
				itemsPerRow={2}
			>
				{availablePoints.map(p => (
					<Card
						className={(selectedValue === p) ? 'selected' : ''}
						color="blue"
						key={p}
						onClick={() => handleSelect(p)}
					>
						{p}
					</Card>
				))}
			</Card.Group>
		</Segment>
	);
}

export default VotingBlock;