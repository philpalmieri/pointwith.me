import React from 'react';
import {render, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {useParams} from 'react-router-dom';
import {onValue} from 'firebase/database';
import Issue from './index'; // Assuming the component file is named index.js

// Mock the firebase functions
jest.mock('firebase/database');
jest.mock('../../firebase');

// Mock useParams hook
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: jest.fn(),
}));

// Mock necessary modules and functions
jest.mock('firebase/auth', () => ({
	...jest.requireActual('firebase/auth'),
	getAuth: jest.fn(() => ({
		currentUser: {uid: 'testUserId'},
	})),
}));
jest.mock('../../firebase', () => ({
	...jest.requireActual('../../firebase'),
	db: {
		pokerTableIssue: jest.fn((userId, tableId, issue) => ({
			path: `pokerTableIssue/${userId}/${tableId}/${issue}`,
		})),
		votesRoot: jest.fn((issue) => ({
			path: `votesRoot/${issue}`,
		})),
	},
}));

describe('Issue Component', () => {
	beforeEach(() => {
		// Mock useParams values
		useParams.mockReturnValue({userId: 'testUserId', tableId: 'testTableId'});
	});

	test('renders Issue component and displays loading message', () => {
		// Render the component
		const {getByText} = render(<Issue issue="testIssue"/>);

		// Check if the loading message is displayed
		expect(getByText('Loading')).toBeInTheDocument();
	});

	test('renders Issue component with Controls when isTableOwner is true', async () => {
		// Mock onValue function for issueRef
		onValue.mockImplementationOnce((ref, callback) => {
			const snapshot = {
				exists: jest.fn(() => true),
				val: jest.fn(() => ({title: 'Test Issue', isLocked: false, showVotes: false}))
			};
			callback(snapshot);
		});

		// Render the component
		const {getByText} = render(<Issue issue="testIssue"/>);

		// Wait for data to be loaded
		await waitFor(() => {
			expect(getByText('Test Issue')).toBeInTheDocument();
		});

		// Check if Controls component is rendered when isTableOwner is true
		expect(getByText('Show Votes')).toBeInTheDocument(); // Assuming this text is present in your Controls component
	});

	test('renders VotingBlock component when issueState.isLocked is false', async () => {
		// Mock onValue function for issueRef
		onValue.mockImplementationOnce((ref, callback) => {
			const snapshot = {
				exists: jest.fn(() => true),
				val: jest.fn(() => ({title: 'Test Issue', isLocked: false, showVotes: false}))
			};
			callback(snapshot);
		});

		// Render the component
		const {getByTestId} = render(<Issue issue="testIssue"/>);

		// Wait for data to be loaded
		await waitFor(() => {
			expect(getByTestId('voteCards')).toBeInTheDocument();
		});

		// Check if VotingBlock component is rendered when issueState.isLocked is false
		expect(getByTestId('voteCards')).toBeInTheDocument();
	});

	// Add more tests based on your specific requirements
});
