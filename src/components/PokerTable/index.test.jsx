// Theirs
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';

// Ours
import { auth } from '../../firebase';
import * as issuesApi from '../../api/issues';
import PokerTable from '.';

jest.mock('../../firebase', () => {
  return {
    auth: {
      getAuth: jest.fn(),
    },
    db: {
      pokerTable: jest.fn().mockReturnValue({
        on: jest.fn().mockImplementation((_, cb) => {
          const snapshot = {
            val: jest.fn().mockReturnValue({
              tableName: 'poker table',
              issues: {
                i1: {
                  title: 'issue 1',
                  isLocked: false,
                  created: new Date(),
                },
                i2: {
                  title: 'issue 2',
                  isLocked: false,
                  created: new Date(),
                },
                i3: {
                  title: 'issue 3',
                  isLocked: false,
                  created: new Date(),
                },
              },
            }),
          };

          cb(snapshot);
        }),
      }),
      pokerTableIssuesRoot: jest.fn(),
    },
  };
});

jest.mock('../../api/issues', () => {
  return {
    createClient: jest.fn().mockReturnValue({
      remove: jest.fn().mockResolvedValue({}),
    }),
  };
});

describe('visiting the poker table page', () => {
  describe('as a voter', () => {
    it('cannot remove issues', () => {
      expect.hasAssertions();

      auth.getAuth.mockReturnValue({
        currentUser: { uid: 'voterId' },
      });

      const { baseElement: el } = render(
        <MemoryRouter initialEntries={['/table/ownerId/tableId']}>
          <Route path="/table/:userId/:tableId" component={PokerTable} />
        </MemoryRouter>
      );

      const deleteButtons = el.querySelector('.pwm-delete');

      expect(deleteButtons).not.toBeInTheDocument();
    });
  });

  describe('as an owner', () => {
    it('can delete an issue', () => {
      expect.hasAssertions();

      auth.getAuth.mockReturnValue({
        currentUser: { uid: 'ownerId' },
      });

      const { baseElement: el } = render(
        <MemoryRouter initialEntries={['/table/ownerId/tableId']}>
          <Route path="/table/:userId/:tableId" component={PokerTable} />
        </MemoryRouter>
      );

      let listItems = el.querySelectorAll('.pwm-list-item');

      // sanity check
      expect(listItems).toHaveLength(3);
      expect(el).toHaveTextContent('issue 2');

      const deleteButton = listItems[1].querySelector('.pwm-delete');

      fireEvent.click(deleteButton);

      // ensure the api call was made
      const mockedIssuesClient = issuesApi.createClient.mock.results[0].value;

      expect(mockedIssuesClient.remove).toHaveBeenCalledWith('i2');

      listItems = el.querySelectorAll('.pwm-list-item'); // reload selection

      expect(listItems).toHaveLength(2);
      expect(el).not.toHaveTextContent('issue 2');

      // ensure we have the correct order of items
      expect(listItems[0]).toHaveTextContent('issue 1');
      expect(listItems[1]).toHaveTextContent('issue 3');
    });
  });
});
