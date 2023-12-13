// Import necessary testing libraries and dependencies
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VotingBlock from './VotingBlock'; // Assuming the component file is named VotingBlock.js

// Mock the fibonacci function to return a predefined sequence for testing
jest.mock('../../utils/fibonacci', () => jest.fn(() => [1, 2, 3, 5, 8, 13, 21, 34]));

// Mock function for onClick
const mockOnClick = jest.fn();

describe('VotingBlock component', () => {
	test('renders correctly', () => {
		// Render the component
		const { getByText } = render(
			<VotingBlock onClick={mockOnClick} isLocked={false} userVote={null} />
		);

		// Check if the component renders with the correct points
		expect(getByText('1')).toBeInTheDocument();
		expect(getByText('2')).toBeInTheDocument();
		expect(getByText('3')).toBeInTheDocument();
		expect(getByText('5')).toBeInTheDocument();
		expect(getByText('8')).toBeInTheDocument();
	});

	test('handles click event to show selected card', () => {

		// Render the component
		const { getByText, getByTestId } = render(
			<VotingBlock onClick={mockOnClick} isLocked={false} userVote={null} />
		);

		// Simulate a click event on a card
		fireEvent.click(getByText('5'));

		// Check if the onClick function is called with the correct argument
		expect(mockOnClick).toHaveBeenCalledWith(5);

		// Check if the card with the selected value has the 'selected' class
		expect(getByTestId('voteCards').childNodes[3]).toHaveClass('selected');
	});
});
