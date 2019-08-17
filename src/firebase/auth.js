import firebase from './firebase';

export const getAuth = () => {
  return firebase.auth();
};

export const githubOAuth = () => {
  return new firebase.firebase_.auth.GithubAuthProvider();
};

export const twitterOAuth = () => {
  return new firebase.firebase_.auth.TwitterAuthProvider();
};

export const facebookOAuth = () => {
  return new firebase.firebase_.auth.FacebookAuthProvider();
};

export const googleOAuth = () => {
  return new firebase.firebase_.auth.GoogleAuthProvider();
};
