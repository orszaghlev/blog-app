import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import slugify from 'react-slugify';
import AdminAllPosts from '../../pages/AdminAllPosts';
import FirebaseContext from '../../contexts/Firebase';
import allPostsFixture from '../../fixtures/CreatedAllPosts';
import allPostsFixtureHun from '../../fixtures/CreatedAllPostsHun';
import activePostsFixture from '../../fixtures/CreatedActivePosts';
import inactivePostsFixture from '../../fixtures/CreatedInactivePosts';
import sortingPostsFixture from '../../fixtures/CreatedPostsForSorting';
import inverseSortingPostsFixture from '../../fixtures/CreatedPostsForSortingInverse';
import useAllPosts from '../../hooks/UseAllPosts';
import * as ROUTES from '../../constants/Routes';

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

    it('Megjelenik a bejegyzéseket tartalmazó kezdőlap, a felhasználó továbblép az egyik bejegyzéshez tartozó aloldalra', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminAllPosts />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('create-post-button'));

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.ADMIN_CREATE_POST);
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor rákattint a magyar bejegyzéseket szűrő gombra', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixtureHun }));

            const { getByTestId, getByText, queryByText } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminAllPosts />
                    </FirebaseContext.Provider>
                </Router >
            );

            expect(queryByText('HTML5')).toBeInTheDocument();
            fireEvent.click(getByTestId('hungarian-posts-only'));
            expect(queryByText('HTML5')).toBeInTheDocument();

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
                expect(getByText('HTML5')).toBeTruthy();
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor rákattint az aktív bejegyzéseket szűrő gombra', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: activePostsFixture }));

            const { getByTestId, getByText, queryByText } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminAllPosts />
                    </FirebaseContext.Provider>
                </Router >
            );

            expect(queryByText('React (JavaScript library)')).toBeInTheDocument();
            fireEvent.click(getByTestId('active-posts-only'));
            expect(queryByText('React (JavaScript library)')).toBeInTheDocument();

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
                expect(getByText('React (JavaScript library)')).toBeTruthy();
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor rákattint az inaktív bejegyzéseket szűrő gombra', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: inactivePostsFixture }));

            const { getByTestId, getByText, queryByText } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminAllPosts />
                    </FirebaseContext.Provider>
                </Router >
            );

            expect(queryByText('React (JavaScript library)')).toBeInTheDocument();
            fireEvent.click(getByTestId('inactive-posts-only'));
            expect(queryByText('React (JavaScript library)')).toBeInTheDocument();

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
                expect(getByText('React (JavaScript library)')).toBeTruthy();
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor ír valamit a keresőbe', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixtureHun }));

            const { getByTestId, getByText, queryByText } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminAllPosts />
                    </FirebaseContext.Provider>
                </Router >
            );

            expect(queryByText('HTML5')).toBeInTheDocument();
            //fireEvent.change(await findByTestId('input-search'), {
            //    target: { value: 'H' }
            //});
            expect(queryByText('HTML5')).toBeInTheDocument();

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
                //expect(getByTestId('input-search').value).toBe('H');
                expect(getByText('HTML5')).toBeTruthy();
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor id szerint rendez', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixtureHun }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminAllPosts />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('sort-by-id-button'));

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor cím szerint rendez', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixtureHun }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminAllPosts />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('sort-by-title-button'));

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor slug szerint rendez', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixtureHun }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminAllPosts />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('sort-by-slug-button'));

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor leírás szerint rendez', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixtureHun }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminAllPosts />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('sort-by-description-button'));

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor tartalom szerint rendez', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixtureHun }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminAllPosts />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('sort-by-content-button'));

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor címke szerint rendez', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixtureHun }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminAllPosts />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('sort-by-tag-button'));

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor nyelv szerint rendez', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixtureHun }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminAllPosts />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('sort-by-language-button'));

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor dátum szerint rendez', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: inverseSortingPostsFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminAllPosts />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('sort-by-date-button'));

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor aktivitás szerint rendez', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: sortingPostsFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminAllPosts />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('sort-by-isActive-button'));

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor a bejegyzést szerkeszti', async () => {
        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixture }));

            const { getByText, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            set: jest.fn(() => Promise.resolve('Edited post'))
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

            fireEvent.click(getByTestId('scroll-to-edit-post-button'));

            await waitFor(() => {
                expect(document.title).toEqual('Összes bejegyzés');
                expect(getByText('Bejegyzés szerkesztése')).toBeTruthy();
            });
        });
    });
})