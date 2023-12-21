import * as db from '../firebase/db';
import * as issues from './issues';

jest.mock('../firebase/db', () => {
    const mockedRemove = jest.fn();

    return {
        pokerTableIssue: jest.fn().mockReturnValue({remove: mockedRemove}),
    };
});

const mockedDB = db;

let issueApi;

describe('issues', () => {
    beforeAll(() => {
        issueApi = issues.createClient('userId', 'pokerTableId');
    });

    it('can delete an issue from a poker table', async () => {
        expect.assertions(2);

        await issueApi.remove('issueId');

        expect(mockedDB.pokerTableIssue).toHaveBeenCalledWith(
            'userId',
            'pokerTableId',
            'issueId'
        );

        const issue = mockedDB.pokerTableIssue.mock.results[0].value;

        expect(issue.remove).toHaveBeenCalledWith();
    });
});
