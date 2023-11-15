// Theirs
import React, {Component, useEffect} from 'react';
import moment from 'moment';
import {
  Button,
  Container,
  Form,
  Header,
  Icon,
  List,
  Modal,
  Segment,
} from 'semantic-ui-react';

// Ours
import { db, auth } from '../../firebase';
import * as issues from '../../api/issues';
import Layout from '../../containers/Layout';
import Issue from '../Issue';
import withAuthentication from '../../containers/withAuthentication';
import {useNavigate, useParams} from 'react-router-dom';
import {onValue, set} from 'firebase/database';
import {pokerTableIssue} from '../../firebase/db';
import shortid from 'shortid';


const PokerTable = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [state, setState] = React.useState({
    ownerId: params.userId,
    tableId: params.tableId,
    currentUser: auth.auth.currentUser,
    newIssueName: '',
    pokerTable: {},
    issuesClient: null,
    issues: [],
    currentIssue: false,
    nextIssue: false,
  });
  const pokerTableRef = db.pokerTable(state.ownerId, state.tableId)
  const ptIssuesRef = db.pokerTableIssuesRoot(
      state.currentUser.uid,
      state.tableId
  );

  useEffect(() => {
    loadPokerTable();
    setState({
      ...state,
      issuesClient: issues.createClient(
          state.currentUser.uid,
          state.tableId
      ),
    });
  }, []);

  const handleCreateIssue = (e) => {
    const uid = shortid.generate();
    const data = {
      title: state.newIssueName,
          created: new Date(),
        score: 0,
        votes: {},
    }
    set(db.pokerTableIssue(state.currentUser.uid, state.tableId, uid), data);
    setState({
      ...state,
      newIssueName: ''
    });
  };

  const removeIssue = (issueId) => (e) => {
    e.preventDefault();

    state.issuesClient.remove(issueId); // Optimistically deletes poker table. i.e. doesn't block the ui from updating

    const filteredIssues = state.issues.filter(({ id }) => id !== issueId);

    setState({
      ...state,
      issues: filteredIssues,
    });
  };

  const handleNewIssueName = (e) => {
    setState({
      ...state,
      newIssueName: e.target.value
    });
  };

  const handleViewIssue = async (currentIssue) => {
    await pokerTableRef.update({ currentIssue: false });
    if (state.ownerId !== state.currentUser.uid) {
      return;
    }
    pokerTableRef.update({ currentIssue });
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
    return await pokerTableRef.update({ currentIssue: false });
  };

  const loadPokerTable = () => {
    onValue(pokerTableRef, (snapshot) => {
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
    });
  };

  const showModalActions = () => {
    if (state.ownerId !== state.currentUser.uid) {
      return;
    }
    return (
      <Modal.Actions id="modalControl">
        <Button.Group>
          <Button color="red" onClick={handleCloseIssue}>
            <Icon name="close" /> Close
          </Button>
          <Button.Or />
          <Button
            color="green"
            onClick={() => handleViewIssue(state.nextIssue)}
            disabled={!state.nextIssue}
          >
            <Icon name="chevron right" /> Next
          </Button>
        </Button.Group>
      </Modal.Actions>
    );
  }
  const showIssueCreator = () => {
    if (state.ownerId !== state.currentUser.uid) {
      return (
        <div>
          <Header as="h1">{state.pokerTable.tableName}</Header>
          <Header
            sub
            as="a"
            onClick={() => navigate('/dashboard')}
          >
            <Icon name="home" />
            Return to Lobby
          </Header>
        </div>
      );
    }
    return (
      <Form onSubmit={handleCreateIssue}>
        <Header as="h1">{state.pokerTable.tableName}</Header>
        <Header
          sub
          as="a"
          onClick={() => navigate('/dashboard')}
        >
          <Icon name="home" />
          Return to Lobby
        </Header>
        <p>
          Copy this table's URL to share with your team for a pointing session
        </p>
        <Header as="h2">Create Issue</Header>
        <Form.Field>
          <label>Open Issues</label>
          <input
            placeholder="New Issue Name"
            value={state.newIssueName}
            onChange={handleNewIssueName}
          />
        </Form.Field>
        <Button primary type="submit">
          Create Issue
        </Button>
      </Form>
    );
  }

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
                    <Icon name={s.isLocked ? 'lock' : 'unlock'} />
                    {s.title}
                  </List.Header>
                  <List.Description>
                    Created: {moment(s.created).format('MM/DD/YYYY hh:mma')}
                  </List.Description>
                </List.Content>

                {/* Only show the delete action if the authenticated user is the owner. */}
                {state.ownerId === state.currentUser.uid && (
                  <div className="actions">
                    <button
                      className="pwm-delete"
                      onClick={removeIssue(s.id)}
                    >
                      <Icon name="times" color="red" />
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
            ownerId={state.ownerId}
            tableId={state.tableId}
          />
        </Modal.Content>
        {showModalActions()}
      </Modal>
    </Layout>
  );
}

export default withAuthentication(PokerTable);
