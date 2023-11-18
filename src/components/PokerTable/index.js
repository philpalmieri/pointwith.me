// Theirs
import React, {useEffect} from 'react';
import moment from 'moment';
import {Button, Container, Form, Header, Icon, List, Modal, Segment,} from 'semantic-ui-react';

// Ours
import {auth, db} from '../../firebase';
import * as issues from '../../api/issues';
import Layout from '../../containers/Layout';
import Issue from '../Issue';
import withAuthentication from '../../containers/withAuthentication';
import {useNavigate, useParams} from 'react-router-dom';
import {onValue, set} from 'firebase/database';
import shortid from 'shortid';
import IssueNameForm from './IssueNameForm';


const PokerTable = () => {
    const navigate = useNavigate();
    const {userId, tableId} = useParams();
    const currentUser = auth.auth.currentUser;
    const issuesClient = issues.createClient(
        currentUser.uid,
        tableId
    );
    const [state, setState] = React.useState({
        pokerTable: {},
        issuesClient: null,
        issues: [],
        currentIssue: false,
        nextIssue: false,
    });
    const pokerTableRef = db.pokerTable(userId, tableId);
    const ptIssuesRef = db.pokerTableIssuesRoot(
        currentUser.uid,
        tableId
    );

    useEffect(() => {
        loadPokerTable();
    }, []);

    const handleCreateIssue = (newIssueName) => {
        const uid = shortid.generate();
        const data = {
            title: newIssueName,
            created: new Date(),
            score: 0,
            votes: {},
        };
        set(db.pokerTableIssue(currentUser.uid, tableId, uid), data)
            .then(() => loadPokerTable());
    };

    const removeIssue = (issueId) => (e) => {
        e.preventDefault();

        issuesClient.remove(issueId); // Optimistically deletes poker table. i.e. doesn't block the ui from updating

        const filteredIssues = state.issues.filter(({id}) => id !== issueId);

        setState({
            ...state,
            issues: filteredIssues,
        });
    };

    const handleViewIssue = async (currentIssue) => {
        await pokerTableRef.update({currentIssue: false});
        if (userId !== currentUser.uid) {
            return;
        }
        pokerTableRef.update({currentIssue});
    };

    const getNextIssue = (currentIssue, issuesList) => {
        let nextIssue = false;
        issuesList.forEach((issue, i) => {
            if (issue.id === currentIssue) {
                nextIssue = issuesList[i + 1];
            }
        });

        return nextIssue ? nextIssue.id : false;
    };

    const handleCloseIssue = async () => {
        return await pokerTableRef.update({currentIssue: false});
    };

    const loadPokerTable = () => {
        onValue(pokerTableRef, (snapshot) => {
            if (snapshot.exists()) {
                const table = snapshot.val();
                const newIssuesList = [];
                for (let issue in table.issues) {
                    newIssuesList.push({
                        ...table.issues[issue],
                        id: issue,
                    });
                }
                newIssuesList.sort((i1, i2) => {
                    if (i1.created > i2.created) return 1;
                    if (i2.created > i1.created) return -1;
                    return 0;
                });

                const nextIssue = getNextIssue(table.currentIssue, newIssuesList);
                setState({
                    ...state,
                    pokerTable: table,
                    issues: newIssuesList,
                    issueModal: table.issueModal || false,
                    currentIssue: table.currentIssue || false,
                    nextIssue,
                });
            }
        });
    };

    const showModalActions = () => {
        if (userId !== currentUser.uid) {
            return;
        }
        return (
            <Modal.Actions id="modalControl">
                <Button.Group>
                    <Button color="red" onClick={handleCloseIssue}>
                        <Icon name="close"/> Close
                    </Button>
                    <Button.Or/>
                    <Button
                        color="green"
                        onClick={() => handleViewIssue(state.nextIssue)}
                        disabled={!state.nextIssue}
                    >
                        <Icon name="chevron right"/> Next
                    </Button>
                </Button.Group>
            </Modal.Actions>
        );
    };
    const showIssueCreator = () => {
        if (userId !== currentUser.uid) {
            return (
                <div>
                    <Header as="h1">{state.pokerTable.tableName}</Header>
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
                <Header as="h1">{state.pokerTable.tableName}</Header>
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
                <IssueNameForm handleIssueSubmit={handleCreateIssue}/>
            </>
        );
    };

    return (
        <Layout>
            <Container>
                <Segment raised>{showIssueCreator()}</Segment>
                <Segment stacked>
                    <Header as="h1">Table Issues</Header>
                    <List divided relaxed>
                        {state.issues.map((s) => (
                            <List.Item className="issueLink pwm-list-item" key={s.id}>
                                <List.Content
                                    className="pwm-list-item-content"
                                    onClick={() => handleViewIssue(s.id)}
                                    role="button"
                                >
                                    <List.Header>
                                        <Icon name={s.isLocked ? 'lock' : 'unlock'}/>
                                        {s.title}
                                    </List.Header>
                                    <List.Description>
                                        Created: {moment(s.created).format('MM/DD/YYYY hh:mma')}
                                    </List.Description>
                                </List.Content>

                                {/* Only show the delete action if the authenticated user is the owner. */}
                                {userId === currentUser.uid && (
                                    <div className="actions">
                                        <button
                                            className="pwm-delete"
                                            onClick={removeIssue(s.id)}
                                        >
                                            <Icon name="times" color="red"/>
                                        </button>
                                    </div>
                                )}
                            </List.Item>
                        ))}
                    </List>
                </Segment>
            </Container>
            <Modal open={state.currentIssue ? true : false} centered={false}>
                <Modal.Content>
                    <Issue
                        issue={state.currentIssue}
                        userId={userId}
                        tableId={tableId}
                    />
                </Modal.Content>
                {showModalActions()}
            </Modal>
        </Layout>
    );
};

export default withAuthentication(PokerTable);
