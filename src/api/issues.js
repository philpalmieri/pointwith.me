import * as db from '../firebase/db';

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
   * @param {*} pokerTableId
   * @return a Promise
   */
  const remove = (issueId) => {
    return db.pokerTableIssue(userId, tableId, issueId).remove();
  };

  return {
    remove,
  };
};
