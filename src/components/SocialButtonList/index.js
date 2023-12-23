import React from 'react';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import {Button, Icon} from 'semantic-ui-react';
import {
    anonymousOAuth,
    azureOAuth,
    facebookOAuth,
    githubOAuth,
    googleOAuth,
    popUpSignIn,
    twitterOAuth
} from '../../firebase/auth';

const propTypes = {
    currentUser: PropTypes.object,
    currentProviders: PropTypes.func
};

const defaultProps = {
    currentProviders: null
};

const buttonList = {
    github: {
        visible: true,
        provider: () => {
            const provider = githubOAuth();
            provider.addScope('user');
            return provider;
        }
    },
    google: {
        visible: true,
        provider: () => googleOAuth()
    },
    microsoft: {
        visible: true,
        provider: () => azureOAuth()
    },
    anonymous: {
        visible: false,
        provider: () => anonymousOAuth()
    },
    twitter: {
        visible: false,
        provider: () => twitterOAuth()
    },
    facebook: {
        visible: false,
        provider: () => facebookOAuth()
    }
};

const SocialButtonList = ({currentUser, currentProviders}) => {
    const navigate = useNavigate();

    const authHandler = authData => {
        if (authData) {
            if (currentProviders === null) {
                navigate('/dashboard');
            } else {
                currentProviders(authData.user.providerData);
            }
        } else {
            console.error('Error authenticating');
        }
    };

    const authenticate = (e, provider) => {
        const providerOAuth = buttonList[provider].provider();
        if (!currentUser) {
            popUpSignIn(providerOAuth)
                .then(authHandler)
                .catch(err => console.error(err));
        } else {
            currentUser.linkWithPopup(providerOAuth)
                .then(authHandler)
                .catch(err => console.error(err));
        }
    };

    const renderButtonList = provider => {
        const visible = buttonList[provider].visible;

        if (visible) {
            return (
                <Button
                    primary
                    key={provider}
                    onClick={e => authenticate(e, provider)}
                >
                    <Icon name={provider}></Icon> {provider}
                </Button>
            );
        } else {
            return null;
        }
    };

    return (
        <div id="loginButtons">
            {Object.keys(buttonList).map(renderButtonList)}
        </div>
    );
};

SocialButtonList.propTypes = propTypes;
SocialButtonList.defaultProps = defaultProps;

export default SocialButtonList;
