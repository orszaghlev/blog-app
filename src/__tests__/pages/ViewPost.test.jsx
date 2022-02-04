import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import ViewPost from '../../pages/ViewPost';
import UserContext from '../../contexts/User';
import FirebaseContext from '../../contexts/Firebase';
import LoggedInUserContext from '../../contexts/LoggedInUser';
import * as ROUTES from '../../constants/Routes';
import { getUserByUserId, getPostByPostSlug } from '../../services/Firebase';
import useUser from '../../hooks/UseUser';
import useUserWhoCommented from '../../hooks/UseUserWhoCommented';
import usePost from '../../hooks/UsePost';
import userFixture from '../../fixtures/LoggedInUser';
import userNotAdminFixture from '../../fixtures/LoggedInUserWithNoAdminAccess';
import userNotAdminEndsWithSFixture from '../../fixtures/LoggedInUserWithNoAdminAccessWhoseNameEndsWithS';
import postFixture from '../../fixtures/CreatedPost';
import postFixtureHun from '../../fixtures/CreatedPostHun';
import postFixtureWithComment from '../../fixtures/CreatedPostWithComment';
import postFixtureWithCommentHun from '../../fixtures/CreatedPostWithCommentHun';
import postFixtureWithUserComment from '../../fixtures/CreatedPostWithUserComment';
import postFixtureWithUserCommentHun from '../../fixtures/CreatedPostWithUserCommentHun';
import postFixtureWithUserCommentEndsWithS from '../../fixtures/CreatedPostWithUserCommentWhoseNameEndsWithS';
import postFixtureInactive from '../../fixtures/CreatedInactivePost';
import { Context as ResponsiveContext } from 'react-responsive';

const mockHistoryPush = jest.fn();

jest.mock('../../services/Firebase');
jest.mock('../../hooks/UseUser');
jest.mock('../../hooks/UseUserWhoCommented');
jest.mock('../../hooks/UsePost');

