// Theirs
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';

// Ours
import * as pokerTablesApi from '../../api/pokerTables';
import Dashboard from '.';

jest.mock('../../firebase', () => {
  return {
    auth: {
      getAuth: jest.fn().mockReturnValue({
        currentUser: {
          uid: 'userId',
        },
      }),
    },
    db: {
      pokerTables: jest.fn().mockReturnValue({
        on: jest.fn().mockImplementation((_, cb) => {
          const snapshot = {
            val: jest.fn().mockReturnValue({
              pt1: { tableName: 'table 1', created: new Date() },
              pt2: { tableName: 'table 2', created: new Date() },
              pt3: { tableName: 'table 3', created: new Date() },
            }),
          };

          cb(snapshot);
        }),
      }),
    },
  };
});
jest.mock('../../api/pokerTables', () => {
  return {
    createClient: jest.fn().mockReturnValue({
      remove: jest.fn().mockResolvedValue({}),
    }),
  };
});

describe('dashboard page', () => {
  it('can delete a poker table', () => {
    expect.hasAssertions();

    const { baseElement: el } = render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    let listItems = el.querySelectorAll('.pwm-list-item');

    // sanity check
    expect(listItems).toHaveLength(3);
    expect(el).toHaveTextContent('table 2');

    const deleteButton = listItems[1].querySelector('.pwm-delete');

    fireEvent.click(deleteButton);

    // ensure the api call was made
    const mockedPokerTablesClient =
      pokerTablesApi.createClient.mock.results[0].value;

    expect(mockedPokerTablesClient.remove).toHaveBeenCalledWith('pt2');

    listItems = el.querySelectorAll('.pwm-list-item'); // reload selection

    expect(listItems).toHaveLength(2);
    expect(el).not.toHaveTextContent('table 2');

    // ensure we have the correct order of items
    expect(listItems[0]).toHaveTextContent('table 1');
    expect(listItems[1]).toHaveTextContent('table 3');
  });
});
