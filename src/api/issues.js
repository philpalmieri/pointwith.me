import * as db from '../firebase/db';
import {remove as firebaseRemove} from 'firebase/database';

/**
 * Creates an api client for managing issue data within a specfic poker table.
 *
 * @param {*} userId - user id from firebase
 * @param {*} tableId - parent poker table id from firebase
 */
export const createClient = (userId, tableId) => {
    /**
     * Deletes an issue from a poker table. Returns a promise once the change is committed to firebase.
     *
     * @param {*} issueId - issue id from firebase
     * @return a Promise
     */
    const remove = (issueId) => firebaseRemove(db.pokerTableIssue(userId, tableId, issueId));

    return {
        remove,
    };
};
