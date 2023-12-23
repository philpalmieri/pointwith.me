import * as db from '../firebase/db';
import { remove as firebaseRemove } from 'firebase/database';
import { createClient } from './pokerTables';

// Mocks
jest.mock('firebase/database', () => ({
  remove: jest.fn(),
}));
jest.mock('../firebase/db', () => ({
  pokerTable: jest.fn(),
}));

describe('Poker Tables API client', () => {
  const userId = 'testUserId';
  const pokerTableId = 'testPokerTableId';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('remove function calls firebaseRemove with correct path', () => {
    const client = createClient(userId);
    client.remove(pokerTableId);

    // Ensure the correct path is constructed
    expect(db.pokerTable).toHaveBeenCalledWith(userId, pokerTableId);

    // Ensure firebaseRemove is called with the path returned from pokerTable
    const path = db.pokerTable.mock.results[0].value;
    expect(firebaseRemove).toHaveBeenCalledWith(path);
  });
});
