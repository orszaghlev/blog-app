import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Home from '../../pages/Home';
import FirebaseContext from '../../contexts/Firebase';
import * as ROUTES from '../../constants/Routes';
import activePostsFixture from '../../fixtures/CreatedActivePosts';
import useActivePosts from '../../hooks/UseActivePosts';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));
jest.mock('../../hooks/UseActivePosts');

describe('<Home />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Megjelenik a bejegyzéseket tartalmazó kezdőlap, de nincsenek bejegyzések', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };
        const { queryByText } = render(
            <Router>
                <FirebaseContext.Provider
                    value={firebase}
                >
                    <Home />
                </FirebaseContext.Provider>
            </Router>
        );

        await act(async () => {
            useActivePosts.mockImplementation(() => ([]));

            await waitFor(() => {
                expect(document.title).toEqual('Bejegyzések');
                expect(queryByText('Bejegyzések')).not.toBeInTheDocument();
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó kezdőlap, a bejegyzések adataival', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };
        const { findByText, queryByText } = render(
            <Router>
                <FirebaseContext.Provider
                    value={firebase}
                >
                    <Home />
                </FirebaseContext.Provider>
            </Router >
        );

        await act(async () => {
            useActivePosts.mockImplementation(() => ([activePostsFixture]));

            expect(queryByText('Összes bejegyzés')).not.toBeInTheDocument();
            expect(await findByText('Összes bejegyzés'));

            await waitFor(() => {
                expect(document.title).toEqual('Bejegyzések');
                //expect(queryByText('Bejegyzések')).toBeInTheDocument();
            });
        });
    });

    /*it('Megjelenik a bejegyzéseket tartalmazó kezdőlap, a felhasználó továbblép az egyik bejegyzéshez tartozó aloldalra', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };
        const { getByTestId } = render(
            <Router>
                <FirebaseContext.Provider
                    value={firebase}
                >
                    <Home />
                </FirebaseContext.Provider>
            </Router >
        );

        await act(async () => {
            getPosts.mockImplementation(() => [postsFixture]);
            usePosts.mockImplementation(() => ({ posts: postsFixture }));

            fireEvent.click(getByTestId('view-post'));

            expect(document.title).toEqual('Bejegyzések');

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(`/posts/${slugify("React (JavaScript library)")}`);
            });
        });
    });*/
})