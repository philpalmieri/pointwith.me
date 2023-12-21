import React from 'react';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import {Button, Icon} from 'semantic-ui-react';
import {popUpSignIn} from '../../firebase/auth';
import {auth} from '../../firebase';

const propTypes = {
    auth: PropTypes.object.isRequired,
    currentProviders: PropTypes.func
};

const defaultProps = {
    currentProviders: null
};

const buttonList = {
    github: {
        visible: true,
        provider: () => {
            const provider = auth.githubOAuth();
            provider.addScope('user');
            return provider;
        }
    },
    google: {
        visible: true,
        provider: () => auth.googleOAuth()
    },
    microsoft: {
        visible: true,
        provider: () => auth.azureOAuth()
    },
    anonymous: {
      visible: false,
      provider: () => auth.anonymousOAuth()
    },
    //twitter: {
    //visible: true,
    //provider: () => auth.twitterOAuth()
    //},
    //facebook: {
    //visible: true,
    //provider: () => auth.facebookOAuth()
    //}
};

const SocialButtonList = ({auth, currentProviders}) => {
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
        if (!auth.auth.currentUser) {
            popUpSignIn(providerOAuth)
                .then(authHandler)
                .catch(err => console.error(err));
        } else {
            auth.auth
                .currentUser.linkWithPopup(providerOAuth)
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
                    onClick={e => {
                        console.log('clicked');
                        authenticate(e, provider)
                    }}
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
