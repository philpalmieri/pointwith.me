import React from 'react';
import { render } from '@testing-library/react';
import Layout from './Layout';
import { auth } from '../firebase';
import * as reactRouterDom from 'react-router-dom';

// Mocks
jest.mock('../firebase', () => ({
	auth: {
		auth: {
			currentUser: {
				uid: 'testUserId',
				displayName: 'Test User'
			}
		}
	}
}));

describe('Layout Component', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		reactRouterDom.useParams.mockReturnValue({ userId: 'testUserId' });
	});

	test('renders with children and displays user info when authenticated', () => {
		const { getByText } = render(
			<Layout>
				<div>Child Component</div>
			</Layout>
		);

		expect(getByText('Child Component')).toBeInTheDocument();
		expect(getByText('Test User - HOST')).toBeInTheDocument();
	});

	test('content centering based on prop', () => {
		const { container } = render(
			<Layout contentCenter={true}>
				<div>Centered Content</div>
			</Layout>
		);

		expect(container.querySelector('.content-center')).toBeInTheDocument();
	});

	// Additional tests as needed...
});
