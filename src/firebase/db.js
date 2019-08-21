import firebase from './firebase';

const getDb = () => {
  return firebase.database().ref();
};

//Tables
export const pokerTablesRoot = (userId) => 
  getDb().child(`pokerTables/${userId}`);
export const pokerTables = (userId) => 
  getDb().child(`pokerTables/${userId}`).orderByKey(); 
export const pokerTable = (userId, uid) => 
  getDb().child(`pokerTables/${userId}/${uid}`);

//Votes
export const votesRoot = (tid) => 
  getDb().child(`votes/${tid}`);

//Issues
export const pokerTableIssuesRoot = (userId, tid) => 
  getDb().child(`pokerTables/${userId}/${tid}/issues`);
export const pokerTableIssue = (userId, tid, iid) => 
  getDb().child(`pokerTables/${userId}/${tid}/issues/${iid}`);
