import {Button, Container, Divider, Icon} from 'semantic-ui-react';
import React from 'react';

const Controls = ({ onClick, isLocked, showVotes }) => (
    <Container id="voteControls" textAlign="center">
        <Button
            positive
            toggle
            active={showVotes}
            onClick={onClick}
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
            onClick={onClick}
        >
            <Icon
                name={(isLocked) ? 'unlock' : 'lock'}
                size="large"/>
            {`${isLocked ? 'Unlock' : 'Lock'}`} Voting
        </Button>

        <Divider horizontal/>
    </Container>
);

export default Controls;