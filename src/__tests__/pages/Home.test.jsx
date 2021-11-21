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

            const { queryByText } = render(
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

            await waitFor(() => {
                expect(document.title).toEqual(`Bejegyzések | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(queryByText('Bejegyzések')).toBeInTheDocument();
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó kezdőlap, a felhasználó továbblép az egyik bejegyzéshez tartozó aloldalra', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useActivePosts.mockImplementation(() => ({ posts: activePostsFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <Home />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('view-post'));

            await waitFor(() => {
                expect(document.title).toEqual(`Bejegyzések | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
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

            const { getByTestId, getByText, queryByText } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <Home />
                    </FirebaseContext.Provider>
                </Router >
            );

            expect(queryByText('HTML5')).toBeInTheDocument();
            fireEvent.click(getByTestId('hungarian-posts-only'));
            expect(queryByText('HTML5')).toBeInTheDocument();

            await waitFor(() => {
                expect(document.title).toEqual(`Bejegyzések | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(getByText('HTML5')).toBeTruthy();
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

            const { getByTestId, getByText, queryByText } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <Home />
                    </FirebaseContext.Provider>
                </Router >
            );

            expect(queryByText('HTML5')).toBeInTheDocument();
            await fireEvent.change(getByTestId('input-search'), {
                target: { value: 'H' }
            });
            expect(queryByText('HTML5')).toBeInTheDocument();

            await waitFor(() => {
                expect(document.title).toEqual(`Bejegyzések | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(getByTestId('input-search').value).toBe('H');
                expect(getByText('HTML5')).toBeTruthy();
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó kezdőlap, a felhasználó ír egy számot a keresőbe', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useActivePosts.mockImplementation(() => ({ posts: inverseSortingPostsFixture }));

            const { getByTestId, getByText, queryByText } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <Home />
                    </FirebaseContext.Provider>
                </Router >
            );

            expect(queryByText('HTML5')).toBeInTheDocument();
            await fireEvent.change(getByTestId('input-search'), {
                target: { value: '2' }
            });
            expect(queryByText('HTML5')).toBeInTheDocument();

            await waitFor(() => {
                expect(document.title).toEqual(`Bejegyzések | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(getByTestId('input-search').value).toBe('2');
                expect(getByText('HTML5')).toBeTruthy();
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

            const { getByTestId, getByText, queryByText } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <Home />
                    </FirebaseContext.Provider>
                </Router >
            );

            expect(queryByText('HTML5')).toBeInTheDocument();
            await fireEvent.change(getByTestId('input-search'), {
                target: { value: 'HTML5' }
            });
            expect(queryByText('HTML5')).toBeInTheDocument();

            await waitFor(() => {
                expect(document.title).toEqual(`Bejegyzések | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(getByTestId('input-search').value).toBe('HTML5');
                expect(getByText('HTML5')).toBeTruthy();
            });
        });
    });
})