describe('<ViewPost />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Nem jelenik meg az angol bejegyzéshez tartozó aloldal, mert inaktív a bejegyzés', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        const firebase = {
            firestore: jest.fn(() => ({
            }))
        }

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureInactive]);
            usePost.mockImplementation(() => ({ post: postFixtureInactive }));

            render(
                <Router>
                    <FirebaseContext.Provider
                        value={firebase}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(document.title).toEqual(`${process.env.REACT_APP_BLOG_NAME}`);
            });
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, a felhasználó elmenti a kedvencek közé a bejegyzést, majd eltávolítja onnan, és visszalép a kezdőoldalra', async () => {
        jest.useFakeTimers();
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixture]);
            usePost.mockImplementation(() => ({ post: postFixture }));

            const { findByText, findByTestId, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            update: jest.fn(() => Promise.resolve('Added to favorites'))
                                        }))
                                    }))
                                }))
                            },
                            FieldValue: {
                                arrayUnion: jest.fn(),
                                arrayRemove: jest.fn()
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('add-to-favorites'));
            expect(await findByText('Remove from favorites')).toBeTruthy();
            expect(await findByText('Post successfully added!')).toBeTruthy();
            jest.advanceTimersByTime(5001);
            fireEvent.click(await findByTestId('add-to-favorites'));

            fireEvent.click(getByTestId('show-post-return'));

            await waitFor(() => {
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.HOME);
            });
        });
    });

    it('Megjelenik a magyar nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, a felhasználó elmenti a kedvencek közé a bejegyzést, majd eltávolítja onnan, és visszalép a kezdőoldalra', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'html5' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureHun]);
            usePost.mockImplementation(() => ({ post: postFixtureHun }));

            const { findByText, findByTestId, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            update: jest.fn(() => Promise.resolve('Hozzáadva a kedvencekhez'))
                                        }))
                                    }))
                                }))
                            },
                            FieldValue: {
                                arrayUnion: jest.fn(),
                                arrayRemove: jest.fn()
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('add-to-favorites'));
            expect(await findByText('Eltávolítás a kedvencek közül')).toBeTruthy();
            expect(await findByText('Sikeres hozzáadás!')).toBeTruthy();
            fireEvent.click(await findByTestId('add-to-favorites'));

            fireEvent.click(getByTestId('show-post-return'));

            await waitFor(() => {
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.HOME);
            });
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, a felhasználó hozzászól a bejegyzéshez', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixture]);
            usePost.mockImplementation(() => ({ post: postFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            update: jest.fn(() => Promise.resolve('Added comment'))
                                        }))
                                    }))
                                }))
                            },
                            FieldValue: {
                                arrayUnion: jest.fn()
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            await fireEvent.change(getByTestId('input-add-comment'), {
                target: { value: '(Y)' }
            });
            fireEvent.submit(getByTestId('add-comment-submit'));
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, a felhasználó semmit sem szól hozzá a bejegyzéshez', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixture]);
            usePost.mockImplementation(() => ({ post: postFixture }));

            const { getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            update: jest.fn(() => Promise.resolve('Added comment'))
                                        }))
                                    }))
                                }))
                            },
                            FieldValue: {
                                arrayUnion: jest.fn()
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            await fireEvent.change(getByTestId('input-add-comment'), {
                target: { value: '' }
            });
            fireEvent.submit(getByTestId('add-comment-submit'));

            await waitFor(() => {
                expect(getByTestId('input-add-comment').value).toBe('');
            });
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor törli az egyik hozzászólást', async () => {
        delete window.location;
        window.location = { reload: jest.fn() };

        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithComment]);
            usePost.mockImplementation(() => ({ post: postFixtureWithComment }));

            const { findByTestId, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            update: jest.fn(() => Promise.resolve('Deleted comment'))
                                        }))
                                    }))
                                }))
                            },
                            FieldValue: {
                                arrayRemove: jest.fn()
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('delete-comment'));
            fireEvent.click(await findByTestId('delete-comment-delete'));
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor törölné az egyik hozzászólást, de végül visszalép', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithComment]);
            usePost.mockImplementation(() => ({ post: postFixtureWithComment }));

            const { findByTestId, getByTestId } = render(
                <Router>
                    <ResponsiveContext.Provider value={{ width: 300 }}>
                        <FirebaseContext.Provider
                            value={{
                                firebase: {
                                    firestore: jest.fn(() => ({
                                        collection: jest.fn(() => ({
                                            doc: jest.fn(() => ({
                                                update: jest.fn(() => Promise.resolve('Deleted comment'))
                                            }))
                                        }))
                                    }))
                                },
                                FieldValue: {
                                    arrayRemove: jest.fn()
                                }
                            }}
                        >
                            <UserContext.Provider
                                value={{
                                    user: {
                                        uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                        displayName: 'admin'
                                    }
                                }}
                            >
                                <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                    <ViewPost />
                                </LoggedInUserContext.Provider>
                            </UserContext.Provider>
                        </FirebaseContext.Provider>
                    </ResponsiveContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('delete-comment'));
            fireEvent.click(await findByTestId('delete-comment-return'));
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor törölné más hozzászólását, de végül visszalép', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userNotAdminFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithUserComment]);
            usePost.mockImplementation(() => ({ post: postFixtureWithUserComment }));

            const { findByTestId, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            update: jest.fn(() => Promise.resolve('Deleted comment'))
                                        }))
                                    }))
                                }))
                            },
                            FieldValue: {
                                arrayRemove: jest.fn()
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('delete-comment'));
            fireEvent.click(await findByTestId('delete-comment-return'));
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor törölné más hozzászólását, akinek a neve s-re végződik, de végül visszalép', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userNotAdminEndsWithSFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithUserCommentEndsWithS]);
            usePost.mockImplementation(() => ({ post: postFixtureWithUserCommentEndsWithS }));

            const { findByTestId, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            update: jest.fn(() => Promise.resolve('Deleted comment'))
                                        }))
                                    }))
                                }))
                            },
                            FieldValue: {
                                arrayRemove: jest.fn()
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('delete-comment'));
            fireEvent.click(await findByTestId('delete-comment-return'));
        });
    });

    it('Megjelenik a magyar nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor törölné más hozzászólását, akinek a neve s-re végződik, de végül visszalép', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userNotAdminEndsWithSFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithUserCommentHun]);
            usePost.mockImplementation(() => ({ post: postFixtureWithUserCommentHun }));

            const { findByTestId, getByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                                firestore: jest.fn(() => ({
                                    collection: jest.fn(() => ({
                                        doc: jest.fn(() => ({
                                            update: jest.fn(() => Promise.resolve('Hozzászólás törölve'))
                                        }))
                                    }))
                                }))
                            },
                            FieldValue: {
                                arrayRemove: jest.fn()
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('delete-comment'));
            fireEvent.click(await findByTestId('delete-comment-return'));
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor szerkeszti az egyik hozzászólást', async () => {
        delete window.location;
        window.location = { reload: jest.fn() };
        window.scrollTo = jest.fn();

        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithComment]);
            usePost.mockImplementation(() => ({ post: postFixtureWithComment }));

            const { findByTestId, getByTestId, queryByTestId } = render(
                <Router>
                    <ResponsiveContext.Provider value={{ width: 300 }}>
                        <FirebaseContext.Provider
                            value={{
                                firebase: {
                                    firestore: jest.fn(() => ({
                                        collection: jest.fn(() => ({
                                            doc: jest.fn(() => ({
                                                update: jest.fn(() => Promise.resolve('Edited comment'))
                                            }))
                                        }))
                                    }))
                                },
                                FieldValue: {
                                    arrayUnion: jest.fn(),
                                    arrayRemove: jest.fn()
                                }
                            }}
                        >
                            <UserContext.Provider
                                value={{
                                    user: {
                                        uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                        displayName: 'admin'
                                    }
                                }}
                            >
                                <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                    <ViewPost />
                                </LoggedInUserContext.Provider>
                            </UserContext.Provider>
                        </FirebaseContext.Provider>
                    </ResponsiveContext.Provider>
                </Router>
            );

            expect(queryByTestId('input-edit-comment')).not.toBeInTheDocument();
            fireEvent.click(getByTestId('show-edit-form'));
            fireEvent.change(await findByTestId('input-edit-comment'), {
                target: { value: 'Like' }
            });
            fireEvent.click(await findByTestId('edit-comment-modal-button'));
            fireEvent.submit(await findByTestId('edit-comment-submit'));

            await waitFor(() => {
                expect(getByTestId('input-edit-comment').value).toBe('Like');
            });
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor szerkesztené más hozzászólását', async () => {
        window.scrollTo = jest.fn();

        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userNotAdminFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithUserComment]);
            usePost.mockImplementation(() => ({ post: postFixtureWithUserComment }));

            const { getByTestId, queryByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                            },
                            FieldValue: {
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            expect(queryByTestId('edit-comment-return')).not.toBeInTheDocument();
            fireEvent.click(getByTestId('show-edit-form'));
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor szerkesztené más hozzászólását, akinek a neve s-re végződik', async () => {
        window.scrollTo = jest.fn();

        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userNotAdminEndsWithSFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithUserCommentEndsWithS]);
            usePost.mockImplementation(() => ({ post: postFixtureWithUserCommentEndsWithS }));

            const { getByTestId, queryByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                            },
                            FieldValue: {
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            expect(queryByTestId('edit-comment-return')).not.toBeInTheDocument();
            fireEvent.click(getByTestId('show-edit-form'));
        });
    });

    it('Megjelenik a magyar nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor szerkeszti az egyik hozzászólást, de végül visszalép', async () => {
        window.scrollTo = jest.fn();

        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'html5' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithCommentHun]);
            usePost.mockImplementation(() => ({ post: postFixtureWithCommentHun }));

            const { findByTestId, getByTestId, queryByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                            },
                            FieldValue: {
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            expect(queryByTestId('edit-comment-return')).not.toBeInTheDocument();
            fireEvent.click(getByTestId('show-edit-form'));
            fireEvent.click(await findByTestId('edit-comment-modal-button'));
            fireEvent.click(await findByTestId('edit-comment-return-modal'));
        });
    });

    it('Megjelenik a magyar nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, az adminisztrátor szerkeszti más hozzászólását, de végül visszalép', async () => {
        window.scrollTo = jest.fn();

        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'html5' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));
            useUserWhoCommented.mockImplementation(() => ({ user: userNotAdminFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithUserCommentHun]);
            usePost.mockImplementation(() => ({ post: postFixtureWithUserCommentHun }));

            const { findByTestId, getByTestId, queryByTestId } = render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                            },
                            FieldValue: {
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: {
                                    uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                    displayName: 'admin'
                                }
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: userFixture }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            expect(queryByTestId('edit-comment-return')).not.toBeInTheDocument();
            fireEvent.click(getByTestId('show-edit-form'));
            fireEvent.click(await findByTestId('edit-comment-modal-button'));
            fireEvent.click(await findByTestId('edit-comment-return-modal'));
        });
    });

    it('Megjelenik az angol nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, nincsen bejelentkezett felhasználó', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'react-javascript-library-' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => []);
            useUser.mockImplementation(() => ({ user: null }));
            useUserWhoCommented.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithComment]);
            usePost.mockImplementation(() => ({ post: postFixtureWithComment }));

            render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                            },
                            FieldValue: {
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: null
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: null }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );
        });
    });

    it('Megjelenik a magyar nyelvű bejegyzéshez tartozó aloldal, a bejegyzéshez tartozó adatokkal, nincsen bejelentkezett felhasználó', async () => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useParams: () => ({ slug: 'html5' }),
            useHistory: () => ({
                push: mockHistoryPush
            })
        }));

        await act(async () => {
            getUserByUserId.mockImplementation(() => []);
            useUser.mockImplementation(() => ({ user: null }));
            useUserWhoCommented.mockImplementation(() => ({ user: userFixture }));
            getPostByPostSlug.mockImplementation(() => [postFixtureWithCommentHun]);
            usePost.mockImplementation(() => ({ post: postFixtureWithCommentHun }));

            render(
                <Router>
                    <FirebaseContext.Provider
                        value={{
                            firebase: {
                            },
                            FieldValue: {
                            }
                        }}
                    >
                        <UserContext.Provider
                            value={{
                                user: null
                            }}
                        >
                            <LoggedInUserContext.Provider value={{ user: null }}>
                                <ViewPost />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );
        });
    });
});