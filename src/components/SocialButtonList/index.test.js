import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import SocialButtonList from './index';
import * as reactRouterDom from 'react-router-dom';
import {
	anonymousOAuth,
	azureOAuth,
	facebookOAuth,
	githubOAuth,
	googleOAuth,
	popUpSignIn,
	twitterOAuth
} from '../../firebase/auth';
import {signInWithPopup} from 'firebase/auth';
import {mockedNavigator} from '../../setupTests';

// Mocks
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: jest.fn(),
}));

jest.mock('../../firebase/auth', () => ({
	...jest.requireActual('../../firebase/auth'),
	githubOAuth: jest.fn(() => ({ /* mock properties and methods as needed */ })),
	googleOAuth: jest.fn(() => ({ /* mock properties and methods as needed */ })),
	azureOAuth: jest.fn(() => ({ /* mock properties and methods as needed */ })),
	popUpSignIn: jest.fn(() => Promise.resolve({ user: { providerData: ['provider'] } })),
}));


describe('SocialButtonList Component', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('renders visible buttons correctly', () => {
		const { getByText } = render(<SocialButtonList currentUser={null} />);

		expect(getByText('github')).toBeInTheDocument();
		expect(getByText('google')).toBeInTheDocument();
		expect(getByText('microsoft')).toBeInTheDocument();
		// Anonymous button is not visible
	});

	test('button click initiates authentication', async () => {
		popUpSignIn.mockResolvedValueOnce({ user: { providerData: ['provider'] } });
		const { getByText } = render(<SocialButtonList currentUser={null} />);
		fireEvent.click(getByText('google'));

		await expect(popUpSignIn).toHaveBeenCalled();
		await expect(googleOAuth).toHaveBeenCalled();
	});

	xtest('navigates to dashboard after successful authentication', async () => {
		popUpSignIn.mockResolvedValueOnce({ user: { providerData: ['provider'] } });
		const { getByText } = render(<SocialButtonList currentUser={null} />);
		fireEvent.click(getByText('google'));

		await expect(mockedNavigator).toHaveBeenCalledWith('/dashboard');
	});
});
