// Theirs
import React, {useEffect} from 'react';
import moment from 'moment';
import {Button, Container, Header, Icon, List, Modal, Segment,} from 'semantic-ui-react';

// Ours
import {auth, db} from '../../firebase';
import * as issues from '../../api/issues';
import Layout from '../../containers/Layout';
import Issue from '../Issue';
import withAuthentication from '../../containers/withAuthentication';
import {useParams} from 'react-router-dom';
import {child, onValue, set, update} from 'firebase/database';
import shortid from 'shortid';
import IssueCreator from './IssueCreator';
import ModalActions from './ModalActions';


const PokerTable = () => {
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
		update(child(ptIssuesRef, uid), data)
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
		update(pokerTableRef, {currentIssue: false})
			.then(() => {
				if (userId !== currentUser.uid) {
					return;
				}
				update(pokerTableRef, {currentIssue});
			});
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
		await update(pokerTableRef, {currentIssue: false});
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

	return (
		<Layout>
			<Container>
				<Segment raised>
					<IssueCreator
						onClick={handleCreateIssue}
						tableName={state.pokerTable.tableName}
					/>
				</Segment>
				<Segment stacked>
					<Header as="h1">Table Issues</Header>
					<List divided relaxed>
						{state.issues.length > 0 ? state.issues.map((s) => (
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
						)) : `No Issues Returned`}
					</List>
				</Segment>
			</Container>
			<Modal open={!!state.currentIssue} centered={false}>
				<Modal.Content>
					<Issue
						issue={state.currentIssue}
					/>
				</Modal.Content>
				{(userId === currentUser.uid) ?
					<ModalActions nextIssue={state.nextIssue} onClose={handleCloseIssue} onNext={handleViewIssue} />
				: null}
			</Modal>
		</Layout>
	);
};

export default withAuthentication(PokerTable);
