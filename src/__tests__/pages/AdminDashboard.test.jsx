import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import slugify from 'react-slugify';
import AdminDashboard from '../../pages/AdminDashboard';
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

describe('<AdminDashboard />', () => {
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
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(queryByText('Admin felület')).not.toBeInTheDocument();
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
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router>
            );

            expect(queryByText('Bejegyzés')).not.toBeInTheDocument();

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(queryByText('Admin felület')).toBeInTheDocument();
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
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('isactive-button'));

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(mockHistoryPush).toHaveBeenCalledWith(`/posts/${slugify("React (JavaScript library)")}`);
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor a bejegyzés törlésére kattint', async () => {
        delete window.location;
        window.location = { reload: jest.fn() };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixture }));

            const { findByTestId, getByTestId } = render(
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
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('delete-post-button'));
            fireEvent.click(await findByTestId('delete-post-delete'));

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor a bejegyzés törlésére kattint, de végül nem töröl', async () => {
        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixture }));

            const { findByTestId, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                            }
                        }}
                    >
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('delete-post-button'));
            fireEvent.click(await findByTestId('delete-post-return'));

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor a bejegyzés duplikálására kattint', async () => {
        delete window.location;
        window.location = { reload: jest.fn() };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixture }));

            const { findByTestId, getByTestId } = render(
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
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('duplicate-post-button'));
            fireEvent.click(await findByTestId('duplicate-post-duplicate'));

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor a bejegyzés duplikálására kattint, de végül nem duplikál', async () => {
        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixture }));

            const { findByTestId, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                            }
                        }}
                    >
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('duplicate-post-button'));
            fireEvent.click(await findByTestId('duplicate-post-return'));

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
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
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router >
            );

            expect(queryByText('HTML5')).toBeInTheDocument();
            fireEvent.click(getByTestId('hungarian-posts-only'));
            expect(queryByText('HTML5')).toBeInTheDocument();

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
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
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router >
            );

            expect(queryByText('React (JavaScript library)')).toBeInTheDocument();
            fireEvent.click(getByTestId('active-posts-only'));
            expect(queryByText('React (JavaScript library)')).toBeInTheDocument();

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
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
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router >
            );

            expect(queryByText('React (JavaScript library)')).toBeInTheDocument();
            fireEvent.click(getByTestId('inactive-posts-only'));
            expect(queryByText('React (JavaScript library)')).toBeInTheDocument();

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(getByText('React (JavaScript library)')).toBeTruthy();
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor ír egy betűt a keresőbe', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: inverseSortingPostsFixture }));

            const { getByTestId, getByText, queryByText } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router >
            );

            expect(queryByText('HTML5')).toBeInTheDocument();
            await fireEvent.change(getByTestId('input-search'), {
                target: { value: 'H' }
            });
            expect(queryByText('HTML5')).toBeInTheDocument();

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(getByTestId('input-search').value).toBe('H');
                expect(getByText('HTML5')).toBeTruthy();
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor ír egy számot a keresőbe', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: inverseSortingPostsFixture }));

            const { getByTestId, getByText, queryByText } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router >
            );

            expect(queryByText('HTML5')).toBeInTheDocument();
            await fireEvent.change(getByTestId('input-search'), {
                target: { value: '2' }
            });
            expect(queryByText('HTML5')).toBeInTheDocument();

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(getByTestId('input-search').value).toBe('2');
                expect(getByText('HTML5')).toBeTruthy();
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor ír egy címet a keresőbe', async () => {
        const firebase = {
            firestore: jest.fn(() => ({
            }))
        };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: inverseSortingPostsFixture }));

            const { getByTestId, getByText, queryByText } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router >
            );

            expect(queryByText('HTML5')).toBeInTheDocument();
            await fireEvent.change(getByTestId('input-search'), {
                target: { value: 'HTML' }
            });
            expect(queryByText('HTML5')).toBeInTheDocument();

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(getByTestId('input-search').value).toBe('HTML');
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
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('sort-by-id-button'));

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
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
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('sort-by-title-button'));

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
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
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('sort-by-description-button'));

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
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
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('sort-by-content-button'));

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
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
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('sort-by-tag-button'));

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
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
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('sort-by-date-button'));

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor az új bejegyzés gombra kattint', async () => {

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixture }));

            const { getByText, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                }))
                            }
                        }}
                    >
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('create-post'));

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.ADMIN_CREATE_POST);
                expect(getByText('Új bejegyzés')).toBeTruthy();
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor a bejegyzés szerkesztése gombra kattint', async () => {
        window.scrollTo = jest.fn();
        delete window.location;
        window.location = { reload: jest.fn() };

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixture }));

            const { findByTestId, getByText, getByTestId } = render(
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
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('scroll-to-edit-post-button'));
            fireEvent.click(await findByTestId('edit-post-button'));
            await fireEvent.change(await findByTestId('input-edit-id'), {
                target: { value: 'react-edit' }
            });
            await fireEvent.change(await findByTestId('input-edit-title'), {
                target: { value: 'React (JavaScript library)-edit' }
            });
            await fireEvent.change(await findByTestId('input-edit-slug'), {
                target: { value: 'react-javascript-library--edit' }
            });
            await fireEvent.change(await findByTestId('input-edit-description'), {
                target: { value: 'React (also known as React.js or ReactJS) is a free and open-source front-end JavaScript library for building user interfaces or UI components. Edit.' }
            });
            await fireEvent.change(await findByTestId('input-edit-imgURL'), {
                target: { value: 'https://www.mobinius.com/wp-content/uploads/2019/03/React_Native_Logo.png-edit' }
            })
            await fireEvent.change(await findByTestId('input-edit-tag'), {
                target: { value: 'react, javascript, library-edit' }
            })
            await fireEvent.change(await findByTestId('input-edit-language'), {
                target: { value: 'Hungarian' }
            })
            await fireEvent.change(await findByTestId('input-edit-isActive'), {
                target: { value: 'true' }
            })
            fireEvent.submit(await findByTestId('edit-post-form'));

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
                expect(getByText('Bejegyzés szerkesztése')).toBeTruthy();
                expect(getByTestId('input-edit-id').value).toBe('react-edit');
                expect(getByTestId('input-edit-title').value).toBe('React (JavaScript library)-edit');
                expect(getByTestId('input-edit-slug').value).toBe('react-javascript-library--edit');
                expect(getByTestId('input-edit-description').value).toBe('React (also known as React.js or ReactJS) is a free and open-source front-end JavaScript library for building user interfaces or UI components. Edit.');
                expect(getByTestId('input-edit-imgURL').value).toBe('https://www.mobinius.com/wp-content/uploads/2019/03/React_Native_Logo.png-edit');
                expect(getByTestId('input-edit-tag').value).toBe('react, javascript, library-edit');
                expect(getByTestId('input-edit-language').value).toBe('Hungarian');
                expect(getByTestId('input-edit-isActive').value).toBe('true');
            });
        });
    });

    it('Megjelenik a bejegyzéseket tartalmazó admin felület, az adminisztrátor a bejegyzést szerkesztése gombra kattint, de végül nem szerkeszt', async () => {
        window.scrollTo = jest.fn();

        await act(async () => {
            useAllPosts.mockImplementation(() => ({ posts: allPostsFixture }));

            const { findByTestId, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                            }
                        }}
                    >
                        <AdminDashboard />
                    </FirebaseContext.Provider>
                </Router >
            );

            fireEvent.click(getByTestId('scroll-to-edit-post-button'));
            fireEvent.click(await findByTestId('edit-post-button'));
            fireEvent.click(await findByTestId('edit-post-return'));

            await waitFor(() => {
                expect(document.title).toEqual(`Admin felület | ${process.env.REACT_APP_FIREBASE_APP_NAME}`);
            });
        });
    });
})