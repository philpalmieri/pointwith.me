import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {onValue, set} from 'firebase/database';
import {Dashboard} from './index';
import * as pokerTablesApi from '../../api/pokerTables';
import {MemoryRouter} from 'react-router-dom';

// Mock necessary modules and functions
// Mock the firebase functions
jest.mock('firebase/database');
jest.mock('../../firebase');
jest.mock('../../api/pokerTables');

// mock layout component
jest.mock('../../containers/Layout', () => ({
	__esModule: true,
	default: ({children}) => <div data-testid="layout-test">{children}</div>,
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
		pokerTables: jest.fn((userId) => ({
			path: `pokerTables/${userId}`,
		})),
		pokerTable: jest.fn((userId, tableId) => ({
			path: `pokerTable/${userId}/${tableId}`,
		})),
	},
}));
jest.mock(pokerTablesApi, () => ({
	createClient: jest.fn(() => ({
		remove: jest.fn(),
	})),
}));
jest.mock('moment', () => {
	const moment = jest.requireActual('moment');
	return (date) => moment(date);
});
jest.mock('shortid', () => ({generate: jest.fn(() => 'testTableId')}));

describe('Dashboard Page', () => {
	test('renders Dashboard component', async () => {
		// Render the component
		const {getByText} = render(<Dashboard/>);

		// Verify that the component renders correctly
		expect(getByText('Your Poker Tables')).toBeInTheDocument();
	});

	test('deletes a poker table when the delete button is clicked', async () => {
		// Mock necessary functions
		const remove = jest.fn();
		onValue.mockImplementationOnce((ref, callback) => {
			const snapshot = {
				exists: jest.fn(() => true),
				val: jest.fn(() => ({
					'randomuserstring': {
						tableName: 'Test Table',
						created: 'Fri Nov 17 2023 22:31:08 GMT-0500 (Eastern Standard Time)'
					}
				}))
			};
			callback(snapshot);
		});
		set.mockImplementationOnce(() => Promise.resolve());
		pokerTablesApi.createClient.mockImplementation(() => ({ remove }));

		// Render the component inside memory router
		const {getByTestId, getByText, queryByText} = await render(
			<MemoryRouter>
				<Dashboard/>
			</MemoryRouter>
		);

		// Wait for data to be loaded
		await waitFor(() => {
			expect(getByText('Test Table')).toBeInTheDocument();
		});

		// Click the delete button
		fireEvent.click(getByTestId('delete-button'));

		// Verify that the poker table is deleted optimistically
		expect(remove).toHaveBeenCalledWith('randomuserstring');

		// Verify that the poker table is removed from the UI
		await waitFor(() => {
			const table = queryByText('Test Table');
			expect(table).not.toBeInTheDocument();
		});
	});

	// Add more tests based on your specific requirements
});
