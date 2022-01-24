import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import slugify from 'react-slugify';
import Profile from '../../pages/Profile';
import UserContext from '../../contexts/User';
import LoggedInUserContext from '../../contexts/LoggedInUser';
import FirebaseContext from '../../contexts/Firebase';
import * as ROUTES from '../../constants/Routes';
import { getUserByUserId } from '../../services/Firebase';
import useUser from '../../hooks/UseUser';
import userFixture from '../../fixtures/LoggedInUser';
import userWithNoFavoritesOrCommentsFixture from '../../fixtures/LoggedInUserWithNoFavoritesOrComments';
import { Context as ResponsiveContext } from 'react-responsive';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));
jest.mock('../../services/Firebase');
jest.mock('../../hooks/UseUser');

describe('<Profile />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Megjelenik a profiloldal mobilon, a felhasználó saját adataival, a felhasználó rendelkezik kedvenc bejegyzéssel és saját kommenttel', async () => {
        const firebase = {
            auth: jest.fn(() => ({
            }))
        };

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));

            render(
                <Router>
                    <ResponsiveContext.Provider value={{ width: 300 }}>
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
                                    <Profile
                                        user={{
                                            uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                            displayName: 'admin'
                                        }}
                                    />
                                </LoggedInUserContext.Provider>
                            </UserContext.Provider>
                        </FirebaseContext.Provider>
                    </ResponsiveContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.HOME);
            });
        });
    });

    it('Megjelenik a profiloldal, a felhasználó saját adataival, a felhasználó nem rendelkezik kedvenc bejegyzéssel és saját kommenttel', async () => {
        const firebase = {
            auth: jest.fn(() => ({
            }))
        };

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userWithNoFavoritesOrCommentsFixture]);
            useUser.mockImplementation(() => ({ user: userWithNoFavoritesOrCommentsFixture }));

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
                                <Profile
                                    user={{
                                        uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                        displayName: 'admin'
                                    }}
                                />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            await waitFor(() => {
                expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.HOME);
            });
        });
    });

    it('Megjelenik a profiloldal, a felhasználó saját adataival, a felhasználó az adatok szerkesztése gombra kattint', async () => {
        const firebase = {
            auth: jest.fn(() => ({
            }))
        };

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));

            const { getByTestId } = render(
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
                                <Profile
                                    user={{
                                        uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                        displayName: 'admin'
                                    }}
                                />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('profile-edit'));

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.PROFILE_EDIT);
            });
        });
    });

    it('Megjelenik a profiloldal, a felhasználó saját adataival, a felhasználó a kedvenc bejegyzésére kattint', async () => {
        const firebase = {
            auth: jest.fn(() => ({
            }))
        };

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));

            const { getByTestId } = render(
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
                                <Profile
                                    user={{
                                        uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                        displayName: 'admin'
                                    }}
                                />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('user-favoritePost-button'));

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(`/posts/${slugify("JSX (JavaScript)")}`);
            });
        });
    });

    it('Megjelenik a profiloldal, a felhasználó saját adataival, a felhasználó a saját hozzászólásának forrására kattint', async () => {
        const firebase = {
            auth: jest.fn(() => ({
            }))
        };

        await act(async () => {
            getUserByUserId.mockImplementation(() => [userFixture]);
            useUser.mockImplementation(() => ({ user: userFixture }));

            const { getByTestId } = render(
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
                                <Profile
                                    user={{
                                        uid: process.env.REACT_APP_FIREBASE_ADMIN_UID,
                                        displayName: 'admin'
                                    }}
                                />
                            </LoggedInUserContext.Provider>
                        </UserContext.Provider>
                    </FirebaseContext.Provider>
                </Router>
            );

            fireEvent.click(getByTestId('user-comment-button'));

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(`/posts/${slugify("Facebook")}`);
            });
        });
    });
});