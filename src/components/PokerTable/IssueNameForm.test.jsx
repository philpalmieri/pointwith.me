import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import IssueNameForm from './IssueNameForm';

describe('IssueNameForm Component', () => {
	test('renders input field correctly', () => {
		const { getByPlaceholderText } = render(<IssueNameForm handleIssueSubmit={() => {}} />);
		const inputElement = getByPlaceholderText('New Issue Name');
		expect(inputElement).toBeInTheDocument();
	});

	test('updates input field on change', () => {
		const { getByPlaceholderText } = render(<IssueNameForm handleIssueSubmit={() => {}} />);
		const inputElement = getByPlaceholderText('New Issue Name');
		fireEvent.change(inputElement, { target: { value: 'Test Issue' } });
		expect(inputElement.value).toBe('Test Issue');
	});

	test('calls handleIssueSubmit on form submission with input value', () => {
		const mockHandleIssueSubmit = jest.fn();
		const { getByPlaceholderText, getByRole } = render(<IssueNameForm handleIssueSubmit={mockHandleIssueSubmit} />);
		const inputElement = getByPlaceholderText('New Issue Name');
		fireEvent.change(inputElement, { target: { value: 'Test Issue' } });
		fireEvent.submit(getByRole('form'));

		expect(mockHandleIssueSubmit).toHaveBeenCalledWith('Test Issue');
	});
});
