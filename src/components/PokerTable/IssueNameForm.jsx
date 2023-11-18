import {Form} from 'semantic-ui-react';
import React, {useState} from 'react';

const IssueNameForm = ({ handleIssueSubmit }) => {
    const [newIssueName, setNewIssueName] = useState('');
    const handleSubmit = () => {
        handleIssueSubmit(newIssueName);
        setNewIssueName('');
    }
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Field>
                <label>Open Issues</label>
                <input
                    placeholder="New Issue Name"
                    value={newIssueName}
                    onChange={(e) => setNewIssueName(e.target.value)}
                />
            </Form.Field>
        </Form>
    )
}

export default IssueNameForm;