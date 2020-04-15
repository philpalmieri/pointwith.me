import db from '../firebase/db';
import * as tables from './pokerTables';

jest.mock('../firebase/db', () => {
  const mockedRemove = jest.fn();

  return {
    pokerTable: jest.fn().mockReturnValue({ remove: mockedRemove }),
  };
});

const mockedDB = db;

let pokerTableApi;

describe('poker table', () => {
  beforeAll(() => {
    pokerTableApi = tables.createClient('userId');
  });

  it('can delete a poker table', async () => {
    expect.assertions(2);

    await pokerTableApi.remove('pokerTableId');

    expect(mockedDB.pokerTable).toHaveBeenCalledWith('userId', 'pokerTableId');

    const pokerTable = mockedDB.pokerTable.mock.results[0].value;

    expect(pokerTable.remove).toHaveBeenCalledWith();
  });
});
