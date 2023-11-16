import React from 'react';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import {Button, Icon} from 'semantic-ui-react';
import {popUpSignIn} from '../../firebase/auth';

const propTypes = {
    buttonList: PropTypes.shape({
        github: PropTypes.shape({
            visible: PropTypes.bool.isRequired,
            provider: PropTypes.func.isRequired
        }),
        google: PropTypes.shape({
            visible: PropTypes.bool.isRequired,
            provider: PropTypes.func.isRequired
        }),
        microsoft: PropTypes.shape({
            visible: PropTypes.bool.isRequired,
            provider: PropTypes.func.isRequired
        }),
        //anonymous: {
        //visible: PropTypes.bool.isRequired,
        //provider: PropTypes.func.isRequired
        //},
        //twitter: PropTypes.shape({
        //visible: PropTypes.bool.isRequired,
        //provider: PropTypes.func.isRequired
        //}),
        //facebook: PropTypes.shape({
        //visible: PropTypes.bool.isRequired,
        //provider: PropTypes.func.isRequired
        //})
    }).isRequired,
    auth: PropTypes.object.isRequired,
    currentProviders: PropTypes.func
};

const defaultProps = {
    currentProviders: null
};

const SocialButtonList = ({buttonList, auth, currentProviders}) => {
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

        return (
            <Button
                primary
                key={provider}
                onClick={e => authenticate(e, provider)}
                className={(!visible) ? 'hidden' : ''}
            >
                <Icon name={provider}></Icon> {provider}
            </Button>
        );
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
