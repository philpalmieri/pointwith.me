// Theirs
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment';
import {Button, Container, Divider, Form, Header, Icon, List, Segment,} from 'semantic-ui-react';
import {child, onValue, push, ref, set} from 'firebase/database';

// Ours
import {auth, db} from '../../firebase';
import * as pokerTablesApi from '../../api/pokerTables';
import Layout from '../../containers/Layout';
import withAuthentication from '../../containers/withAuthentication';
import {pokerTable, updatePokerTable} from '../../firebase/db';

const shortid = require('shortid');

class Dashboard extends Component {
    state = {
        pokerTables: [],
        pokerTablesClient: null,
        newPokerTableName: '',
        currentUser: auth.auth.currentUser,
    };

    componentDidMount() {
        this.loadPokerTables();

        this.setState({
            pokerTablesClient: pokerTablesApi.createClient(
                this.state.currentUser.uid
            ),
        });
    }

    createPokerTable = (e) => {
        const uid = shortid.generate();
        const pRef = db.pokerTable(this.state.currentUser.uid, uid);
        const data = {
            created: new Date().toString(),
            tableName: this.state.newPokerTableName,
        };
        set(pRef, data)
            .then(() => console.log('Updated successfully'))
            .catch((error)=> console.log('Error updating document: ', error));
        this.setState({newPokerTableName: ''});
        this.loadPokerTables();
    };

    removePokerTable = (pokerTableId) => (e) => {
        e.preventDefault();

        this.state.pokerTablesClient.remove(pokerTableId); // Optimistically deletes poker table. i.e. doesn't block the ui from updating

        const filteredPokerTables = this.state.pokerTables.filter(
            ({id}) => id !== pokerTableId
        );

        this.setState({
            pokerTables: filteredPokerTables,
        });
    };

    handleNewPokerTableName = (e) => {
        this.setState({newPokerTableName: e.target.value});
    };

    loadPokerTables = () => {
        const pokerTablesRef = db.pokerTables(this.state.currentUser.uid);
        onValue(pokerTablesRef, (snapshot) => {
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
            this.setState({
                pokerTables: newPokerTablesState,
            });
        });
    };

    render() {
        return (
            <Layout>
                <Container>
                    <Segment raised>
                        <Form onSubmit={this.createPokerTable}>
                            <Header as="h1">Create Poker Table</Header>
                            <Form.Field>
                                <label>Poker Table Name</label>
                                <input
                                    placeholder="New Poker Table Name"
                                    value={this.state.newPokerTableName}
                                    onChange={this.handleNewPokerTableName}
                                />
                            </Form.Field>
                            <Button primary type="submit">
                                Create Poker Table
                            </Button>
                        </Form>
                    </Segment>
                    <Segment stacked>
                        <Header as="h1">Your Poker Tables</Header>
                        <List divided relaxed>
                            {this.state.pokerTables.map((s) => (
                                <List.Item key={s.id} className="pwm-list-item">
                                    <Link
                                        to={`/table/${this.state.currentUser.uid}/${s.id}`}
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
                                            onClick={this.removePokerTable(s.id)}
                                        >
                                            <Icon name="times" color="red"/>
                                        </button>
                                    </div>
                                </List.Item>
                            ))}
                        </List>
                    </Segment>
                </Container>
                <Divider horizontal></Divider>
                <Container>
                    <Button negative onClick={() => auth.auth.signOut()}>
                        Logout
                    </Button>
                </Container>
            </Layout>
        );
    }
}

export default withAuthentication(Dashboard);
