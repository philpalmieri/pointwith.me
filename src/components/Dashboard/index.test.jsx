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
      remove: jest.fn(),
    }),
  };
});

describe('dashboard page', () => {
  it('can delete a poker table', () => {
    expect.hasAssertions();

    const { debug, baseElement: el } = render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    debug(el);

    let listItems = el.querySelectorAll('.pwm-list-item');

    expect(listItems).toHaveLength(3);
    expect(el).toHaveTextContent('table 2');

    const deleteButton = listItems[1].querySelector('.pwm-delete');

    fireEvent.click(deleteButton);

    // const mockedPokerTablesApi = pokerTablesApi.mock.results[0].value;

    // expect(mockedPokerTablesApi.remove).toHaveBeenCalledWith('pt2');

    listItems = el.querySelectorAll('.pwm-list-item');

    expect(listItems).toHaveLength(2);
    expect(el).not.toHaveTextContent('table 2');
  });
});
