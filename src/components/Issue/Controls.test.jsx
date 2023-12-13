import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Controls from './Controls'; // Assuming the component file is named Controls.js
import { update } from 'firebase/database';
import { db } from '../../firebase';
import { useParams } from 'react-router-dom';

// Mock the firebase functions
jest.mock('firebase/database');
jest.mock('../../firebase');

// Mock useParams hook
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: jest.fn(),
}));

describe('Controls component', () => {
	beforeEach(() => {
		// Mock useParams values
		useParams.mockReturnValue({userId: 'testUserId', tableId: 'testTableId'});
	});

	test('rendered correctly', () => {
		// Render the component
		const {getByText} = render(
			<Controls isLocked={false} issue="testIssue" showVotes={false}/>
		);

		// Check if the buttons and their initial state are rendered correctly
		expect(getByText('Show Votes')).toBeInTheDocument();
		expect(getByText('Lock Voting')).toBeInTheDocument();
	});

	describe('handles button clicks', () => {
		test('to show votes', () => {
			// Render the component
			const {getByText} = render(
				<Controls isLocked={false} issue="testIssue" showVotes={false}/>
			);

			// Mock the update function from firebase
			update.mockReturnValueOnce(Promise.resolve());

			// Simulate a click event on the "Show Votes" button
			fireEvent.click(getByText('Show Votes'));

			// Check if the update function is called with the correct arguments
			expect(update).toHaveBeenCalledWith(
				db.pokerTableIssue('testUserId', 'testTableId', 'testIssue'),
				{showVotes: true}
			);
		});

		test('to lock voting', () => {
			// Render the component
			const {getByText} = render(
				<Controls isLocked={false} issue="testIssue" showVotes={false}/>
			);

			// Mock the update function from firebase
			update.mockReturnValueOnce(Promise.resolve());

			// Simulate a click event on the "Lock Voting" button
			fireEvent.click(getByText('Lock Voting'));

			// Check if the update function is called with the correct arguments
			expect(update).toHaveBeenCalledWith(
				db.pokerTableIssue('testUserId', 'testTableId', 'testIssue'),
				{isLocked: true}
			);
		});
	});
});

// Add more test cases as needed
