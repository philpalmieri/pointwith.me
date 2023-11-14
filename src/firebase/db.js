import {getDatabase, orderByKey, query, ref, set, update} from 'firebase/database';
import app from './firebase';
import shortid from 'shortid';

export const db = getDatabase(app);

//Tables
export const pokerTablesRoot = (userId) => ref(db, `pokerTables/${userId}`);
export const pokerTables = (userId) => query(ref(db, `pokerTables/${userId}`), orderByKey());
export const pokerTable = (userId, uid) => ref(db, `pokerTables/${userId}/${uid}`);

export const updatePokerTable = (ref, data) => {
    ref.set(data)
        .then(() => console.log('Updated successfully'))
        .catch((error)=> console.log('Error updating document: ', error));
}

//Votes
export const votesRoot = (tid) => ref(db, `votes/${tid}`);

//Issues
export const pokerTableIssuesRoot = (userId, tid) => ref(db, `pokerTables/${userId}/${tid}/issues`);
export const pokerTableIssue = (userId, tid, iid) => ref(db, `pokerTables/${userId}/${tid}/issues/${iid}`);
