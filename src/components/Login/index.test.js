import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Login from './index';
import store from 'store';
import * as firebaseAuth from '../../firebase';

// Mocks
jest.mock('store', () => ({
	get: jest.fn(),
	remove: jest.fn()
}));
jest.mock('../../firebase', () => ({
	auth: {
		auth: {
			onAuthStateChanged: jest.fn()
		},
		githubOAuth: jest.fn(),
		googleOAuth: jest.fn(),
		azureOAuth: jest.fn()
		// ... other auth methods
	}
}));
jest.mock('../../containers/Layout', () => ({ children }) => <div data-testid="layout">{children}</div>);
jest.mock('../SocialButtonList', () => ({ buttonList }) => <div data-testid="social-button-list"></div>);

describe('Login Component', () => {
	test('renders Login component', () => {
		const { getByText } = render(
			<BrowserRouter>
				<Login />
			</BrowserRouter>
		);
		expect(getByText('Sign In - It’s FREE')).toBeInTheDocument();
	});

	test('navigates based on authentication state', async () => {
		const mockUser = { uid: '123' };
		firebaseAuth.auth.auth.onAuthStateChanged.mockImplementationOnce(callback => callback(mockUser));
		store.get.mockImplementationOnce(() => '/dashboard');

		render(
			<BrowserRouter>
				<Login />
			</BrowserRouter>
		);

		// Verify navigation logic
		// This requires additional setup depending on how you handle routing in your tests
		await waitFor(() => {
			expect(store.get).toHaveBeenCalledWith('entryPoint');
			// Additional assertions for navigation
		});
	});

	// Additional tests for different scenarios (e.g., user not authenticated)
});

