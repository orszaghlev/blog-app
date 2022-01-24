import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import slugify from 'react-slugify';
import Home from '../../pages/Home';
import FirebaseContext from '../../contexts/Firebase';
import activePostsFixture from '../../fixtures/CreatedActivePosts';
import activePostsFixtureHun from '../../fixtures/CreatedActivePostsHun';
import useActivePosts from '../../hooks/UseActivePosts';
import inverseSortingPostsFixture from '../../fixtures/CreatedPostsForSortingInverse';
import { Context as ResponsiveContext } from 'react-responsive';

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

        await act(async () => {
            useActivePosts.mockImplementation(() => ({ posts: undefined }));

            const { queryByText } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <Home />
                    </FirebaseContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(document.title).toEqual(`Bejegyzések | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(queryByText('Bejegyzések')).not.toBeInTheDocument();
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó kezdőlap mobilon, a bejegyzések adataival', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useActivePosts.mockImplementation(() => ({ posts: activePostsFixture }));

            const { getByTestId, queryByText } = render(
                <Router>
                    <ResponsiveContext.Provider value={{ width: 300 }}>
                        <FirebaseContext.Provider
                            value={firebase}
                        >
                            <Home />
                        </FirebaseContext.Provider>
                    </ResponsiveContext.Provider>
                </Router>
            )

            fireEvent.click(getByTestId('view-post'));

            await waitFor(() => {
                expect(queryByText('Bejegyzések')).toBeInTheDocument();
                expect(mockHistoryPush).toHaveBeenCalledWith(`posts/${slugify("React (JavaScript library)")}`);
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó kezdőlap, a felhasználó rákattint a szűrés gombra', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useActivePosts.mockImplementation(() => ({ posts: activePostsFixtureHun }));

            const { findByTestId, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <Home />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('hungarian-posts-only'));
            fireEvent.click(await findByTestId('hungarian-posts-only'));
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó kezdőlap, de kereséskor nincs találat', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useActivePosts.mockImplementation(() => ({ posts: inverseSortingPostsFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <Home />
                    </FirebaseContext.Provider>
                </Router>
            );

            await fireEvent.change(getByTestId('input-search'), {
                target: { value: 'Nem szerepel a cikkben' }
            });

            await waitFor(() => {
                expect(getByTestId('input-search').value).toBe('Nem szerepel a cikkben');
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó kezdőlap, a felhasználó ír egy betűt a keresőbe', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useActivePosts.mockImplementation(() => ({ posts: inverseSortingPostsFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <Home />
                    </FirebaseContext.Provider>
                </Router >
            );

            await fireEvent.change(getByTestId('input-search'), {
                target: { value: 'H' }
            });

            await waitFor(() => {
                expect(getByTestId('input-search').value).toBe('H');
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó kezdőlap, a felhasználó ír egy címet a keresőbe', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useActivePosts.mockImplementation(() => ({ posts: inverseSortingPostsFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <Home />
                    </FirebaseContext.Provider>
                </Router >
            );

            await fireEvent.change(getByTestId('input-search'), {
                target: { value: 'HTML5' }
            });

            await waitFor(() => {
                expect(getByTestId('input-search').value).toBe('HTML5');
            });
        });
    });
});