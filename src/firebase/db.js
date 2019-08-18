import firebase from './firebase';

const getDb = () => {
  return firebase.database().ref();
};

export const pokerTablesRoot = (userId) => 
  getDb().child(`pokerTables/${userId}`);
export const pokerTables = (userId) => 
  getDb().child(`pokerTables/${userId}`).orderByKey(); 
export const pokerTable = (userId, uid) => 
  getDb().child(`pokerTables/${userId}/${uid}`);
