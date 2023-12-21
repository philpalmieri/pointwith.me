import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ModalActions from './ModalActions';

describe('ModalActions Component', () => {
	test('calls onClose when Close button is clicked', () => {
		const mockOnClose = jest.fn();
		const { getByText } = render(<ModalActions onClose={mockOnClose} />);

		fireEvent.click(getByText('Close'));
		expect(mockOnClose).toHaveBeenCalled();
	});

	test('calls onNext with nextIssue when Next button is clicked', () => {
		const mockOnNext = jest.fn();
		const { getByText } = render(<ModalActions onNext={mockOnNext} nextIssue={'nextIssueId'} />);

		fireEvent.click(getByText('Next'));
		expect(mockOnNext).toHaveBeenCalledWith('nextIssueId');
	});

	test('Next button is disabled when nextIssue is not provided', () => {
		const { getByText } = render(<ModalActions onNext={() => {}} />);

		expect(getByText('Next').closest('button')).toBeDisabled();
	});
});
