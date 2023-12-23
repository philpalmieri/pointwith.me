// Theirs
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment';
import {Container, Header, Icon, List, Segment,} from 'semantic-ui-react';
import {onValue, set} from 'firebase/database';
import shortid from 'shortid';

// Ours
import {auth, db} from '../../firebase';
import * as pokerTablesApi from '../../api/pokerTables';
import Layout from '../../containers/Layout';
import withAuthentication from '../../containers/withAuthentication';
import PokerTableNameForm from './PokerTableNameForm';


const Dashboard = () => {
	const currentUser = auth.auth.currentUser;
	const pokerTablesClient = pokerTablesApi.createClient(currentUser.uid);
	const [pokerTables, setPokerTables] = useState([]);

	useEffect(() => {
		loadPokerTables();
	}, []);

	const createPokerTable = (newPokerTableName) => {
		const uid = shortid.generate();
		const pRef = db.pokerTable(currentUser.uid, uid);
		const data = {
			created: new Date().toString(),
			tableName: newPokerTableName,
		};
		set(pRef, data)
			.then(() => console.log('Updated successfully'))
			.catch((error) => console.log('Error updating document: ', error));
		loadPokerTables();
	};

	const removePokerTable = (pokerTableId) => (e) => {
		e.preventDefault();

		// Optimistically deletes poker table. i.e. doesn't block the ui from updating
		pokerTablesClient.remove(pokerTableId);

		const filteredPokerTables = pokerTables.filter(
			({id}) => id !== pokerTableId
		);

		setPokerTables(filteredPokerTables);
	};

	const loadPokerTables = () => {
		const pokerTablesRef = db.pokerTables(currentUser.uid);
		onValue(pokerTablesRef, (snapshot) => {
			if (snapshot.exists()) {
				const pokerTables = snapshot.val();
				let newPokerTablesState = [];
				for (let table in pokerTables) {
					newPokerTablesState.push({
						...pokerTables[table],
						id: table,
					});
				}
				newPokerTablesState.sort((t1, t2) => {
					if (t1.created > t2.created) return -1;
					if (t2.created > t1.created) return 1;
					return 0;
				});
				setPokerTables(newPokerTablesState);
			}
		});
	};

	return (
		<Layout data-testid={`Dashboard`}>
			<Container>
				<Segment raised>
					<PokerTableNameForm handlePokerTableSubmit={createPokerTable}/>
				</Segment>
				<Segment stacked>
					<Header as="h1">Your Poker Tables</Header>
					<List divided relaxed>
						{pokerTables.length > 0 ? pokerTables.map((s) => (
							<List.Item key={s.id} className="pwm-list-item">
								<Link
									to={`/table/${currentUser.uid}/${s.id}`}
									className="pwm-list-item-content"
								>
									<List.Content>
										<List.Header>{s.tableName}</List.Header>
										<List.Description>Table ID: {s.id}</List.Description>
										<List.Description>
											Created: {moment(s.created).format('MM/DD/YYYY hh:mma')}
										</List.Description>
									</List.Content>
								</Link>
								<div className="actions">
									<button
										className="pwm-delete"
										data-testid="delete-button"
										onClick={removePokerTable(s.id)}
									>
										<Icon name="times" color="red"/>
									</button>
								</div>
							</List.Item>
						)) : `No poker tables found. Create one above!`}
					</List>
				</Segment>
			</Container>
		</Layout>
	);
};

export default withAuthentication(Dashboard);

// Export Dashboard without the withAuthentication HOC for testing
export {Dashboard};