import {Header, Icon} from 'semantic-ui-react';
import IssueNameForm from './IssueNameForm';
import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {auth, db} from '../../firebase';
import shortid from 'shortid';
import {set} from 'firebase/database';

const IssueCreator = ({onClick, tableName}) => {
    const navigate = useNavigate();
    const {userId, tableId} = useParams();
    const currentUser = auth.auth.currentUser;

    if (userId !== currentUser.uid) {
        return (
            <div>
                <Header as="h1">{tableName}</Header>
                <Header
                    sub
                    as="a"
                    onClick={() => navigate('/dashboard')}
                >
                    <Icon name="home"/>
                    Return to Lobby
                </Header>
            </div>
        );
    }
    return (
        <>
            <Header as="h1">{tableName}</Header>
            <Header
                sub
                as="a"
                onClick={() => navigate('/dashboard')}
            >
                <Icon name="home"/>
                Return to Lobby
            </Header>
            <p>
                Copy this table's URL to share with your team for a pointing session
            </p>
            <IssueNameForm handleIssueSubmit={onClick}/>
        </>
    );
};

export default IssueCreator;