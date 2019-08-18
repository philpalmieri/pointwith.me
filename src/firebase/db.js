import firebase from './firebase';

const getDb = () => {
  return firebase.database().ref();
};

export const pokerSessionsRoot = () => getDb().child('poker-sessions');
export const pokerSessions = async () => await getDb().child('poker-sessions').orderByKey(); 
export const pokerSession = uid => getDb().child(`poker-sessions/${uid}`);
