import React from 'react';
import PropTypes from 'prop-types';
import {Button, Container, Icon, Image, Menu} from 'semantic-ui-react';
import {auth} from '../firebase';
import {useParams} from 'react-router-dom';

const propTypes = {
	children: PropTypes.node.isRequired,
	contentCenter: PropTypes.bool,
};

const defaultProps = {
	contentCenter: false,
};

const Layout = ({children, contentCenter}) => {
	const {userId} = useParams();
	const currentUser = auth.auth.currentUser;
	const isHost = userId === currentUser.uid
	const userDisplay = `${currentUser.displayName} - ${isHost ? `HOST` : `ATTENDEE`}`;

	return (
		<Container text style={{marginTim: '1em'}}>
			<Menu fixed="top" inverted>
				<Container text id="topBranding">
					<Image
						size="mini"
						src="/favicon-32x32.png"
						style={{marginRight: '1.5em'}}
					/>
					<p>Planning Poker for Remote Teams!</p>
				</Container>
				{currentUser ? (
					<>
						<Menu.Item>
							<Icon name="user"/>
							{userDisplay}
						</Menu.Item>
						<Menu.Item>
							<Button negative onClick={() => auth.auth.signOut()}>
								Logout
							</Button>
						</Menu.Item>
					</>
				) : null}
			</Menu>
			<main className={contentCenter ? 'content-center' : ''}>{children}</main>
			<Container>
				<footer>
					<p>
						<a
							href="https://twitter.com/pointwithme"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Icon name="twitter"/>
						</a>
						<a
							href="https://github.com/philpalmieri/pointwith.me"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Icon name="github"/>
						</a>
						&copy; {new Date().getFullYear()} PointWith.me
					</p>
				</footer>
			</Container>
		</Container>
	);
};

Layout.propTypes = propTypes;
Layout.defaultProps = defaultProps;

export default Layout;
