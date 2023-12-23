import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react';
import {BrowserRouter, useParams} from 'react-router-dom';
import '@testing-library/jest-dom';
import {PokerTable} from './index';
import {auth, db} from '../../firebase';
import * as issues from '../../api/issues';
import {onValue} from 'firebase/database';
import * as pokerTablesApi from '../../api/pokerTables';

// Mocks
// Mock necessary modules and functions
// Mock the firebase functions
jest.mock('firebase/database');
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: jest.fn()
}));
jest.mock('../../firebase', () => ({
	...jest.requireActual('../../firebase'),
	auth: {
		get auth() {
			return {
				currentUser: {uid: 'testUserId'},
			};
		},
	},
	db: {
		pokerTable: jest.fn((userId) => ({
			path: `pokerTables/${userId}`,
		})),
		pokerTableIssuesRoot: jest.fn((userId, tid) => ({
			path: `pokerTables/${userId}/${tid}/issues`,
		})),
	},
}));
jest.mock('../../api/issues', () => ({
	createClient: jest.fn(() => ({
		remove: jest.fn()
	}))
}));
jest.mock('../../containers/Layout', () => ({children}) => <div data-testid="layout">{children}</div>);
jest.mock('../Issue', () => () => <div data-testid="issue-component"></div>);
jest.mock('./IssueCreator', () => () => <div data-testid="issue-creator-component"></div>);
jest.mock('./ModalActions', () => () => <div data-testid="modal-actions-component"></div>);

describe('PokerTable Component', () => {
	const originalUser = auth.auth.currentUser;

	beforeEach(() => {
		useParams.mockReturnValue({userId: 'testUserId', tableId: 'testTableId'});
	});

	afterEach(() => {
		// Reset currentUser to original after each test
		auth.auth.currentUser = originalUser;
	});

	test('as a voter, cannot remove issues', () => {
		const {queryByTestId} = render(
			<BrowserRouter>
				<PokerTable/>
			</BrowserRouter>
		);

		// Expect the delete button not to be present
		expect(queryByTestId('delete-issue-button')).not.toBeInTheDocument();
	});

	test('as an owner, can delete an issue', async () => {
		const remove = jest.fn();
		// Mock firebase database responses
		db.pokerTable.mockImplementation(() => ({ /* ... */}));
		db.pokerTableIssuesRoot.mockImplementation(() => ({ /* ... */}));
		issues.createClient.mockImplementation(() => ({ remove }));
		onValue.mockImplementation((ref, callback) => {
			const snapshot = {
				exists: jest.fn(() => true),
				val: jest.fn(() => ({
					tableName: 'Test Table',
					created: 'Fri Nov 17 2023 22:31:08 GMT-0500 (Eastern Standard Time)',
					issues: {
						'testIssue': {
							created: "2023-12-14T19:40:46.578Z",
							score: 0,
							title: "test issue"
						}
					}
				}))
			};
			callback(snapshot);
		});

		// Render the component
		const {getByTestId} = render(
			<BrowserRouter>
				<PokerTable/>
			</BrowserRouter>
		);

		// Fire event to simulate deleting an issue
		fireEvent.click(getByTestId('delete-issue-button'));

		// Wait for the expected outcome
		await waitFor(() => {
			expect(remove).toHaveBeenCalled();
		});
	});

	// Additional tests as needed...
});
