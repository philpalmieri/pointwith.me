import * as db from '../firebase/db';
import { remove as firebaseRemove } from 'firebase/database';
import { createClient } from './issues';

// Mocks
jest.mock('firebase/database', () => ({
    remove: jest.fn(),
}));
jest.mock('../firebase/db', () => ({
    pokerTableIssue: jest.fn(),
}));

describe('Issues API client', () => {
    const userId = 'testUserId';
    const tableId = 'testTableId';
    const issueId = 'testIssueId';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('remove function calls firebaseRemove with correct path', () => {
        const client = createClient(userId, tableId);
        client.remove(issueId);

        // Ensure the correct path is constructed
        expect(db.pokerTableIssue).toHaveBeenCalledWith(userId, tableId, issueId);

        // Ensure firebaseRemove is called with the path returned from pokerTableIssue
        const path = db.pokerTableIssue.mock.results[0].value;
        expect(firebaseRemove).toHaveBeenCalledWith(path);
    });
});
