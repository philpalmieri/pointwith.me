import {getAuth, GithubAuthProvider, TwitterAuthProvider, FacebookAuthProvider, GoogleAuthProvider, OAuthProvider, signInAnonymously, signInWithPopup} from 'firebase/auth';
import app from './firebase';
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const githubOAuth = () => {
  return new GithubAuthProvider();
};

export const twitterOAuth = () => {
  return new TwitterAuthProvider();
};

export const facebookOAuth = () => {
  return new FacebookAuthProvider();
};

export const googleOAuth = () => {
  return new GoogleAuthProvider();
};

export const azureOAuth = () => {
  return new OAuthProvider('microsoft.com');
};

export const anonymousOAuth = () => {
  return new signInAnonymously();
};

export const popUpSignIn = (provider) => signInWithPopup(auth, provider);
