import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import slugify from 'react-slugify';
import AdminAllPosts from '../../pages/AdminAllPosts';
import FirebaseContext from '../../contexts/Firebase';
import allPostsFixture from '../../fixtures/CreatedAllPosts';
import activePostsFixture from '../../fixtures/CreatedActivePosts';
import useAllPosts from '../../hooks/UseAllPosts';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));
jest.mock('../../hooks/UseAllPosts');

describe('<AdminAllPosts />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, de nincsenek bejegyzések', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: undefined }));

            const { queryByText } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminAllPosts />
                    </FirebaseContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
                expect(queryByText('Összes bejegyzés')).not.toBeInTheDocument();
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, a bejegyzések adataival', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixture }));

            const { queryByText } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminAllPosts />
                    </FirebaseContext.Provider>
                </Router>
            );

            expect(queryByText('Bejegyzés')).not.toBeInTheDocument();

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
                expect(queryByText('Összes bejegyzés')).toBeInTheDocument();
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor az aktív bejegyzés megtekintésére kattint', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: activePostsFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminAllPosts />
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('isactive-button'));

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
                expect(mockHistoryPush).toHaveBeenCalledWith(`/posts/${slugify("React (JavaScript library)")}`);
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor a bejegyzés törlésére kattint', async () => {
        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            delete: jest.fn(() => Promise.resolve('Deleted post'))
                                        }))
                                    }))
                                }))
                            }
                        }}
                    >
                        <AdminAllPosts />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('delete-post-button'));

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor a bejegyzés duplikálására kattint', async () => {
        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            set: jest.fn(() => Promise.resolve('Duplicated post'))
                                        }))
                                    }))
                                }))
                            }
                        }}
                    >
                        <AdminAllPosts />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('duplicate-post-button'));

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
            });
        });
    });
})