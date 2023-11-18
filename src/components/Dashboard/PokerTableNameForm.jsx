import {Button, Form, Header} from 'semantic-ui-react';
import React from 'react';

const PokerTableNameForm = ({ handlePokerTableSubmit }) => {
    const [pokerTableName, setPokerTableName] = React.useState('');
    const handleNewPokerTableName = (e) => setPokerTableName(e.target.value);
    const handleSubmit = () => {
        handlePokerTableSubmit(pokerTableName);
        setPokerTableName('');
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Header as="h1">Create Poker Table</Header>
            <Form.Field>
                <label>Poker Table Name</label>
                <input
                    placeholder="New Poker Table Name"
                    value={pokerTableName}
                    onChange={handleNewPokerTableName}
                />
            </Form.Field>
            <Button primary type="submit">
                Create Poker Table
            </Button>
        </Form>
    )
}

export default PokerTableNameForm;