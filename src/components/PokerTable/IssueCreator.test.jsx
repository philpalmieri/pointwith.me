import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import IssueCreator from './IssueCreator';
import * as reactRouterDom from 'react-router-dom';
import {mockedNavigator, mockNavigation} from '../../setupTests';

// Mocks
jest.mock('../../firebase', () => ({
	auth: {
		auth: {
			currentUser: { uid: 'testUserId' }
		}
	}
}));
jest.mock('./IssueNameForm', () => ({ handleIssueSubmit }) => (
	<div data-testid="issue-name-form" onClick={handleIssueSubmit}>
		IssueNameForm
	</div>
));

describe('IssueCreator Component', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('renders correctly for a non-owner user', () => {
		reactRouterDom.useParams.mockReturnValue({ userId: 'differentUserId', tableId: 'testTableId' });

		const { getByText } = render(<IssueCreator tableName="Test Table" />);

		expect(getByText('Test Table')).toBeInTheDocument();
		expect(getByText('Return to Lobby')).toBeInTheDocument();
		expect(() => getByTestId('issue-name-form')).toThrow();
	});

	test('renders correctly for the owner user', () => {
		reactRouterDom.useParams.mockReturnValue({ userId: 'testUserId', tableId: 'testTableId' });

		const { getByText, getByTestId } = render(<IssueCreator tableName="Test Table" onClick={() => {}} />);

		expect(getByText('Test Table')).toBeInTheDocument();
		expect(getByText('Return to Lobby')).toBeInTheDocument();
		expect(getByTestId('issue-name-form')).toBeInTheDocument();
	});

	test('navigates to the dashboard on click', () => {
		reactRouterDom.useParams.mockReturnValue({ userId: 'testUserId', tableId: 'testTableId' });

		const { getByText } = render(<IssueCreator tableName="Test Table" onClick={() => {}} />);
		fireEvent.click(getByText('Return to Lobby'));

		expect(mockedNavigator).toHaveBeenCalledWith('/dashboard');
	});
});
