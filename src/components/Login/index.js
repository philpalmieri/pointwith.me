import React, {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import store from 'store';
import Layout from '../../containers/Layout';
import SocialButtonList from '../SocialButtonList';
import {Divider, Grid, Header, Segment} from 'semantic-ui-react';
import {auth} from '../../firebase';

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
    // anonymous: {
    //   visible: false,
    //   provider: () => auth.anonymousOAuth()
    // },
    //twitter: {
    //visible: true,
    //provider: () => auth.twitterOAuth()
    //},
    //facebook: {
    //visible: true,
    //provider: () => auth.facebookOAuth()
    //}
};

const Login = () => {
    console.group('Login');
    console.groupEnd();
    const navigate = useNavigate();
    useEffect(() => {
        auth.auth.onAuthStateChanged(user => {
            if (user) {
                const entryPoint = store.get('entryPoint');
                if (entryPoint) {
                    store.remove('entryPoint');
                    navigate(entryPoint);
                } else {
                    navigate('/dashboard');
                }
            } else {
                navigate('/');
            }
        });
    }, []);

    return (
        <Layout>
            <Grid textAlign="center" style={{height: '80vh'}} verticalAlign="middle">
                <Grid.Column style={{maxWidth: 450}}>
                    <Segment>
                        <Header as="h2">What is it?</Header>
                        <p>PointWith.me is a way for remote teams to story point quickly and easily.
                            Someone &ldquo;Drives&rdquo; your session and all the players open the link on their
                            phone/desktop and just point issues as they cycle through</p>
                    </Segment>
                    <Segment>
                        <Header as="h1">Sign In - It&rsquo;s FREE</Header>
                        <Header sub>
                            Login with a social account, we don&rsquo;t use/store anything other
                            than your account ID for OAuth
                        </Header>
                        <Divider horizontal/>
                        <SocialButtonList buttonList={buttonList} auth={auth}/>
                        <Link to="/about"></Link>
                    </Segment>
                </Grid.Column>
            </Grid>
        </Layout>
    );
};

export default Login;
